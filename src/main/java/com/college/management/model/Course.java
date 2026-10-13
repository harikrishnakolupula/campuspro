package com.college.management.model;
import jakarta.persistence.*;
@Entity
@Table(name="courses")
public class Course {
@Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
private String name;
private String code;
private String department;
private Integer credits;
public Course() {}
public Long getId() {return id;}
public void setId(Long id) {this.id=id;}
public String getName() {return name;}
public void setName(String value) {this.name=value;}
public String getCode() {return code;}
public void setCode(String value) {this.code=value;}
public String getDepartment() {return department;}
public void setDepartment(String value) {this.department=value;}
public Integer getCredits() {return credits;}
public void setCredits(Integer value) {this.credits=value;}
}
