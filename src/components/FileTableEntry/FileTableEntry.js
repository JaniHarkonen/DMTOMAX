export const Entry = (filePath, isSelected) => {
  return {
    filePath,
    isSelected
  };
};

export default function FileTableEntry(props) {
  const filePath = props.path || "";
  const isSelected = props.isSelected || false;
  const onSelect = props.onSelect || function() { };

  return (
    <div className="file-table-entry">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
      />
      {filePath}
    </div>
  );
}
