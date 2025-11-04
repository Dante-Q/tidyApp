# WindCompass Integration Guide

## Overview

The WindCompass component has been updated to accept real-time weather data from the Open-Meteo API. The `openMeteoService.js` now includes a `fetchWeatherData()` function to retrieve wind speed, direction, gusts, and temperature.

## Changes Made

### 1. Service Layer (`openMeteoService.js`)

- ✅ Added `WEATHER_API_URL` from config
- ✅ Created `buildWeatherApiUrl()` function
- ✅ Created `fetchWeatherData()` function that retrieves:
  - Current: temperature, humidity, wind speed, wind direction, wind gusts
  - Hourly: temperature, wind speed, wind direction, wind gusts (24 hours)

### 2. WindCompass Component (`WindCompass.jsx`)

- ✅ Now accepts `weatherData`, `isLoading`, and `error` props
- ✅ Extracts wind data from API response (`current.wind_speed_10m`, etc.)
- ✅ Calculates cardinal direction from degrees automatically
- ✅ Shows loading spinner while fetching data
- ✅ Shows error message if fetch fails
- ✅ Falls back to safe defaults if no data

### 3. CSS Updates (`WindCompass.css`)

- ✅ Added `.wind-compass-loading` styles
- ✅ Added `.wind-compass-error` styles
- ✅ Added loading spinner animation

## How to Use

### Example 1: Simple Usage (Default Beach)

```jsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import WindCompass from "../components/WindCompass";
import { fetchWeatherData } from "../services/openMeteoService";

export default function HomePage() {
  // Fetch weather data for a default beach (e.g., muizenberg)
  const {
    data: weatherData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["weather", "muizenberg"],
    queryFn: ({ signal }) => fetchWeatherData("muizenberg", { signal }),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return (
    <div>
      <WindCompass
        weatherData={weatherData}
        isLoading={isLoading}
        error={error?.message}
      />
    </div>
  );
}
```

### Example 2: User-Selected Beach

```jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import WindCompass from "../components/WindCompass";
import { fetchWeatherData } from "../services/openMeteoService";

export default function WeatherPage() {
  const [selectedBeach, setSelectedBeach] = useState("muizenberg");

  const {
    data: weatherData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["weather", selectedBeach],
    queryFn: ({ signal }) => fetchWeatherData(selectedBeach, { signal }),
    enabled: !!selectedBeach,
    refetchInterval: 5 * 60 * 1000,
  });

  return (
    <div>
      <select
        value={selectedBeach}
        onChange={(e) => setSelectedBeach(e.target.value)}
      >
        <option value="muizenberg">Muizenberg</option>
        <option value="bloubergstrand">Bloubergstrand</option>
        <option value="clifton">Clifton</option>
        {/* Add other beaches */}
      </select>

      <WindCompass
        weatherData={weatherData}
        isLoading={isLoading}
        error={error?.message}
      />
    </div>
  );
}
```

### Example 3: Using on BeachPage

```jsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import WindCompass from "../components/WindCompass";
import { fetchWeatherData } from "../services/openMeteoService";

export default function BeachPage() {
  const { beachName } = useParams();

  const {
    data: weatherData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["weather", beachName],
    queryFn: ({ signal }) => fetchWeatherData(beachName, { signal }),
    refetchInterval: 5 * 60 * 1000,
  });

  return (
    <div>
      <h1>Beach: {beachName}</h1>
      <WindCompass
        weatherData={weatherData}
        isLoading={isLoading}
        error={error?.message}
      />
    </div>
  );
}
```

## API Response Structure

The `fetchWeatherData()` function returns data in this format:

```json
{
  "current": {
    "temperature_2m": 18.5,
    "relative_humidity_2m": 65,
    "apparent_temperature": 17.2,
    "precipitation": 0,
    "wind_speed_10m": 18.4,
    "wind_direction_10m": 225,
    "wind_gusts_10m": 24.1
  },
  "hourly": {
    "time": ["2025-11-03T00:00", "2025-11-03T01:00", ...],
    "temperature_2m": [18.5, 18.2, 17.9, ...],
    "wind_speed_10m": [18.4, 19.1, 17.5, ...],
    "wind_direction_10m": [225, 230, 235, ...],
    "wind_gusts_10m": [24.1, 25.3, 23.8, ...]
  }
}
```

## WindCompass Data Extraction

The component automatically extracts:

- **Wind Speed**: `current.wind_speed_10m` (km/h)
- **Wind Direction**: `current.wind_direction_10m` (degrees, 0-360)
- **Wind Gusts**: `current.wind_gusts_10m` (km/h)
- **Direction Name**: Calculated from degrees (N, NE, E, SE, S, SW, W, NW)

## Next Steps

1. **Update HomePage.jsx** to fetch weather data and pass it to WindCompass
2. **Add beach selector** if you want users to choose which beach to view
3. **Consider caching** - React Query automatically caches for 5 minutes
4. **Add temperature display** - The API also returns temperature data you could show

## Testing

To test the component without real data:

```jsx
<WindCompass
  weatherData={{
    current: {
      wind_speed_10m: 18,
      wind_direction_10m: 225,
      wind_gusts_10m: 24,
    },
  }}
  isLoading={false}
  error={null}
/>
```

To test loading state:

```jsx
<WindCompass isLoading={true} />
```

To test error state:

```jsx
<WindCompass error="Failed to fetch weather data" />
```
