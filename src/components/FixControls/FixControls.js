export default function FixControls(props) {
  const getAllEntries = props.getAllEntries || function() { return [] };
  const getSelectedEntries = props.getSelectedEntries || function() { return [] };

  const onImport = props.onImport || function() { };
  const onFix = props.onFix || function(entries) { };
  const onRemove = props.onRemove || function(entries) { };

  return (
    <div>
      <button onClick={() => onRemove(getSelectedEntries())}>Remove selected</button>
      <button onClick={() => onRemove(getAllEntries())}>Remove all</button>
      <button onClick={() => onFix(getSelectedEntries())}>Fix selected</button>
      <button onClick={() => onFix(getAllEntries())}>Fix all</button>
      <button onClick={() => onImport()}>Import files</button>
    </div>
  );
}
