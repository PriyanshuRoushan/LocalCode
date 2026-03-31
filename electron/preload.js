import { contextBridge, ipcRenderer } from "electron";

 contextBridge.exposeInMainWorld("electronAPI", {
  saveProgress: (data) => ipcRenderer.invoke("save-progress", data),
  getProgress: () => ipcRenderer.invoke("get-progress"),
  setToken: (token) => ipcRenderer.send("set-token", token),
  getAllProblems: () => ipcRenderer.invoke("get-all-problems"),
  getProblem: (id) => ipcRenderer.invoke("get-problem", id),
  runCode: (options) => ipcRenderer.invoke("run-code", options),
  submitCode: (options) => ipcRenderer.invoke("submit-code", options)
});