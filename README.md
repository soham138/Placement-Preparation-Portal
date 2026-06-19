# Placement Preparation Portal

A full-stack Placement Preparation Portal built using React, Spring Boot, MySQL, JWT Authentication, and REST APIs.

## Project Overview

This project helps students prepare for placements through aptitude tests, practice questions, progress tracking, attempt history, and leaderboard rankings.

The portal provides a secure login system and tracks user performance for continuous improvement.

---

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Vite

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA

### Database
- MySQL

---

## Features

### Authentication
- User Registration
- User Login
- JWT Token Authentication
- Protected Routes

### Aptitude Test
- One Attempt Per Question
- Score Calculation
- Accuracy Calculation
- Progress Tracking
- Result Feedback

### Practice Mode
- Unlimited Practice
- Instant Feedback
- Difficulty Based Questions

### Dashboard
- Total Questions
- Total Attempts
- Correct Answers
- Wrong Answers
- Accuracy Percentage

### Attempt History
- View All Previous Attempts
- Correct/Wrong Status
- Date and Time Tracking

### Leaderboard
- User Ranking
- Score Comparison
- Accuracy Comparison

### Difficulty Levels
- Easy
- Medium
- Hard

---

## Database Tables

### users

| Column |
|----------|
| id |
| name |
| email |
| password |

### aptitude_questions

| Column |
|----------|
| id |
| question |
| option_a |
| option_b |
| option_c |
| option_d |
| correct_answer |
| difficulty |

### user_attempts

| Column |
|----------|
| id |
| user_email |
| question_id |
| selected_answer |
| is_correct |
| attempted_at |

---

## Project Structure

```text
PlacementPreparationPortal
│
├── backend
│   ├── controller
│   ├── entity
│   ├── repository
│   ├── security
│   └── config
│
└── frontend
    ├── components
    ├── pages
    ├── routes
    └── services
```

---

## API Endpoints

### Authentication

POST

```http
/api/auth/register
```

```http
/api/auth/login
```

### Aptitude

GET

```http
/api/aptitude
```

POST

```http
/api/aptitude/{id}/submit
```

GET

```http
/api/aptitude/score
```

GET

```http
/api/aptitude/history
```

GET

```http
/api/aptitude/leaderboard
```

### Practice

GET

```http
/api/practice
```

POST

```http
/api/practice/{id}/check
```

---

## Screenshots

### Login Page

Add Screenshot Here

### Dashboard

Add Screenshot Here

### Aptitude Test

Add Screenshot Here

### Practice Mode

Add Screenshot Here

### History

Add Screenshot Here

### Leaderboard

Add Screenshot Here

---

## How To Run

### Backend

```bash
cd backend

mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8081
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Learning Outcomes

This project demonstrates:

- React Fundamentals
- Component-Based Architecture
- REST APIs
- Spring Boot Development
- Spring Security
- JWT Authentication
- Database Design
- MySQL Integration
- Full Stack Development
- CRUD Operations
- Performance Tracking Systems

---

## Future Enhancements

- Coding Questions Module
- Notes Management Module
- Admin Dashboard
- Interview Preparation Module
- Company Wise Question Bank
- Performance Analytics
- Charts and Graphs
- Role Based Access Control

---

## Author

Soham

BE Computer Engineering Student










































































INSERT INTO aptitude_questions
(
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    difficulty
)
VALUES
(
    'What is 15 + 10?',
    '20',
    '25',
    '30',
    '35',
    'B',
    'EASY'
);

DELETE FROM aptitude_questions
WHERE id = 5;

SELECT * FROM aptitude_questions;