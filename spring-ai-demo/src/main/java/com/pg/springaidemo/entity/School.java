package com.pg.springaidemo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.ai.tool.annotation.ToolParam;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class School {

    @ToolParam(required = false, description = "学校ID")
    private String id;

    @ToolParam(required = false, description = "学校名称")
    private String schoolName;

    @ToolParam(required = false, description = "学校所在城市")
    private String city;
}