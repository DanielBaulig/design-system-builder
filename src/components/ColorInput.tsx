import { colorToHex, hexToColor } from '../colors';
import './ColorInput.css';
import type { Color } from '../colors';

export default function ColorInput({color, onUpdateColor}: {color: Color, onUpdateColor: (color: Color) => void }) {
  const hex = colorToHex(color);
  return (
    <div style={{backgroundColor: hex}} className="colorInput">
      <input
        className="colorInput__input"
        type="color"
        value={hex}
         onChange={(e) => onUpdateColor(hexToColor(e.target.value))}
      />
    </div>
  );
}
