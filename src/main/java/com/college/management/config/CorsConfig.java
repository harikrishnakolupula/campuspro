package com.college.management.config;
import org.springframework.context.annotation.*;
import org.springframework.web.servlet.config.annotation.*;
@Configuration
public class CorsConfig {
 @Bean WebMvcConfigurer cors() { return new WebMvcConfigurer() {
  @Override public void addCorsMappings(CorsRegistry registry) {
   registry.addMapping("/api/**").allowedOrigins("http://localhost:5173","http://127.0.0.1:5173").allowedMethods("GET","POST","PUT","DELETE","OPTIONS");
  }
 }; }
}
