from fastapi import FastAPI
from pydantic import BaseModel
from ml.magajico_predictor import MagajiCoMLPredictor

app = FastAPI(title="MagajiCo ML Prediction API")

# Load model once at startup
predictor = MagajiCoMLPredictor()

class PredictionInput(BaseModel):
    features: list[float]  # must be length 7

@app.post("/predict")
def predict(input: PredictionInput):
    return predictor.predict(input.features)