# 🌊 TidyApp Backend

Express.js REST API server for TidyApp, providing authentication, forum functionality, tide data, and beach information for Cape Town beaches.

## 🏗️ Architecture

### Tech Stack

- **Node.js 18+** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB + Mongoose 8** - Database and ODM
- **JWT** - Stateless authentication
- **bcrypt** - Password hashing
- **cookie-parser** - HTTP cookie parsing
- **bad-words** - Profanity filtering
- **sanitize-html** - XSS protection
- **axios** - HTTP client for external APIs

### External APIs

- **Stormglass.io** - Tide predictions (10 requests/day free)
- **Open-Meteo Marine** - Real-time weather and sea level data (free)

## 📂 Project Structure

```
backend/
├── src/
│   ├── server.js              # Express app entry point
│   ├── models/                # Mongoose schemas
│   │   ├── User.js           # User model with auth
│   │   ├── Post.js           # Forum post model
│   │   └── Comment.js        # Comment model with replies
│   ├── routes/               # API route definitions
│   │   ├── auth.js           # Authentication routes
│   │   ├── posts.js          # Post CRUD routes
│   │   ├── comments.js       # Comment CRUD routes
│   │   ├── friends.js        # Friend system routes
│   │   ├── admin.js          # Admin moderation routes
│   │   ├── tides.js          # Tide data routes
│   │   └── seaLevel.js       # Sea level data routes
│   ├── controllers/          # Business logic handlers
│   │   ├── posts/
│   │   │   ├── getPosts.js           # List posts with filtering
│   │   │   ├── getPostById.js        # Single post with views
│   │   │   ├── createPost.js         # Create with validation
│   │   │   ├── updatePost.js         # Update (author only)
│   │   │   ├── deletePost.js         # Delete with cascades
│   │   │   ├── toggleLikePost.js     # Like/unlike
│   │   │   ├── getPostsByCategory.js # Category stats
│   │   │   ├── togglePin.js          # Pin posts (admin)
│   │   │   └── toggleComments.js     # Disable comments (admin)
│   │   ├── comments/
│   │   │   ├── getCommentsByPost.js  # Nested comments
│   │   │   ├── createComment.js      # Comment/reply creation
│   │   │   ├── updateComment.js      # Edit (author only)
│   │   │   ├── deleteComment.js      # Delete with replies
│   │   │   └── toggleLikeComment.js  # Like/unlike
│   │   ├── friends/
│   │   │   ├── list.js               # Get friends
│   │   │   ├── sendRequest.js        # Send friend request
│   │   │   ├── acceptRequest.js      # Accept request
│   │   │   ├── rejectRequest.js      # Reject request
│   │   │   └── removeFriend.js       # Remove friend
│   │   ├── admin/
│   │   │   ├── posts.js              # Edit/delete any post
│   │   │   └── comments.js           # Edit/delete any comment
│   │   └── utils/
│   │       └── postHelpers.js        # Shared utilities
│   ├── middleware/
│   │   ├── auth.js           # JWT verification & user loading
│   │   └── admin.js          # Admin role guard
│   ├── scripts/              # Data fetching scripts
│   │   ├── fetchTideData.js          # Stormglass tide fetcher
│   │   └── fetchSeaLevelData.js      # Open-Meteo sea level fetcher
│   ├── config/
│   │   └── forumCategories.js        # Category validation
│   └── services/             # External service integrations (if any)
├── data/
│   ├── db/                   # MongoDB data directory
│   ├── tideData.json         # Cached tide predictions
│   └── seaLevelData.json     # Cached sea level data
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment template
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Stormglass.io API key (free tier)

### Installation

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:

   ```env
   # MongoDB Connection
   MONGO_URI=mongodb://127.0.0.1:27017/tidyapp
   # Or use MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tidyapp

   # JWT Secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # API Keys
   STORMGLASS_API_KEY=your-stormglass-api-key-here

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally)

   ```bash
   # From project root
   mongod --dbpath backend/data/db --bind_ip 127.0.0.1

   # Or use the npm script from root
   npm run mongo
   ```

5. **Fetch initial tide data** (optional but recommended)

   ```bash
   node src/scripts/fetchTideData.js
   ```

6. **Start the server**

   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

Server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Description                  | Auth Required |
| ------ | ----------- | ---------------------------- | ------------- |
| POST   | `/register` | Create new user account      | No            |
| POST   | `/login`    | Login and receive JWT cookie | No            |
| POST   | `/logout`   | Logout and clear cookie      | No            |
| GET    | `/me`       | Get current user info        | Yes           |

### Posts (`/api/posts`)

| Method | Endpoint        | Description                          | Auth Required |
| ------ | --------------- | ------------------------------------ | ------------- |
| GET    | `/`             | List posts with filtering/pagination | No            |
| GET    | `/:id`          | Get single post (increments views)   | No            |
| POST   | `/`             | Create new post                      | Yes           |
| PUT    | `/:id`          | Update post (author only)            | Yes           |
| DELETE | `/:id`          | Delete post and comments             | Yes (author)  |
| POST   | `/:id/like`     | Toggle like on post                  | Yes           |
| GET    | `/categories`   | Get category statistics              | No            |
| PATCH  | `/:id/pin`      | Toggle pin status                    | Yes (admin)   |
| PATCH  | `/:id/comments` | Enable/disable comments              | Yes (admin)   |

**Query Parameters for GET /:**

- `category` - Filter by category slug
- `subcategory` - Filter by subcategory slug
- `author` - Filter by author ID
- `tags` - Filter by beach tags (comma-separated)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field and order (default: -createdAt)

### Comments (`/api/comments`)

| Method | Endpoint        | Description                  | Auth Required |
| ------ | --------------- | ---------------------------- | ------------- |
| GET    | `/post/:postId` | Get all comments for a post  | No            |
| POST   | `/`             | Create comment or reply      | Yes           |
| PUT    | `/:id`          | Update comment (author only) | Yes           |
| DELETE | `/:id`          | Delete comment and replies   | Yes (author)  |
| POST   | `/:id/like`     | Toggle like on comment       | Yes           |

### Friends (`/api/friends`)

| Method | Endpoint             | Description                 | Auth Required |
| ------ | -------------------- | --------------------------- | ------------- |
| GET    | `/`                  | Get user's friends list     | Yes           |
| GET    | `/requests`          | Get pending friend requests | Yes           |
| POST   | `/request/:userId`   | Send friend request         | Yes           |
| POST   | `/accept/:requestId` | Accept friend request       | Yes           |
| POST   | `/reject/:requestId` | Reject friend request       | Yes           |
| DELETE | `/:friendId`         | Remove friend               | Yes           |

### Admin (`/api/admin`)

| Method | Endpoint          | Description                     | Auth Required |
| ------ | ----------------- | ------------------------------- | ------------- |
| PATCH  | `/posts/:id`      | Edit any post                   | Yes (admin)   |
| DELETE | `/posts/:id`      | Delete any post                 | Yes (admin)   |
| PATCH  | `/posts/:id/move` | Move post to different category | Yes (admin)   |
| PATCH  | `/comments/:id`   | Edit any comment                | Yes (admin)   |
| DELETE | `/comments/:id`   | Delete any comment              | Yes (admin)   |

### Tides (`/api/tides`)

| Method | Endpoint      | Description                      | Auth Required |
| ------ | ------------- | -------------------------------- | ------------- |
| GET    | `/`           | Get tide data for all beaches    | No            |
| GET    | `/:beachName` | Get tide data for specific beach | No            |

### Sea Level (`/api/sea-level`)

| Method | Endpoint      | Description                  | Auth Required |
| ------ | ------------- | ---------------------------- | ------------- |
| GET    | `/:beachName` | Get sea level data for beach | No            |

## 🗄️ Database Models

### User Model

```javascript
{
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    // Hashed with bcrypt (10 rounds)
  },
  displayName: {
    type: String,
    default: function() { return this.name; }
  },
  avatarColor: {
    type: String,
    default: "#6dd5ed", // Ocean blue
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  showAdminBadge: {
    type: Boolean,
    default: true,
  },
  friends: [{
    type: ObjectId,
    ref: "User",
  }],
  friendRequests: [{
    from: {
      type: ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: Date,
  updatedAt: Date,
}
```

### Post Model

```javascript
{
  title: {
    type: String,
    required: true,
    maxLength: 100,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["general", "beaches", "food-hangouts", "safety", "wildlife", "events"],
  },
  subcategory: {
    type: String,
    required: true,
    // Validated against category's allowed subcategories
  },
  tags: [{
    type: String,
    // Beach tags: muizenberg, bloubergstrand, strand, clifton, kalk-bay, milnerton
  }],
  author: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: ObjectId,
    ref: "User",
  }],
  isPinned: {
    type: Boolean,
    default: false,
  },
  commentsDisabled: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
    default: null,
  },
  createdAt: Date,
  updatedAt: Date,
}

// Virtual: commentCount
```

### Comment Model

```javascript
{
  content: {
    type: String,
    required: true,
  },
  post: {
    type: ObjectId,
    ref: "Post",
    required: true,
  },
  author: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  parentComment: {
    type: ObjectId,
    ref: "Comment",
    default: null,
  },
  likes: [{
    type: ObjectId,
    ref: "User",
  }],
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
    default: null,
  },
  createdAt: Date,
  updatedAt: Date,
}

// Virtual: replies
```

## 🔐 Authentication & Authorization

### JWT Authentication

- JWT tokens issued on successful login
- Stored in **HttpOnly cookies** (secure, not accessible via JavaScript)
- Token expires after 7 days
- Middleware verifies token and attaches user to `req.user`

### Middleware

**`protect` middleware (`middleware/auth.js`):**

- Verifies JWT token from cookie or Authorization header
- Loads user data and attaches to `req.user`
- Returns 401 if token invalid/missing

**`requireAdmin` middleware (`middleware/admin.js`):**

- Checks if `req.user.isAdmin === true`
- Returns 403 if user is not admin
- Must be used after `protect` middleware

### Usage Example

```javascript
// Protected route (auth required)
router.post("/posts", protect, createPost);

// Admin-only route
router.patch("/posts/:id/pin", protect, requireAdmin, togglePinPost);
```

## 🛡️ Security Features

### Content Sanitization

- **HTML Sanitization**: `sanitize-html` removes dangerous HTML/scripts
- **Profanity Filter**: `bad-words` filters inappropriate content
- **XSS Protection**: Content cleaned before database storage

### CORS Configuration

```javascript
const corsOptions = {
  origin: (origin, callback) => {
    // Allow localhost (any port)
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }

    // Allow ngrok domains
    if (
      /^https:\/\/[\w-]+\.ngrok-free\.(app|dev)$/.test(origin) ||
      /^https:\/\/[\w-]+\.ngrok\.io$/.test(origin)
    ) {
      return callback(null, true);
    }

    // Allow localtunnel
    if (/^https:\/\/[\w-]+\.loca\.lt$/.test(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // Allow cookies
};
```

### Password Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- Never stored or transmitted in plain text
- Password field excluded from query results by default

## 📊 Data Fetching Scripts

### Tide Data (Stormglass.io)

Fetches tide extremes (high/low) for the next 7 days.

```bash
node src/scripts/fetchTideData.js
```

**Features:**

- Fetches data for all 6 beaches in parallel
- Saves to `data/tideData.json`
- Includes metadata (last updated, API provider, fetch status)
- Handles partial failures (continues if some beaches fail)
- API rate limit warning

**Requirements:**

- `STORMGLASS_API_KEY` in `.env`
- Free tier: 10 requests/day (6 beaches = 6 requests)

**Recommended Schedule:**
Run on **odd dates** (1st, 3rd, 5th, etc.) at 6am:

```bash
# Cron example
0 6 1-31/2 * * cd /path/to/backend && node src/scripts/fetchTideData.js
```

**Output Format:**

```json
{
  "beaches": {
    "muizenberg": {
      "beach": "muizenberg",
      "name": "Muizenberg",
      "coordinates": { "lat": -34.118, "lng": 18.4699 },
      "extremes": [
        {
          "height": 1.23,
          "time": "2025-11-06T04:15:00Z",
          "type": "high"
        }
        // ...
      ],
      "lastUpdated": "2025-11-06T06:00:00.000Z"
    }
    // ... other beaches
  },
  "metadata": {
    "lastUpdated": "2025-11-06T06:00:00.000Z",
    "totalBeaches": 6,
    "apiProvider": "Stormglass.io",
    "fetchStatus": "complete"
  }
}
```

### Sea Level Data (Open-Meteo)

Fetches hourly sea level predictions.

```bash
node src/scripts/fetchSeaLevelData.js
```

**Features:**

- Free API, no key required
- Saves to `data/seaLevelData.json`
- Hourly predictions

**Recommended Schedule:**
Run on **even dates** (2nd, 4th, 6th, etc.) at 6am:

```bash
# Cron example
0 6 2-30/2 * * cd /path/to/backend && node src/scripts/fetchSeaLevelData.js
```

## 🚀 Deployment

### Environment Variables

```env
# Production MongoDB (MongoDB Atlas recommended)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tidyapp?retryWrites=true&w=majority

# Strong JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-production-jwt-secret-here

# API Keys
STORMGLASS_API_KEY=your-api-key

# Server Config
PORT=5000
NODE_ENV=production
```

### Deployment Platforms

**Recommended: Railway**

- Supports Node.js and MongoDB
- Easy deployment from GitHub
- Automatic HTTPS
- Cron jobs for data fetching scripts

**Other Options:**

- **Render** - Free tier with MongoDB
- **Heroku** - Requires MongoDB Atlas
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**
- **Azure App Service**
- **Google Cloud Run**

### MongoDB Hosting

**Free Options:**

- **MongoDB Atlas** (512MB free tier)
- **Railway** (built-in MongoDB)

### Build Command

```bash
npm install
```

### Start Command

```bash
npm start
```

### Health Check Endpoint

```
GET /
Response: "tidyApp API Running!"
```

## 🧪 Testing

### Manual API Testing

Use **Postman**, **Insomnia**, or **curl** to test endpoints.

**Example: Register a user**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Example: Create a post**

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -d '{
    "title": "Great surf at Muizenberg today!",
    "content": "The waves were perfect this morning...",
    "category": "beaches",
    "subcategory": "muizenberg",
    "tags": ["muizenberg"]
  }'
```

## 📝 Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Optional detailed error info"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:** Start MongoDB:

```bash
mongod --dbpath backend/data/db --bind_ip 127.0.0.1
```

### JWT Secret Missing

**Error:** `Missing required environment variable(s): JWT_SECRET`

**Solution:** Add `JWT_SECRET` to `.env` file

### CORS Errors

**Error:** `Not allowed by CORS`

**Solution:** Update CORS configuration in `server.js` to allow your frontend origin

### API Rate Limit (Stormglass)

**Error:** Tide data fetch fails with 429 status

**Solution:** Wait until rate limit resets (daily limit: 10 requests)

## 📚 Additional Resources

- [Forum API Documentation](../docs/FORUM_API.md)
- [Tide Data Storage Documentation](../docs/TIDE_DATA_STORAGE.md)
- [Main Project README](../README.md)
- [Frontend README](../frontend/README.md)

## 🤝 Contributing

When contributing to the backend:

1. Follow existing code structure and patterns
2. Add error handling to all routes
3. Validate user input
4. Document new endpoints in API docs
5. Test authentication and authorization
6. Keep controllers focused and single-purpose

---

**Built with Express.js and MongoDB for the TidyApp beach community platform**
