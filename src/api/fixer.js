const ipcRenderer = window.require("electron").ipcRenderer;

export const FIXER_STATUS = {
  ready: "ready",
  fixing: "fixing",
  successful: "successful",
  failed: "failed",
};

export function mappingsToMappingsTable(mappings) {
  const mappingsTable = {};
  mappings.forEach((mapping) => mappingsTable[mapping.joint] = mapping.replacement);
  return mappingsTable;
}

  // Notice mappings table is not to be confused with mappings
  // Mappings table should be a JSON that only pairs joints with their replacements
export function fixFiles(filePaths, outputPath, mappingsTable) {
  const promises = [];
  
  for( let filePath of filePaths )
  promises.push(ipcRenderer.invoke("fix-files", filePath, outputPath, mappingsTable));

  return promises;
}
