const { spawn } = require("child_process");
const path = require("path");

const backendSrc = path.join(__dirname, "apps/backend/src");
const backendML = path.join(__dirname, "apps/backend/ml");

// Start Express
const express = spawn("npm", ["run", "dev"], { cwd: backendSrc, shell: true });
express.stdout.on("data", (data) => process.stdout.write(`[Express] ${data}`));
express.stderr.on("data", (data) => process.stderr.write(`[Express] ${data}`));

// Start FastAPI
// Windows uses 'venv\\Scripts\\activate && uvicorn main:app --reload --port 8000'
// Linux/macOS uses 'source venv/bin/activate && uvicorn main:app --reload --port 8000'
const isWin = process.platform === "win32";
const activateCmd = isWin
  ? `${path.join(backendML, "venv/Scripts/activate")} && uvicorn main:app --reload --port 8000`
  : `source ${path.join(backendML, "venv/bin/activate")} && uvicorn main:app --reload --port 8000`;

const fastapi = spawn(activateCmd, { cwd: backendML, shell: true });
fastapi.stdout.on("data", (data) => process.stdout.write(`[FastAPI] ${data}`));
fastapi.stderr.on("data", (data) => process.stderr.write(`[FastAPI] ${data}`));

console.log("🚀 Starting both servers...");