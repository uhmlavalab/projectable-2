import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "node:os";
import { join } from "node:path";

import { DB } from "../database/db";

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

async function InitDb() {
  await DB.init();
}

InitDb();

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let mainWin: BrowserWindow | null = null;
let secondaryWin: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindows() {
  mainWin = new BrowserWindow({
    title: "Main",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    x: 0,
    y: 0,
    width: 1920 / 2,
    height: 1080,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  secondaryWin = new BrowserWindow({
    title: "Secondary",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    x: 1920 / 2,
    y: 0,
    width: 1920 / 2,
    height: 1080,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    mainWin.loadURL(url);
    secondaryWin.loadURL(url);
    // Open devTool if the app is not packaged
    mainWin.webContents.openDevTools();
    secondaryWin.webContents.openDevTools();
  } else {
    mainWin.loadFile(indexHtml);
    secondaryWin.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  mainWin.webContents.on("did-finish-load", () => {
    sendNewPosts();
    mainWin.webContents.send("window-name", { name: "main" });
  });

  // Test actively push message to the Electron-Renderer
  secondaryWin.webContents.on("did-finish-load", () => {
    sendNewPosts();
    secondaryWin.webContents.send("window-name", { name: "secondary" });
  });

  function sendNewPosts() {
    mainWin.webContents.send("posts-list", { posts: DB.getPosts() });
    secondaryWin.webContents.send("posts-list", { posts: DB.getPosts() });
  }

  ipcMain.on("posts-add", (_, arg) => {
    DB.addPost(arg.post);
    sendNewPosts();
  });
  ipcMain.on("posts-remove", (_, arg) => {
    DB.removePost(arg.id);
    sendNewPosts();
  });
}

app.whenReady().then(createWindows);

app.on("window-all-closed", () => {
  mainWin = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (mainWin) {
    // Focus on the main window if the user tried to open another
    if (mainWin.isMinimized()) mainWin.restore();
    mainWin.focus();
  }
  if (secondaryWin) {
    // Focus on the main window if the user tried to open another
    if (secondaryWin.isMinimized()) mainWin.restore();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindows();
  }
});
