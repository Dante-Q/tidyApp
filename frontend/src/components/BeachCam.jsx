import { useState } from "react";
import "./BeachCam.css";

const BeachCam = () => {
  // Mock beach camera data
  const [cameras] = useState([
    {
      id: 1,
      name: "Muizenberg Beach",
      location: "Main Beach",
      status: "live",
      thumbnail:
        "https://via.placeholder.com/400x300/1e293b/6dd5ed?text=Muizenberg+Cam",
    },
    {
      id: 2,
      name: "Clifton 4th",
      location: "Clifton",
      status: "live",
      thumbnail:
        "https://via.placeholder.com/400x300/1e293b/6dd5ed?text=Clifton+Cam",
    },
    {
      id: 3,
      name: "Camps Bay",
      location: "Main Beach",
      status: "live",
      thumbnail:
        "https://via.placeholder.com/400x300/1e293b/6dd5ed?text=Camps+Bay+Cam",
    },
  ]);

  const [selectedCam, setSelectedCam] = useState(cameras[0]);
  const [activeTab, setActiveTab] = useState("cameras"); // 'cameras' or 'stats'

  return (
    <div className="beach-cam">
      <div className="beach-cam-header">
        <h2>Live Beach Cams</h2>
        <p>Real-time beach conditions</p>
      </div>

      <div className="beach-cam-container">
        {/* Main camera view */}
        <div className="beach-cam-main">
          <div className="cam-video-container">
            <img
              src={selectedCam.thumbnail}
              alt={selectedCam.name}
              className="cam-video"
            />

            {/* Live indicator */}
            <div className="cam-live-indicator">
              <span className="live-dot"></span>
              <span className="live-text">LIVE</span>
            </div>

            {/* Camera info overlay */}
            <div className="cam-info-overlay">
              <div className="cam-name">{selectedCam.name}</div>
              <div className="cam-location">📍 {selectedCam.location}</div>
            </div>

            {/* Controls overlay */}
            <div className="cam-controls">
              <button className="cam-control-btn" title="Refresh">
                🔄
              </button>
              <button className="cam-control-btn" title="Fullscreen">
                ⛶
              </button>
              <button className="cam-control-btn" title="Screenshot">
                📷
              </button>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="cam-mobile-tabs">
            <button
              className={`cam-tab ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              📊 Stats
            </button>
            <button
              className={`cam-tab ${activeTab === "cameras" ? "active" : ""}`}
              onClick={() => setActiveTab("cameras")}
            >
              📹 Cameras
            </button>
          </div>

          {/* Camera stats */}
          <div className={`cam-stats ${activeTab === "stats" ? "active" : ""}`}>
            <div className="cam-stat">
              <span className="cam-stat-label">Quality</span>
              <span className="cam-stat-value">HD</span>
            </div>
            <div className="cam-stat">
              <span className="cam-stat-label">FPS</span>
              <span className="cam-stat-value">30</span>
            </div>
            <div className="cam-stat">
              <span className="cam-stat-label">Updated</span>
              <span className="cam-stat-value">Just now</span>
            </div>
            <div className="cam-stat">
              <span className="cam-stat-label">Viewers</span>
              <span className="cam-stat-value">127</span>
            </div>
          </div>
        </div>

        {/* Camera selection list */}
        <div
          className={`beach-cam-list ${
            activeTab === "cameras" ? "active" : ""
          }`}
        >
          <div className="cam-list-header">Available Cameras</div>

          {cameras.map((cam) => (
            <div
              key={cam.id}
              className={`cam-list-item ${
                selectedCam.id === cam.id ? "active" : ""
              }`}
              onClick={() => setSelectedCam(cam)}
            >
              <div className="cam-list-thumbnail">
                <img src={cam.thumbnail} alt={cam.name} />
                {cam.status === "live" && (
                  <div className="cam-list-live">
                    <span className="live-dot-small"></span>
                    LIVE
                  </div>
                )}
              </div>

              <div className="cam-list-info">
                <div className="cam-list-name">{cam.name}</div>
                <div className="cam-list-location">📍 {cam.location}</div>
              </div>

              <div className="cam-list-arrow">›</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeachCam;
