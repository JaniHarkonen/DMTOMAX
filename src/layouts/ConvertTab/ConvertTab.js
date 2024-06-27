import { useContext, useEffect, useState } from "react";
import { FilesysDialogSettings, showOpenDirectory, showOpenFile } from "../../api/fileSystemDialog";
import FileTable from "../../components/FileTable/FileTable";
import { ENTRY_STATUS, Entry } from "../../components/FileTableEntry/FileTableEntry";
import FixControls from "../../components/FixControls/FixControls";
import { fixFiles } from "../../api/fixer";
import { GlobalContext } from "../../context/GlobalContext";
import { DEFAULT_CONFIGURATION_SCHEMA } from "../../api/configuration";
import { doesPathExist } from "../../api/miscFS";
import imgWarning from "../../assets/exclamation-triangle-icon.svg"
import "./ConvertTab.css";

const FIXER_STATUS = {
  ready: "ready",
  fixing: "fixing",
  successful: "successful",
  failed: "failed",
};

export function FixerStatus(status, title, timeElapsed = 0) {
  return {
    status,
    title,
    timeElapsed
  };
}

const FIXER_READY = FixerStatus(FIXER_STATUS.ready, "Ready!");

const CONFIG_SUBSCRIPTION_ID = "convert-tab";
const CONFIG_STORAGE_FILE_ENTRIES = "conversion-file-entries";
const CONFIG_STORAGE_OUTPUT_PATH = "conversion-output-path";

export default function ConvertTab() {
  const { config } = useContext(GlobalContext);
  const [fileEntries, setFileEntries] = useState({});
  const [mappings, setMappings] = useState(DEFAULT_CONFIGURATION_SCHEMA);
  const [outputPath, setOutputPath] = useState("");
  const [pathExists, setPathExists] = useState(true);
  const [fixerStatus, setFixerStatus] = useState(FIXER_READY);

  useEffect(() => {
    config.subscribe(CONFIG_SUBSCRIPTION_ID, (data) => setMappings(data.configuration.mappings));
    setFileEntries(config.getStored(CONFIG_STORAGE_FILE_ENTRIES, {}));
    setOutputPath(config.getStored(CONFIG_STORAGE_OUTPUT_PATH, ""));
    return () => config.unsubscribe(CONFIG_SUBSCRIPTION_ID);
  }, []);

  const updateFileEntries = (entries) => {
    config.store(CONFIG_STORAGE_FILE_ENTRIES, entries);
  }

  const handleFileEntries = (entries) => {
    const newEntries = {};

    for( let entry of entries ) {
      newEntries[entry.filePath] = entry;
    }

    updateFileEntries(newEntries);
    setFileEntries(newEntries);
  };

    // We use keyfield to determine the key fieldname in order to make this 
    // function a bit more versatile in case it's used by something other than
    // the fixer callbacks
  const updateFileEntryStatuses = (results, keyField, timeElapsed) => {
    let oneFailed = false;
    const newEntries = { ...fileEntries };

    for( let result of results ) {
      if( !result.wasSuccessful )
      oneFailed = true;

      newEntries[result[keyField]] = {
        ...fileEntries[result[keyField]],
        status: result.wasSuccessful ? ENTRY_STATUS.fixed : ENTRY_STATUS.failed
      };
    }

    updateFileEntries(newEntries);
    setFileEntries(newEntries);

    if( oneFailed )
    setFixerStatus(FixerStatus(FIXER_STATUS.failed, "Failed to convert all the files in red!", timeElapsed));
    else
    setFixerStatus(FixerStatus(FIXER_STATUS.successful, "Successfully converted all files!", timeElapsed));
  }

  const handleImportFiles = () => {
    const settings = FilesysDialogSettings();
    settings.multiSelections = true;

    showOpenFile(settings, (response) => {
      if( !response.canceled )
      handleFileEntries(response.filePaths.map((file) => Entry(file, false, ENTRY_STATUS.unfixed)));
    });
  };

  const handleFixFiles = (entries) => {
    if( entries.length == 0 || !pathExists ) {
      return;
    }

    const promises = fixFiles(
      entries.map((entry) => entry.filePath),
      outputPath,
      mappings
    );

    const time = performance.now();
    Promise.all(promises)
    .then(
      (results) => updateFileEntryStatuses(results, "filePath", performance.now() - time)
    );

    setFixerStatus(FIXER_STATUS.fixing);
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

    handleFileEntries(filteredEntries);
  };

  const handleOutputSelection = () => {
    showOpenDirectory(FilesysDialogSettings(), (result) => {
      if( result.canceled )
      return;

      updateOutputPath(result.filePaths[0]);
    });
  };

  const updateOutputPath = (path) => {
    if( path !== "" )
    doesPathExist(path).then((result) => setPathExists(result));
    else
    setPathExists(true);

    config.store(CONFIG_STORAGE_OUTPUT_PATH, path);
    setOutputPath(path);
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
      <div className="file-table-placeholder">
        Start by importing the files you want to convert...
      </div>
    );
  };

  const renderOutputPathWarning = () => {
    if( pathExists )
    return <><p></p></>;

    return (
      <div className="d-flex d-align-items-center">
        <img
          className="warning-icon"
          src={imgWarning}
        />
        Warning! Output directory doesn't exist.
      </div>
    );
  };

  const fileEntriesToArray = (entries) => {
    const array = [];

    for( let key of Object.keys(entries) ) {
      array.push(entries[key]);
    }

    return array;
  }

  return (
    <div>
      <h2>Convert files</h2>
      <div>
        <h4>Sources:</h4>
        {
          <FileTable
            entries={fileEntriesToArray(fileEntries)}
            controls={renderControls}
            placeholder={renderPlaceholder}
          />
        }
      </div>
      <div>
        <strong>Status: </strong>{fixerStatus.title + " Time elapsed: " + fixerStatus.timeElapsed + "ms"}
        <h4>Output folder:</h4>
        <p>
          Leave blank to save the fixes in the same folders as the sources.
        </p>
        <input
          value={outputPath}
          onChange={(e) => updateOutputPath(e.target.value)}
        />
        <button
          className="browse-filesys-button"
          onClick={handleOutputSelection}
        >
          {"..."}
        </button>
        { renderOutputPathWarning() }
      </div>
    </div>
  );
}
