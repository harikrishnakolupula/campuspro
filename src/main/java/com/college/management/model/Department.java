package com.college.management.model;
import jakarta.persistence.*;
@Entity
@Table(name="departments")
public class Department {
@Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
private String name;
private String code;
private String head;
public Department() {}
public Long getId() {return id;}
public void setId(Long id) {this.id=id;}
public String getName() {return name;}
public void setName(String value) {this.name=value;}
public String getCode() {return code;}
public void setCode(String value) {this.code=value;}
public String getHead() {return head;}
public void setHead(String value) {this.head=value;}
}
