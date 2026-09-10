# Discipline - Personal Development & Religious Tracking System

A comprehensive web application for tracking personal development, courses, reading, goals, and daily prayers.

## Features

### 🌙 Dark/Light Mode
- Seamless theme switching with smooth transitions
- Persistent theme preference

### 👤 Authentication
- User registration and login
- JWT-based authentication
- Role-based access (Admin/User)

### 📚 Areas Management
- Create and manage multiple areas
- Each area can contain courses, books, and goals

### 🎓 Courses
- Create courses with multiple topics
- Automatic topic assignment to days
- Track topic completion status (missed/pending/complete)
- Visual progress tracking

### 📖 Books
- Add books with page counts
- Automatic page distribution across days
- Track reading sessions (missed/pending/complete)

### 🎯 Goals
- Create goals with multiple tasks
- Automatic task assignment to days
- Track task completion status

### 🕌 Prayer Tracker
- Track 5 daily prayers (Fajer, Duher, Aser, Maghrib, Isha)
- Visual prayer status
- Mark prayers as complete or pending

### 📊 Dashboard
- Weekly progress overview
- Daily view with all tasks
- Charts and statistics
- Quick actions

### 📈 Weekly Review
- Detailed weekly progress
- Daily breakdown
- Completion rates for all activities
- Visual charts

### 👑 Admin Panel
- User management
- Activate/deactivate users
- Change user roles
- Delete users

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React.js
- React Router
- Styled Components
- Recharts for charts
- React Hot Toast for notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd discipline-backend