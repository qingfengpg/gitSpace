package com.pg.springaidemo.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Objects;
import java.util.Properties;

@Slf4j
@Component
public class LocalPdfFileRepository implements FileRepository{


    private final Properties chatFiles = new Properties();
    @Override
    public boolean save(String chatId, Resource resource) {

        String filename = resource.getFilename();
        File file = new File(Objects.requireNonNull(filename));
        if (!file.exists()) {
            try {
                Files.copy(resource.getInputStream(), file.toPath());
            } catch (IOException e) {
                log.info("保存文件失败");
                return false;
            }
        }

        chatFiles.put(chatId, file);
        return true;
    }

    @Override
    public Resource get(String chatId) {
        return null;
    }
}
