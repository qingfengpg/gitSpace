// 全局变量存储当前会话ID
var currentMemoryId = null;

// 生成随机ID的函数
function generateRandomId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    var chatList = document.getElementById('chatList');
    var chatContainer = document.getElementById('chatContainer');
    var messageInput = document.getElementById('messageInput');
    var sendButton = document.getElementById('sendButton');
    var newChatBtn = document.getElementById('newChatBtn');
    var themeToggle = document.getElementById('themeToggle');

    // 初始化：如果已有会话，使用第一个会话；否则创建新会话
    if (chatList && chatList.children.length > 0) {
        // 选择第一个会话
        var firstItem = chatList.children[0];
        firstItem.classList.add('active');
        currentMemoryId = firstItem.getAttribute('data-memory-id');
        loadChatHistory(currentMemoryId);
    } else {
        // 创建新会话
        createNewChat();
    }

    // 新建对话按钮点击事件
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function() {
            createNewChat();
        });
    }

    // 聊天记录项点击事件
    if (chatList) {
        chatList.addEventListener('click', function(e) {
            var target = e.target;
            // 找到最近的.chat-item父元素
            while (target && !target.classList.contains('chat-item')) {
                target = target.parentElement;
            }
            
            if (target && target.classList.contains('chat-item')) {
                // 移除所有active类
                var items = chatList.querySelectorAll('.chat-item');
                items.forEach(function(item) {
                    item.classList.remove('active');
                });
                
                // 添加active类到当前项
                target.classList.add('active');
                
                // 更新当前会话ID
                currentMemoryId = target.getAttribute('data-memory-id');
                
                // 加载该会话的历史记录
                loadChatHistory(currentMemoryId);
            }
        });
    }

    // 发送消息函数
    async function sendMessage() {
        var message = messageInput.value.trim();
        if (!message) return;
        
        // 确保当前会话ID存在
        if (!currentMemoryId) {
            currentMemoryId = generateRandomId();
            // 添加新会话到列表
            addChatItem(currentMemoryId);
        }
        
        // 显示用户消息
        addMessageToChat(message, 'user');
        messageInput.value = '';
        sendButton.disabled = true;
        
        try {
            // 显示打字指示器
            var typingIndicator = document.createElement('div');
            typingIndicator.className = 'message ai-message typing-indicator';
            typingIndicator.textContent = '思考中...';
            chatContainer.appendChild(typingIndicator);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // 调用后端API - 使用 GET 请求和 URL 参数，包含memoryId
            var url = '/ai/service?message=' + encodeURIComponent(message) + '&memoryId=' + currentMemoryId;
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
            addMessageToChat(data, 'ai');
        } catch (error) {
            // 移除打字指示器
            var typingIndicators = document.querySelectorAll('.typing-indicator');
            typingIndicators.forEach(function(indicator) {
                indicator.remove();
            });
            
            // 显示错误消息
            addMessageToChat('抱歉，发送消息时出现错误，请稍后再试。', 'ai');
        } finally {
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    // 添加消息到聊天区域
    function addMessageToChat(content, sender) {
        var messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + sender + '-message';
        messageDiv.textContent = content;
        
        // 移除欢迎消息（首次用户交互后）
        var welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage && chatContainer.children.length === 1) {
            welcomeMessage.remove();
        }
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // 创建新会话
    function createNewChat() {
        var newId = generateRandomId();
        addChatItem(newId);
        
        // 清空聊天区域，显示欢迎消息
        chatContainer.innerHTML = '<div class="welcome-message">请输入消息，可上传图片、音频或视频...</div>';
        currentMemoryId = newId;
    }

    // 添加聊天记录项
    function addChatItem(memoryId) {
        if (!chatList) return;
        
        var chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.setAttribute('data-memory-id', memoryId);
        chatItem.innerHTML = `
            <div class="chat-icon">💬</div>
            <div class="chat-info">
                <div class="chat-title">对话 ${memoryId}</div>
                <div class="chat-time">刚刚</div>
            </div>
        `;
        
        // 添加到列表顶部
        chatList.insertBefore(chatItem, chatList.firstChild);
        
        // 设置为当前选中项
        var items = chatList.querySelectorAll('.chat-item');
        items.forEach(function(item) {
            item.classList.remove('active');
        });
        chatItem.classList.add('active');
        
        // 更新当前会话ID
        currentMemoryId = memoryId;
    }

    // 加载聊天历史
    function loadChatHistory(memoryId) {
        // 这里可以添加从localStorage或其他存储加载历史记录的逻辑
        // 当前简化实现：清空聊天区域并显示欢迎消息
        chatContainer.innerHTML = '<div class="welcome-message">请输入消息，可上传图片、音频或视频...</div>';
    }

    // 发送按钮点击事件
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // 回车键发送消息
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // 夜间模式切换
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
        });
    }

    // 页面加载后聚焦到输入框
    if (messageInput) {
        messageInput.focus();
    }
});