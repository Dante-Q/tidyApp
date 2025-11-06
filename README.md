# 🌊 TidyApp

A comprehensive web application for beach enthusiasts in Cape Town, combining real-time surf conditions, tide predictions, and a vibrant community forum.

## ✨ Features

### 🔐 User Authentication

- Secure JWT-based authentication with HttpOnly cookies
- User registration and login system
- Protected routes and role-based access control
- User profiles with customizable avatar colors
- Admin badges and role indicators
- Friends system for connecting with other users

### 🏖️ Beach & Surf Information

- **6 Major Beaches**: Muizenberg, Bloubergstrand, Strand, Clifton, Kalk Bay, Milnerton
- Real-time surf conditions from Open-Meteo Marine API
- Tide predictions and extremes (high/low tides) from Stormglass.io
- Interactive tide charts with smooth bezier curves
- Wave height, wind speed, and direction visualization
- Beach favorites and watchlist system
- Detailed beach information pages with amenities and tips
- Interactive map showing beach locations
- Responsive beach carousel optimized for mobile browsing

### 💬 Community Forum

- **6 Main Categories** with **25+ Subcategories**:
  - 💬 **General**: Info & Tips, Community News, Gear, Surfing, Kiteboarding, Diving, Yoga, Sailing
  - 🏖️ **Beaches**: Muizenberg, Bloubergstrand, Strand, Clifton, Kalk Bay, Milnerton, Hidden Gems
  - 🍔 **Food & Hangouts**: Cafés & Takeaways, Bars & Sundowners, Chill Spots
  - ⚠️ **Safety & Awareness**: General Safety, Local Alerts, Boating Safety, Parking, Emergencies
  - 🐋 **Wildlife**: Marine Life, Birds & Coastal Animals, Conservation, Sightings
  - 📅 **Events**: Competitions, Beach Cleanups, Social Gatherings, Workshops
- Create, edit, and delete posts with rich content
- Threaded comments with nested replies
- Like posts and comments
- Post pinning and comment moderation (admin only)
- View counts and engagement tracking
- User post history and profile pages
- Beach-specific tags for location-based discussions
- Smart breadcrumb navigation
- Real-time updates with React Query
- Content moderation with profanity filtering
- HTML sanitization for security

### 🎨 Modern UI/UX

- Ocean-themed dark gradient design (#0a0f1e → #1a2332 → #0f172a)
- Glassmorphism effects with backdrop blur
- Fully responsive layout (mobile-first design)
- Touch-optimized interactions for mobile devices
- Smooth animations and transitions
- Emoji fallback system for consistent cross-platform rendering
- Accessible navigation with mobile burger menu
- Natural scrolling with soft gradient indicators
- Loading skeletons and error states

### 👥 Social Features

- Friends system (add, remove, accept/reject requests)
- Friend request notifications
- View friends' profiles and activity
- User avatars with customizable colors
- Admin badges visible on posts and comments

### 🛠️ Admin Tools

- Pin/unpin posts to forum homepage
- Enable/disable comments on posts
- Edit any post or comment
- Delete inappropriate content
- Move posts between categories/subcategories
- User role management

## 🛠️ Tech Stack

### Frontend

- **React 19** — Modern UI library with concurrent features
- **React Router v7** — Client-side routing with loaders
- **TanStack Query v5** — Server state management and caching
- **Vite 7** — Next-generation build tool
- **Mantine UI v8** — Comprehensive component library
- **Axios** — Promise-based HTTP client
- **CSS3** — Custom styling with CSS Modules

### Backend

- **Node.js 18+** — JavaScript runtime
- **Express 5** — Fast, minimalist web framework
- **MongoDB** — NoSQL database
- **Mongoose 8** — Elegant MongoDB ODM
- **JWT** — Stateless authentication tokens
- **bcrypt** — Password hashing
- **bad-words** — Profanity filter
- **sanitize-html** — HTML sanitization
- **cookie-parser** — Cookie parsing middleware

### External APIs

- **Open-Meteo Marine API** — Real-time marine weather data (free, no API key required)
- **Stormglass.io API** — Tide predictions (10 requests/day free tier)

## 📦 Project Structure

```
tidyapp/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx              # Main navigation
│   │   │   ├── BeachCarousel.jsx       # Beach selector carousel
│   │   │   ├── BeachSlider.jsx         # Conditions slider
│   │   │   ├── TideChart.jsx           # Interactive tide graph
│   │   │   ├── CommentForm.jsx         # Comment input
│   │   │   ├── CommentsList.jsx        # Comment display
│   │   │   ├── ForumCategories.jsx     # Category grid
│   │   │   ├── ForumRecentActivity.jsx # Recent posts
│   │   │   ├── FriendsManager.jsx      # Friends UI
│   │   │   └── ...
│   │   ├── pages/              # Route components
│   │   │   ├── HomePage.jsx            # Landing page
│   │   │   ├── DashboardPage.jsx       # User dashboard
│   │   │   ├── BeachPage.jsx           # Beach details
│   │   │   ├── ForumHomePage.jsx       # Forum landing
│   │   │   ├── CategoryPage.jsx        # Category view
│   │   │   ├── SubcategoryPage.jsx     # Subcategory view
│   │   │   ├── PostDetailPage.jsx      # Single post
│   │   │   ├── CreatePostPage.jsx      # New post form
│   │   │   ├── UserProfilePage.jsx     # User profile
│   │   │   └── ...
│   │   ├── context/            # React Context providers
│   │   │   ├── UserContext.jsx         # Auth state
│   │   │   └── UIContext.jsx           # UI state (drawer, theme)
│   │   ├── services/           # API service layer
│   │   │   ├── authService.js          # Auth API calls
│   │   │   ├── forumService.js         # Posts API
│   │   │   ├── commentService.js       # Comments API
│   │   │   ├── tideService.js          # Tide data
│   │   │   ├── openMeteoService.js     # Weather data
│   │   │   └── friendService.js        # Friends API
│   │   ├── mutations/          # React Query mutations
│   │   │   ├── postMutations.js        # Post CRUD
│   │   │   └── commentMutations.js     # Comment CRUD
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useTideData.js          # Tide data fetching
│   │   ├── config/             # Configuration files
│   │   │   ├── forumCategories.js      # Forum structure
│   │   │   ├── beachTags.js            # Beach tagging
│   │   │   ├── beaches.js              # Beach data
│   │   │   └── api.js                  # API config
│   │   ├── data/               # Static data
│   │   │   └── beachInfo.js            # Beach details
│   │   └── utils/              # Helper functions
│   │       ├── forumHelpers.js         # Forum utilities
│   │       └── ...
│   └── package.json
│
├── backend/                     # Express API server
│   ├── src/
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js                 # User model
│   │   │   ├── Post.js                 # Forum post model
│   │   │   └── Comment.js              # Comment model
│   │   ├── routes/             # API route definitions
│   │   │   ├── auth.js                 # Auth routes
│   │   │   ├── posts.js                # Post routes
│   │   │   ├── comments.js             # Comment routes
│   │   │   ├── friends.js              # Friend routes
│   │   │   ├── admin.js                # Admin routes
│   │   │   ├── tides.js                # Tide data routes
│   │   │   └── seaLevel.js             # Sea level routes
│   │   ├── controllers/        # Route handlers
│   │   │   ├── posts/                  # Post controllers
│   │   │   ├── comments/               # Comment controllers
│   │   │   ├── friends/                # Friend controllers
│   │   │   └── admin/                  # Admin controllers
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.js                 # JWT verification
│   │   │   └── admin.js                # Admin guard
│   │   ├── scripts/            # Utility scripts
│   │   │   ├── fetchTideData.js        # Tide data fetcher
│   │   │   └── fetchSeaLevelData.js    # Sea level fetcher
│   │   ├── config/             # Backend configuration
│   │   │   └── forumCategories.js      # Category validation
│   │   └── server.js           # Express app entry point
│   ├── data/
│   │   ├── db/                 # MongoDB data directory
│   │   ├── tideData.json       # Cached tide predictions
│   │   └── seaLevelData.json   # Cached sea level data
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   └── package.json
│
├── docs/                        # Documentation
│   ├── FORUM_API.md            # Forum API reference
│   ├── TIDE_DATA_STORAGE.md    # Tide data docs
│   └── ...
│
└── package.json                 # Root package.json with scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** installed locally (or MongoDB Atlas)
- **Stormglass.io API Key** (free tier: 10 requests/day)

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

   Create `backend/.env` (copy from `.env.example`):

   ```env
   # MongoDB connection
   MONGO_URI=mongodb://127.0.0.1:27017/tidyapp

   # JWT secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-here

   # API Keys
   STORMGLASS_API_KEY=your-stormglass-api-key(not required to run project)

   # Server port
   PORT=5000
   ```

4. **Fetch initial tide data** (optional stormglass fetch)
   ```bash
   cd backend
   node src/scripts/fetchTideData.js
   ```
   This fetches 7 days of tide predictions for all beaches.

### Running the App

#### Development Mode (All Services)

Run MongoDB, backend, and frontend concurrently (from project root):

```bash
npm start
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://127.0.0.1:27017

#### Individual Services

```bash
# Frontend only (from root)
cd frontend && npm run dev

# Backend only (from root)
cd backend && npm run dev

# MongoDB only (from root)
npm run mongo
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout and clear cookie
- `GET /api/auth/me` - Get current user info

### Posts

- `GET /api/posts` - Get all posts (with filtering, pagination, sorting)
- `GET /api/posts/:id` - Get single post (increments view count)
- `POST /api/posts` - Create new post (auth required)
- `PUT /api/posts/:id` - Update post (auth required, author only)
- `DELETE /api/posts/:id` - Delete post (auth required, author only)
- `POST /api/posts/:id/like` - Toggle like on post (auth required)
- `GET /api/posts/categories` - Get category statistics

### Comments

- `GET /api/comments/post/:postId` - Get all comments for a post
- `POST /api/comments` - Create comment or reply (auth required)
- `PUT /api/comments/:id` - Update comment (auth required, author only)
- `DELETE /api/comments/:id` - Delete comment (auth required, author only)
- `POST /api/comments/:id/like` - Toggle like on comment (auth required)

### Friends

- `GET /api/friends` - Get user's friends list
- `GET /api/friends/requests` - Get pending friend requests
- `POST /api/friends/request/:userId` - Send friend request
- `POST /api/friends/accept/:requestId` - Accept friend request
- `POST /api/friends/reject/:requestId` - Reject friend request
- `DELETE /api/friends/:friendId` - Remove friend

### Admin (Admin role required)

- `PATCH /api/posts/:id/pin` - Toggle pin status on post
- `PATCH /api/posts/:id/comments` - Enable/disable comments on post
- `PATCH /api/admin/posts/:id` - Edit any post
- `DELETE /api/admin/posts/:id` - Delete any post
- `PATCH /api/admin/comments/:id` - Edit any comment
- `DELETE /api/admin/comments/:id` - Delete any comment

### Tides

- `GET /api/tides` - Get tide data for all beaches
- `GET /api/tides/:beachName` - Get tide data for specific beach

### Sea Level

- `GET /api/sea-level/:beachName` - Get sea level data for specific beach

See [docs/FORUM_API.md](docs/FORUM_API.md) for complete API documentation.

## 🗄️ Database Models

### User

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  displayName: String,
  avatarColor: String (hex color),
  isAdmin: Boolean (default: false),
  showAdminBadge: Boolean (default: true),
  friends: [ObjectId],
  friendRequests: [{
    from: ObjectId,
    status: 'pending' | 'accepted' | 'rejected',
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Post

```javascript
{
  title: String (max 100 chars, required),
  content: String (required),
  category: String (required, enum),
  subcategory: String (required),
  tags: [String] (beach tags),
  author: ObjectId (ref: User, required),
  views: Number (default: 0),
  likes: [ObjectId] (refs: User),
  isPinned: Boolean (default: false),
  commentsDisabled: Boolean (default: false),
  isLocked: Boolean (default: false),
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Valid Categories:**

- `general` - General discussions
- `beaches` - Beach-specific discussions
- `food-hangouts` - Food and hangout spots
- `safety` - Safety and awareness
- `wildlife` - Marine life and conservation
- `events` - Beach events and activities

### Comment

```javascript
{
  content: String (required),
  post: ObjectId (ref: Post, required),
  author: ObjectId (ref: User, required),
  parentComment: ObjectId (ref: Comment, optional),
  likes: [ObjectId] (refs: User),
  isEdited: Boolean (default: false),
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Data Fetching Scripts

### Tide Data (Stormglass.io)

Fetch tide extremes (high/low) for the next 7 days:

```bash
cd backend
node src/scripts/fetchTideData.js
```

**Important:**

- Requires `STORMGLASS_API_KEY` in `.env`
- Free tier: 10 requests/day
- 6 beaches = 6 API calls per run
- Data saved to `backend/data/tideData.json`
- **Recommended schedule**: Run on odd dates (1st, 3rd, 5th, etc.) at 6am

**Cron Example:**

```bash
# Run at 6am on odd-numbered days
0 6 1-31/2 * * cd /path/to/tidyapp/backend && node src/scripts/fetchTideData.js
```

### Sea Level Data (Open-Meteo)

Fetch hourly sea level predictions:

```bash
cd backend
node src/scripts/fetchSeaLevelData.js
```

**Important:**

- Free API
- Data saved to `backend/data/seaLevelData.json`
- **Recommended schedule**: Run on even dates (2nd, 4th, 6th, etc.) at 6am

**Cron Example:**

```bash
# Run at 6am on even-numbered days
0 6 2-30/2 * * cd /path/to/tidyapp/backend && node src/scripts/fetchSeaLevelData.js
```

### Frontend (Vite)

Build optimized production bundle:

```bash
cd frontend
npm run build
```

Deploy `dist/` folder to:

- **Vercel** (recommended for Vite apps)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

Set environment variable:

```
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend (Express + MongoDB)

Required environment variables:

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
STORMGLASS_API_KEY=...
PORT=5000
NODE_ENV=production
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Dante Q**

- GitHub: [@Dante-Q](https://github.com/Dante-Q)

## 🙏 Acknowledgments

- **Open-Meteo** - Free marine weather API
- **Stormglass.io** - Tide prediction data
- **Mantine UI** - Component library
- **TanStack Query** - Data synchronization

## 📚 Additional Documentation

- [Backend README](backend/README.md) - Backend architecture and API details
- [Frontend README](frontend/README.md) - Frontend architecture and components
- [Forum API Documentation](docs/FORUM_API.md) - Complete API reference
- [Tide Data Storage](docs/TIDE_DATA_STORAGE.md) - Tide data system documentation

---

**Made with 🌊 for the Cape Town beach community**
