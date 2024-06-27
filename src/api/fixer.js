const ipcRenderer = window.require("electron").ipcRenderer;

export const FIXER_STATUS = {
  ready: "ready",
  fixing: "fixing",
  successful: "successful",
  failed: "failed",
};

export function fixFiles(filePaths, outputPath, mappings) {
  const promises = [];
  
  for( let filePath of filePaths )
  promises.push(ipcRenderer.invoke("fix-files", filePath, outputPath, mappings));

  return promises;
}
