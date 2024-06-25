const ipcRenderer = window.require("electron").ipcRenderer;

export const fixFiles = (filePaths, outputPath, mappings) => {
  return ipcRenderer.invoke("fix-files", filePaths, outputPath, mappings);
};
