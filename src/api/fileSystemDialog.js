const ipcRenderer = window.require("electron").ipcRenderer;

export function FilesysDialogSettings(dontAddToRecent = true) {
  return {
    title: "",
    buttonLabel: "",
    filters: "",
    properties: dontAddToRecent ? ["dontAddToRecent"] : [],
    multiSelections: true
  };
};

function invokeDialog(settings, callback, dialogType, openType) {
  ipcRenderer.invoke(
    dialogType, {
      ...settings,
      properties: settings.properties.concat(openType)
    }
  ).then((response) => callback(response));
};

export function showOpenFile(settings, callback) {
  invokeDialog({
      ...settings,
      properties: settings.properties.concat(settings.multiSelections && "multiSelections")
    }, 
    callback, 
    "open-filesys-dialog", 
    "openFile"
  );
};

export function showSaveFile(settings, callback) {
  invokeDialog(settings, callback, "save-filesys-dialog", "openFile");
};

export function showOpenDirectory(settings, callback) {
  invokeDialog(settings, callback, "open-filesys-dialog", "openDirectory");
};
