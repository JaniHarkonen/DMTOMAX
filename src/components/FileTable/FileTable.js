import { useEffect, useState } from "react";
import FileTableEntry from "../FileTableEntry/FileTableEntry";

export const FileTableSelection = (index, isSelected) => {
  return {
    index,
    isSelected
  };
};

export default function FileTable(props) {
  const fileEntries = props.entries;
  const renderControls = props.controls;

  const [selections, setSelections] = useState({});

  useEffect(() => {
    const selectionMap = {};

    for( let i = 0; i < fileEntries.length; i++ )
    selectionMap[i] = false;

    setSelections(selectionMap);
  }, [fileEntries]);


  const isEntrySelected = (index) => {
    return selections[index];
  };

  const appendSelection = (selection) => {
    const newSelection = { ...selections };

    for( let entry of selection )
    newSelection[entry.index] = (entry.isSelected === undefined) ? !isEntrySelected(entry.index) : entry.isSelected;
  
    setSelections(newSelection);
  };

  const selectAll = () => {
    const newSelection = {};
    const newDeselection = {};
    let selectedCount = 0;

    for( let i = 0; i < fileEntries.length; i++ ) {
      if( selections[i] === true )
      selectedCount++;

      newSelection[i] = true;
      newDeselection[i] = false;
    }

    setSelections((selectedCount === fileEntries.length) ? newDeselection : newSelection);
  };

  const deselectAll = () => {
    const newSelection = {};

    for( let i = 0; i < fileEntries.length; i++ )
    newSelection[i] = false;

    setSelections(newSelection);
  }

  const areAllSelected = () => {
    for( let i = 0; i < fileEntries.length; i++ ) {
      if( selections[i] === false )
      return false;
    }
    return true;
  }

  const renderEntries = (entries) => {
    const entryElements = entries.map((entry, index) => {
      return (
        <FileTableEntry
          key={entry.filePath}
          isSelected={selections[index]}
          path={entry.filePath}
          onSelect={() => appendSelection([
            FileTableSelection(index)
          ])}
        />
      )
    });
    return (
      <>
        <input
          type="checkbox"
          checked={areAllSelected()}
          onChange={selectAll}
        />
        { entryElements }
      </>
    );
  };

  return (
    <div>
      { renderEntries(fileEntries) }
      {
        renderControls(
          () => fileEntries,
          () => fileEntries.filter((entry, index) => isEntrySelected(index)),
          () => fileEntries.filter((entry, index) => !isEntrySelected(index)),
          isEntrySelected,
          appendSelection,
          selectAll,
          deselectAll,
          areAllSelected
        )
      }
    </div>
  );
}
