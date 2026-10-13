package com.college.management.config;
import com.college.management.model.*;
import com.college.management.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
@Configuration
public class SampleData {
 @Bean CommandLineRunner seed(StudentRepository students,CourseRepository courses,DepartmentRepository departments) {
  return args -> {
   if(departments.count()==0) {
    Department a=new Department();a.setName("Computer Science");a.setCode("CSE");a.setHead("Dr. Ananya Rao");departments.save(a);
    Department b=new Department();b.setName("Mechanical Engineering");b.setCode("ME");b.setHead("Dr. Ravi Kumar");departments.save(b);
    Department c=new Department();c.setName("Electronics & Communication");c.setCode("ECE");c.setHead("Dr. Priya Sharma");departments.save(c);
   }
   if(courses.count()==0) {
    Course a=new Course();a.setName("Data Structures");a.setCode("CS201");a.setDepartment("Computer Science");a.setCredits(4);courses.save(a);
    Course b=new Course();b.setName("Database Management");b.setCode("CS302");b.setDepartment("Computer Science");b.setCredits(3);courses.save(b);
    Course c=new Course();c.setName("Digital Electronics");c.setCode("EC205");c.setDepartment("Electronics & Communication");c.setCredits(4);courses.save(c);
   }
   if(students.count()==0) {
    String[][] demo={{"Aarav Mehta","CSE001","aarav@example.com","Computer Science","3rd Year"},
     {"Diya Reddy","CSE002","diya@example.com","Computer Science","2nd Year"},
     {"Ishaan Shah","ECE003","ishaan@example.com","Electronics & Communication","4th Year"},
     {"Sara Khan","ME004","sara@example.com","Mechanical Engineering","1st Year"}};
    for(String[] row:demo) {
     Student s=new Student();s.setFullName(row[0]);s.setRollNumber(row[1]);s.setEmail(row[2]);
     s.setDepartment(row[3]);s.setYear(row[4]);s.setStatus("Active");s.setPhone("9876543210");students.save(s);
    }
   }
  };
 }
}
