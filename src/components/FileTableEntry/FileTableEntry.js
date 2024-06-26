import "./FileTableEntry.css";

export const ENTRY_STATUS = {
  unfixed: "unfixed",
  fixed: "fixed",
  failed: "failed"
};

export function Entry(filePath, isSelected, status) {
  return {
    filePath,
    isSelected,
    status
  };
};

export default function FileTableEntry(props) {
  const filePath = props.path || "";
  const status = props.status || ENTRY_STATUS.unfixed;
  const isSelected = props.isSelected || false;
  const onSelect = props.onSelect || function() { };

  let containerClassName = "";

  switch( status ) {
    case ENTRY_STATUS.fixed: containerClassName += " file-table-entry-fixed"; break;
    case ENTRY_STATUS.failed: containerClassName += " file-table-entry-failed"; break;
    default: break;
  }

  return (
    <div className={containerClassName}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
      />
      {filePath}
    </div>
  );
}
