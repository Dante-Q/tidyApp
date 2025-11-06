# Tide System - Complete Summary

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    STORMGLASS API (10 req/day)                  │
│                   https://api.stormglass.io/v2                  │
└────────────────────┬────────────────────────────┬────────────────┘
                     │                            │
         /tide/extremes/point          /tide/sea-level/point
         (High/Low tides)               (Water levels - NOT USED)
                     │                            │
                     │                            │
                     ▼                            ▼
         ┌──────────────────────────────────────────────────┐
         │   fetchTideData.js (Backend Script)              │
         │   - Runs once daily (6am cron)                   │
         │   - Uses 6 API requests (1 per beach)            │
         │   - Fetches 7 days of predictions                │
         │   - Only fetches tide extremes (not sea level)   │
         └──────────────────┬───────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────────────────┐
         │   backend/data/tideData.json (Static File)       │
         │   {                                              │
         │     "beaches": {                                 │
         │       "muizenberg": {                            │
         │         "extremes": [                            │
         │           {height: 1.23, time: "...", type: "low"} │
         │         ]                                        │
         │       }                                          │
         │     }                                            │
         │   }                                              │
         └──────────────────┬───────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────────────────┐
         │   GET /api/tides (Backend API Route)            │
         │   - Serves static JSON file                      │
         │   - No API calls per request                     │
         │   - Unlimited frontend access                    │
         └──────────────────┬───────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────────────────┐
         │   useTideData() Hook (Frontend)                  │
         │   - Fetches from /api/tides/:beach              │
         │   - Returns tide extremes + calculations         │
         └──────────────────┬───────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────────────────┐
         │   TideChart Component                            │
         │   - Shows next high/low tides                    │
         │   - Interpolates current height                  │
         │   - 24-hour bar chart visualization              │
         └──────────────────────────────────────────────────┘
```

## Current Implementation

### What We Fetch

- **Tide Extremes Only** (`/tide/extremes/point`)
  - High and low tide times
  - Heights at those times
  - Type (high/low)

### What We DON'T Fetch (Yet)

- **Sea Level Data** (`/tide/sea-level/point`)
  - Continuous water level readings
  - Hourly height measurements
  - More granular tide curve

### API Request Count

**Current:** 6 requests per run (1 per beach)

- 1 request = `/tide/extremes/point` for one beach

**If we add sea level:** 12 requests per run

- 1 request = `/tide/extremes/point` for one beach
- 1 request = `/tide/sea-level/point` for same beach
- Total: 2 × 6 beaches = 12 requests

## Sea Level Data - API Quota Analysis

### The Problem

```
Free tier limit: 10 requests/day
Current usage:   6 requests/day (tide extremes only)
If we add sea level: 12 requests/day ❌ OVER LIMIT!
```

### Can We Combine Into One Request?

**❌ NO** - These are **separate API endpoints**:

- `/tide/extremes/point` - Returns discrete high/low events
- `/tide/sea-level/point` - Returns continuous time series data

You **cannot** get both from a single API call.

### Possible Solutions

#### Option 1: Paid Tier (Not Free)

- Upgrade to paid plan for more requests
- Cost: Check Stormglass.io pricing

#### Option 2: Reduce Beaches (Loses Coverage)

```
3 beaches × 2 endpoints = 6 requests ✅
- Keep: Muizenberg, Bloubergstrand, Clifton
- Drop: Strand, Kalk Bay, Milnerton
```

#### Option 3: Interpolation (Current Approach) ✅ RECOMMENDED

- Only fetch tide extremes (6 requests)
- **Calculate** sea level between extremes using math
- Already implemented in `getCurrentTideHeight()`

**How it works:**

```javascript
// We have: High at 10:45 (1.89m), Low at 16:30 (0.45m)
// User asks: What's tide height at 13:00?

// Linear interpolation:
const timeSinceHigh = 13:00 - 10:45 = 2.25 hours
const totalTime = 16:30 - 10:45 = 5.75 hours
const progress = 2.25 / 5.75 = 0.39 (39% of way to low)

const heightDrop = 1.89 - 0.45 = 1.44m
const currentHeight = 1.89 - (1.44 × 0.39) = 1.33m
```

This gives **good enough** accuracy for a beach app without extra API calls!

#### Option 4: Hybrid Approach

Fetch sea level for **one priority beach** only:

```
1 beach × 2 endpoints = 2 requests (extremes + sea level)
5 beaches × 1 endpoint = 5 requests (extremes only)
Total: 7 requests ✅ Within limit
```

Show high-fidelity tide curve for one beach (e.g., Muizenberg), use interpolation for others.

## Data Storage: JSON File vs Database

### Current: JSON File Storage

**Location:** `backend/data/tideData.json`

**Structure:**

```json
{
  "lastUpdated": "2025-11-03T06:00:00Z",
  "beaches": {
    "muizenberg": {
      "extremes": [...],
      "lastUpdated": "..."
    }
  },
  "meta": {
    "fetchStatus": "complete",
    "failedBeaches": []
  }
}
```

### Should We Use MongoDB Instead?

Let's compare:

| Aspect          | JSON File                   | MongoDB Database                  |
| --------------- | --------------------------- | --------------------------------- |
| **Setup**       | ✅ Zero setup               | ❌ Requires schema, connection    |
| **Performance** | ✅ Fast reads (one file)    | ⚠️ Query overhead for simple data |
| **Concurrency** | ✅ Node.js handles it       | ✅ Built-in locking               |
| **History**     | ❌ Overwrites daily         | ✅ Can store historical data      |
| **Backup**      | ✅ Simple file copy         | ⚠️ Need dump/restore              |
| **Querying**    | ❌ Load all, filter in code | ✅ Flexible queries               |
| **Data Size**   | ✅ Tiny (~50KB)             | ⚠️ Overkill for small data        |
| **Deployment**  | ✅ Works anywhere           | ⚠️ Need MongoDB instance          |

### Recommendation: **Keep JSON File** ✅

**Why?**

1. **Small, static data** - 6 beaches × 7 days of tides = ~50KB total
2. **Updated once daily** - Not real-time, no need for DB writes
3. **Simple access pattern** - Frontend always wants "all beaches" or "one beach"
4. **Already cached** - File system caching is perfect for this
5. **Deployment simplicity** - No MongoDB required in production
6. **Atomic updates** - Easier with files than DB transactions

### When You WOULD Use MongoDB

Use the database if you need:

- **Historical data** - Store years of tide readings
- **User preferences** - "Favorite beaches", tide alerts
- **Analytics** - Track which beaches users view most
- **Real-time updates** - If tide data changed frequently (it doesn't)
- **Complex queries** - "Show all beaches with high tide > 2m in next 6 hours"

### Hybrid Approach (Best of Both Worlds)

You could do:

```javascript
// Store CURRENT tide predictions in JSON file (fast, simple)
backend/data/tideData.json

// Store HISTORICAL data in MongoDB (analysis, trends)
TideHistory collection: {
  beach: "muizenberg",
  date: "2025-11-03",
  extremes: [...],
  fetchedAt: "..."
}
```

This gives you:

- ✅ Fast current data access (JSON)
- ✅ Historical archive (MongoDB)
- ✅ Can analyze tide patterns over months/years

## Implementation Details

### Data Flow Timeline

**6:00 AM** - Cron job runs

```bash
node src/scripts/fetchTideData.js
```

1. Fetches 7 days of tide extremes from Stormglass (6 API requests)
2. Backs up old `tideData.json` → `tideData.backup.json`
3. Writes new data atomically to `tideData.json`

**6:05 AM** - User visits site

1. Frontend requests `/api/tides/muizenberg`
2. Backend reads JSON file (fast, no API call)
3. Returns extremes to frontend
4. Frontend calculates current height via interpolation
5. Displays in TideChart component

**8:00 PM** - Same user visits again

1. Same process, same JSON file
2. Data is now 14 hours old but still valid (7-day predictions)

**6:00 AM Next Day** - Fresh data

1. Cron job fetches new 7-day window
2. Cycle repeats

### What Each File Does

**Backend:**

- `stormglassService.js` - API wrapper (2 endpoints available)
- `fetchTideData.js` - Cron script (uses only extremes endpoint)
- `routes/tides.js` - HTTP endpoints to serve JSON file
- `data/tideData.json` - Static data file
- `data/tideData.backup.json` - Auto-backup before updates

**Frontend:**

- `services/tideService.js` - Fetch from `/api/tides`, calculate current height
- `hooks/useTideData.js` - React hook for data fetching
- `components/TideChart.jsx` - Visualization

## Key Takeaways

### ✅ What We Have

- Tide extremes (high/low times and heights)
- 7 days of predictions updated daily
- 6 beaches covered
- Interpolated current tide height
- Atomic file updates with backup
- Graceful API quota handling

### ⚠️ Current Limitations

- No continuous sea level curve (only extremes)
- Can't exceed 10 API requests/day
- Data refreshes once daily (not real-time, but tides are predictable)
- JSON file = no historical archive

### 🚀 To Add Sea Level Data

**Cheapest option:** Stick with interpolation (current)
**Best option within free tier:** Hybrid (1 beach with sea level, 5 with extremes)
**Best option overall:** Upgrade to paid Stormglass tier

### 💾 Database Migration

**Don't migrate unless you need:**

- Historical tide data storage
- Complex queries across time ranges
- User-specific tide preferences
- Analytics on tide patterns

**Current JSON approach is optimal for:**

- Static daily predictions
- Small dataset size
- Simple access patterns
- Easy deployment

---

## Summary Table

| Question                      | Answer                                             |
| ----------------------------- | -------------------------------------------------- |
| **What do we fetch?**         | Tide extremes only (high/low)                      |
| **What don't we fetch?**      | Sea level (continuous water heights)               |
| **Can we combine endpoints?** | ❌ No, separate API calls required                 |
| **Sea level API cost?**       | 2× current (12 vs 6 requests) = ❌ Over free limit |
| **Best solution?**            | ✅ Keep interpolation for current height           |
| **Storage method?**           | JSON file (50KB, updated daily)                    |
| **Should we use MongoDB?**    | ❌ Not needed for current use case                 |
| **When to use DB?**           | When storing historical data or user prefs         |
| **Current API usage?**        | 6 of 10 daily requests (60%)                       |
| **Run frequency?**            | Once daily at 6am                                  |

The current system is **well-designed** for the free tier constraints and provides excellent UX through smart interpolation!
