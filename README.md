# 🏥 Hospital Management System (Full Stack Project)

A complete full-stack Hospital Management System built using **HTML, CSS, JavaScript, Node.js, Express.js, and PostgreSQL**. This system provides a complete solution to manage hospital operations digitally with a modern responsive dashboard.

---

## 🚀 Project Overview

This project is designed to manage all core hospital activities including patients, doctors, appointments, medical records, prescriptions, billing, and department management. It uses a RESTful API architecture to connect frontend with backend and PostgreSQL database.

---

## ⚙️ Features

### 👨‍⚕️ Patient Management
- Add new patients
- View patient list
- Update patient details
- Delete patient records

### 🩺 Doctor Management
- Add doctors
- Assign specialization
- Manage doctor records

### 🏥 Department Management
- Create departments
- Assign doctors to departments

### 📅 Appointment System
- Book appointments
- Track appointment status
- Link patients and doctors

### 📋 Medical Records
- Store diagnosis
- Manage treatments
- Track patient history

### 💊 Prescriptions
- Add medicines
- Set dosage & instructions

### 💰 Billing System
- Generate bills
- Track payment status
- Link with appointments

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Responsive UI)
- JavaScript (Fetch API)

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

---

## 📂 Project Structure
/project-root
HMS/
│
├── API/ # Backend (Node.js + Express)
│ ├── node_modules/
│ ├── .env
│ ├── index.js
│ ├── package.json
│ └── package-lock.json
│
└── frontend/ # Frontend (UI)
├── index.html
├── style.css
└── script.js

---

## 🗄️ Database Schema

Tables used:
- patients
- doctors
- departments
- doctor_departments
- appointments
- medical_records
- prescriptions
- billing

All tables are relational and connected using **foreign keys**.

---

## 🔗 API Endpoints

### Patients
- GET `/patients`
- POST `/patients`
- PUT `/patients/:id`
- DELETE `/patients/:id`

### Doctors
- GET `/doctors`
- POST `/doctors`
- PUT `/doctors/:id`
- DELETE `/doctors/:id`

### Departments, Appointments, Records, Billing
Same REST pattern used for all modules.

---

## ▶️ How to Run Project

### 1. Clone Repository
git clone <repo-url>


### 2. Install Dependencies

npm install


### 3. Setup Database
- Create PostgreSQL database
- Run provided SQL script

### 4. Configure Environment
Create `.env` file:

DATABASE_URL=your_database_url
PORT=3000


### 5. Start Server

node index.js


### 6. Run Frontend
Open `index.html` in browser

---

## 📸 UI Features

- Modern glassmorphism design
- Responsive layout (mobile + desktop)
- Interactive dashboard
- Card-based data display

---

## 🎯 Purpose of Project

This project is built for learning:
- Full-stack web development
- REST API creation
- Database relationships (PostgreSQL)
- CRUD operations
- Frontend-backend integration

---

## 👨‍💻 Author

Developed for educational purposes to understand real-world hospital system architecture.

---

## 📌 Future Improvements

- Authentication system (Login/Register)
- Role-based access (Admin/Doctor/Staff)
- Live notifications
- Dashboard analytics
- Cloud deployment

---

## ⭐ If you like this project
Give it a star and feel free to improve it 🚀
