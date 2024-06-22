import FileTable from "../../components/FileTable/FileTable";
import { Entry } from "../../components/FileTableEntry/FileTableEntry";

export default function ConvertTab(props) {
  return(
    <div>
      <h2>
        Choose the files that are to be fixed
      </h2>
      <FileTable
        entries={[Entry("C:/users/User/Desktop/motion.bvh", false)]}
      />
    </div>
  );
}
