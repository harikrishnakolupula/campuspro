package com.college.management.controller;
import com.college.management.model.Student;
import com.college.management.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@RestController @RequestMapping("/api/students")
public class StudentController {
 private final StudentRepository repository;
 public StudentController(StudentRepository repository) {this.repository=repository;}
 @GetMapping public List<Student> all() {return repository.findAll();}
 @GetMapping("/{id}") public Student one(@PathVariable Long id) {
  return repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found"));
 }
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Student create(@RequestBody Student value) {
  if(value.getFullName()==null || value.getFullName().isBlank())
   throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Required field missing");
  value.setId(null); return repository.save(value);
 }
 @PutMapping("/{id}") public Student update(@PathVariable Long id,@RequestBody Student value) {
  if(!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found");
  value.setId(id); return repository.save(value);
 }
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) {
  if(!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found");
  repository.deleteById(id);
 }
}
