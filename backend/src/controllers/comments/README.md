## Structure

```
comments/
├── getCommentsByPost.js    # Fetch comments with pagination and nested replies
├── createComment.js        # Create new comments or replies
├── updateComment.js        # Update comment content
├── deleteComment.js        # Delete comment and all replies
├── toggleLikeComment.js    # Like/unlike comments
└── index.js                # Centralized exports
```

## Helper Utilities

Located in `controllers/utils/commentHelpers.js`:

- `handleControllerError()` - Consistent error response formatting
- `canModify()` - Authorization check (author or admin)
- `validateCommentContent()` - Content validation and XSS sanitization

## API Endpoints

| Method | Endpoint                     | Description              | Auth |
| ------ | ---------------------------- | ------------------------ | ---- |
| GET    | `/api/comments/post/:postId` | Get comments for a post  | No   |
| POST   | `/api/comments`              | Create comment/reply     | Yes  |
| PUT    | `/api/comments/:id`          | Update comment           | Yes  |
| DELETE | `/api/comments/:id`          | Delete comment + replies | Yes  |
| POST   | `/api/comments/:id/like`     | Toggle like              | Yes  |
