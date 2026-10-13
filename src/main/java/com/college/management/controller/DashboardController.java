package com.college.management.controller;
import com.college.management.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/dashboard")
public class DashboardController {
 private final StudentRepository students;
 private final CourseRepository courses;
 private final DepartmentRepository departments;
 public DashboardController(StudentRepository students,CourseRepository courses,DepartmentRepository departments) {
  this.students=students;this.courses=courses;this.departments=departments;
 }
 @GetMapping public Map<String,Object> dashboard() {
  Map<String,Object> result=new LinkedHashMap<>();
  result.put("students",students.count());
  result.put("courses",courses.count());
  result.put("departments",departments.count());
  result.put("active",students.findAll().stream().filter(s->"Active".equalsIgnoreCase(s.getStatus())).count());
  return result;
 }
}
