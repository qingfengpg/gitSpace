package com.pg.springaidemo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.ai.tool.annotation.ToolParam;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @ToolParam(required = false, description = "id")
    private Long id;

    @ToolParam(required = false, description = "课程名称")
    private String name;

    @ToolParam(required = false, description = "对应学历")
    private String edu;

    @ToolParam(required = false, description = "课程价格")
    private BigDecimal price;

    @ToolParam(required = false, description = "课程学习时长")
    private int duration;
}
