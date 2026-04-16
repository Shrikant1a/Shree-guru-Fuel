# Shriguru Petrol Pump Management & Booking System

A modern, digitized fuel station management platform built with React, Spring Boot, and MySQL.

## 🚀 Getting Started

### 1. Prerequisites
- **Java 17** or higher
- **Node.js** (v18+)
- **MySQL** installed and running
- **Maven** (optional, you can use `./mvnw`)

### 2. Database Setup
1. Open your MySQL terminal/bench.
2. Create the database:
   ```sql
   CREATE DATABASE shriguru_petrol_db;
   ```
3. Update `backend/src/main/resources/application.properties` with your MySQL username and password.

### 3. Running the Backend
1. Navigate to the `backend` directory.
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start at `http://localhost:8080`.

### 4. Running the Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies (if not done already):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Axios, Lucide Icons.
- **Backend**: Java, Spring Boot, Spring Security, Spring Data JPA.
- **Database**: MySQL.

## ✨ Key Features
- **Dynamic Price Board**: Real-time fuel prices fetched from the backend.
- **Service Requests**: Digital form for booking fuel delivery, bulk orders, etc.
- **Admin Control**: Backend API ready for fuel price updates and request management.
- **Premium UI**: Modern dark mesh background, glassmorphism, and smooth animations.

## 🏆 Project Inspiration
Inspired by the digital transformation of major fuel providers like Bharat Petroleum, tailored for a premium local business experience.
