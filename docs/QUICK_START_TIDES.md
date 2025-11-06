# Quick Start: Fetch Your First Tide Data

## Step 1: Add API Key

Edit `backend/.env` and add this line:

```bash
STORMGLASS_API_KEY=036d2c16-b87a-11f0-a148-0242ac130003-036d2cca-b87a-11f0-a148-0242ac130003
```

## Step 2: Run the Script

```bash
cd backend
node src/scripts/fetchTideData.js
```

Expected output:

```
Starting tide data fetch...

Fetching tide data for Muizenberg...
✓ Fetched 14 tide extremes for Muizenberg
Fetching tide data for Bloubergstrand...
✓ Fetched 14 tide extremes for Bloubergstrand
...

✓ Tide data saved to /path/to/backend/data/tideData.json
✓ Total beaches processed: 6
✓ Last updated: 2025-11-03T...

Summary:
  Muizenberg: 14 tide extremes
  Bloubergstrand: 14 tide extremes
  Strand: 14 tide extremes
  Clifton: 14 tide extremes
  Kalk Bay: 14 tide extremes
  Milnerton: 14 tide extremes

✓ Tide data fetch complete!
```

## Step 3: Test the API

Start your backend:

```bash
npm run dev
```

Test in browser or curl:

```bash
# View all beaches
http://localhost:5000/api/tides

# View specific beach
http://localhost:5000/api/tides/muizenberg
```

## Step 4: Check the Data File

```bash
cat backend/data/tideData.json
```

## API Usage

This fetch used **6 requests** (one per beach).

You have **4 requests** remaining today.

💡 **Tip**: Run this script 2-3 times per day maximum to stay within the 10 requests/day limit.

## Next: Update TideChart

Now that you have real tide data, we can update the TideChart component to display it!
