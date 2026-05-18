package com.pg.springaidemo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RestController
public class ChatController {

    private final ChatClient chatClient;

    /**
     * 处理聊天消息请求
     * @param message 用户发送的消息内容
     * @return AI模型生成的回复内容
     */
    @GetMapping("/chat")
    public String chat(@RequestParam("message") String message, @RequestParam("memoryId") String memoryId) {
        // 这里可以集成AI服务来处理聊天逻辑
        return chatClient.prompt()
                .user(message)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, memoryId))
                .call()
                .content();
    }
}
