# 🌊 Tidy

A modern web application for Cape Town surfers and beachgoers to stay in sync with tides, surf reports, weather, and connect with the community through our forum.

## ✨ Features

### 🔐 User Authentication

- Secure JWT-based login and registration with HttpOnly cookies
- Session-based authentication
- User profiles with post history
- Password hashing with bcrypt

### 🏖️ Beach & Surf Information

- Real-time surf conditions
- Tide charts and predictions
- Wave height graphs
- Beach favorites and watchlist
- Interactive beach carousel

### 💬 Community Forum

- **Category System** — 4 main categories with 17 subcategories
  - 🏖️ Beaches (Muizenberg, Camps Bay, Clifton, etc.)
  - ⚠️ Safety & Awareness (Rip Currents, Marine Life, First Aid, etc.)
  - 📅 Events & Meetups (Competitions, Beach Cleanups, Social Gatherings)
  - 💡 General Discussion (Gear Reviews, Travel Tips, Conservation)
- **Posts & Comments** — Create posts, comment, and reply to discussions
- **Real-time Updates** — Instant comment/reply updates with React Query
- **User Interactions** — Like posts and comments, view counts
- **User Profiles** — View user's post history and stats
- **Smart Navigation** — Breadcrumb navigation, category/subcategory pages
- **Auto-fill Forms** — Create posts with pre-selected categories from context

### 🎨 Modern UI/UX

- Ocean-themed dark gradient design
- Glassmorphism effects with backdrop blur
- Responsive layout (mobile-first)
- Smooth animations and transitions
- Show More/Hide pagination on long lists
- Loading states and error handling

## 🛠️ Tech Stack

### Frontend

- **React 19** — UI library with hooks
- **React Router v6** — Client-side routing with dynamic params
- **React Query v5** — Server state management, caching, and mutations
- **Vite 7** — Build tool and dev server
- **Mantine UI** — Component library
- **Axios** — HTTP client with credentials
- **CSS3** — Custom styling with CSS Modules and gradients

### Backend

- **Node.js & Express** — Server and REST API
- **MongoDB & Mongoose** — Database with ODM
- **JWT** — Token-based authentication
- **bcrypt** — Password hashing
- **CORS** — Configured for localhost development
- **Cookie Parser** — HttpOnly cookie handling

## 📦 Project Structure

```
tidyapp/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── UserPostsList.jsx       # User posts display
│   │   │   ├── MyForumPosts.jsx        # Dashboard posts
│   │   │   ├── CommentForm.jsx         # Top-level comments
│   │   │   ├── InlineCommentForm.jsx   # Reply forms
│   │   │   ├── CommentsList.jsx        # Comment display
│   │   │   ├── ForumRecentActivity.jsx # Recent posts
│   │   │   └── ...
│   │   ├── context/         # Global state (User, PostDetail)
│   │   ├── pages/           # Route pages
│   │   │   ├── ForumHomePage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── SubcategoryPage.jsx
│   │   │   ├── PostDetailPage.jsx
│   │   │   ├── CreatePostPage.jsx
│   │   │   ├── UserProfilePage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── mutations/       # React Query mutations
│   │   ├── services/        # API service functions
│   │   ├── config/          # App configuration
│   │   │   └── forumCategories.js  # Category/subcategory config
│   │   └── utils/           # Helper functions
│   └── package.json
├── backend/           # Express API server
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── User.js      # User model (email hidden from frontend)
│   │   │   ├── Post.js      # Forum posts
│   │   │   └── Comment.js   # Comments with replies
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js      # Authentication endpoints
│   │   │   ├── posts.js     # Post CRUD
│   │   │   └── comments.js  # Comment CRUD
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth middleware
│   │   ├── config/          # Backend configuration
│   │   │   └── forumCategories.js  # Category validation
│   │   └── server.js        # Entry point
│   ├── data/db/             # Local MongoDB data
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
   MONGO_URI=mongodb://127.0.0.1:27017/tidyapp
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

   Create `frontend/.env` (optional):

   ```env
   VITE_API_URL=http://localhost:5000/api
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

### Posts

- `GET /api/posts` — Get all posts (with filters: category, subcategory, author)
- `GET /api/posts/:id` — Get single post
- `GET /api/posts/categories` — Get category statistics
- `POST /api/posts` — Create post (protected)
- `PUT /api/posts/:id` — Update post (protected, author only)
- `DELETE /api/posts/:id` — Delete post (protected, author only)
- `POST /api/posts/:id/like` — Toggle like (protected)

### Comments

- `GET /api/comments/post/:postId` — Get comments for a post
- `POST /api/comments` — Create comment/reply (protected)
- `PUT /api/comments/:id` — Update comment (protected, author only)
- `DELETE /api/comments/:id` — Delete comment (protected, author only)
- `POST /api/comments/:id/like` — Toggle like (protected)

## 🎨 Design Features

- **Ocean Theme** — Dark gradient backgrounds (`#0f172a` → `#1e293b`)
- **Glassmorphism** — Frosted glass effects with backdrop blur
- **Gradient Accents** — Teal-to-blue highlights (`#6dd5ed` → `#2193b0`)
- **Smooth Animations** — Card hover effects, drawer transitions
- **Custom Scrollbar** — Themed scrollbar matching dark palette
- **Responsive Design** — Mobile-first approach with breakpoints
- **CSS Modules** — Scoped component styling
- **Emoji Icons** — Visual category/subcategory indicators

## 🔒 Security Features

✅ **User ID Spoofing Protection** — Author IDs from authenticated session only
✅ **Email Privacy** — User emails excluded at model level (toJSON transform)
✅ **HttpOnly Cookies** — JWT tokens not accessible via JavaScript
✅ **CORS Configuration** — Localhost-only in development
✅ **Password Hashing** — bcrypt with 10 rounds
✅ **Session-based Auth** — Server determines user identity from JWT
✅ **Input Validation** — Category/subcategory validation
✅ **Protected Routes** — Middleware-based authentication

### Recommendations for Production

- Add rate limiting (express-rate-limit)
- Add Helmet for security headers
- Update CORS to allow production domain
- Add request validation (express-validator)

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

## �️ Forum Categories

### 🏖️ Beaches

Muizenberg, Camps Bay, Clifton, Blouberg, Noordhoek, Kogel Bay, Scarborough

### ⚠️ Safety & Awareness

Rip Currents, Marine Life, Weather Warnings, Beach Etiquette, First Aid

### 📅 Events & Meetups

Surf Competitions, Beach Cleanups, Social Gatherings

### 💡 General Discussion

Gear & Equipment, Travel & Destinations, Conservation & Environment

## 🚀 Recent Updates

- ✅ React Query integration for server state management
- ✅ User profile pages with post history
- ✅ Dashboard with user's posts
- ✅ Real-time comment/reply updates
- ✅ Email privacy security hardening
- ✅ Category/subcategory navigation system
- ✅ Show More/Hide pagination
- ✅ Auto-fill create post forms from context
- ✅ Inline reply forms with auto-focus
- ✅ Edit comment functionality
- ✅ Breadcrumb navigation

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📄 License

ISC

## 👤 Author

**Dante-Q**

---

Built with ❤️ for Cape Town surfers and ocean enthusiasts 🏄‍♂️
