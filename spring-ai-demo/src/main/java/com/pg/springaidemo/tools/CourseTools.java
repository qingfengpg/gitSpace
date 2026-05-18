package com.pg.springaidemo.tools;

import com.pg.springaidemo.entity.Course;
import com.pg.springaidemo.entity.CourseReservation;
import com.pg.springaidemo.entity.School;
import com.pg.springaidemo.entity.query.CourseQuery;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;

@Component
public class CourseTools {

    @Tool(description = "根据条件查询课程信息")
    public List<Course> queryCourse(@ToolParam(description = "查询条件", required = false) CourseQuery query) {

        // 生成模拟查询数据，query里面的条件可能有一个有值，也可能都有值
        Course course1 = new Course();
        course1.setId(1L);
        course1.setName("Java编程基础");
        course1.setPrice(new BigDecimal("99.00"));
        course1.setDuration(50);
        course1.setEdu("本科");

        Course course2 = new Course();
        course2.setId(2L);
        course2.setName("Spring Boot实战");
        course2.setPrice(new BigDecimal("149.00"));
        course2.setDuration(10);
        course2.setEdu("硕士");

        Course course3 = new Course();
        course3.setId(3L);
        course3.setName("人工智能入门");
        course3.setPrice(new BigDecimal("199.00"));
        course3.setDuration(90);
        course3.setEdu("博士");

        List<Course> allCourses = List.of(course1, course2, course3);

        // 根据查询条件过滤结果
        return allCourses.stream()
                .filter(course -> StringUtils.hasText(query.getType()) && course.getName().contains(query.getType()))
                .filter(course -> StringUtils.hasText(query.getEdu()) && course.getEdu().contains(query.getEdu()))
                .toList();
    }

    @Tool(description = "根据条件查询学校信息")
    public List<School> querySchool(@ToolParam(description = "学校名称关键词", required = false) String schoolName) {
        // 生成模拟查询数据
        School school1 = new School();
        school1.setId("school001");
        school1.setSchoolName("清华大学");
        school1.setCity("北京");

        School school2 = new School();
        school2.setId("school002");
        school2.setSchoolName("北京大学");
        school2.setCity("北京");

        School school3 = new School();
        school3.setId("school003");
        school3.setSchoolName("上海交通大学");
        school3.setCity("上海");

        List<School> allSchools = List.of(school1, school2, school3);

        // 根据学校名称关键词过滤结果
        if (StringUtils.hasText(schoolName)) {
            return allSchools.stream()
                    .filter(school -> school.getSchoolName().contains(schoolName))
                    .toList();
        }
        
        return allSchools;
    }

    @Tool(description = "生成课程预约")
    public Integer createCourseReservation(@ToolParam(description = "预约信息") CourseReservation reservation) {
        // 模拟创建预约成功
        return 1;
    }
    
// TODO
}