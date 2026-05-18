package com.pg.springaidemo.entity.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.ai.tool.annotation.ToolParam;

@Data
@AllArgsConstructor
public class CourseQuery {

    @ToolParam(required = false, description = "课程类型：编程、设计、自媒体、其他")
    private String type;

    @ToolParam(required = false, description = "学历要求：本科、硕士、博士、无")
    private String edu;
}
