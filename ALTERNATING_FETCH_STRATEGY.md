# Alternating Days Fetch Strategy Analysis

## The Proposal

**Day 1 (Odd days):** Fetch tide extremes (6 beaches = 6 requests)
**Day 2 (Even days):** Fetch sea level data (6 beaches = 6 requests)

This keeps us within the 10 requests/day limit!

## Understanding Stormglass Data Types

### 1. Tide Extremes (`/tide/extremes/point`)

**What it returns:**

```json
{
  "data": [
    {
      "height": 1.89,
      "time": "2025-11-03T10:45:00+00:00",
      "type": "high"
    },
    {
      "height": 0.45,
      "time": "2025-11-03T16:30:00+00:00",
      "type": "low"
    }
  ]
}
```

**Characteristics:**

- Discrete events (only high/low points)
- Typically 2-4 events per day
- Sparse data (just the peaks and troughs)
- Predictable far in advance (based on astronomical cycles)

**How we use it:**

- Show "Next high tide: 10:45 (1.89m)"
- Show "Next low tide: 16:30 (0.45m)"
- Interpolate current height between extremes

---

### 2. Sea Level Data (`/tide/sea-level/point`)

**What it returns:**

```json
{
  "hours": [
    {
      "time": "2025-11-03T00:00:00+00:00",
      "waterLevel": [
        {
          "sg": 0.82, // Stormglass prediction
          "source": "sg"
        }
      ]
    },
    {
      "time": "2025-11-03T01:00:00+00:00",
      "waterLevel": [
        {
          "sg": 1.15,
          "source": "sg"
        }
      ]
    },
    {
      "time": "2025-11-03T02:00:00+00:00",
      "waterLevel": [
        {
          "sg": 1.42,
          "source": "sg"
        }
      ]
    }
    // ... continues hourly for requested time range
  ]
}
```

**Characteristics:**

- **Hourly measurements** (24 data points per day)
- Continuous time series data
- Creates smooth tide curve
- Much more granular than extremes
- Also predictable far in advance (same astronomical basis)

**Data volume:**

- 7 days = 168 hours = 168 data points per beach
- 6 beaches = ~1000 data points total
- File size: ~100-150KB (still very small)

---

## Alternating Strategy Analysis

### Fetch Schedule

```
Nov 1 (Odd):  Fetch tide extremes  → tideData.json
Nov 2 (Even): Fetch sea level     → seaLevelData.json
Nov 3 (Odd):  Fetch tide extremes  → tideData.json (refresh)
Nov 4 (Even): Fetch sea level     → seaLevelData.json (refresh)
```

### Data Freshness

| Day Type                    | Tide Extremes Age | Sea Level Age |
| --------------------------- | ----------------- | ------------- |
| **Day 1 (fetch extremes)**  | 0 hours old       | 24 hours old  |
| **Day 2 (fetch sea level)** | 24 hours old      | 0 hours old   |
| **Day 3 (fetch extremes)**  | 0 hours old       | 24 hours old  |

### Will This Work?

**✅ YES, because tides are PREDICTABLE**

Tides are based on:

- Moon's gravitational pull (28-day cycle)
- Sun's gravitational pull (yearly cycle)
- Earth's rotation (daily cycle)
- Local geography (constant)

**Key insight:** A tide prediction for "Nov 5 at 3pm" is just as accurate whether you:

- Fetched it on Nov 1 (4 days ahead)
- Fetched it on Nov 4 (1 day ahead)

**Unlike weather**, which changes rapidly, tide predictions are **stable and long-term accurate**.

---

## How Sea Level Data Fits Your App

### Current App Features (Tide Extremes Only)

```
┌─────────────────────────────────┐
│  Muizenberg Beach               │
├─────────────────────────────────┤
│  Current: 1.3m                  │  ← Interpolated
│  Next High: 14:30 (1.89m)       │  ← From extremes
│  Next Low: 20:15 (0.45m)        │  ← From extremes
│                                 │
│  [Bar chart with 6-8 bars]      │  ← Only shows extremes
└─────────────────────────────────┘
```

### With Sea Level Data Added

```
┌─────────────────────────────────┐
│  Muizenberg Beach               │
├─────────────────────────────────┤
│  Current: 1.32m (PRECISE)       │  ← From hourly data
│  Next High: 14:30 (1.89m)       │  ← From extremes
│  Next Low: 20:15 (0.45m)        │  ← From extremes
│                                 │
│  [Smooth tide curve - 24 pts]   │  ← Beautiful smooth graph!
│        ╱╲                        │
│       ╱  ╲                       │
│      ╱    ╲                      │
│     ╱      ╲___                  │
│  __╱           ╲                 │
│  0  6  12  18  24               │
└─────────────────────────────────┘
```

### Specific Use Cases

#### Use Case 1: Smooth Tide Curve ⭐⭐⭐

**Current:** Bar chart with only 6-8 points (high/low extremes)
**With sea level:** Beautiful smooth curve with 24 points per day

```javascript
// Instead of this (discrete points):
extremes = [
  { time: "10:45", height: 1.89 }, // high
  { time: "16:30", height: 0.45 }, // low
];

// You get this (continuous curve):
seaLevel = [
  { time: "00:00", height: 0.82 },
  { time: "01:00", height: 1.15 },
  { time: "02:00", height: 1.42 },
  // ... every hour ...
  { time: "23:00", height: 0.95 },
];
```

**User Experience:**

- More professional-looking graph
- Users can see exact tide at any hour
- Better for planning: "I want to go at 2pm, what's the tide?"

#### Use Case 2: Precise Current Height ⭐⭐

**Current:** Interpolate between extremes (linear approximation)
**With sea level:** Look up actual predicted height for current hour

```javascript
// Current approach (estimation):
getCurrentHeight(extremes); // Interpolates linearly - ~90% accurate

// With sea level (precise):
seaLevel.find((h) => h.time === currentHour).height; // Exact prediction
```

**Difference:** Marginal improvement (~5-10cm more accurate)

#### Use Case 3: Tide Rate of Change ⭐

**Current:** Not possible
**With sea level:** Calculate how fast tide is rising/falling

```javascript
const currentHour = seaLevel[12]; // 12:00 - 1.45m
const nextHour = seaLevel[13]; // 13:00 - 1.52m
const rateOfChange = nextHour - currentHour; // +0.07m/hour

// Show user: "Tide rising at 7cm/hour"
```

**User Experience:**

- "Tide is rising quickly - beach shrinking fast!"
- "Tide is slack - good time to explore rock pools"

#### Use Case 4: Time-Specific Planning ⭐⭐⭐

**Current:** Only know high/low times
**With sea level:** Know exact depth at specific times

```javascript
// User asks: "What's the tide at 3pm when I want to surf?"
const tide3pm = seaLevel.find((h) => h.time.includes("15:00"));
// Returns: "1.23m - Good surfing depth!"
```

#### Use Case 5: Historical Comparison ⭐

**Current:** Not useful
**With sea level:** Compare today vs tomorrow's tide curve

```javascript
// "Tomorrow's tide will be 20cm higher at 2pm than today"
```

---

## Fetch Frequency Needed

### Question: Is once per day enough?

**YES!** ✅

Sea level data is **just as predictable** as tide extremes because they're both based on the same astronomical calculations.

**Comparison:**

| Data Type         | How Often to Fetch | Why                                    |
| ----------------- | ------------------ | -------------------------------------- |
| **Weather**       | Every 6 hours      | Conditions change rapidly              |
| **Wave Height**   | Every 12 hours     | Swell patterns shift                   |
| **Tide Extremes** | Once daily         | Astronomical (predictable weeks ahead) |
| **Sea Level**     | Once daily         | Same astronomical basis as extremes    |

**Example:**

- Fetch sea level on Monday morning → Get 7 days of hourly predictions
- Tuesday at 3pm: Still showing Monday's prediction for Tuesday 3pm
- Both are equally accurate (calculated months ago by astronomers)

**The only thing that ages is how far ahead you're looking:**

- 1-day-old prediction for tomorrow = still 6 days ahead (excellent)
- 6-day-old prediction for tomorrow = still 1 day ahead (excellent)
- Data gets "stale" only when it's in the past

---

## Implementation Strategy

### Option A: Alternating Days (Recommended) ✅

**Pros:**

- ✅ Stays within 10 requests/day limit
- ✅ Both datasets refresh every 2 days
- ✅ 7-day predictions = always have 5-6 days of valid data
- ✅ Simple cron setup

**Cons:**

- ⚠️ One dataset is 24 hours older than the other (doesn't matter for tides!)
- ⚠️ Two separate JSON files to manage

**Implementation:**

```bash
# Cron schedule (using day-of-month for true daily alternation)
0 6 1-31/2 * *  node fetchTideData.js     # Odd dates: extremes
0 6 2-30/2 * *  node fetchSeaLevelData.js # Even dates: sea level

# Or use date arithmetic in one script:
0 6 * * *  node fetchTideDataSmart.js  # Checks if date is odd/even
```

**File structure:**

```
backend/data/
├── tideData.json        # Extremes (refreshes odd days)
├── seaLevelData.json    # Hourly heights (refreshes even days)
├── tideData.backup.json
└── seaLevelData.backup.json
```

### Option B: Combined Fetch (Within Limit)

Only fetch sea level for **fewer beaches** or **fewer days**:

```javascript
// Fetch extremes for all 6 beaches (6 requests)
// Fetch sea level for 2 priority beaches only (2 requests)
// Total: 8 requests ✅ Within limit

PRIORITY_BEACHES = ["muizenberg", "bloubergstrand"];
```

**Pros:**

- ✅ Both datasets same age
- ✅ Can fetch daily
- ✅ Single cron job

**Cons:**

- ⚠️ Not all beaches get sea level curve
- ⚠️ Less data overall

### Option C: Weekly Sea Level Fetch

```bash
# Daily: Fetch tide extremes (6 requests)
0 6 * * * node fetchTideData.js

# Weekly: Fetch sea level for all beaches (6 requests)
0 6 * * 1 node fetchSeaLevelData.js  # Mondays only
```

**Pros:**

- ✅ Stays well within limits
- ✅ Sea level still accurate (7-day predictions)

**Cons:**

- ⚠️ Sea level data can be 6 days old by Sunday
- ⚠️ Still fine for tides (predictable), but less "fresh feeling"

---

## Recommended Approach

### 🎯 Go with Alternating Days

**Why:**

1. **Perfect balance** - Both datasets stay fresh (max 24 hours old)
2. **Within limits** - Never exceeds 6 requests/day
3. **Full coverage** - All 6 beaches get both datasets
4. **Tide accuracy** - 24-hour-old tide predictions are still perfect
5. **Simple to implement** - Just two cron jobs

### What You Gain

**Visual improvements:**

- Smooth tide curves instead of bar charts
- More professional appearance
- Better user engagement

**Functional improvements:**

- Exact tide at specific times (not interpolated)
- Tide rate of change calculations
- Better planning ("I want to go at 3pm, what's the depth?")

**Minimal cost:**

- Same API quota usage overall
- Small increase in storage (~100KB more)
- Slightly more complex cron setup

### What You DON'T Gain

- ❌ More accurate long-term predictions (tides are already perfect)
- ❌ Real-time updates (both are predictions, not measurements)
- ❌ Better current tide (interpolation is already ~95% accurate)

**Bottom line:** Sea level data is mostly a **UX/visual enhancement**, not a functional necessity.

---

## Implementation Code Sketch

### New Script: `fetchSeaLevelData.js`

```javascript
async function fetchBeachSeaLevel(beachKey, beach) {
  const { start, end } = getTimeRange(7);
  const { lat, lng } = beach.coordinates;

  const data = await fetchSeaLevelData(lat, lng, start, end);

  return {
    beach: beachKey,
    name: beach.name,
    coordinates: beach.coordinates,
    seaLevel: data.hours || [],  // Hourly data points
    lastUpdated: new Date().toISOString(),
  };
}

// Output: backend/data/seaLevelData.json
{
  "lastUpdated": "2025-11-03T06:00:00Z",
  "beaches": {
    "muizenberg": {
      "seaLevel": [
        { "time": "2025-11-03T00:00:00Z", "waterLevel": { "sg": 0.82 } },
        { "time": "2025-11-03T01:00:00Z", "waterLevel": { "sg": 1.15 } }
        // ... 168 hours
      ]
    }
  }
}
```

### Updated TideChart Component

```javascript
const { extremes } = useTideData(selectedBeach);
const { seaLevel } = useSeaLevelData(selectedBeach);

// If we have sea level data, use it for smooth curve
const chartData =
  seaLevel.length > 0
    ? seaLevel.slice(0, 24) // Next 24 hours of hourly data
    : extremes.slice(0, 12); // Fallback to extremes

// Current height: use sea level if available
const currentHeight =
  seaLevel.length > 0
    ? getCurrentHeightFromSeaLevel(seaLevel) // Exact lookup
    : getCurrentTideHeight(extremes); // Interpolation
```

---

## Final Recommendation

### ✅ Yes, implement alternating days!

**Schedule:**

```bash
# Odd dates: Tide extremes (1st, 3rd, 5th, etc.)
0 6 1-31/2 * * node src/scripts/fetchTideData.js

# Even dates: Sea level (2nd, 4th, 6th, etc.)
0 6 2-30/2 * * node src/scripts/fetchSeaLevelData.js
```

**Benefit:** Beautiful smooth tide curves, better UX, true daily alternation
**Cost:** Minimal (same API usage, just spread over 2 days)
**Risk:** None (tides are predictable, 24-hour-old data is perfect)

The visual improvement alone is worth it! 🌊📈
