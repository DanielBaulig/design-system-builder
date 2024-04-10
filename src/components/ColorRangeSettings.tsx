export default function ColorRangeSettings({onAddColor}: { onAddColor: () => void }) {
  return (
    <button onClick={onAddColor}>+</button>
  );
}
