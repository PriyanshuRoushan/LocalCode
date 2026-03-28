import { contextBridge, ipcRenderer } from "electron";

 contextBridge.exposeInMainWorld("electronAPI", {
  saveProgress: (data) => ipcRenderer.invoke("save-progress", data),
  getProgress: () => ipcRenderer.invoke("get-progress")
});