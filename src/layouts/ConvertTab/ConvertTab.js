import { useContext, useEffect, useState } from "react";
import { FilesysDialogSettings, showOpenDirectory, showOpenFile } from "../../api/fileSystemDialog";
import FileTable from "../../components/FileTable/FileTable";
import { Entry } from "../../components/FileTableEntry/FileTableEntry";
import FixControls from "../../components/FixControls/FixControls";
import { fixFiles } from "../../api/fixer";
import { GlobalContext } from "../../context/GlobalContext";
import { DEFAULT_CONFIGURATION_SCHEMA } from "../../api/configuration";
import { doesPathExist } from "../../api/miscFS";
import "./ConvertTab.css";
import imgWarning from "../../assets/exclamation-triangle-icon.svg";

const CONFIG_SUBSCRIPTION_ID = "convert-tab";

export default function ConvertTab(props) {
  const [fileEntries, setFileEntries] = useState([]);
  const [mappings, setMappings] = useState(DEFAULT_CONFIGURATION_SCHEMA);
  const [outputPath, setOutputPath] = useState("");
  const [pathExists, setPathExists] = useState(true);
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
    if( entries.length == 0 || !pathExists ) {
      return;
    }

    const promises = fixFiles(
      entries.map((entry) => entry.filePath),
      outputPath,
      mappings
    );
    console.log(promises);
    //Promise.all([...promises]).then((value) => console.log(value));
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

      updateOutputPath(result.filePaths[0]);
    });
  };

  const updateOutputPath = (path) => {
    if( path !== "" )
    doesPathExist().then((result) => setPathExists(result));
    else
    setPathExists(true);

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
      <div>
        Start by importing the files you want to fix...
      </div>
    );
  }

  const renderOutputPathWarning = () => {
    if( pathExists )
    return <></>;

    return (
      <div className="d-flex d-align-items-center">
        <img
          className="warning-icon"
          src={imgWarning}
        />
        Warning! Output directory doesn't exist.
      </div>
    )
  };

  return(
    <div>
      <h2>
        Convert files
      </h2>
      <div>
        <h4>Sources:</h4>
        {
          <FileTable
            entries={fileEntries}
            controls={renderControls}
            placeholder={renderPlaceholder}
          />
        }
      </div>
      <div>
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
      <div>
        <h4>Results:</h4>
        
      </div>
    </div>
  );
}
