# 🌊 Tidy

A modern web application for staying in sync with tides, surf reports, and weather in Cape Town.

## ✨ Features

- **User Authentication** — Secure JWT-based login and registration with HttpOnly cookies
- **Modern UI** — Ocean-themed dark gradient design with glassmorphism effects
- **Responsive Layout** — Built with Mantine UI components and custom styling
- **Global State Management** — React Context API for user and UI state
- **Protected Routes** — Role-based access control for authenticated users
- **Smooth Animations** — Polished interactions with backdrop blur and slide transitions

## 🛠️ Tech Stack

### Frontend

- **React 19** — UI library
- **Vite** — Build tool and dev server
- **Mantine UI** — Component library
- **React Router** — Client-side routing
- **Axios** — HTTP client
- **CSS3** — Custom styling with gradients, animations, and glassmorphism

### Backend

- **Node.js & Express** — Server and REST API
- **MongoDB & Mongoose** — Database and ODM
- **JWT** — Token-based authentication
- **bcrypt** — Password hashing
- **CORS** — Cross-origin resource sharing

## 📦 Project Structure

```
tidyapp/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Global state (User, UI)
│   │   ├── pages/        # Route pages
│   │   └── assets/       # Static assets
│   └── package.json
├── backend/           # Express API server
│   ├── src/
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   └── server.js     # Entry point
│   ├── data/db/          # Local MongoDB data
│   └── package.json
└── package.json       # Root scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** installed locally

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Dante-Q/tidyApp.git
   cd tidyapp
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

   This installs packages for both frontend and backend.

3. **Set up environment variables**

   Create `backend/.env`:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/tidyapp
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

### Running the App

**Development mode** (runs MongoDB, backend, and frontend concurrently):

```bash
npm start
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

**Individual services:**

```bash
# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && npm run dev

# MongoDB only
npm run mongo
```

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user (protected)
- `POST /api/auth/logout` — Logout user

## 🎨 Design Features

- **Ocean Theme** — Dark gradient backgrounds (`#0f172a` → `#1e293b`)
- **Glassmorphism** — Frosted glass effects with backdrop blur
- **Gradient Accents** — Teal-to-blue highlights (`#6dd5ed` → `#2193b0`)
- **Smooth Animations** — Drawer transitions, wave emoji, gradient text
- **Custom Scrollbar** — Themed scrollbar matching dark palette
- **Responsive Navbar** — Glass background with hover effects

## 📝 Available Scripts

### Root

- `npm start` — Run MongoDB, backend, and frontend
- `npm run dev` — Development mode with hot reload
- `npm run install-all` — Install all dependencies

### Frontend

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

### Backend

- `npm run dev` — Start with nodemon (auto-restart)
- `npm start` — Start production server

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens stored in HttpOnly cookies
- CORS configured for localhost development
- Environment variables for sensitive data

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📄 License

ISC

## 👤 Author

**Dante-Q**

---

Built with ❤️ for Cape Town surfers and ocean enthusiasts 🏄‍♂️
