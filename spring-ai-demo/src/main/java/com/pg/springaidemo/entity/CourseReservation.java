package com.pg.springaidemo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.ai.tool.annotation.ToolParam;

@Data
@AllArgsConstructor
public class CourseReservation {

    @ToolParam(required = false, description = "预约ID")
    private String id;

    @ToolParam(required = false, description = "预约课程名称")
    private String courseName;

    @ToolParam(required = false, description = "学生姓名")
    private String studentName;

    @ToolParam(required = false, description = "联系方式")
    private String contactInfo;

    @ToolParam(required = false, description = "预约校区")
    private String campus;
}