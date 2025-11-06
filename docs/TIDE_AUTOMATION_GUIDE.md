# Tide Data Automation - Complete Guide

## How Does Automation Work?

### ❌ The Backend Server Does NOT Auto-Run Scripts

**Important:** The Node.js backend server (`npm run dev` or `npm start`) **does not** automatically run the tide fetch scripts at 6am. These are two separate systems:

1. **Backend Server** - Serves API endpoints for your frontend
2. **Cron Jobs** - System-level scheduler that runs scripts at specific times

### ✅ You Need to Set Up Cron Jobs

Cron is a time-based job scheduler in Unix-like operating systems. It runs commands at scheduled times.

## Setup Instructions

### Option 1: Automated Setup (Recommended)

Run the setup script:

```bash
cd backend/src/scripts
./setup-cron.sh
```

This will:

- Show you the cron jobs to be added
- Create a `logs` directory for output
- Prompt you to install the cron jobs
- Set up logging automatically

### Option 2: Manual Setup

1. Open your crontab:

```bash
crontab -e
```

2. Add these lines at the bottom:

```bash
# TidyApp - Tide Data Fetching (Alternating Schedule)
0 6 1-31/2 * * cd /path/to/tidyapp/backend && node src/scripts/fetchTideData.js >> /path/to/tidyapp/backend/logs/tide-fetch.log 2>&1
0 6 2-30/2 * * cd /path/to/tidyapp/backend && node src/scripts/fetchSeaLevelData.js >> /path/to/tidyapp/backend/logs/sealevel-fetch.log 2>&1
```

**Important:** Replace `/path/to/tidyapp/backend` with your actual path!

3. Save and exit (in vim: `:wq`, in nano: `Ctrl+X` then `Y`)

4. Create logs directory:

```bash
mkdir -p /path/to/tidyapp/backend/logs
```

## Understanding the Cron Schedule

### Cron Syntax

```
* * * * * command
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, both 0 and 7 = Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

### Our Schedule Explained

**Tide Extremes: `0 6 1-31/2 * *`**

- `0` = At minute 0
- `6` = At hour 6 (6:00 AM)
- `1-31/2` = Every odd day of month (1, 3, 5, 7, 9, 11, 13, etc.)
- `*` = Every month
- `*` = Every day of week

**Sea Level: `0 6 2-30/2 * *`**

- `0` = At minute 0
- `6` = At hour 6 (6:00 AM)
- `2-30/2` = Every even day of month (2, 4, 6, 8, 10, 12, etc.)
- `*` = Every month
- `*` = Every day of week

### Actual Run Dates (Example)

| Date  | Day#     | Script               | Data Type |
| ----- | -------- | -------------------- | --------- |
| Nov 1 | 1 (odd)  | fetchTideData.js     | Extremes  |
| Nov 2 | 2 (even) | fetchSeaLevelData.js | Hourly    |
| Nov 3 | 3 (odd)  | fetchTideData.js     | Extremes  |
| Nov 4 | 4 (even) | fetchSeaLevelData.js | Hourly    |
| Nov 5 | 5 (odd)  | fetchTideData.js     | Extremes  |
| Nov 6 | 6 (even) | fetchSeaLevelData.js | Hourly    |

## How Cron Knows the Date

### ✅ Cron Uses System Time (No Extra Modules Needed)

Cron is part of your operating system and uses the system clock. It **automatically** knows:

- Current date
- Current time
- Timezone

**No Node.js modules required** - Cron runs independently of Node.js!

Your scripts use JavaScript's built-in `Date` object:

```javascript
const now = new Date(); // Uses system time
```

This is **native JavaScript** - no installation needed.

## Logging & Monitoring

### View Logs

**Tide extremes log:**

```bash
tail -f backend/logs/tide-fetch.log
```

**Sea level log:**

```bash
tail -f backend/logs/sealevel-fetch.log
```

### Enhanced Logging Output

Both scripts now include detailed logging:

```
============================================================
🌊 TIDE EXTREMES FETCH STARTED
============================================================
Start Time: 2025-11-04T06:00:00.123Z
Local Time: 11/4/2025, 8:00:00 AM
Script: fetchTideData.js
Schedule: ODD DATES (1, 3, 5, 7, etc.)
============================================================

Fetching tide data for Muizenberg...
✓ Fetched 8 tide extremes for Muizenberg
...

============================================================
🌊 TIDE EXTREMES FETCH COMPLETED
============================================================
End Time: 2025-11-04T06:00:15.456Z
Duration: 15.33 seconds
Status: SUCCESS ✓
============================================================
```

### Check if Cron Jobs are Installed

```bash
crontab -l
```

This lists all your cron jobs. You should see the two TidyApp entries.

### Test the Scripts Manually

Before relying on cron, test them manually:

```bash
cd backend
node src/scripts/fetchTideData.js
node src/scripts/fetchSeaLevelData.js
```

Watch for the detailed logging output!

## Data Flow Verification

### 1. API Response Structure (Stormglass)

**Tide Extremes Response:**

```json
{
  "data": [
    {
      "height": 1.89,
      "time": "2025-11-03T04:15:00+00:00",
      "type": "high"
    },
    {
      "height": 0.32,
      "time": "2025-11-03T10:45:00+00:00",
      "type": "low"
    }
  ],
  "meta": { ... }
}
```

**Sea Level Response:**

```json
{
  "data": [
    {
      "time": "2025-11-03T00:00:00+00:00",
      "waterLevel": {
        "sg": 1.23
      }
    },
    {
      "time": "2025-11-03T01:00:00+00:00",
      "waterLevel": {
        "sg": 1.45
      }
    }
  ],
  "meta": { ... }
}
```

### 2. Data Extraction (Fixed!)

**Tide Extremes:**

```javascript
const extremes = await fetchTideDataFromAPI(lat, lng, start, end);
// extremes.data = [{ height, time, type }, ...]
return {
  extremes: extremes.data || [],  // ✅ Correct
  ...
};
```

**Sea Level:**

```javascript
const response = await fetchSeaLevelDataFromAPI(lat, lng, start, end);
// response.data = [{ time, waterLevel: { sg: 1.23 } }, ...]
const seaLevel = (response.data || []).map((hour) => ({
  time: hour.time,
  height: hour.waterLevel?.sg || 0, // ✅ Fixed! Was waterLevel[0].sg
}));
```

### 3. Storage Format

**tideData.json:**

```json
{
  "lastUpdated": "2025-11-03T06:00:00Z",
  "beaches": {
    "muizenberg": {
      "extremes": [
        { "height": 1.89, "time": "...", "type": "high" },
        { "height": 0.32, "time": "...", "type": "low" }
      ]
    }
  }
}
```

**seaLevelData.json:**

```json
{
  "lastUpdated": "2025-11-04T06:00:00Z",
  "beaches": {
    "muizenberg": {
      "seaLevel": [
        { "time": "2025-11-04T00:00:00+00:00", "height": 1.23 },
        { "time": "2025-11-04T01:00:00+00:00", "height": 1.45 },
        ...24 hourly points...
      ]
    }
  }
}
```

### 4. Frontend Display

**TideChart.jsx Logic:**

```javascript
const { extremes } = useTideData(selectedBeach);
const { seaLevel } = useSeaLevelData(selectedBeach);

// Prefer sea level (24 hourly bars) over extremes (6-8 bars)
const hasSeaLevelData = seaLevel && seaLevel.length > 0;

if (hasSeaLevelData) {
  // Show 24 cyan bars (smooth curve)
  chartData = seaLevel.map((reading) => ({
    time: reading.time,
    height: reading.height,
    type: "sea-level",
  }));
} else {
  // Show 6-8 blue/red bars (discrete extremes)
  chartData = extremes;
}
```

## Issues Found & Fixed

### 1. ✅ Sea Level Data Extraction

**Before:** `hour.waterLevel?.[0]?.sg` (treating as array)
**After:** `hour.waterLevel?.sg` (correct object access)
**Why:** Stormglass returns `{ waterLevel: { sg: 1.23 } }` not an array

### 2. ✅ Enhanced Logging

**Added:**

- Start/end timestamps (ISO + local)
- Duration calculation
- Script name identification
- Schedule reminder (ODD/EVEN dates)
- Clear visual separators

### 3. ✅ Cron Setup Script

**Created:** `setup-cron.sh` for easy installation
**Features:**

- Automatic path detection
- Logs directory creation
- Interactive installation
- Safety checks

## Troubleshooting

### Cron jobs not running?

1. **Check crontab:**

   ```bash
   crontab -l
   ```

2. **Check system cron service:**

   ```bash
   # Linux
   systemctl status cron
   # or
   systemctl status crond
   ```

3. **Check logs for errors:**

   ```bash
   tail -50 backend/logs/tide-fetch.log
   tail -50 backend/logs/sealevel-fetch.log
   ```

4. **Verify paths are absolute:**
   Cron doesn't use your shell's working directory. Always use full paths!

### Scripts work manually but not in cron?

1. **Environment variables missing:**
   Cron has a minimal environment. The scripts load `.env` automatically via `dotenv.config()`, so this should work.

2. **Check file permissions:**

   ```bash
   ls -la backend/src/scripts/*.js
   ```

   Should be readable.

3. **Test with simple cron first:**

   ```bash
   # Add to crontab:
   * * * * * date >> /tmp/crontest.log

   # Wait 1 minute, then check:
   cat /tmp/crontest.log
   ```

### API quota exceeded?

Monitor your usage in the logs. Each script shows:

```
📊 API Usage:
  Requests made: 6
  Daily limit: 10 requests
  Remaining today: ~4 requests
```

## Summary

✅ **Cron handles scheduling** (not Node.js backend)
✅ **System time used** (no modules needed)
✅ **Logs capture everything** (timestamps, duration, errors)
✅ **Data extraction fixed** (waterLevel.sg, not waterLevel[0].sg)
✅ **Easy setup script** (setup-cron.sh)
✅ **Alternating schedule** (odd dates = extremes, even dates = sea level)
✅ **Within API limits** (6 requests/day, limit is 10)

## Next Steps

1. ✅ Wait for API quota reset (tomorrow)
2. ✅ Test scripts manually: `node src/scripts/fetchTideData.js`
3. ✅ Run setup: `./src/scripts/setup-cron.sh`
4. ✅ Verify first cron run tomorrow at 6am
5. ✅ Check logs to confirm success
6. ✅ View smooth tide curves in your app! 🌊
