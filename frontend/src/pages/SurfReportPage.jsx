import { useState } from "react";
import WaveHeightGraph from "../components/WaveHeightGraph";
import useMarineData from "../hooks/useMarineData";
import "./ToolsPage.css";

export default function SurfReportPage() {
  const [selectedBeach, setSelectedBeach] = useState("muizenberg");
  const { data: surfData, loading, error } = useMarineData(selectedBeach);

  return (
    <div className="tools-page">
      <div className="tools-hero">
        <h1 className="tools-title">
          <span className="hero-emoji">🏄‍♂️</span> Surf Report
        </h1>
        <p className="tools-description">
          Real-time wave height and surf conditions for Cape Town beaches
        </p>
      </div>

      <div className="tools-content">
        <WaveHeightGraph
          surfData={surfData}
          loading={loading}
          error={error}
          selectedBeach={selectedBeach}
          onBeachChange={setSelectedBeach}
        />
      </div>
    </div>
  );
}
