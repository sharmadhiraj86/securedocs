const { app, BrowserWindow, globalShortcut, screen } = require('electron');
const path = require('path');

// Handle Squirrel installer events on Windows at the very top of the app
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, err;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
    } catch (error) {}
    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything we did in the installer
      spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      app.quit();
      return true;
  }
}

if (handleSquirrelEvent()) {
  return;
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Disable CORS so localtunnel doesn't block OPTIONS preflight requests!
    }
  });

  // Hide the app icon from the taskbar completely
  mainWindow.setSkipTaskbar(true);

  // Make the app visible on all virtual desktops automatically
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Make sure it stays on top so you don't lose it
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  // CRITICAL FEATURE: Prevent screen capture
  mainWindow.setContentProtection(true);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function moveWindow(position) {
  if (!mainWindow) return;
  
  const winBounds = mainWindow.getBounds();
  const moveAmount = 50; // Nudge by 50 pixels
  
  let newX = winBounds.x;
  let newY = winBounds.y;

  switch (position) {
    case 'left':
      newX -= moveAmount;
      break;
    case 'right':
      newX += moveAmount;
      break;
    case 'top':
      newY -= moveAmount;
      break;
    case 'bottom':
      newY += moveAmount;
      break;
  }

  mainWindow.setPosition(newX, newY, true);
}

app.whenReady().then(() => {
  createWindow();

  // Register Global Shortcuts
  // 1. Toggle Visibility (Hide/Show to yourself)
  globalShortcut.register('CommandOrControl+B', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        // showInactive() makes the app appear without stealing focus from Coderpad!
        mainWindow.showInactive();
      }
    }
  });

  // 2. Move window quickly
  globalShortcut.register('CommandOrControl+Left', () => moveWindow('left'));
  globalShortcut.register('CommandOrControl+Right', () => moveWindow('right'));
  globalShortcut.register('CommandOrControl+Up', () => moveWindow('top'));
  globalShortcut.register('CommandOrControl+Down', () => moveWindow('bottom'));
});

app.on('will-quit', () => {
  // Unregister all shortcuts when closing the app
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
