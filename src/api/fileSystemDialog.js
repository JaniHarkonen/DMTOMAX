const ipcRenderer = window.require("electron").ipcRenderer;

export const FilesysDialogSettings = (dontAddToRecent = true) => {
  return {
    title: "",
    buttonLabel: "",
    filters: "",
    properties: dontAddToRecent ? ["dontAddToRecent"] : [],
    multiSelections: true
  };
};

const invokeDialog = (settings, callback, dialogType, openType) => {
  ipcRenderer.invoke(
    dialogType, {
      ...settings,
      properties: settings.properties.concat(openType)
    }
  ).then((response) => callback(response));
};

export const showOpenFile = (settings, callback) => {
  invokeDialog({
      ...settings,
      properties: settings.properties.concat(settings.multiSelections && "multiSelections")
    }, 
    callback, 
    "open-filesys-dialog", 
    "openFile"
  );
};

export const showSaveFile = (settings, callback) =>  {
  invokeDialog(settings, callback, "save-filesys-dialog", "openFile");
};

export const showOpenDirectory = (settings, callback) => {
  invokeDialog(settings, callback, "open-filesys-dialog", "openFolder");
};
