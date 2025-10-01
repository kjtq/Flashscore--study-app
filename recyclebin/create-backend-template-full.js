const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const baseDir = path.join(__dirname, "apps/backend");

// Helper to create folder if it doesn't exist
function createDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Helper to write file
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

// 1️⃣ Express src app
const srcDir = path.join(baseDir, "src");
createDir(srcDir);
createDir(path.join(srcDir, "routes"));
createDir(path.join(srcDir, "controllers"));

writeFile(
  path.join(srcDir, "index.js"),
  `
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);

app.get("/", (req, res) => res.send("Backend Express server running"));

app.listen(PORT, () => console.log(\`Express server listening on port \${PORT}\`));
`,
);

writeFile(
  path.join(srcDir, "routes/api.js"),
  `
const express = require("express");
const router = express.Router();
const { processPayment } = require("../controllers/paymentController");

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.post("/payment", processPayment);

module.exports = router;
`,
);

writeFile(
  path.join(srcDir, "controllers/paymentController.js"),
  `
exports.processPayment = (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: "Amount is required" });
  res.json({ message: \`Payment of \${amount} processed successfully\` });
};
`,
);

writeFile(
  path.join(srcDir, "package.json"),
  `
{
  "name": "backend-src",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
`,
);

// 2️⃣ FastAPI ml app
const mlDir = path.join(baseDir, "ml");
createDir(mlDir);
createDir(path.join(mlDir, "models"));

writeFile(
  path.join(mlDir, "main.py"),
  `
from fastapi import FastAPI
from pydantic import BaseModel
from models.sample_model import predict

app = FastAPI(title="Prediction Service")

class InputData(BaseModel):
    features: list

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def make_prediction(data: InputData):
    prediction = predict(data.features)
    return {"prediction": prediction}
`,
);

writeFile(
  path.join(mlDir, "models/sample_model.py"),
  `
def predict(features):
    return sum(features) / len(features) if features else 0
`,
);

writeFile(
  path.join(mlDir, "requirements.txt"),
  `
fastapi
uvicorn
pydantic
`,
);

// 3️⃣ Install Node.js dependencies
console.log("📦 Installing Node.js dependencies...");
execSync("npm install", { cwd: srcDir, stdio: "inherit" });

// 4️⃣ Set up Python virtual environment and install requirements
console.log("🐍 Setting up Python virtual environment...");
const venvDir = path.join(mlDir, "venv");
execSync(`python3 -m venv ${venvDir}`, { stdio: "inherit" });

// Activate venv and install requirements
const activate =
  process.platform === "win32"
    ? path.join(venvDir, "Scripts", "activate")
    : `source ${path.join(venvDir, "bin/activate")}`;

console.log("📥 Installing Python packages...");
if (process.platform === "win32") {
  execSync(`${path.join(venvDir, "Scripts/pip")} install -r requirements.txt`, {
    cwd: mlDir,
    stdio: "inherit",
  });
} else {
  execSync(`${path.join(venvDir, "bin/pip")} install -r requirements.txt`, {
    cwd: mlDir,
    stdio: "inherit",
  });
}

console.log("✅ Backend + ML boilerplate created and dependencies installed!");
console.log("👉 Express: cd apps/backend/src && npm run dev");
console.log(
  "👉 FastAPI: cd apps/backend/ml && source venv/bin/activate && uvicorn main:app --reload --port 8000",
);
