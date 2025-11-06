# Tide Data Storage & Update Strategy

## Overview

This document explains how tide data is stored, updated, and protected from corruption or API limit issues.

## Storage Format

### File Location

```
backend/data/
├── tideData.json         # Primary data file (served to frontend)
└── tideData.backup.json  # Automatic backup (created before each update)
```

### Data Structure

```json
{
  "lastUpdated": "2025-11-03T06:00:00.000Z",
  "beaches": {
    "muizenberg": {
      "beach": "muizenberg",
      "name": "Muizenberg",
      "coordinates": { "lat": -34.1183, "lng": 18.4717 },
      "extremes": [
        { "height": 1.23, "time": "2025-11-03T04:30:00+00:00", "type": "low" },
        { "height": 1.89, "time": "2025-11-03T10:45:00+00:00", "type": "high" }
      ],
      "lastUpdated": "2025-11-03T06:00:00.000Z"
    }
  },
  "meta": {
    "totalBeaches": 6,
    "daysOfPredictions": 7,
    "apiProvider": "Stormglass.io",
    "fetchStatus": "complete", // "complete", "partial", or "failed"
    "failedBeaches": []
  }
}
```

## Update Strategy

### Complete Replacement (Not Append)

**Each fetch completely overwrites the file** - we do NOT append new data.

**Why?**

- Tide predictions are **absolute**, not cumulative (e.g., "high tide at 10:45am" doesn't change)
- Appending would create duplicate/conflicting predictions
- 7 days of data is sufficient (frontend only shows next 24 hours)
- Simpler to manage and reason about

### Atomic Write Process

```javascript
// 1. Load existing data (for fallback)
const existingData = loadExistingData();

// 2. Fetch new data for all beaches
const newData = await fetchAllBeaches();

// 3. Create backup of old file
fs.copyFileSync(TIDE_DATA_FILE, BACKUP_FILE);

// 4. Write to temp file first
fs.writeFileSync(TEMP_FILE, JSON.stringify(newData));

// 5. Atomic rename (all-or-nothing)
fs.renameSync(TEMP_FILE, TIDE_DATA_FILE);
```

This ensures:

- ✅ No partial writes (system crash mid-write)
- ✅ No corrupted JSON
- ✅ Always a valid backup exists

## API Quota Management

### Problem: 10 Requests/Day Limit

- Stormglass free tier: **10 requests per day**
- We have **6 beaches** = 6 requests per fetch
- Running twice/day = **12 requests** = ❌ OVER LIMIT

### Solution: Once-Daily Fetch

```bash
# Cron: Run once at 6am (uses 6 of 10 requests)
0 6 * * * cd /path/to/backend && node src/scripts/fetchTideData.js
```

**Benefits:**

- ✅ Stays within API limit (6 < 10)
- ✅ Gets 7 days of predictions per run
- ✅ Leaves 4 requests for manual testing
- ✅ No risk of partial data corruption

## Graceful Degradation

### What Happens When API Quota Exceeded?

**Scenario:** You accidentally run the script twice in one day.

**Result:**

1. First 3 beaches fetch successfully (3 requests used)
2. Beach 4 fails with **"API quota exceeded"** (HTTP 429)
3. Beaches 5-6 also fail

**Script Behavior:**

```javascript
// Beach 1-3: Fresh data ✅
results.beaches.muizenberg = { extremes: [...], lastUpdated: "2025-11-03T10:00:00Z" }

// Beach 4-6: Use cached data from previous fetch ♻️
results.beaches.clifton = {
  ...existingData.beaches.clifton,  // Old data from 6am fetch
  cachedData: true,
  cacheReason: "API quota exceeded"
}

// Meta tracks what happened
results.meta = {
  fetchStatus: "partial",
  failedBeaches: ["clifton", "kalkbay", "milnerton"]
}
```

**Exit Code:**

- `0` = Success (all beaches fetched)
- `1` = Partial success (some cached) or complete failure

This allows monitoring systems to detect issues.

## Data Freshness

### How Stale Can Data Get?

**Best case:** Data updated daily at 6am

- 6am fetch: Data is 0 hours old
- 6pm view: Data is 12 hours old (still valid - 7-day predictions)
- Next 6am: Fresh fetch

**Partial failure case:** Some beaches use cached data

- Failed beaches: Could be 24-48 hours old (still valid - 7-day window)
- Successful beaches: Fresh data

**Complete failure case:** All beaches fail

- All beaches use previous fetch data
- Could be 24+ hours old
- Frontend still works (slightly stale but accurate)

### Frontend Handling

The frontend service (`tideService.js`) doesn't care about data age:

- Reads from `/api/tides` endpoint
- Filters to show only **next 24 hours**
- Even 2-day-old data is useful if it predicts today's tides

## File Corruption Protection

### Backup Strategy

Before every update, the script creates a backup:

```javascript
fs.copyFileSync(TIDE_DATA_FILE, BACKUP_FILE);
```

**Recovery from corruption:**

```bash
# If tideData.json is corrupted
cd backend/data
cp tideData.backup.json tideData.json
```

### Atomic Writes Prevent Corruption

```javascript
// DON'T: Direct write (unsafe)
fs.writeFileSync(TIDE_DATA_FILE, json); // ❌ Could crash mid-write

// DO: Temp file + atomic rename (safe)
fs.writeFileSync(tempFile, json); // ✅ Write to temp
fs.renameSync(tempFile, TIDE_DATA_FILE); // ✅ Atomic replace
```

On most filesystems, `rename()` is atomic:

- Either succeeds completely or fails completely
- No partial writes
- No corrupted JSON

## Error Scenarios & Handling

### Scenario 1: API Key Invalid

```
❌ Error: Authentication failed (401). Check STORMGLASS_API_KEY in .env
```

**Result:**

- All beaches fail
- `fetchStatus: "failed"`
- No update written (old data preserved)

**Action:** Fix API key in `.env` and retry

---

### Scenario 2: Network Timeout

```
❌ Error: Fetch timeout after 30s
```

**Result:**

- Failed beach uses cached data
- `fetchStatus: "partial"`
- Other beaches continue

**Action:** Check network, retry later

---

### Scenario 3: API Quota Exceeded

```
⚠️  API quota exceeded (429). Daily limit: 10 requests. Try again tomorrow.
```

**Result:**

- Remaining beaches use cached data
- `fetchStatus: "partial"`
- Script exits with code 1

**Action:** Wait until next day (quota resets at midnight UTC)

---

### Scenario 4: Disk Full

```
❌ Error: ENOSPC: no space left on device
```

**Result:**

- Temp file write fails
- Original file preserved
- Script exits with error

**Action:** Free disk space and retry

## Manual Operations

### View Current Data

```bash
cat backend/data/tideData.json | jq '.meta'
```

### Restore from Backup

```bash
cp backend/data/tideData.backup.json backend/data/tideData.json
```

### Check Data Age

```bash
cat backend/data/tideData.json | jq '.lastUpdated'
# Output: "2025-11-03T06:00:00.000Z"
```

### Test Partial Failure

```bash
# Temporarily break API key to simulate failure
STORMGLASS_API_KEY=invalid node src/scripts/fetchTideData.js
# Should preserve old data and use cache
```

## Best Practices

✅ **DO:**

- Run fetch script **once per day**
- Monitor exit codes (0 = success, 1 = issues)
- Check `fetchStatus` in meta for health monitoring
- Keep backup files (automatic)
- Review logs for API quota warnings

❌ **DON'T:**

- Run script multiple times per day (wastes quota)
- Delete backup files manually
- Edit `tideData.json` by hand (use script)
- Ignore "partial" status (investigate failures)

## Monitoring & Alerts

### Cron Job with Logging

```bash
# Log output for debugging
0 6 * * * cd /path/to/backend && node src/scripts/fetchTideData.js >> /var/log/tide-fetch.log 2>&1
```

### Check for Issues

```bash
# Exit code = 1 means partial/failed
if [ $? -ne 0 ]; then
  echo "Tide fetch had issues, check logs"
  # Send alert email/Slack notification
fi
```

### Health Check Endpoint

Add to `backend/src/routes/tides.js`:

```javascript
router.get("/health", (req, res) => {
  const data = JSON.parse(fs.readFileSync(TIDE_DATA_FILE));
  const age = Date.now() - new Date(data.lastUpdated);
  const hoursOld = age / (1000 * 60 * 60);

  res.json({
    status: data.meta.fetchStatus,
    lastUpdated: data.lastUpdated,
    hoursOld: hoursOld.toFixed(1),
    failedBeaches: data.meta.failedBeaches,
  });
});
```

## Summary

| Aspect             | Strategy                               | Reason                        |
| ------------------ | -------------------------------------- | ----------------------------- |
| **Storage**        | Single JSON file, complete replacement | Simple, no duplicates         |
| **Frequency**      | Once daily (6am)                       | Stays within 10 req/day limit |
| **Write Safety**   | Atomic rename, backup creation         | Prevents corruption           |
| **API Failures**   | Use cached data for failed beaches     | Graceful degradation          |
| **Data Lifespan**  | 7 days predictions, show next 24h      | Balance freshness & API usage |
| **Error Handling** | Partial updates allowed, exit codes    | Resilient & monitorable       |

This strategy ensures **robust, corruption-resistant tide data** while respecting API limits and maintaining service availability even during failures.
