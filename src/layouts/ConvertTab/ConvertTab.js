import { useState } from "react";
import { FilesysDialogSettings, showOpenFile } from "../../api/fileSystemDialog";
import FileTable from "../../components/FileTable/FileTable";
import { Entry } from "../../components/FileTableEntry/FileTableEntry";
import FixControls from "../../components/FixControls/FixControls";
import fixFiles from "../../service/fixFiles";

export default function ConvertTab(props) {
  const [fileEntries, setFileEntries] = useState([]);

  const handleImportFiles = () => {
    const settings = FilesysDialogSettings();
    settings.multiSelections = true;
    showOpenFile(settings, (response) => {
      if( !response.canceled )
      setFileEntries(response.filePaths.map((file) => Entry(file, false)));
    });
  };

  const handleFixFiles = (entries) => {
    fixFiles(entries.map((entry) => entry.filePath));
  };

  const handleRemoveFiles = (entries) => {
    const filteredEntries = [];
    let removePointer = 0;
    let currentPointer = 0;

    while( currentPointer < fileEntries.length ) {
      if( fileEntries[currentPointer] === entries[removePointer] )
      removePointer++;
      else
      filteredEntries.push(fileEntries[currentPointer]);

      currentPointer++;
    }

    setFileEntries(filteredEntries);
  };

  const renderControls = (
    getAllEntries,
    getSelectedEntries
  ) => {
    return (
      <FixControls
        getAllEntries={getAllEntries}
        getSelectedEntries={getSelectedEntries}
        onImport={handleImportFiles}
        //onFix={(entries) => { console.log("fixing..."); console.log(entries.map((entry) => entry)); console.log(process.cwd()) }}
        onFix={handleFixFiles}
        onRemove={handleRemoveFiles}
      />
    );
  };

  return(
    <div>
      <h2>
        Choose DM files
      </h2>
      <h4>Sources:</h4>
      <FileTable
        entries={fileEntries}
        controls={renderControls}
      />
      <h4>Output folder:</h4>
      <p>
        Leave blank to save the fixes in the same folders as the sources.
      </p>
      <button onClick={() => showOpenFile(FilesysDialogSettings(), (result) => console.log(result))}>...</button><input />
    </div>
  );
}
