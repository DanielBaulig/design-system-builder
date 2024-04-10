import { useContext } from 'react';
import ColorRange from './ColorRange';
import ColorRangeSettings from './ColorRangeSettings';
import DefaultColorContext from '../DefaultColorContext';
import './ColorSystem.css';

type Colors = React.ComponentProps<typeof ColorRange>['colors'];

function ColorSystemRow({label, colors, onUpdateColorRange}: {label: string, colors: Colors, onUpdateColorRange: (colors: Colors) => void}) {
  const defaultColor = useContext(DefaultColorContext);

  return (
    <div className="colorSystemRow">
      <h4>{label}</h4>
      <div>
        <ColorRange colors={colors} onUpdateColorRange={onUpdateColorRange} />
      </div>
      <div>
       <ColorRangeSettings
         onAddColor={() => onUpdateColorRange(colors.concat([defaultColor]))}
       />
      </div>
    </div>
  );
}

type ColorSystemProps = {
  colors: {
    primary: Colors,
    neutral: Colors,
    accents: Colors[],
  },
  onUpdateColorSystem: (colors: ColorSystemProps['colors']) => void,
};

export default function ColorSystem({colors, onUpdateColorSystem}: ColorSystemProps) {
  return (
    <div>
      <h3>Colors</h3>
      <ColorSystemRow
       label="Primary"
       colors={colors.primary}
       onUpdateColorRange={(range) => onUpdateColorSystem({ ...colors, primary: range })}
      />
      <ColorSystemRow
        label="Neutral"
        colors={colors.neutral}
        onUpdateColorRange={(range) => onUpdateColorSystem({ ...colors, neutral: range })}
      />
    </div>
  );
}
