# 🎓 Placement Preparation Portal

A full-stack web application developed to help students prepare for campus placements. The portal provides aptitude practice, coding practice, study notes, profile management, and resume management through a secure role-based system.

---

## 📖 Overview

The Placement Preparation Portal is designed for students and administrators.

Students can:
- Create and manage their profile
- Upload and view resumes
- Practice aptitude questions
- Track coding progress
- Access study notes

Administrators can:
- Manage aptitude questions
- Manage coding questions
- Upload and manage study notes
- View student profiles and resumes

The application uses JWT Authentication and Role-Based Authorization to secure all APIs.

---

# ✨ Features

## 👨‍🎓 Student

- User Registration
- User Login
- JWT Authentication
- View Dashboard
- Create Profile
- Update Profile
- Upload Resume (PDF)
- View Resume
- Practice Aptitude Questions
- View Aptitude Score
- Track Aptitude Progress
- View Coding Questions
- Mark Coding Questions as Solved
- Track Coding Progress
- View Notes

---

## 👨‍💼 Admin

- Secure Admin Login
- Add Aptitude Questions
- Update Aptitude Questions
- Delete Aptitude Questions
- Add Coding Questions
- Update Coding Questions
- Delete Coding Questions
- Upload Notes
- Edit Notes
- Delete Notes
- View Student Profiles
- View Student Resumes

---

# 🔒 Security Features

- JWT Authentication
- BCrypt Password Encryption
- Role-Based Authorization
- Protected REST APIs
- Global Exception Handling
- Input Validation

---

# 🛠 Tech Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Axios

## Backend

- Spring Boot
- Spring Security
- Spring Data JPA
- JWT
- Hibernate

## Database

- MySQL

## Tools

- Maven
- Git
- GitHub
- Postman
- VS Code
- IntelliJ IDEA

---

# 📂 Project Structure

```
PlacementPreparationPortal
│
├── backend
│   ├── src
│   ├── uploads
│   ├── pom.xml
│   └── application.properties
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🗄 Database

Main Tables

- User
- StudentProfile
- AptitudeQuestion
- UserAttempt
- CodingQuestion
- CodingProgress
- Notes

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/PlacementPreparationPortal.git
```

---

## Backend

```bash
cd backend
```

Configure MySQL in

```
src/main/resources/application.properties
```

Example

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/placement_portal
spring.datasource.username=root
spring.datasource.password=yourpassword
```

Run Backend

```bash
./mvnw spring-boot:run
```

or

```bash
mvn spring-boot:run
```

Backend runs on

```
http://localhost:8081
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🔑 Authentication

The application uses JWT Authentication.

After successful login, a JWT token is generated.

Protected APIs require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📌 Main REST APIs

## Authentication

```
POST /api/auth/register
POST /api/auth/login
```

---

## Student Profile

```
GET /api/profile
POST /api/profile
PUT /api/profile
```

---

## Resume

```
POST /api/profile/resume
GET /api/profile/resume
GET /api/profile/admin/resume/{id}
```

---

## Aptitude

```
GET /api/aptitude/*
POST /api/aptitude/*
```

---

## Coding

```
GET /api/coding/*
POST /api/coding/*
```

---

## Notes

```
GET /api/notes/*
POST /api/notes/*
```

---

# 📸 Screenshots

Add screenshots of the following pages:

- Login
- <img width="1259" height="756" alt="image" src="https://github.com/user-attachments/assets/94793854-0f5a-4fd3-914b-0e12d02c130b" />

- Register
- <img width="906" height="783" alt="image" src="https://github.com/user-attachments/assets/7a48f8c1-c690-453e-86e9-8a4a1f05be56" />

- Dashboard
- <img width="1876" height="984" alt="image" src="https://github.com/user-attachments/assets/3b8101ec-3dbe-4e3f-bcec-4ae2d92a392c" />

- Student Profile
- <img width="674" height="773" alt="image" src="https://github.com/user-attachments/assets/23546357-c944-4ea5-9aba-1a148ee1a903" />

- Aptitude Module
- <img width="848" height="1022" alt="image" src="https://github.com/user-attachments/assets/67f64510-1efe-474f-8514-0e9dcf5ed140" />

- Coding Module
- <img width="1029" height="1079" alt="image" src="https://github.com/user-attachments/assets/85a3dfc5-3d66-43cc-bad5-ad0f609a53ea" />

- Notes Module
- <img width="760" height="1063" alt="image" src="https://github.com/user-attachments/assets/8ebb87b2-cfc2-48c0-aa1f-8f3aabb4d25e" />

- Admin Dashboard
- <img width="1842" height="757" alt="image" src="https://github.com/user-attachments/assets/475da02d-4f4a-4a0e-ac7c-70669d762652" />


---

# 📈 Future Enhancements

- Company Management Module
- Online Coding Compiler
- Mock Interview Module
- Email Notifications
- Resume Analyzer
- Placement Analytics
- Cloud File Storage
- Deployment on Cloud Platform

---

# 👨‍💻 Author

**Soham**

Bachelor of Engineering (Computer Engineering)

---

# 📄 License

This project is developed for educational purposes as part of a Bachelor of Engineering project.
