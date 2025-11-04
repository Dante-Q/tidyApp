import { useState } from "react";
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

  // Predefined color palette - diverse range of distinct colors
  const colorPalette = [
    "#EF4444",
    "#F97316",
    "#FBBF24",
    "#FDE047",
    "#84CC16",
    "#22C55E",
    "#14B8A6",
    "#06B6D4",
    "#0EA5E9",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#A855F7",
    "#D946EF",
    "#EC4899",
    "#F43F5E",
    "#64748B",
    "#94A3B8",
    "#E2E8F0",
    "#CBD5E1",
    "#78716C",
    "#A8A29E",
    "#FCA5A5",
    "#FCD34D",
  ];

  const handleColorSelect = (color) => {
    onChange(color);
    setShowColorPicker(false);
  };

  return (
    <div className="color-picker-wrapper">
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
