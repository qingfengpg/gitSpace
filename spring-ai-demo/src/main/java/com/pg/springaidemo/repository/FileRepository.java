package com.pg.springaidemo.repository;

import org.springframework.core.io.Resource;

public interface FileRepository {

    boolean save(String chatId, Resource file);
    /**
     * 获取指定聊天ID的临时文件
     *
     * @param chatId 聊天ID
     * @return 临时文件
     */
    Resource get(String chatId);
}