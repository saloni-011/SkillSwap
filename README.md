# SkillSwap Learning & Exchange Platform

A full-stack MERN application for skill exchange, allowing users to teach what they know and learn what they desire.

## 🚀 Features
- **Real-time Chat**: Powered by Socket.io for instant messaging.
- **Skill Management**: Add skills you can teach and skills you want to learn.
- **Matching System**: Automated suggestions based on mutually beneficial skills.
- **Session Scheduler**: Book classes, accept/reject requests, and rate your mentors.
- **Admin Panel**: Analytics and user management for administrators.
- **Premium UI**: Clean, modern design with smooth animations.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Context API, Axios, Lucide React, Framer Motion.
- **Backend**: Node.js, Express.js, Socket.io, JWT.
- **Database**: MongoDB (Mongoose).

## 🏃 Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running

### 1. Setup Backend
```bash
cd backend
npm install
npm start
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure
```
skill-exchange/
├── backend/
│   ├── config/         # Database config
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── server.js      # Entry point
└── frontend/
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── context/    # Global state (Auth)
    │   ├── pages/      # Application pages
    │   ├── App.jsx     # Main routes
    │   └── index.css   # Modern styles
    └── vite.config.js
```
