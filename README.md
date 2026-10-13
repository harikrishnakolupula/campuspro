# CampusPro College Management React Frontend

A responsive React + Vite dashboard designed to pair with a Spring Boot college-management backend.

## Requirements
- Node.js 20.19+ or 22.12+ recommended for current Vite releases.
- npm
- Spring Boot backend (the API client defaults to `http://localhost:3030`).

## Run the frontend
1. Extract this ZIP.
2. Open a terminal inside the extracted `college-management-react` folder.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the URL shown by Vite, usually `http://localhost:5173`.

## Backend configuration
The API base URL defaults to `http://localhost:3030`. To change it:
1. Copy `.env.example` to `.env`.
2. Set `VITE_API_BASE_URL=http://localhost:3030` to your backend's base URL.
3. Restart `npm run dev`.

## Expected API endpoints
The starter frontend tries these GET endpoints:
- `GET /api/students`
- `GET /api/courses`
- `GET /api/departments`

For Create/Edit/Delete it expects:
- `POST /api/{resource}`
- `PUT /api/{resource}/{id}`
- `DELETE /api/{resource}/{id}`

These paths are common conventions, not guaranteed to match your backend. Adjust `path` in `src/App.jsx` to match your Spring controllers. The API response for list endpoints should be a JSON array or an object containing `content`, `data`, or `items` arrays.

The frontend requests these fields in its create/edit forms:
- Students: `fullName`, `email`, `phone`, `rollNumber`, `department`, `year`, `status`
- Courses: `name`, `code`, `credits`, `department`
- Departments: `name`, `code`, `head`

Change these names to match your Java entity fields. IDs are expected as `id`, `studentId`, `courseId`, or `departmentId`.

## CORS
Allow the React origin in Spring Boot, e.g. `http://localhost:5173`, for API routes. Example `WebMvcConfigurer` configuration:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```
Use your existing CORS configuration if you already have one.

## Preview mode
If endpoints are unavailable or don't match, the UI displays sample data and a notice. Sample rows are not saved to MySQL. Add/Edit/Delete only run against APIs detected as live. Verify your exact controller routes and request fields before using mutations.

## Important
This ZIP contains the React frontend only. It does not contain your Spring Boot Java backend or MySQL database. It is a runnable frontend project; full database integration depends on matching the API paths and fields to your backend.
