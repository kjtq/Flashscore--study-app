from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# --- Initialize FastAPI app ---
app = FastAPI()

# --- CORS configuration ---
origins = ["http://localhost:3000"]  # Your frontend URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Health route ---
@app.get("/health")
async def health():
    return {"status": "ok"}


# --- Prediction model ---
class PredictRequest(BaseModel):
    features: List[float]


@app.post("/predict")
async def predict(request: PredictRequest):
    features = request.features
    prediction = sum(features) / len(features) if features else 0
    return {"prediction": prediction}
