const ipcRenderer = window.require("electron").ipcRenderer;

export function doesPathExist(path) {
  return ipcRenderer.invoke("does-path-exist", path);
}
