function attachFSHandler(ipcMain, electron) {
  const { fsPromises, fs } = electron;

  ipcMain.handle("ensure-json-exists", async (event, path, json) => {
    return fsPromises.writeFile(path, stringifyJson(json), { flag: "wx" });
  });

  ipcMain.handle("read-json", async (event, path) => {
    return fsPromises.readFile(path, "utf8");
  });

  ipcMain.handle("write-json", async (event, path, json) => {
    return fsPromises.writeFile(path, stringifyJson(json));
  });

  ipcMain.handle("does-path-exist", async (event, path) => {
    return new Promise((resolve, reject) => fs.exists(path, (flag) => resolve(flag)));
  });
}

  // Use this function instead of JSON.stringify to keep things uniform
const stringifyJson = (json) => {
  return JSON.stringify(json, null, 2);
};

exports.attachFSHandler = attachFSHandler;