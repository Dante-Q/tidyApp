# Tide Data System Setup Guide

## Overview

The tide data system uses Stormglass.io API to fetch tide predictions and stores them in a static JSON file. This approach minimizes API calls (only 10/day allowed on free tier) while providing fresh data to the frontend.

## Architecture

```
┌─────────────────┐
│  Stormglass API │
│  (10 req/day)   │
└────────┬────────┘
         │
         │ Fetch 2-3x/day
         ▼
┌─────────────────────┐
│  fetchTideData.js   │
│  (Backend Script)   │
└────────┬────────────┘
         │
         │ Saves to
         ▼
┌─────────────────────┐
│  tideData.json      │
│  (Static File)      │
└────────┬────────────┘
         │
         │ Serves via
         ▼
┌─────────────────────┐
│  /api/tides         │
│  (Express Route)    │
└────────┬────────────┘
         │
         │ Fetch from
         ▼
┌─────────────────────┐
│  Frontend           │
│  (TideChart)        │
└─────────────────────┘
```

## Setup Steps

### 1. Add API Key to Environment

Add your Stormglass API key to `backend/.env`:

```bash
STORMGLASS_API_KEY=036d2c16-b87a-11f0-a148-0242ac130003-036d2cca-b87a-11f0-a148-0242ac130003
```

### 2. Initial Data Fetch

Run the script manually to fetch tide data for the first time:

```bash
cd backend
node src/scripts/fetchTideData.js
```

This will:

- Fetch tide data for all 6 beaches
- Create `backend/data/tideData.json`
- Use 6 API requests

### 3. Verify Data

Check that the data file was created:

```bash
cat backend/data/tideData.json
```

You should see tide extremes (high/low) for each beach.

### 4. Test API Endpoint

Start your backend server and test:

```bash
# Get all beaches
curl http://localhost:5000/api/tides

# Get specific beach
curl http://localhost:5000/api/tides/muizenberg
```

### 5. Automate Data Fetching (Optional)

#### Linux/Mac (Cron)

Edit crontab:

```bash
crontab -e
```

Add this line (runs at 6am, 2pm, 10pm):

```bash
0 6,14,22 * * * cd /path/to/tidyapp/backend && node src/scripts/fetchTideData.js >> /path/to/tidyapp/backend/logs/tide-fetch.log 2>&1
```

#### Windows (Task Scheduler)

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily at 6:00 AM
4. Action: Start a program
   - Program: `node`
   - Arguments: `src/scripts/fetchTideData.js`
   - Start in: `C:\path\to\tidyapp\backend`
5. Repeat for 2pm and 10pm

## Data Structure

### Request Format

The script fetches:

- **Extremes**: High and low tide times and heights
- **Duration**: 7 days from current time
- **Beaches**: All 6 configured beaches

### Response Format

```json
{
  "lastUpdated": "2025-11-03T10:30:00.000Z",
  "meta": {
    "totalBeaches": 6,
    "daysOfPredictions": 7,
    "apiProvider": "Stormglass.io"
  },
  "beaches": {
    "muizenberg": {
      "beach": "muizenberg",
      "name": "Muizenberg",
      "coordinates": { "lat": -34.1183, "lng": 18.4717 },
      "extremes": [
        {
          "height": 1.23,
          "time": "2025-11-03T04:30:00+00:00",
          "type": "low"
        },
        {
          "height": 1.89,
          "time": "2025-11-03T10:45:00+00:00",
          "type": "high"
        }
      ],
      "lastUpdated": "2025-11-03T10:30:00.000Z"
    }
  }
}
```

## API Usage Tracking

Monitor your API usage to stay within limits:

- **Free Tier**: 10 requests/day
- **Per Script Run**: 6 requests (one per beach)
- **Recommended Runs**: 2-3 times/day maximum
- **Daily Usage**: 12-18 requests (within limit if running 2x/day)

⚠️ **Important**: Running more than 3 times per day may exceed your limit!

## Frontend Integration

### API Endpoints

```javascript
// Get all beaches
GET /api/tides

// Get specific beach
GET /api/tides/:beachName
```

### Example Frontend Usage

```javascript
// Fetch tide data for a beach
const response = await fetch("http://localhost:5000/api/tides/muizenberg");
const tideData = await response.json();

console.log(tideData.extremes); // Array of high/low tides
console.log(tideData.lastUpdated); // When data was fetched
```

## Troubleshooting

### "Tide data not available"

**Cause**: Script hasn't been run yet or data file doesn't exist.

**Solution**: Run `node src/scripts/fetchTideData.js`

### "STORMGLASS_API_KEY is not configured"

**Cause**: API key missing from `.env` file.

**Solution**: Add key to `backend/.env`

### "API error (401)"

**Cause**: Invalid API key.

**Solution**: Verify your API key is correct

### "API error (429)"

**Cause**: Rate limit exceeded (>10 requests/day).

**Solution**: Wait until tomorrow or reduce fetch frequency

## Next Steps

1. ✅ Backend setup complete
2. ⏳ Update TideChart component to use real data
3. ⏳ Create frontend service to fetch tide data
4. ⏳ Add loading/error states to TideChart
5. ⏳ Display high/low tides with times
6. ⏳ Add beach selector to TideChart

## Files Created

- ✅ `backend/src/services/stormglassService.js` - API service
- ✅ `backend/src/scripts/fetchTideData.js` - Data fetch script
- ✅ `backend/src/routes/tides.js` - Express routes
- ✅ `backend/.env.example` - Updated with API key
- ✅ `backend/src/server.js` - Added tide routes

## Files To Update Next

- ⏳ `frontend/src/services/tideService.js` - Create frontend service
- ⏳ `frontend/src/components/TideChart.jsx` - Use real data
- ⏳ `frontend/src/hooks/useTideData.js` - Create data hook
