  // Use this function instead of JSON.stringify to keep things uniform
const stringifyJson = (json) => {
  return JSON.stringify(json, null, 2);
};

function attachJsonHandler(ipcMain, fsPromises) {
  ipcMain.handle("ensure-json-exists", async (event, path, json) => {
    return fsPromises.writeFile(path, stringifyJson(json), { flag: "wx" });
  });

  ipcMain.handle("read-json", async (event, path) => {
    return fsPromises.readFile(path, "utf8");
  });

  ipcMain.handle("write-json", async (event, path, configJson) => {
    if( !fs.exists(path) )
    return;
    
    fs.writeFile(path, stringifyJson(configJson));
  });
}

exports.attachJsonHandler = attachJsonHandler;