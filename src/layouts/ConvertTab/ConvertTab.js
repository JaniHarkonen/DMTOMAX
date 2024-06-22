import FileTable from "../../components/FileTable/FileTable";
import { Entry } from "../../components/FileTableEntry/FileTableEntry";
import FixControls from "../../components/FixControls/FixControls";

export default function ConvertTab(props) {
  const renderControls = (
    getAllEntries,
    getSelectedEntries
  ) => {
    return (
      <FixControls
        getAllEntries={getAllEntries}
        getSelectedEntries={getSelectedEntries}
        onFix={(entries) => { console.log("fixing..."); console.log(entries.map((entry) => entry)); }}
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
        entries={[
          Entry("C:/users/User/Desktop/motion.bvh", false),
          Entry("C:/users/User/Desktop/motion2.bvh", false)
        ]}
        controls={renderControls}
      />
      <h4>Output folder:</h4>
      <p>
        Leave blank to save the fixes in the same folders as the sources.
      </p>
      <button>...</button><input />
    </div>
  );
}
