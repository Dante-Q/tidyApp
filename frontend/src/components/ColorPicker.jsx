import { useState, useEffect, useRef } from "react";
import "./ColorPicker.css";

/**
 * ColorPicker component for selecting avatar colors
 * @param {Object} props
 * @param {string} props.value - Current color value (hex format)
 * @param {Function} props.onChange - Callback when color changes
 * @param {string} props.userName - User's display name for preview
 */
export default function ColorPicker({ value, onChange, userName }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  // Predefined color palette - diverse range of distinct colors
  const colorPalette = [
    // Primary Colors
    "#EF4444",
    "#F87171",
    "#FCA5A5",
    "#FB923C",
    "#FDBA74",
    "#FACC15",
    "#FDE047",
    // Secondary Colors (Green-Cyan spectrum)
    "#16A34A",
    "#22C55E",
    "#4ADE80",
    "#86EFAC",
    "#0D9488",
    "#14B8A6",
    "#2DD4BF",
    "#5EEAD4",
    "#0284C7",
    "#0EA5E9",
    "#38BDF8",
    "#7DD3FC",
    // Secondary Colors (Blue-Purple-Pink spectrum)
    "#2563EB",
    "#3B82F6",
    "#60A5FA",
    "#93C5FD",
    "#7C3AED",
    "#8B5CF6",
    "#A78BFA",
    "#C4B5FD",
    "#C026D3",
    "#D946EF",
    "#E879F9",
    "#F0ABFC",
    "#DB2777",
    "#EC4899",
    "#F472B6",
    "#F9A8D4",
  ];

  const handleColorSelect = (color) => {
    onChange(color);
    setShowColorPicker(false);
  };

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  return (
    <div className="color-picker-wrapper" ref={colorPickerRef}>
      <div className="color-picker-controls">
        <div
          className="color-input-button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{ backgroundColor: value }}
        >
          <span className="color-input-icon">🎨</span>
        </div>
        <div className="color-preview" style={{ backgroundColor: value }}>
          <span className="preview-initial">
            {userName?.replace("👑 ", "").charAt(0).toUpperCase()}
          </span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="#6DD5ED"
          pattern="^#[0-9A-Fa-f]{6}$"
          className="color-text-input"
        />
      </div>

      {/* Custom Color Picker Popup */}
      {showColorPicker && (
        <div className="custom-color-picker">
          <div className="color-picker-header">
            <span>Choose a color</span>
            <button
              type="button"
              className="color-picker-close"
              onClick={() => setShowColorPicker(false)}
            >
              ✕
            </button>
          </div>
          <div className="color-palette-grid">
            {colorPalette.map((color) => (
              <div
                key={color}
                className={`color-swatch ${
                  value.toUpperCase() === color ? "selected" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              >
                {value.toUpperCase() === color && (
                  <span className="checkmark">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
