
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
