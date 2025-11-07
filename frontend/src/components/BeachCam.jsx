import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { getAllCameras } from "../config/beachCameras.js";
import "./BeachCam.css";

const BeachCam = () => {
  const [cameras] = useState(getAllCameras());
  const [selectedCam, setSelectedCam] = useState(cameras[0]);
  const [activeTab, setActiveTab] = useState("cameras"); // 'cameras' or 'stats'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Handle video stream loading
  useEffect(() => {
    if (!selectedCam || !videoRef.current) return;

    setIsLoading(true);
    setError(null);

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const video = videoRef.current;

    if (selectedCam.type === "hls" && selectedCam.streamUrl) {
      // Check if HLS is supported
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hlsRef.current = hls;

        hls.loadSource(selectedCam.streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().catch((e) => {
            console.error("Autoplay failed:", e);
            setError("Click to play video");
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
          if (data.fatal) {
            setError("Failed to load video stream");
            setIsLoading(false);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.src = selectedCam.streamUrl;
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false);
          video.play().catch((e) => {
            console.error("Autoplay failed:", e);
            setError("Click to play video");
          });
        });
        video.addEventListener("error", () => {
          setError("Failed to load video stream");
          setIsLoading(false);
        });
      } else {
        setError("HLS not supported in this browser");
        setIsLoading(false);
      }
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [selectedCam]);

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
            {/* Video player for HLS streams */}
            <video
              ref={videoRef}
              className="cam-video"
              autoPlay
              muted
              playsInline
              controls
            />

            {/* Loading indicator */}
            {isLoading && (
              <div className="cam-loading">
                <div className="loading-spinner"></div>
                <p>Loading stream...</p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="cam-error">
                <p>⚠️ {error}</p>
              </div>
            )}

            {/* Live indicator */}
            {!error && (
              <div className="cam-live-indicator">
                <span className="live-dot"></span>
                <span className="live-text">LIVE</span>
              </div>
            )}

            {/* Camera info overlay */}
            <div className="cam-info-overlay">
              <div className="cam-name">{selectedCam.name}</div>
              <div className="cam-location">📍 {selectedCam.location}</div>
            </div>

            {/* Controls overlay */}
            <div className="cam-controls">
              <button
                className="cam-control-btn"
                title="Refresh"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play();
                  }
                }}
              >
                🔄
              </button>
              <button
                className="cam-control-btn"
                title="Fullscreen"
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    } else if (videoRef.current.webkitRequestFullscreen) {
                      videoRef.current.webkitRequestFullscreen();
                    }
                  }
                }}
              >
                ⛶
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
              <span className="cam-stat-value">
                {selectedCam.quality || "HD"}
              </span>
            </div>
            <div className="cam-stat">
              <span className="cam-stat-label">Status</span>
              <span className="cam-stat-value">
                {selectedCam.status === "live" ? "🟢 Live" : "🔴 Offline"}
              </span>
            </div>
            <div className="cam-stat">
              <span className="cam-stat-label">Beach</span>
              <span className="cam-stat-value">
                {selectedCam.beach.charAt(0).toUpperCase() +
                  selectedCam.beach.slice(1)}
              </span>
            </div>
            <div className="cam-stat">
              <span className="cam-stat-label">Type</span>
              <span className="cam-stat-value">
                {selectedCam.type.toUpperCase()}
              </span>
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
              <div className="cam-list-info">
                <div className="cam-list-name">{cam.name}</div>
                <div className="cam-list-location">📍 {cam.location}</div>
                {cam.status === "live" && (
                  <div className="cam-list-live">
                    <span className="live-dot-small"></span>
                    LIVE
                  </div>
                )}
              </div>

              <div className="cam-list-arrow">›</div>
            </div>
          ))}

          {cameras.length === 0 && (
            <div className="cam-list-empty">
              <p>No cameras available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeachCam;
