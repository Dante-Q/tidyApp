import BeachCam from "../components/BeachCam";
import "./ToolsPage.css";

export default function CamsPage() {
  return (
    <div className="tools-page">
      <div className="tools-hero">
        <h1 className="tools-title">📹 Beach Cams</h1>
        <p className="tools-description">
          Live webcam feeds from Cape Town beaches
        </p>
      </div>

      <div className="tools-content">
        <BeachCam />
      </div>
    </div>
  );
}
