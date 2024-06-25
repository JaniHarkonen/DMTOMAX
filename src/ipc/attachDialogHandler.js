function attachDialogHandler(ipcMain, dialog) {
  
  ipcMain.handle("open-filesys-dialog", async (event, settings) => {
    return dialog.showOpenDialog(null, {
      title: settings?.title || "",
      buttonLabel: settings?.buttonLabel || "",
      filters: settings?.filters || "",
      properties: settings?.properties || []
    });
  });
  
  ipcMain.handle("save-filesys-dialog", async (event, settings) => {
    return dialog.showSaveDialog(null, {
      title: settings?.title || "",
      buttonLabel: settings?.buttonLabel || "",
      filters: settings?.filters || "",
      properties: settings?.properties || []
    });
  });
}

exports.attachDialogHandler = attachDialogHandler;
