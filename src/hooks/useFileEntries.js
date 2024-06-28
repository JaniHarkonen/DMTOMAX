import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { ENTRY_STATUS } from "../components/FileTableEntry/FileTableEntry";

export default function useFileEntries(configStorageFileEntries) {
  const { config } = useContext(GlobalContext);
  const [fileEntries, setFileEntries] = useState({});

  useEffect(() => {
    setFileEntries(config.getStored(configStorageFileEntries, {}));
  }, [config]);

  const updateFileEntries = (entries) => {
    const newEntries = {};

    for( let entry of entries ) {
      newEntries[entry.filePath] = entry;
    }

    config.store(configStorageFileEntries, newEntries);
    setFileEntries(newEntries);
  };

  const updateFileEntryStatuses = (results, keyField, failed, successful) => {
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

    config.store(configStorageFileEntries, newEntries);
    setFileEntries(newEntries);

    if( oneFailed )
    failed();
    else
    successful();
  };

  return {
    fileEntries,
    updateFileEntries,
    updateFileEntryStatuses
  };
}
