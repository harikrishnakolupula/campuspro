package com.college.management.model;
import jakarta.persistence.*;
@Entity
@Table(name="students")
public class Student {
@Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
private String fullName;
private String rollNumber;
private String email;
private String phone;
private String department;
private String year;
private String status;
public Student() {}
public Long getId() {return id;}
public void setId(Long id) {this.id=id;}
public String getFullName() {return fullName;}
public void setFullName(String value) {this.fullName=value;}
public String getRollNumber() {return rollNumber;}
public void setRollNumber(String value) {this.rollNumber=value;}
public String getEmail() {return email;}
public void setEmail(String value) {this.email=value;}
public String getPhone() {return phone;}
public void setPhone(String value) {this.phone=value;}
public String getDepartment() {return department;}
public void setDepartment(String value) {this.department=value;}
public String getYear() {return year;}
public void setYear(String value) {this.year=value;}
public String getStatus() {return status;}
public void setStatus(String value) {this.status=value;}
}
