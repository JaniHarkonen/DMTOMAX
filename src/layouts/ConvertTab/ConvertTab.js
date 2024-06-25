import { useContext, useEffect, useState } from "react";
import { FilesysDialogSettings, showOpenFile } from "../../api/fileSystemDialog";
import FileTable from "../../components/FileTable/FileTable";
import { Entry } from "../../components/FileTableEntry/FileTableEntry";
import FixControls from "../../components/FixControls/FixControls";
import { fixFiles } from "../../api/fixer";
import { GlobalContext } from "../../context/GlobalContext";
import { DEFAULT_CONFIGURATION_SCHEMA } from "../../api/configuration";

const CONFIG_SUBSCRIPTION_ID = "convert-tab";

export default function ConvertTab(props) {
  const [fileEntries, setFileEntries] = useState([]);
  const [mappings, setMappings] = useState(DEFAULT_CONFIGURATION_SCHEMA);
  const { config } = useContext(GlobalContext);

  useEffect(() => {
    config.subscribe(CONFIG_SUBSCRIPTION_ID, (data) => setMappings(data.configuration.mappings));
    return () => config.unsubscribe(CONFIG_SUBSCRIPTION_ID);
  }, []);

  const handleImportFiles = () => {
    const settings = FilesysDialogSettings();
    settings.multiSelections = true;
    showOpenFile(settings, (response) => {
      if( !response.canceled )
      setFileEntries(response.filePaths.map((file) => Entry(file, false)));
    });
  };

  const handleFixFiles = (entries) => {
    if( entries.length == 0 )
    return;

    const promises = fixFiles(
      entries.map((entry) => entry.filePath),
      "C:\\Users\\User\\Desktop\\DUMP\\",
      mappings
    );
    console.log(promises);
    Promise.all([...promises]).then((value) => console.log(value));
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
