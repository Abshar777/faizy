import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let studio: BrowserWindow | null
let floatingWebCam: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 300,
    minHeight: 300,
    minWidth: 400,
    maxHeight:300,
    maxWidth:400,
    frame: false,
    title: "Faizy",
    fullscreenable: false,
    fullscreen: false,
    // backgroundColor:"transparent",
    roundedCorners: true,
    simpleFullscreen:false,
    // transparent:true,
    // alwaysOnTop: true,
    // focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, 'Faizy.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,

    },
  })

  studio = new BrowserWindow({
    width: 300,
    height: 30,
    minHeight: 30,
    maxHeight: 30,
    minWidth: 300,
    maxWidth: 300,
    frame: false,

    roundedCorners:true,
    fullscreen:false,
    fullscreenable:false,
    simpleFullscreen:false,
    title: "Faizy studio",
    icon: path.join(process.env.VITE_PUBLIC, 'Faizy.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,

    },
  })

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
    icon: path.join(process.env.VITE_PUBLIC, 'Faizy.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,

    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })
  studio.webContents.on('did-finish-load', () => {
    studio?.webContents.send('main-process-message', (new Date).toLocaleString())
  })
  floatingWebCam.webContents.on('did-finish-load', () => {
    floatingWebCam?.webContents.send('main-process-message', (new Date).toLocaleString())
  })
  floatingWebCam?.hide();
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  // win.setAlwaysOnTop(true, 'screen-saver', 1);
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, 'screen-saver', 1);
  // floatingWebCam.setVisibleOnAllWorkspaces(true,{visibleOnFullScreen:true});
  // floatingWebCam.setAlwaysOnTop(true, 'screen-saver',1);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    studio.loadURL(`${import.meta.env.VITE_APP_URL}/studio.html`)
    floatingWebCam.loadURL(`${import.meta.env.VITE_APP_URL}/webCam.html`)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    studio.loadFile(path.join(RENDERER_DIST, 'studio.html'))
    floatingWebCam.loadFile(path.join(RENDERER_DIST, 'webCam.html'))
  }
}


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
    studio = null
    floatingWebCam = null
  }
})

ipcMain.on('close-window', (event, arg) => {
  // console.log("close-window");

  if (process.platform !== 'darwin') {
    app.quit()
    win = null
    studio = null
    floatingWebCam = null
  }
})


ipcMain.handle('getSources', async (event, arg) => {

  const sources = await desktopCapturer.getSources({
    types: ["screen", "window"],
    thumbnailSize: { width: 150, height: 100 },
    fetchWindowIcons: true,
  });

  
  const sourcesWithStreams = sources.map((source) => ({
    id: source.id,
    name: source.name,
    appIcon: source.appIcon?.toDataURL(), 
    thumbnail: source.thumbnail.toDataURL(), 
  }));

  return sourcesWithStreams;
})

ipcMain.on('resize-studio', (event, payload) => {
  if (payload.shrink) studio?.setSize(400, 100);
  else studio?.setSize(400, 250);
})

ipcMain.on("hide-plugin", (event, payload) => {
  win?.webContents.send("hide-plugin", payload);
})

ipcMain.on("startPreview",(event,payload)=>{
  // console.log(payload,"statrt pre")
  win?.webContents.send("startPreview",{payload})
})


ipcMain.on("play-video",(event,payload)=>{
  // console.log(payload,"stream payload");
  
  win?.webContents.send("play-video",payload)
})


ipcMain.on("hide-floating-webcam", (event, payload) => {
  floatingWebCam?.hide();
});

ipcMain.on("show-floating-webcam", (event, payload) => {
  floatingWebCam?.show();
});


ipcMain.on("media-sources", (event, payload) => {
  studio?.webContents.send("profile-recieved", payload);
})




app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
