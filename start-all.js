const { spawnSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const backendSrc = path.join(__dirname, "apps/backend/src");
const backendML = path.join(__dirname, "apps/backend/ml");

const isWin = process.platform === "win32";
const venvPath = isWin
  ? path.join(backendML, "venv", "Scripts", "python.exe")
  : path.join(backendML, "venv", "bin", "python");

// --- Step 0: Install Node.js dependencies if missing ---
if (!fs.existsSync(path.join(backendSrc, "node_modules"))) {
  console.log("📦 Installing Node.js dependencies...");
  spawnSync("npm", ["install"], { cwd: backendSrc, stdio: "inherit", shell: true });
}

// --- Step 1: Create Python venv if missing ---
if (!fs.existsSync(venvPath)) {
  console.log("🐍 Python venv not found. Creating venv...");
  const py = isWin ? "python" : "python3";
  spawnSync(py, ["-m", "venv", "venv"], { cwd: backendML, stdio: "inherit", shell: true });
}

// --- Step 2: Install FastAPI packages ---
console.log("📦 Installing FastAPI packages...");
spawnSync(venvPath, ["-m", "pip", "install", "--upgrade", "pip"], { stdio: "inherit", shell: true });
spawnSync(venvPath, ["-m", "pip", "install", "fastapi", "uvicorn", "pydantic"], { stdio: "inherit", shell: true });

// --- Step 3: Start Express ---
console.log("🚀 Starting Express server...");
const express = spawn("npm", ["run", "dev"], { cwd: backendSrc, shell: true, stdio: "inherit" });

// --- Step 4: Start FastAPI ---
console.log("🚀 Starting FastAPI server...");
const fastapi = spawn(venvPath, ["-m", "uvicorn", "main:app", "--reload", "--port", "8000"], {
  cwd: backendML,
  shell: true,
  stdio: "inherit",
});

// --- Step 5: Graceful shutdown on CTRL+C ---
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down both servers...");
  express.kill("SIGINT");
  fastapi.kill("SIGINT");
  process.exit();
});