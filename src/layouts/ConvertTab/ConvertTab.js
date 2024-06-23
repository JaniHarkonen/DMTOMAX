import { useState } from "react";
import { FilesysDialogSettings, showOpenFile, showSaveFile } from "../../api/fileSystemDialog";
import FileTable from "../../components/FileTable/FileTable";
import { Entry } from "../../components/FileTableEntry/FileTableEntry";
import FixControls from "../../components/FixControls/FixControls";

export default function ConvertTab(props) {
  const [fileEntries, setFileEntries] = useState([
    Entry("C:/users/User/Desktop/motion.bvh", false),
    Entry("C:/users/User/Desktop/motion2.bvh", false)
  ]);

  const importFiles = () => {
    const settings = FilesysDialogSettings();
    settings.multiSelections = true;
    showOpenFile(settings, (response) => {
      if( !response.cancelled )
      setFileEntries(response.filePaths.map((file) => Entry(file, false)));
    });
  };

  const renderControls = (
    getAllEntries,
    getSelectedEntries
  ) => {
    return (
      <FixControls
        getAllEntries={getAllEntries}
        getSelectedEntries={getSelectedEntries}
        onImport={() => importFiles()}
        onFix={(entries) => { console.log("fixing..."); console.log(entries.map((entry) => entry)); console.log(process.cwd()) }}
        onRemove={(entries) => { console.log("removing from list..."); console.log(entries.map((entry) => entry)); }}
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
