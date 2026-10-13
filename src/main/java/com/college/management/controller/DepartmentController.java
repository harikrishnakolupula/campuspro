package com.college.management.controller;
import com.college.management.model.Department;
import com.college.management.repository.DepartmentRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@RestController @RequestMapping("/api/departments")
public class DepartmentController {
 private final DepartmentRepository repository;
 public DepartmentController(DepartmentRepository repository) {this.repository=repository;}
 @GetMapping public List<Department> all() {return repository.findAll();}
 @GetMapping("/{id}") public Department one(@PathVariable Long id) {
  return repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found"));
 }
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Department create(@RequestBody Department value) {
  if(value.getName()==null || value.getName().isBlank())
   throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Required field missing");
  value.setId(null); return repository.save(value);
 }
 @PutMapping("/{id}") public Department update(@PathVariable Long id,@RequestBody Department value) {
  if(!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found");
  value.setId(id); return repository.save(value);
 }
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) {
  if(!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found");
  repository.deleteById(id);
 }
}
