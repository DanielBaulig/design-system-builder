import ColorInput from './ColorInput';

type Color = React.ComponentProps<typeof ColorInput>['color'];

export default function ColorRange({colors, onUpdateColorRange}: { colors: Color[], onUpdateColorRange: (range: Color[]) => void }) {
  return (<>
    {colors.map((c, i) => <ColorInput
      key={i}
      color={c}
      onRemoveColor={() => {
        onUpdateColorRange(colors.slice(0, i).concat(colors.slice(i+1)));
      }}
      onUpdateColor={(c) => {
        onUpdateColorRange(colors.slice(0, i).concat([c], colors.slice(i+1)));
      }}
    />)}
  </>);
}
