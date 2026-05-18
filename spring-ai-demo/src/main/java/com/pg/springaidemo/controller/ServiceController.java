package com.pg.springaidemo.controller;

import lombok.AllArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

/**
 * 服务控制器，提供AI聊天服务接口
 */
@AllArgsConstructor
@RestController
@RequestMapping("/ai")
public class ServiceController {

    private final ChatClient courseChatClient;


    /**
     * 处理聊天服务请求，接收用户提示和聊天ID，返回流式响应
     *
     * @param message 用户输入的提示文本
     * @param memoryId 聊天会话的唯一标识符
     * @return 返回字符串流，包含AI模型生成的响应内容
     */
    @RequestMapping(value = "/service", produces = "text/html;charset=utf-8")
    public Flux<String> service(String message, String memoryId) {
        // 使用普通的聊天服务
        return courseChatClient.prompt()
                .user(message)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, memoryId))
                .stream()
                .content();
    }
    
    /**
     * 判断是否为知识库相关查询
     */
    private boolean isKnowledgeBaseRelated(String message) {
        // 简单的关键词匹配，可根据实际需求调整
        String lowerMsg = message.toLowerCase();
        return lowerMsg.contains("根据文档") || 
               lowerMsg.contains("根据知识库") || 
               lowerMsg.contains("根据pdf") ||
               lowerMsg.contains("文档中") ||
               lowerMsg.contains("资料中") ||
               lowerMsg.contains("参考");
    }
    

}