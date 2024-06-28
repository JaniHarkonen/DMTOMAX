import { FilesysDialogSettings, showOpenFile } from "../../api/fileSystemDialog";
import { fixFiles, mappingsToMappingsTable } from "../../api/fixer";
import { ENTRY_STATUS, Entry } from "../FileTableEntry/FileTableEntry";
import "./FixControls.css";

export default function FixControls(props) {
  const getAllEntries = props.getAllEntries || function() { return [] };
  const getSelectedEntries = props.getSelectedEntries || function() { return [] };

  const onImport = props.onImport || function() { };
  const onFix = props.onFix || function(results) { };
  const canFix = props.canFix || false;
  const onWait = props.onWait || function() { };
  const onRemove = props.onRemove || function(entries) { };

  const outputPath = props.outputPath || "";
  const mappings = props.mappings || {};

  const handleImportFiles = () => {
    const settings = FilesysDialogSettings();
    settings.multiSelections = true;

    showOpenFile(settings, (response) => {
      if( !response.canceled )
      onImport(response.filePaths.map((file) => Entry(file, false, ENTRY_STATUS.unfixed)));
    });
  };

  const handleFixFiles = (entries) => {
    if( entries.length === 0 || !canFix ) {
      return;
    }

    const promises = fixFiles(
      entries.map((entry) => entry.filePath),
      outputPath,
      mappingsToMappingsTable(mappings)
    );

    const time = performance.now();
    Promise.all(promises)
    .then(
      (results) => onFix(results, "filePath", performance.now() - time)
    );

    onWait();
  };

  return (
    <div>
      <button onClick={() => handleImportFiles()}>Import files</button>
      <button
        className="fix-controls-approval-button"
        onClick={() => handleFixFiles(getSelectedEntries())}
      >
        Convert selected
      </button>
      <button
        className="fix-controls-approval-button"
        onClick={() => handleFixFiles(getAllEntries())}
      >
        Convert all
      </button>
      <button
        className="fix-controls-reject-button"
        onClick={() => onRemove(getSelectedEntries())}
      >
        Remove selected
      </button>
      <button
        className="fix-controls-reject-button"
        onClick={() => onRemove(getAllEntries())}
      >
        Remove all
      </button>
    </div>
  );
}
