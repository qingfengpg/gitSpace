// 聊天历史记录功能 - 支持多会话管理
class ChatHistory {
    constructor() {
        this.storageKey = 'chatHistory';
        this.maxEntries = 50;
    }

    // 保存消息到历史记录
    saveMessage(memoryId, userMessage, aiResponse) {
        var history = this.getHistory();
        var timestamp = new Date().toLocaleString('zh-CN');
        
        if (!history[memoryId]) {
            history[memoryId] = [];
        }
        
        history[memoryId].push({
            id: Date.now(),
            timestamp: timestamp,
            userMessage: userMessage,
            aiResponse: aiResponse
        });

        // 限制每个会话的最大消息数
        if (history[memoryId].length > this.maxEntries) {
            history[memoryId].shift();
        }

        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    // 获取所有历史记录
    getHistory() {
        var history = localStorage.getItem(this.storageKey);
        return history ? JSON.parse(history) : {};
    }

    // 获取特定会话的历史记录
    getMemoryHistory(memoryId) {
        var history = this.getHistory();
        return history[memoryId] || [];
    }

    // 清空所有历史记录
    clearHistory() {
        localStorage.removeItem(this.storageKey);
    }

    // 创建新会话
    createNewMemory() {
        var memoryId = this.generateRandomId();
        var history = this.getHistory();
        history[memoryId] = [];
        localStorage.setItem(this.storageKey, JSON.stringify(history));
        return memoryId;
    }

    // 生成随机ID
    generateRandomId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // 获取最近的会话列表
    getRecentMemories(count = 5) {
        var history = this.getHistory();
        var memories = Object.keys(history);
        // 按时间倒序排列（最新在前）
        memories.sort(function(a, b) {
            var lastMsgA = history[a][history[a].length - 1];
            var lastMsgB = history[b][history[b].length - 1];
            return (lastMsgB ? lastMsgB.id : 0) - (lastMsgA ? lastMsgA.id : 0);
        });
        return memories.slice(0, count);
    }
}

// 初始化聊天历史记录
var chatHistory = new ChatHistory();

// 全局变量存储当前会话ID
var currentMemoryId = chatHistory.createNewMemory();

// 添加会话到列表
function addMemoryToList(memoryId, title) {
    var chatList = document.getElementById('chatList');
    var memoryItem = document.createElement('div');
    memoryItem.className = 'chat-item';
    memoryItem.setAttribute('data-memory-id', memoryId);
    
    var now = new Date();
    var timeStr = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
    memoryItem.innerHTML = `
        <div class="chat-icon">💬</div>
        <div class="chat-info">
            <div class="chat-title">${title}</div>
            <div class="chat-time">${timeStr}</div>
        </div>
    `;
    
    chatList.appendChild(memoryItem);
    
    // 设置点击事件
    memoryItem.addEventListener('click', function() {
        // 移除其他项的active类
        var items = document.querySelectorAll('.chat-item');
        items.forEach(function(item) {
            item.classList.remove('active');
        });
        
        // 添加active类到当前项
        this.classList.add('active');
        
        // 切换会话
        currentMemoryId = memoryId;
        loadMemoryHistory(memoryId);
    });
    
    // 默认选中第一个会话
    if (chatList.children.length === 1) {
        memoryItem.classList.add('active');
        loadMemoryHistory(memoryId);
    }
}

// 加载会话历史
function loadMemoryHistory(memoryId) {
    var chatContainer = document.getElementById('chatContainer');
    var history = chatHistory.getMemoryHistory(memoryId);
    
    // 清空聊天区域
    chatContainer.innerHTML = '';
    
    if (history.length === 0) {
        // 显示欢迎消息
        var welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-message';
        welcomeDiv.textContent = '请输入消息，开始新的对话';
        chatContainer.appendChild(welcomeDiv);
    } else {
        // 显示历史消息
        history.forEach(function(msg) {
            var userDiv = document.createElement('div');
            userDiv.className = 'message user-message';
            userDiv.textContent = msg.userMessage;
            chatContainer.appendChild(userDiv);
            
            var aiDiv = document.createElement('div');
            aiDiv.className = 'message ai-message';
            aiDiv.textContent = msg.aiResponse;
            chatContainer.appendChild(aiDiv);
        });
    }
    
    // 滚动到底部
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 发送消息
async function sendMessage() {
    var messageInput = document.getElementById('messageInput');
    var message = messageInput.value.trim();
    if (!message) return;
    
    var chatContainer = document.getElementById('chatContainer');
    
    // 显示用户消息
    var userDiv = document.createElement('div');
    userDiv.className = 'message user-message';
    userDiv.textContent = message;
    chatContainer.appendChild(userDiv);
    
    messageInput.value = '';
    document.getElementById('sendButton').disabled = true;
    
    try {
        // 显示打字指示器
        var typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai-message typing-indicator';
        typingIndicator.textContent = '思考中...';
        chatContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 调用后端API
        var url = '/chat?message=' + encodeURIComponent(message) + '&memoryId=' + currentMemoryId;
        var response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        
        if (!response.ok) {
            throw new Error('服务器错误: ' + response.status);
        }
        
        var data = await response.text();
        
        // 移除打字指示器
        chatContainer.removeChild(typingIndicator);
        
        // 显示AI回复
        var aiDiv = document.createElement('div');
        aiDiv.className = 'message ai-message';
        aiDiv.textContent = data;
        chatContainer.appendChild(aiDiv);
        
        // 保存到历史记录
        chatHistory.saveMessage(currentMemoryId, message, data);
        
        // 滚动到底部
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        // 移除打字指示器
        var typingIndicators = document.querySelectorAll('.typing-indicator');
        typingIndicators.forEach(function(indicator) {
            indicator.remove();
        });
        
        // 显示错误消息
        var errorDiv = document.createElement('div');
        errorDiv.className = 'message ai-message';
        errorDiv.textContent = '抱歉，发送消息时出现错误，请稍后再试。';
        chatContainer.appendChild(errorDiv);
    } finally {
        document.getElementById('sendButton').disabled = false;
        messageInput.focus();
    }
}