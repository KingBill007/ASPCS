import { app, BrowserWindow } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
let frontendProcess;
let backendProcess;

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

function startBackend() {
  // ✅ Start backend server in both dev and prod
  const backendPath = isDev
    ? path.join(__dirname, "server.js") // during development, use the local server.js
    : path.join(process.resourcesPath, "app", "server.js"); // extracted to the filesystem at runtime

  console.log("🟩 Starting backend from:", backendPath);

  if (fs.existsSync(backendPath)) {
    backendProcess = spawn("node", [backendPath], {
      shell: true,
      stdio: ["ignore", "pipe", "pipe"], //runs node server.js in the background
    });
    // Log backend output to console
    backendProcess.stdout.on("data", (data) => {
      console.log(`[SERVER] ${data.toString()}`);
    });
    backendProcess.stderr.on("data", (data) => {
      console.error(`[SERVER ERROR] ${data.toString()}`);
    });
    backendProcess.on("exit", (code) => {
      console.error(`❌ Backend exited with code ${code}`);
      console.log("🔁 Restarting backend in 3 seconds...");
      setTimeout(startBackend, 3000); // Restart backend after 3 seconds
    });
  } else {
    console.error("❌ Backend entry not found at", backendPath);
  }
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
  //start backend
  startBackend();
});

app.on('window-all-closed', () => {
  if (frontendProcess) frontendProcess.kill();
  if (backendProcess) backendProcess.kill();
  app.quit();
});
