import { colorToHsl, colorToHex, hexToColor } from '../colors';
import './ColorInput.css';
import type { Color } from '../colors';

export default function ColorInput({color, onUpdateColor, onRemoveColor}: {color: Color, onUpdateColor: (color: Color) => void, onRemoveColor: () => void }) {
  const hsl = colorToHsl(color);
  const hex = colorToHex(color);
  return (
    <div style={{backgroundColor: hsl}} className="colorInput">
      <input
        className="colorInput__input"
        type="color"
        value={hex}
         onChange={(e) => onUpdateColor(hexToColor(e.target.value))}
      />
      <button className="colorInput__remove" onClick={onRemoveColor}>x</button>
    </div>
  );
}
