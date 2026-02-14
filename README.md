# 💬 Chatly

A full-stack real-time chat application built with the MERN stack and Socket.io.  
Users can register, log in, update profiles, send text and image messages, and chat instantly with other users.

# 🚀 Live Demo:
 https://realtimechatapp-qxrk.onrender.com

---

## ✨ Features

- JWT-based authentication (Login / Register)
- Secure cookie-based sessions
- Profile update (Name & Image)
- Search users by name or username
- Real-time one-to-one messaging
- Online user tracking
- Image sharing with Cloudinary
- MongoDB data persistence
- Socket.io real-time communication
- Deployed on Render

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io
- JWT
- bcrypt
- Multer
- Cloudinary

---

## 📁 Project Structure

chatly/
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── config/
│ ├── models/
│ ├── socket/
│ └── server.js
│
└── frontend/
├── src/
└── public/

---

## 🗄 Database Models

### User
- name (String)
- userName (String, unique, required)
- email (String, unique, required)
- password (String, hashed)
- image (String)
- timestamps

### Message
- sender (ObjectId → User)
- receiver (ObjectId → User)
- message (String)
- image (String)
- timestamps

### Conversation
- participants (Array of User ObjectIds)
- messages (Array of Message ObjectIds)
- timestamps

---

## 🔐 Authentication

- Password hashing using bcrypt
- JWT token generation
- HTTP-only cookies
- Protected routes using middleware

---

## 🔌 Real-Time Communication

- Users connect using userId
- Maintains userSocketMap
- Emits:
  - `getOnlineUsers`
  - `newMessage`
- Handles connection and disconnection events

---

## 📤 File Upload

- Multer for handling uploads
- Cloudinary for storing images
- Supports:
  - Profile image upload
  - Image messages

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/hixrathiee/chatly.git
cd chatly
```

## 🚀 Installation & Setup

### 2️. Backend Setup

```bash
cd backend
npm install
```

Create a .env file inside the backend folder:

```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend server:
```bash
npm run dev
```

### 3️. Frontend Setup
```bash
cd frontend
npm install
npm start
```

🌍 Deployment

-Backend deployed on Render
-Database hosted on MongoDB Atlas
-Media storage handled by Cloudinary

### 📌 Future Improvements

-Group chat
-Typing indicator
-Message seen status
-Delete messages
-Pagination
-Push notifications

### 👩‍💻 Author
Anjali Rathi
GitHub: https://github.com/hixrathiee
