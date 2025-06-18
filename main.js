import { app, BrowserWindow } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
let frontendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:8080/');
  } else {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      win.loadFile(indexPath);
    } else {
      console.error('❌ Cannot find dist/index.html. Did you run `vite build`?');
    }
  }
  if (!isDev) {
  win.removeMenu(); // optional: also hides menu bar
  }
win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
  console.error(`❌ Failed to load: ${errorDescription}`);
});
}

app.whenReady().then(() => {
  if (isDev) {
    // Run Vite dev server
    frontendProcess = spawn('npm', ['run', 'dev'], {
      shell: true,
      stdio: 'inherit',
    });

    // Wait for Vite to boot up
    setTimeout(() => {
      createWindow();
    }, 3000);
  } else {
    createWindow();
  }
  // ✅ Start backend server in both dev and prod
  const backendPath = isDev
    ? path.join(__dirname, 'backend', 'index.js')
    : path.join(process.resourcesPath, 'app', 'backend', 'index.js'); // inside the .asar

  if (fs.existsSync(backendPath)) {
    backendProcess = spawn('node', [backendPath], {
      shell: true,
      stdio: 'inherit',
    });
  } else {
    console.error('❌ Backend entry not found at', backendPath);
  }

});

app.on('window-all-closed', () => {
  if (frontendProcess) frontendProcess.kill();
  app.quit();
});
