# Forum Moderation Scripts

## Delete a Specific Post

Delete a post by its ID (also deletes all associated comments):

```bash
cd backend
node src/scripts/deletePost.js <POST_ID>
```

Example:

```bash
node src/scripts/deletePost.js 67234abc123def456789
```

## Delete a User (Ban)

Delete a user by their ID (also deletes all their posts and comments):

```bash
cd backend
node src/scripts/deleteUser.js <USER_ID>
```

Example:

```bash
node src/scripts/deleteUser.js 67234abc123def456789
```

## Wipe All Forum Posts (MongoDB Console)

To delete ALL posts and comments from the database using MongoDB shell:

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/tidyapp

# Then run these commands:
db.posts.deleteMany({})
db.comments.deleteMany({})
```

Or as a one-liner:

```bash
mongosh mongodb://localhost:27017/tidyapp --eval "db.posts.deleteMany({}); db.comments.deleteMany({})"
```

## Notes

- **deletePost.js**: Removes a single post and its comments
- **deleteUser.js**: Removes a user and ALL their content (posts + comments)
- Both scripts show details before deletion
- All operations are permanent and cannot be undone
- Make sure your MongoDB is running before using these scripts
