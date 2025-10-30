# Forum API Documentation

## Overview

Complete backend API for the TidyApp forum system with posts, comments, likes, and category management.

## Authentication

Most endpoints require authentication via JWT token. Include the token in:

- **Authorization header**: `Bearer YOUR_TOKEN`
- **OR Cookie**: `token=YOUR_TOKEN`

---

## Posts API

### GET /api/posts

Get all posts with pagination and filtering

**Query Parameters:**

- `category` (optional): Filter by category (surf-reports, beach-safety, general-discussion, events-meetups)
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Posts per page
- `sort` (optional, default: -createdAt): Sort order

**Response:**

```json
{
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### GET /api/posts/categories

Get posts grouped by category with stats

**Response:**

```json
[
  {
    "category": "surf-reports",
    "totalPosts": 42,
    "totalComments": 128,
    "recentPosts": [...]
  }
]
```

### GET /api/posts/:id

Get single post by ID (increments view count)

### POST /api/posts

Create new post (requires auth)

**Body:**

```json
{
  "title": "Post title",
  "content": "Post content",
  "category": "surf-reports"
}
```

### PUT /api/posts/:id

Update post (requires auth, author only)

**Body:**

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "category": "surf-reports"
}
```

### DELETE /api/posts/:id

Delete post and all comments (requires auth, author only)

### POST /api/posts/:id/like

Toggle like on post (requires auth)

**Response:**

```json
{
  "likes": 5,
  "isLiked": true
}
```

---

## Comments API

### GET /api/comments/post/:postId

Get all comments for a post with replies

**Query Parameters:**

- `page` (optional, default: 1)
- `limit` (optional, default: 50)

**Response:**

```json
{
  "comments": [
    {
      "_id": "...",
      "content": "Comment text",
      "author": { "name": "User", "email": "user@example.com" },
      "replies": [...]
    }
  ],
  "pagination": {...}
}
```

### POST /api/comments

Create new comment or reply (requires auth)

**Body:**

```json
{
  "content": "Comment text",
  "postId": "POST_ID",
  "parentCommentId": "COMMENT_ID" // optional, for replies
}
```

### PUT /api/comments/:id

Update comment (requires auth, author only)

**Body:**

```json
{
  "content": "Updated comment text"
}
```

### DELETE /api/comments/:id

Delete comment and all replies (requires auth, author only)

### POST /api/comments/:id/like

Toggle like on comment (requires auth)

---

## Models

### Post

```javascript
{
  title: String (max 100 chars),
  content: String,
  category: Enum (surf-reports, beach-safety, general-discussion, events-meetups),
  author: ObjectId (ref: User),
  views: Number,
  likes: [ObjectId] (ref: User),
  isPinned: Boolean,
  isLocked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment

```javascript
{
  content: String,
  post: ObjectId (ref: Post),
  author: ObjectId (ref: User),
  parentComment: ObjectId (ref: Comment),
  likes: [ObjectId] (ref: User),
  isEdited: Boolean,
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Categories

- `surf-reports` - Surf Reports 🌊
- `beach-safety` - Beach Safety 🏖️
- `general-discussion` - General Discussion 🌅
- `events-meetups` - Events & Meetups 📅

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

Common status codes:

- 400: Bad Request (validation error)
- 401: Unauthorized (no token or invalid token)
- 403: Forbidden (not author of resource)
- 404: Not Found
- 500: Server Error
