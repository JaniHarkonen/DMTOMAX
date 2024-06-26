import { useContext, useEffect, useState } from "react";
import { FilesysDialogSettings, showOpenDirectory, showOpenFile } from "../../api/fileSystemDialog";
import FileTable from "../../components/FileTable/FileTable";
import { Entry } from "../../components/FileTableEntry/FileTableEntry";
import FixControls from "../../components/FixControls/FixControls";
import { fixFiles } from "../../api/fixer";
import { GlobalContext } from "../../context/GlobalContext";
import { DEFAULT_CONFIGURATION_SCHEMA } from "../../api/configuration";
import "./ConvertTab.css";

const CONFIG_SUBSCRIPTION_ID = "convert-tab";

export default function ConvertTab(props) {
  const [fileEntries, setFileEntries] = useState([]);
  const [mappings, setMappings] = useState(DEFAULT_CONFIGURATION_SCHEMA);
  const [outputPath, setOutputPath] = useState(null);
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
      outputPath,
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

  const handleOutputSelection = () => {
    showOpenDirectory(FilesysDialogSettings(), (result) => {
      if( result.canceled )
      return;

      setOutputPath(result.filePaths[0]);
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
        onImport={handleImportFiles}
        onFix={handleFixFiles}
        onRemove={handleRemoveFiles}
      />
    );
  };

  const renderPlaceholder = () => {
    return(
      <div>
        Start by importing the files you want to fix...
      </div>
    );
  }

  return(
    <div>
      <h2>
        Convert files
      </h2>
      <h4>Sources:</h4>
      {
        <FileTable
          entries={fileEntries}
          controls={renderControls}
          placeholder={renderPlaceholder}
        />
      }
      <h4>Output folder:</h4>
      <p>
        Leave blank to save the fixes in the same folders as the sources.
      </p>
      <input
        value={outputPath}
        onChange={(e) => setOutputPath(e.target.value)}
      />
      <button
        className="browse-filesys-button"
        onClick={handleOutputSelection}
      >
        {"..."}
      </button>
    </div>
  );
}
