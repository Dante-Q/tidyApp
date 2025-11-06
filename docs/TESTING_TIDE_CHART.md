# Testing Tide Chart Component

## Before You Can See Tide Data

The TideChart component needs tide data from the backend. Follow these steps to populate the data:

### 1. Add Your Stormglass API Key to Backend

Edit `backend/.env` and add your API key:

```bash
STORMGLASS_API_KEY=036d2c16-b87a-11f0-a148-0242ac130003-036d2cca-b87a-11f0-a148-0242ac130003
```

### 2. Fetch Tide Data

From the `backend` directory, run the fetch script:

```bash
cd backend
node src/scripts/fetchTideData.js
```

**Important:** This will use **6 API requests** (one per beach). You have **10 requests per day** on the free tier.

Expected output:

```
Fetching tide data for all beaches...
Fetching tide data for muizenberg...
Fetching tide data for bloubergstrand...
Fetching tide data for strand...
Fetching tide data for clifton...
Fetching tide data for kalkbay...
Fetching tide data for milnerton...
Successfully saved tide data for 6 beaches to /path/to/backend/data/tideData.json
```

### 3. Start the Backend Server

```bash
npm run dev
```

The tide API will be available at:

- `http://localhost:3001/api/tides` - All beaches
- `http://localhost:3001/api/tides/muizenberg` - Specific beach

### 4. View in Frontend

Start the frontend (if not already running):

```bash
cd ../frontend
npm run dev
```

Navigate to any beach page to see the TideChart component with real data.

## What You'll See

The TideChart displays:

- **Current tide height** - Interpolated from extremes
- **Next high tide** - Time and height
- **Next low tide** - Time and height
- **24-hour chart** - Bar graph showing tide extremes
- **Beach selector** - Synced with other components

## Troubleshooting

### "No tide data available"

- Run `backend/src/scripts/fetchTideData.js` first
- Check that `backend/data/tideData.json` exists
- Verify backend server is running

### "Failed to load tide data"

- Check backend console for errors
- Verify API key in `backend/.env`
- Check `/api/tides` endpoint in browser

### Empty Chart

- Data may have expired (only shows next 24 hours)
- Re-run the fetch script to get fresh 7-day predictions

## Fetching Schedule

**⚠️ IMPORTANT: Stormglass Free Tier = 10 Requests/Day**

Since each fetch uses **6 requests** (one per beach), running twice would use **12 requests** and exceed your daily limit.

**Recommended Strategy: Fetch ONCE per day**

```cron
# Run once daily at 6am (uses 6 of 10 daily requests)
0 6 * * * cd /path/to/backend && node src/scripts/fetchTideData.js
```

### Why Once Daily is Better

1. **Stays within API limits** - 6 requests < 10 limit
2. **7-day predictions** - Each fetch gets a full week of data
3. **No partial data issues** - All beaches succeed or use cached data
4. **Reserve requests** - Leaves 4 requests for manual testing/debugging

### What Happens If You Exceed the Limit?

When you hit the API quota (HTTP 429):

- Script will detect "API quota exceeded" error
- Failed beaches will use **cached data** from previous successful fetch
- Script creates **backup files** (`tideData.backup.json`) before updating
- Frontend continues working with slightly stale data

### Atomic Updates & Graceful Degradation

The script now implements:

- **Atomic writes** - Uses temp file + rename for safe updates
- **Partial fallback** - If some beaches fail, keeps old data for those beaches
- **Backup creation** - Copies existing data before overwriting
- **Status tracking** - Marks data as `complete`, `partial`, or `failed`

**Note:** Free tier is 10 requests/day, so **run ONCE per day** to stay within limits:

```cron
# Run once daily at 6am (uses 6 of 10 requests)
0 6 * * * cd /path/to/backend && node src/scripts/fetchTideData.js
```

See "Fetching Schedule" section above for full details on API quota management.

## Data Structure

Tide data is stored in `backend/data/tideData.json`:

```json
{
  "lastUpdated": "2025-01-03T10:30:00.000Z",
  "meta": {
    "totalBeaches": 6,
    "daysOfPredictions": 7
  },
  "beaches": {
    "muizenberg": {
      "extremes": [
        {
          "height": 1.23,
          "time": "2025-01-03T04:30:00+00:00",
          "type": "low"
        },
        {
          "height": 1.89,
          "time": "2025-01-03T10:45:00+00:00",
          "type": "high"
        }
      ]
    }
  }
}
```

## Component Features

✅ Real-time tide height interpolation
✅ Next high/low tide predictions
✅ 24-hour visual chart
✅ Beach selector (shared state)
✅ Loading spinner
✅ Error handling
✅ Responsive design
✅ Blue bars for high tides
✅ Red bars for low tides

---

For more details, see:

- `TIDE_SYSTEM_SETUP.md` - Complete architecture
- `QUICK_START_TIDES.md` - Quick reference
- `backend/src/scripts/README.md` - Script usage
