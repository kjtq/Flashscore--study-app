from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --------- CORS configuration ----------
origins = [
    "http://localhost:3000",  # your frontend
    # "*"  # optional: allow all for testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------- End CORS ----------

# Example health route
@app.get("/health")
async def health():
    return {"status": "ok"}

# Example prediction route
@app.post("/predict")
async def predict(data: dict):
    features = data.get("features", [])
    prediction = sum(features)/len(features) if features else 0
    return {"prediction": prediction}