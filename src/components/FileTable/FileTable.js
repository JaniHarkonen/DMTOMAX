import { useEffect, useState } from "react";
import FileTableEntry from "../FileTableEntry/FileTableEntry";

export default function FileTable(props) {
  const fileEntries = props.entries || [];

  const [selections, setSelections] = useState({});

  useEffect(() => {
    const selectionMap = {};

    for( let i = 0; i < fileEntries.length; i++ )
    selectionMap[i] = false;

    setSelections(selectionMap);
  }, [fileEntries]);

  const renderEntries = (entries) => {
    return entries.map((entry, index) => {
      return (
        <FileTableEntry
          key={entry.filePath}
          isSelected={selections[index]}
          path={entry.filePath}
          onSelect={() => setSelections({
            ...selections,
            [index]: !selections[index]
          })}
        />
      )
    });
  };

  return (
    <div>
      { renderEntries(fileEntries) }
    </div>
  );
}
