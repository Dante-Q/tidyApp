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

## Fetch Tide Data (Extremes)

Fetch tide extremes (high/low) from Stormglass API for all beaches:

```bash
cd backend
node src/scripts/fetchTideData.js
```

**Important:**

- Requires `STORMGLASS_API_KEY` in `backend/.env` file
- Free tier: 10 requests/day (6 beaches = 6 requests per run)
- Fetches 7 days of tide predictions (high/low times)
- Data saved to `backend/data/tideData.json`
- Recommended: Run on **ODD DAYS** (alternating with sea level)

**Automation with Cron:**

```bash
# Run at 6am on odd days (Mon, Wed, Fri, Sun)
0 6 * * 1,3,5,0 cd /path/to/tidyapp/backend && node src/scripts/fetchTideData.js
```

## Fetch Sea Level Data (Hourly)

Fetch hourly sea level data from Stormglass API for all beaches:

```bash
cd backend
node src/scripts/fetchSeaLevelData.js
```

**Important:**

- Requires `STORMGLASS_API_KEY` in `backend/.env` file
- Free tier: 10 requests/day (6 beaches = 6 requests per run)
- Fetches 7 days of hourly predictions (24 data points per day)
- Data saved to `backend/data/seaLevelData.json`
- Recommended: Run on **EVEN DAYS** (alternating with tide extremes)

**Automation with Cron:**

```bash
# Run at 6am on even days (Tue, Thu, Sat)
0 6 * * 2,4,6 cd /path/to/tidyapp/backend && node src/scripts/fetchSeaLevelData.js
```

**Alternating Strategy:**
By running tide extremes on odd days and sea level on even days, you stay within the 10 requests/day limit while keeping both datasets fresh!

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
