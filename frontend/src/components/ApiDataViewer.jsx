import { useState } from "react";
import useSurfData from "../hooks/useSurfData";
import "./ApiDataViewer.css";

export default function ApiDataViewer() {
  const [selectedBeach, setSelectedBeach] = useState("muizenberg");
  const { data, current, loading, error } = useSurfData(selectedBeach);

  const beaches = [
    "muizenberg",
    "bloubergstrand",
    "strand",
    "clifton",
    "kalkbay",
    "milnerton",
  ];

  return (
    <div className="api-viewer">
      <h1>API Data Viewer - Testing Open-Meteo</h1>

      <div className="beach-selector">
        <label>Select Beach: </label>
        <select
          value={selectedBeach}
          onChange={(e) => setSelectedBeach(e.target.value)}
        >
          {beaches.map((beach) => (
            <option key={beach} value={beach}>
              {beach.charAt(0).toUpperCase() + beach.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="status">Loading...</div>}
      {error && <div className="status error">Error: {error}</div>}

      {current && (
        <div className="data-section">
          <h2>Current Conditions</h2>
          <pre>{JSON.stringify(current, null, 2)}</pre>
        </div>
      )}

      {data && (
        <>
          <div className="data-section">
            <h2>Hourly Data (first 5 hours)</h2>
            <div className="hourly-preview">
              {data.hourly && (
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Wave Height (m)</th>
                      <th>Wave Period (s)</th>
                      <th>Wave Direction (°)</th>
                      <th>Wind Wave Height (m)</th>
                      <th>Swell Wave Height (m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.hourly.time.slice(0, 5).map((time, i) => (
                      <tr key={i}>
                        <td>{new Date(time).toLocaleString()}</td>
                        <td>{data.hourly.wave_height[i]}</td>
                        <td>{data.hourly.wave_period[i]}</td>
                        <td>{data.hourly.wave_direction[i]}</td>
                        <td>{data.hourly.wind_wave_height[i]}</td>
                        <td>{data.hourly.swell_wave_height[i]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="data-section">
            <h2>Full Response Structure</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}
