package com.pg.springaidemo;

import org.junit.jupiter.api.Test;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SpringAiDemoApplicationTests {

    @Autowired
    private OpenAiEmbeddingModel embeddingModel;

    @Test
    void contextLoads() {
    }

    @Test
    void testEmbedding() {
        float[] embedding = embeddingModel.embed("你好，你是谁？");
        System.out.println(embedding);
    }

}
