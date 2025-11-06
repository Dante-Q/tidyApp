# Backend API Response Format Documentation

## Overview

All backend controllers have been refactored to return a **standardized JSON response format** with consistent structure across Posts, Comments, and Friends endpoints.

---

## Standard Response Format

### Success Responses

```javascript
{
  success: true,
  // ... specific data fields based on endpoint
}
```

### Error Responses

```javascript
{
  success: false,
  message: "Error description",
  error: "Detailed error message" // Only in 500 errors
}
```

---

## Posts API (`/api/posts`)

### GET `/api/posts` - Get all posts with pagination

**Response:**

```javascript
{
  success: true,
  posts: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    pages: 8
  }
}
```

### GET `/api/posts/:id` - Get single post

**Response:**

```javascript
{
  success: true,
  post: {
    _id: "...",
    title: "...",
    content: "...",
    author: { _id: "...", name: "..." },
    category: "...",
    subcategory: "...",
    tags: [...],
    likes: [...],
    views: 123,
    createdAt: "...",
    updatedAt: "...",
    editedAt: "..." // if edited
  }
}
```

### POST `/api/posts` - Create new post

**Response:**

```javascript
{
  success: true,
  post: { /* same structure as GET single post */ }
}
```

### PUT `/api/posts/:id` - Update post

**Response:**

```javascript
{
  success: true,
  post: { /* updated post object */ }
}
```

### DELETE `/api/posts/:id` - Delete post

**Response:**

```javascript
{
  success: true,
  message: "Post and associated comments deleted successfully"
}
```

### POST `/api/posts/:id/like` - Toggle like on post

**Response:**

```javascript
{
  success: true,
  likes: 42,        // Total number of likes
  isLiked: true     // Whether current user liked it
}
```

### GET `/api/posts/categories` - Get category statistics

**Response:**

```javascript
{
  success: true,
  stats: [
    {
      category: "surf-reports",
      totalPosts: 50,
      totalComments: 200,
      recentPosts: [...]
    },
    // ... more categories
  ]
}
```

---

## Comments API (`/api/comments`)

### GET `/api/comments/post/:postId` - Get comments for a post

**Response:**

```javascript
{
  comments: [
    {
      _id: "...",
      content: "...",
      author: { _id: "...", name: "..." },
      post: "...",
      parentComment: null,
      likes: [...],
      createdAt: "...",
      isEdited: false,
      editedAt: null,
      replies: [
        {
          _id: "...",
          content: "...",
          author: { _id: "...", name: "..." },
          parentComment: "...",
          likes: [...],
          createdAt: "...",
          replies: [] // Replies don't have nested replies
        }
      ]
    }
  ],
  pagination: {
    page: 1,
    limit: 50,
    total: 25,
    pages: 1
  }
}
```

**NOTE:** Comments endpoint returns bare object (no `success: true` wrapper) for backward compatibility.

### POST `/api/comments` - Create new comment/reply

**Response:**

```javascript
{
  success: true,
  comment: {
    _id: "...",
    content: "...",
    author: { _id: "...", name: "..." },
    post: "...",
    parentComment: null, // or parent ID if reply
    likes: [],
    createdAt: "..."
  }
}
```

### PUT `/api/comments/:id` - Update comment

**Response:**

```javascript
{
  success: true,
  comment: { /* updated comment */ }
}
```

### DELETE `/api/comments/:id` - Delete comment

**Response:**

```javascript
{
  success: true,
  message: "Comment and all replies deleted successfully"
}
```

### POST `/api/comments/:id/like` - Toggle like on comment

**Response:**

```javascript
{
  success: true,
  likes: 15,
  isLiked: false
}
```

---

## Friends API (`/api/friends`)

### POST `/api/friends/request/:userId` - Send friend request

**Response:**

```javascript
{
  success: true,
  message: "Friend request sent successfully"
}
```

### POST `/api/friends/accept/:requestId` - Accept friend request

**Response:**

```javascript
{
  success: true,
  message: "Friend request accepted"
}
```

### POST `/api/friends/reject/:requestId` - Reject friend request

**Response:**

```javascript
{
  success: true,
  message: "Friend request rejected"
}
```

### GET `/api/friends/requests` - Get pending friend requests

**Response:**

```javascript
{
  success: true,
  requests: [
    {
      _id: "...",
      name: "...",
      createdAt: "..."
    }
  ]
}
```

### GET `/api/friends/status/:userId` - Get friendship status

**Response:**

```javascript
{
  success: true,
  status: "none" | "friends" | "pending_sent" | "pending_received" | "self"
}
```

### GET `/api/friends/:userId` - Get friends list

**Response:**

```javascript
{
  success: true,
  friends: [
    {
      _id: "...",
      name: "..."
    }
  ],
  user: {
    _id: "...",
    name: "..."
  }
}
```

### DELETE `/api/friends/:friendId` - Remove friend

**Response:**

```javascript
{
  success: true,
  message: "Friend removed successfully"
}
```

---

## Key Changes from Previous Implementation

### What Changed:

1. **Standardized `success` field**: All endpoints (except `getCommentsByPost` for backward compatibility) now include `success: true/false`
2. **Wrapped data**: Single resources wrapped in named keys (`post`, `comment`, `friend`)
3. **Consistent pagination**: All list endpoints return `pagination` object with `page`, `limit`, `total`, `pages`
4. **Consistent error format**: All errors return `{ success: false, message, error? }`
5. **Like responses**: Toggle endpoints return both `likes` count and `isLiked` boolean

### Frontend Impact:

- Frontend services must extract data from wrapper (e.g., `response.data.post` instead of `response.data`)
- Error handling simplified with consistent `success` flag
- Pagination info now available at `response.data.pagination`

---

## Validation & Security Features

### All endpoints include:

- ✅ **Input sanitization** (HTML removal via `sanitize-html`)
- ✅ **Profanity filtering** (via `bad-words`)
- ✅ **XSS prevention** (safe HTML tags only in content)
- ✅ **Authorization checks** (author or admin can modify)
- ✅ **Content length limits** (titles: 5-200, content: 10-10000, comments: max 2000)
- ✅ **Atomic operations** (likes use MongoDB `$pull`/`$addToSet`)
- ✅ **Query optimization** (`.lean()`, batched queries, aggregation pipelines)

---

## Migration Guide for Frontend

### Before (Old Format):

```javascript
const response = await axios.get("/api/posts/123");
const post = response.data; // Direct access
```

### After (New Format):

```javascript
const response = await axios.get("/api/posts/123");
const post = response.data.post; // Extract from wrapper
```

### Service Layer Pattern:

```javascript
// Option 1: Return wrapper (recommended)
export const getPostById = async (postId) => {
  const response = await axios.get(`/api/posts/${postId}`);
  return response.data; // { success: true, post: {...} }
};

// Usage in component:
const data = await getPostById(id);
const post = data.post;

// Option 2: Unwrap in service
export const getPostById = async (postId) => {
  const response = await axios.get(`/api/posts/${postId}`);
  return response.data.post; // Just the post
};

// Usage in component:
const post = await getPostById(id);
```

**Recommended**: Use Option 1 (return wrapper) for consistency and to preserve `success` flag for error handling.
