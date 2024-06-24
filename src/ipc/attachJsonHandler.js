  // Use this function instead of JSON.stringify to keep things uniform
const stringifyJson = (json) => {
  return JSON.stringify(json, null, 2);
};

const readJson = (fs, path, callback) => {
  fs.readFile(path, (err, config) => callback(JSON.parse(config)));
};

function attachJsonHandler(ipcMain, fs) {
  ipcMain.handle("read-json", async (event, path, callback, json) => {
    if( !fs.exists(path) ) {
      if( json ) {
        fs.writeFile(path, stringifyJson(json), null)
        .then((res) => readJson(fs, path, callback));
      }

      return;
    }

    readJson(fs, path, callback);
    //fs.readFile(path, (err, config) => callback(JSON.parse(config)));
  });

  ipcMain.handle("write-json", async (event, path, configJson) => {
    if( !fs.exists(path) )
    return;
    
    fs.writeFile(path, stringifyJson(configJson));
  });
}

exports.attachJsonHandler = attachJsonHandler;