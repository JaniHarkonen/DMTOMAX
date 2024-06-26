import "./FixControls.css";

export default function FixControls(props) {
  const getAllEntries = props.getAllEntries || function() { return [] };
  const getSelectedEntries = props.getSelectedEntries || function() { return [] };

  const onImport = props.onImport || function() { };
  const onFix = props.onFix || function(entries) { };
  const onRemove = props.onRemove || function(entries) { };

  return (
    <div>
      <button onClick={() => onImport()}>Import files</button>
      <button
        className="fix-controls-approval-button"
        onClick={() => onFix(getSelectedEntries())}
      >
        Convert selected
      </button>
      <button
        className="fix-controls-approval-button"
        onClick={() => onFix(getAllEntries())}
      >
        Convert all
      </button>
      <button
        className="fix-controls-reject-button"
        onClick={() => onRemove(getSelectedEntries())}
      >
        Remove selected
      </button>
      <button
        className="fix-controls-reject-button"
        onClick={() => onRemove(getAllEntries())}
      >
        Remove all
      </button>
    </div>
  );
}
