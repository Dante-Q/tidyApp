import { useState } from "react";
import TideChart from "../components/TideChart";
import "./ToolsPage.css";

export default function TidesPage() {
  const [selectedBeach, setSelectedBeach] = useState("muizenberg");

  return (
    <div className="tools-page">
      <div className="tools-hero">
        <h1 className="tools-title">🌊 Tide Times</h1>
        <p className="tools-description">
          Accurate tide predictions for Cape Town beaches
        </p>
      </div>

      <div className="tools-content">
        <TideChart
          selectedBeach={selectedBeach}
          onBeachChange={setSelectedBeach}
        />
      </div>
    </div>
  );
}
