# Forum Quick Start Guide

## Running the Full-Stack Forum

### 1. Start the Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

### 2. Start the Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

### 3. Test the Forum

1. **Register a user**: http://localhost:5173/register
2. **Visit forum**: http://localhost:5173/forum
3. **Create a post**: Click "Create New Post" button
4. **View your post**: Automatically redirected after creation
5. **Add comments**: Scroll down and use comment form
6. **Check profile**: Click your name to see your posts

## API Endpoints Being Used

### Posts

- `GET /api/posts` - List all posts (with pagination/filters)
- `GET /api/posts/categories` - Get category stats
- `GET /api/posts/:id` - Get single post (increments view count)
- `POST /api/posts` - Create new post (requires auth)
- `PUT /api/posts/:id` - Update post (requires auth, author only)
- `DELETE /api/posts/:id` - Delete post (requires auth, author only)
- `POST /api/posts/:id/like` - Toggle like (requires auth)

### Comments

- `GET /api/comments/post/:postId` - Get all comments for a post
- `POST /api/comments` - Create comment/reply (requires auth)
- `PUT /api/comments/:id` - Update comment (requires auth, author only)
- `DELETE /api/comments/:id` - Delete comment (requires auth, author only)
- `POST /api/comments/:id/like` - Toggle like (requires auth)

## Frontend Pages

- `/forum` - Forum home with categories and recent posts
- `/forum/create-post` - Create new post form
- `/forum/post/:postId` - View post with comments
- `/forum/edit/:postId` - Edit your post
- `/profile/:userId` - View user profile and posts

## File Structure

```
frontend/src/
├── services/
│   ├── forumService.js      # Post API calls
│   └── commentService.js    # Comment API calls
├── pages/
│   ├── ForumHomePage.jsx    # Forum landing page
│   ├── CreatePostPage.jsx   # Create post form
│   ├── PostDetailPage.jsx   # Single post view
│   ├── EditPostPage.jsx     # Edit post form
│   └── UserProfilePage.jsx  # User profile
└── App.jsx                  # Routes

backend/src/
├── models/
│   ├── Post.js              # Post schema
│   ├── Comment.js           # Comment schema
│   └── User.js              # User schema (existing)
├── controllers/
│   ├── postController.js    # Post logic
│   └── commentController.js # Comment logic
├── routes/
│   ├── posts.js             # Post routes
│   ├── comments.js          # Comment routes
│   └── auth.js              # Auth routes (existing)
└── middleware/
    └── auth.js              # JWT verification
```

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tidyapp
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Backend won't start

- Check MongoDB is running
- Verify .env file exists in backend/
- Check port 5000 is not in use

### Frontend won't connect to backend

- Verify backend is running
- Check VITE_API_URL in frontend/.env
- Check CORS settings in backend/src/server.js

### Authentication errors

- Clear localStorage and cookies
- Re-login with valid credentials
- Check JWT_SECRET is set in backend .env

### Posts not appearing

- Check MongoDB connection
- Verify posts collection has data
- Check browser console for errors

## Sample Data

To test with sample posts, you can create a few posts through the UI or use MongoDB Compass/mongosh to insert test data.

## Next Steps

1. ✅ Create test user accounts
2. ✅ Create posts in different categories
3. ✅ Add comments and replies
4. ✅ Test like functionality
5. ✅ Test edit/delete features
6. 🔜 Implement category filtering
7. 🔜 Add search functionality
8. 🔜 Add pagination

---

**Everything is connected and ready to use!** 🚀
