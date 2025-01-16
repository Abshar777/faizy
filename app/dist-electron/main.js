import { app, ipcMain, desktopCapturer, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let studio;
let floatingWebCam;
function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 300,
    minHeight: 300,
    minWidth: 400,
    maxHeight: 300,
    maxWidth: 400,
    frame: false,
    title: "Faizy",
    fullscreenable: false,
    fullscreen: false,
    // backgroundColor:"transparent",
    roundedCorners: true,
    simpleFullscreen: false,
    // transparent:true,
    // alwaysOnTop: true,
    // focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "Faizy.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true
    }
  });
  studio = new BrowserWindow({
    width: 300,
    height: 30,
    minHeight: 30,
    maxHeight: 30,
    minWidth: 300,
    maxWidth: 300,
    frame: false,
    roundedCorners: true,
    fullscreen: false,
    fullscreenable: false,
    simpleFullscreen: false,
    title: "Faizy studio",
    icon: path.join(process.env.VITE_PUBLIC, "Faizy.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true
    }
  });
  floatingWebCam = new BrowserWindow({
    width: 400,
    height: 200,
    minHeight: 70,
    maxHeight: 400,
    minWidth: 300,
    maxWidth: 400,
    frame: false,
    roundedCorners: true,
    title: "Faizy - floating WebCam",
    fullscreenable: false,
    fullscreen: false,
    icon: path.join(process.env.VITE_PUBLIC, "Faizy.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  studio.webContents.on("did-finish-load", () => {
    studio == null ? void 0 : studio.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  floatingWebCam.webContents.on("did-finish-load", () => {
    floatingWebCam == null ? void 0 : floatingWebCam.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  floatingWebCam == null ? void 0 : floatingWebCam.hide();
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, "screen-saver", 1);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    studio.loadURL(`${"http://localhost:5173"}/studio.html`);
    floatingWebCam.loadURL(`${"http://localhost:5173"}/webCam.html`);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
    studio.loadFile(path.join(RENDERER_DIST, "studio.html"));
    floatingWebCam.loadFile(path.join(RENDERER_DIST, "webCam.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});
ipcMain.on("close-window", (event, arg) => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});
ipcMain.handle("getSources", async (event, arg) => {
  const sources = await desktopCapturer.getSources({
    types: ["screen", "window"],
    thumbnailSize: { width: 150, height: 100 },
    fetchWindowIcons: true
  });
  const sourcesWithStreams = sources.map((source) => {
    var _a;
    return {
      id: source.id,
      name: source.name,
      appIcon: (_a = source.appIcon) == null ? void 0 : _a.toDataURL(),
      thumbnail: source.thumbnail.toDataURL()
    };
  });
  return sourcesWithStreams;
});
ipcMain.on("resize-studio", (event, payload) => {
  if (payload.shrink) studio == null ? void 0 : studio.setSize(400, 100);
  else studio == null ? void 0 : studio.setSize(400, 250);
});
ipcMain.on("hide-plugin", (event, payload) => {
  win == null ? void 0 : win.webContents.send("hide-plugin", payload);
});
ipcMain.on("startPreview", (event, payload) => {
  win == null ? void 0 : win.webContents.send("startPreview", { payload });
});
ipcMain.on("play-video", (event, payload) => {
  win == null ? void 0 : win.webContents.send("play-video", payload);
});
ipcMain.on("hide-floating-webcam", (event, payload) => {
  floatingWebCam == null ? void 0 : floatingWebCam.hide();
});
ipcMain.on("show-floating-webcam", (event, payload) => {
  floatingWebCam == null ? void 0 : floatingWebCam.show();
});
ipcMain.on("media-sources", (event, payload) => {
  studio == null ? void 0 : studio.webContents.send("profile-recieved", payload);
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
