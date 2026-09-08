const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 860,
    minHeight: 600,
    backgroundColor: '#09090b',
    title: 'Munin',
    icon: path.join(__dirname, 'public', 'pwa-512x512.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Allows file:// protocol to load local fonts and assets cleanly
    },
  });

  // Only consider dev if explicitly not packaged and development mode is enabled
  const isDev = !app.isPackaged && process.env.NODE_ENV === 'development';

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    // Find index.html whether in packaged ASAR, release folder, or root dist folder
    let indexPath = path.join(__dirname, 'dist', 'index.html');
    if (!fs.existsSync(indexPath)) {
      indexPath = path.join(process.resourcesPath, 'app', 'dist', 'index.html');
    }
    if (!fs.existsSync(indexPath)) {
      indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
    }

    win.loadFile(indexPath).catch((err) => {
      console.error('Failed to load local index.html:', err);
      win.webContents.openDevTools();
    });
  }

  // Handle any load failure
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorCode, errorDescription);
    win.webContents.openDevTools();
  });

  // Press F12 or Ctrl+Shift+I to toggle DevTools
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
      win.webContents.toggleDevTools();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
