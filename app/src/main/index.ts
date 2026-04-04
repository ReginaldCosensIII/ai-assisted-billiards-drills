import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';

let mainWindow: BrowserWindow | null = null;
let projectorWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function createProjectorWindow() {
  projectorWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    // Projector window defaults to no frame for a cleaner projection
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  projectorWindow.on('ready-to-show', () => {
    projectorWindow?.show();
  });

  projectorWindow.on('closed', () => {
    projectorWindow = null;
  });

  const projectorModeParam = '?mode=projector';
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    projectorWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}${projectorModeParam}`);
  } else {
    projectorWindow.loadFile(join(__dirname, '../renderer/index.html'), { query: { mode: 'projector' } });
  }
}

app.whenReady().then(() => {
  createMainWindow();
  createProjectorWindow();

  ipcMain.on('sync-drill-layout', (_event, layout) => {
    // Relay the layout to the projector window if it exists and is not destroyed
    if (projectorWindow && !projectorWindow.isDestroyed()) {
      projectorWindow.webContents.send('update-drill-layout', layout);
    }
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
      createProjectorWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
