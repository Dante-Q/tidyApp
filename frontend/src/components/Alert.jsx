import { useEffect } from "react";
import "./Alert.css";

export default function Alert({
  message,
  type = "error",
  onClose,
  duration = 5000,
}) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`custom-alert custom-alert-${type}`}>
      <div className="custom-alert-content">
        <span className="custom-alert-icon">
          {type === "error" && "⚠️"}
          {type === "success" && "✓"}
          {type === "info" && "ℹ️"}
          {type === "warning" && "⚠️"}
        </span>
        <span className="custom-alert-message">{message}</span>
      </div>
      {onClose && (
        <button
          className="custom-alert-close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
}
