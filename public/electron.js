const { app, BrowserWindow, protocol } = require("electron");
const path = require("path");
const url = require("url");
 
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
      //preload: path.join(__dirname, "preload.js"),
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

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
/*function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    },
  );
}*/

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
 
// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
 
    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});
