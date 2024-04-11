import { useContext } from 'react';
import ColorRange from './ColorRange';
import ColorRangeSettings from './ColorRangeSettings';
import DefaultColorContext from '../DefaultColorContext';
import './ColorSystem.css';
import { white } from '../colors';

type Colors = React.ComponentProps<typeof ColorRange>['colors'];

const defaultAccentColors = 9;

function ColorSystemRow({label, colors, onUpdateColorRange, onRemove}: {label: string, colors: Colors, onUpdateColorRange: (colors: Colors) => void, onRemove?: () => void}) {
  const defaultColor = useContext(DefaultColorContext);

  return (
    <div className="colorSystemRow">
      <div>
        {onRemove && (<button className={"colorSystemRow__removeRowButton"} onClick={onRemove}>-</button>)}
        <h4>{label}</h4>
      </div>
      <div className="colorRange">
        <ColorRange colors={colors} onUpdateColorRange={onUpdateColorRange} />
      </div>
      <div className="colorRangeSettings">
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
    accents: {
      [key: string]: Colors,
    },
  },
  onUpdateColorSystem: (colors: ColorSystemProps['colors']) => void,
};

export default function ColorSystem({colors, onUpdateColorSystem}: ColorSystemProps) {
  function addAccent() {
    const accentName = window.prompt('Accent name?');
    if (!accentName) {
      return;
    }
    onUpdateColorSystem({
      ...colors,
      accents: Object.assign(
        {[accentName]: Array(defaultAccentColors).fill(white)},
        colors.accents,
      )
    });
  }

  return (
    <div className="colorSystem">
      <h3>Main Colors</h3>
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
      <h3>Accent Colors</h3>
      {Object.entries(colors.accents).map(([key, value], i) => (
        <ColorSystemRow
          key={key}
          label={key}
          colors={value}
          onUpdateColorRange={(range) => onUpdateColorSystem({
            ...colors,
            accents: { ...colors.accents, [key]: range },
          })}
          onRemove={() => {
            const accents = Object.assign({}, colors.accents);
            delete accents[key];
            onUpdateColorSystem({
              ...colors,
              accents,
            })
          }}
        />
      ))}
      <div className={"colorSystem__accentColorControls"}>
        <button onClick={addAccent}>Add Accent Color</button>
      </div>
    </div>
  );
}
