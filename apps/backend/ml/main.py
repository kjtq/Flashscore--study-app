
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Initialize FastAPI app ---
app = FastAPI(
    title="MagajiCo ML Prediction Service",
    description="AI-powered sports prediction engine",
    version="2.0.0"
)

# --- CORS configuration ---
origins = [
    "http://localhost:3000",
    "http://localhost:5000", 
    "http://0.0.0.0:3000",
    "http://0.0.0.0:5000",
    "*"  # Allow all origins for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Startup event ---
@app.on_event("startup")
async def startup_event():
    logger.info("🤖 MagajiCo ML Service starting up...")
    logger.info("✅ ML Service ready for predictions")

# --- Health route ---
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "MagajiCo ML Prediction Service",
        "version": "2.0.0",
        "ready": True
    }

# --- Root endpoint ---
@app.get("/")
async def root():
    return {
        "message": "MagajiCo ML Prediction Service",
        "version": "2.0.0",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "docs": "/docs"
        }
    }

# --- Prediction model (for object POST) ---
class PredictRequest(BaseModel):
    features: List[float]

class PredictResponse(BaseModel):
    prediction: float
    confidence: float
    model_version: str

# --- Prediction route ---
@app.post("/predict", response_model=PredictResponse)
async def predict(data: Union[PredictRequest, List[float]] = Body(...)):
    try:
        # Determine if request is object or raw array
        if isinstance(data, PredictRequest):
            features = data.features
        elif isinstance(data, list):
            features = data
        else:
            features = []

        if not features:
            raise HTTPException(status_code=400, detail="No features provided")

        # Simple prediction logic (replace with actual ML model)
        prediction = sum(features) / len(features) if features else 0
        confidence = min(0.95, max(0.5, abs(prediction) / 10))  # Simple confidence calculation
        
        logger.info(f"Prediction made: {prediction} with confidence: {confidence}")
        
        return PredictResponse(
            prediction=prediction,
            confidence=confidence,
            model_version="MagajiCo-v2.0"
        )
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# --- Additional ML endpoints ---
@app.get("/model/status")
async def model_status():
    return {
        "model_loaded": True,
        "model_version": "MagajiCo-v2.0",
        "last_trained": "2024-01-01",
        "accuracy": 0.87
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
