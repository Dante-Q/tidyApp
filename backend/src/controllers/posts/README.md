## Structure

```
posts/
├── getPosts.js           - List posts with pagination and filtering
├── getPostById.js        - Get single post by ID (with view increment)
├── createPost.js         - Create new post
├── updatePost.js         - Update existing post
├── deletePost.js         - Delete post and associated comments
├── toggleLikePost.js     - Like/unlike post
├── getPostsByCategory.js - Get posts by category with stats
└── index.js             - Export all controllers
```

## Helper Functions

Located in `controllers/utils/postHelpers.js`:

- **handleControllerError(res, message, error)** - Consistent error handling
- **canModifyPost(post, user)** - Authorization check (author or admin)
- **assignFields(target, source, fields)** - DRY field assignment
- **validatePostTitle(title)** - Validate and sanitize title (5-200 chars, no HTML, profanity filter)
- **validatePostContent(content)** - Validate and sanitize content (10-10000 chars, safe HTML, profanity filter)

## Validation Rules

### Title

- Required, trimmed
- 5-200 characters
- No HTML tags allowed
- Profanity filtered

### Content

- Required, trimmed
- 10-10000 characters
- Allowed HTML tags: `b`, `i`, `em`, `strong`, `u`, `p`, `br`, `ul`, `ol`, `li`, `blockquote`, `code`, `pre`, `a`, `h1-h6`
- Links auto-configured with `target="_blank"` and `rel="noopener noreferrer"`
- Profanity filtered

### Category & Subcategory

- Must be valid combination from `forumCategories.js`
- Subcategory is optional

## Dependencies

- `sanitize-html` - HTML sanitization
- `bad-words` - Profanity filtering
- `mongoose` - Database operations
