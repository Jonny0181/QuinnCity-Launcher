const { app, BrowserWindow, ipcMain } = require("electron");
const Server = require("./server");
const fetch = require('electron-fetch').default;

let window = null;
var isServerOnline = false;

async function fetchFilesFromGitHub() {
  const htmlURL = 'https://github.com/Jonny0181/QuinnCity-Launcher/raw/main/html/index.html';
  const cssURL = 'https://github.com/Jonny0181/QuinnCity-Launcher/raw/main/html/styles.css';
  const jsURL = 'https://github.com/Jonny0181/QuinnCity-Launcher/raw/main/src/render.js';

  const responseHTML = await fetch(htmlURL);
  const htmlContent = await responseHTML.text();

  const responseCSS = await fetch(cssURL);
  const cssContent = await responseCSS.text();

  const responseJS = await fetch(jsURL);
  const jsContent = await responseJS.text();

  return {
    html: htmlContent,
    css: cssContent,
    js: jsContent,
  };
}

const createWindow = async () => {
  const { html, css, js } = await fetchFilesFromGitHub();

  window = new BrowserWindow({
    width: 800, height: 500, resizable: false, frame: false, icon: "html/assets/images/QuinnCityIcon.png",
    webPreferences: { nodeIntegration: true, contextIsolation: false, devTools: true, },
  });

  window.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(html)}`);
  window.webContents.on('did-finish-load', () => {
    window.webContents.insertCSS(css);
    window.webContents.executeJavaScript(js);
  });
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