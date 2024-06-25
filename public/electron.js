const electron = require("electron");
const { app, BrowserWindow, ipcMain, dialog } = electron;
const path = require("path");
const url = require("url");
const fs = require("fs");
const readline = require("readline");
const fsPromises = fs.promises;
const { attachDialogHandler } = require("../src/ipc/attachDialogHandler");
const { attachJsonHandler } = require("../src/ipc/attachJsonHandler");
const { attachFileFixer } = require("../src/ipc/attachFileFixer");
 
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);
  
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();
 
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

attachDialogHandler(ipcMain, dialog);  // File system dialog handle
attachJsonHandler(ipcMain, fsPromises);  // Config read/writer handle
attachFileFixer(ipcMain, { fs, pathModule: path, readline }); // File fixer handle