from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union

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


# --- Prediction model (for object POST) ---
class PredictRequest(BaseModel):
    features: List[float]


# --- Prediction route ---
@app.post("/predict")
async def predict(data: Union[PredictRequest, List[float]] = Body(...)):
    # Determine if request is object or raw array
    if isinstance(data, PredictRequest):
        features = data.features
    elif isinstance(data, list):
        features = data
    else:
        features = []

    prediction = sum(features) / len(features) if features else 0
    return {"prediction": prediction}
