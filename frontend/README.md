# 📸 Instagram Clone

A modern, full-stack Instagram clone featuring authentication, private accounts, follow system, and dynamic content feed. Built with clean architecture principles and responsive design.

---

## 🎯 Project Overview

This project replicates Instagram's core functionality including user authentication, post sharing, social interactions, and privacy controls. The application uses a 4-layer backend architecture for maintainability and follows React best practices on the frontend.

---

## ✨ Features

### 🔐 Authentication & Security
- User registration with username, email, password
- Login with username OR email support
- JWT token-based authentication
- HTTP-only cookies for secure session management
- Protected routes and middleware authorization

### 👥 User System
- Public and private account modes
- Custom profile images with gradient borders
- User bio and profile customization
- Follow/unfollow functionality
- Follow request system for private accounts

### 📰 Feed & Posts
- Dynamic feed filtering based on:
  - Public posts (always visible)
  - Private posts (only for accepted followers)
  - Own posts (always visible)
- Real-time like/unlike with animations
- Comment and share capabilities
- Bookmark posts for later viewing
- Responsive image display with consistent sizing

### 🎨 UI/UX
- Instagram-inspired gradient profile borders
- Smooth like animations (heart pop effect)
- Loading states and empty states
- Mobile-responsive design
- Clean, minimal interface
- SCSS modular styling

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library with hooks and context
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **SCSS** - Modular styling with nesting

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **ImageKit** - Cloud image storage and optimization

### Architecture
- **4-Layer Pattern**: Routes → Controllers → Services → Models
- **Hooks Pattern**: Custom React hooks for state management
- **RESTful API**: Standard HTTP methods and status codes

---

## 📁 Project Structure
```
instagram-clone/
├── frontend/
│   ├── src/
│   │   ├── auth/          # Authentication pages & logic
│   │   │   ├── pages/     # Login, Register components
│   │   │   ├── hooks/     # useAuth hook
│   │   │   └── services/  # Auth API calls
│   │   ├── feed/          # Feed page & components
│   │   ├── components/    # Reusable components (Post, etc.)
│   │   ├── hooks/         # Custom hooks (usePost)
│   │   ├── services/      # API services
│   │   └── styles/        # SCSS stylesheets
│   └── ...
├── backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth, validation
│   └── ...
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- ImageKit account

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/instagram-clone.git
   cd instagram-clone
```

2. **Backend Setup**
```bash
   cd backend
   npm install
   
   # Create .env file with:
   # MONGODB_URI=your_mongodb_uri
   # JWT_SECRET=your_secret_key
   # IMAGEKIT_PUBLIC_KEY=your_key
   # IMAGEKIT_PRIVATE_KEY=your_key
   # IMAGEKIT_URL_ENDPOINT=your_endpoint
   
   npm start
```

3. **Frontend Setup**
```bash
   cd frontend
   npm install
   npm run dev
```

4. **Open your browser**
```
   http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/instagram-clone
JWT_SECRET=your_jwt_secret_key_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### Frontend (optional .env)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📸 Screenshots

[Add screenshots of your app here]

---

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
- Full-stack JavaScript development
- RESTful API design and implementation
- JWT authentication and authorization
- React hooks and context API
- MongoDB schema design and relationships
- Responsive UI/UX design
- Image optimization and cloud storage
- Clean code architecture

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
## 👨‍💻 Author

**Your Name**  
[GitHub](https://github.com/yourusername) • [LinkedIn](https://linkedin.com/in/yourprofile) • [Portfolio](https://yourwebsite.com)

---

## 🙏 Acknowledgments

- Inspired by Instagram's design and functionality
- ImageKit for image storage solution
- MongoDB for database services