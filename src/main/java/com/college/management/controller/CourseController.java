package com.college.management.controller;
import com.college.management.model.Course;
import com.college.management.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@RestController @RequestMapping("/api/courses")
public class CourseController {
 private final CourseRepository repository;
 public CourseController(CourseRepository repository) {this.repository=repository;}
 @GetMapping public List<Course> all() {return repository.findAll();}
 @GetMapping("/{id}") public Course one(@PathVariable Long id) {
  return repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found"));
 }
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Course create(@RequestBody Course value) {
  if(value.getName()==null || value.getName().isBlank())
   throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Required field missing");
  value.setId(null); return repository.save(value);
 }
 @PutMapping("/{id}") public Course update(@PathVariable Long id,@RequestBody Course value) {
  if(!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found");
  value.setId(id); return repository.save(value);
 }
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) {
  if(!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found");
  repository.deleteById(id);
 }
}
