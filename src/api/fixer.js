const ipcRenderer = window.require("electron").ipcRenderer;

export function fixFiles(filePaths, outputPath, mappings) {
  const promises = [];
  
  for( let filePath of filePaths )
  promises.push(ipcRenderer.invoke("fix-files", filePath, outputPath, mappings));

  return promises;
}

