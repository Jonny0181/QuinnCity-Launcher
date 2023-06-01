const { app, BrowserWindow, ipcMain } = require("electron");
const Server = require("./server");

let window = null;
var isServerOnline = false;

const createWindow = async () => {
  window = new BrowserWindow({
    width: 800, height: 500, resizable: false, frame: false, icon: "html/assets/images/QuinnCityIcon.png",
    webPreferences: { nodeIntegration: true, contextIsolation: false, devTools: false, },
  });

  window.loadFile("./html/index.html");
};

app.whenReady().then(() => { createWindow(); });
ipcMain.on("closeApp", (event, data) => { window.close(); });
ipcMain.on("minimizeApp", (event, data) => { window.minimize(); });

ipcMain.on("serverStatus", async (event, data) => {
  const API = new Server(data);
  const val = await API.getServerStatus();
  isServerOnline = val.online;
  window.webContents.send("StatusChecker", isServerOnline);
});

ipcMain.on("getConnectedPlayers", async (event, data) => {
  const API = new Server(data);
  const count = await API.getPlayersList();
  const max = await API.getMaxPlayers();
  window.webContents.send("sendPlayerCount", count, max);
});