import { useContext, useEffect, useState } from "react";
import { FilesysDialogSettings, showOpenDirectory } from "../../api/fileSystemDialog";
import FileTable from "../../components/FileTable/FileTable";
import FixControls from "../../components/FixControls/FixControls";
import { GlobalContext } from "../../context/GlobalContext";
import { doesPathExist } from "../../api/miscFS";
import "./ConvertTab.css";
import OutputPathWarning from "../../components/OutputPathWarning/OutputPathWarning";
import useMappings from "../../hooks/useMappings";
import { FIXER_STATUS } from "../../api/fixer";
import useFileEntries from "../../hooks/useFileEntries";

export function FixerStatus(status, title, timeElapsed = 0) {
  return {
    status,
    title,
    timeElapsed
  };
}

function fileEntriesToArray(entries) {
  const array = [];

  for( let key of Object.keys(entries) ) {
    array.push(entries[key]);
  }

  return array;
}

const FIXER_READY = FixerStatus(FIXER_STATUS.ready, "Ready!");

export default function ConvertTab() {
  const CONFIG_SUBSCRIPTION_ID = "convert-tab";
  const CONFIG_STORAGE_FILE_ENTRIES = "conversion-file-entries";
  const CONFIG_STORAGE_OUTPUT_PATH = "conversion-output-path";

  const { config } = useContext(GlobalContext);
  const [outputPath, setOutputPath] = useState("");
  const [pathExists, setPathExists] = useState(true);
  const [fixerStatus, setFixerStatus] = useState(FIXER_READY);

  const { mappings } = useMappings(CONFIG_SUBSCRIPTION_ID);

  const { fileEntries, updateFileEntries, updateFileEntryStatuses } = useFileEntries(CONFIG_STORAGE_FILE_ENTRIES);

  useEffect(() => {
    setOutputPath(config.getStored(CONFIG_STORAGE_OUTPUT_PATH, ""));
  }, []);

  const handleFix = (results, keyField, timeElapsed) => {
    updateFileEntryStatuses(
      results,
      keyField,
      () => {
        setFixerStatus(FixerStatus(
          FIXER_STATUS.failed, "Failed to convert all the files in red!", timeElapsed
        ))
      },
      () => {
        setFixerStatus(FixerStatus(
          FIXER_STATUS.successful, "Successfully converted all files!", timeElapsed
        ))
      }
    );
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

    updateFileEntries(filteredEntries);
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
        onImport={updateFileEntries}
        onFix={handleFix}
        onWait={() => setFixerStatus(FIXER_STATUS.fixing)}
        onRemove={handleRemoveFiles}
        outputPath={outputPath}
        mappings={mappings}
        canFix={pathExists}
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
        <OutputPathWarning hide={pathExists} />
      </div>
    </div>
  );
}
