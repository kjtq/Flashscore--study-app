from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union, Dict, Any
import logging
import os

from magajico_predictor import MagajiCoMLPredictor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Initialize ML predictor (try load trained model) ---
MODEL_PATH = os.getenv("MAGAJICO_MODEL", "./ml/magajico_model.pkl")
ml_predictor = MagajiCoMLPredictor(model_path=MODEL_PATH)

# --- Initialize FastAPI app ---
app = FastAPI(
    title="MagajiCo ML Prediction Service",
    description="AI-powered sports prediction engine",
    version="2.1.0"
)

# --- CORS configuration ---
origins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://0.0.0.0:3000",
    "http://0.0.0.0:5000",
    "*"  # Dev mode: allow all origins
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
    logger.info(f"✅ Using model: {ml_predictor.get_model_info()}")

# --- Health route ---
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "MagajiCo ML Prediction Service",
        "version": "2.1.0",
        "ready": True
    }

# --- Root endpoint ---
@app.get("/")
async def root():
    return {
        "message": "MagajiCo ML Prediction Service",
        "version": "2.1.0",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "docs": "/docs"
        }
    }

# --- Prediction models ---
class PredictRequest(BaseModel):
    features: List[float]
    match_id: str = None
    home_team: str = None
    away_team: str = None

class PredictResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: Dict[str, float]
    model_version: str
    match_details: Dict[str, Any] = None

class SportsMatchFeatures(BaseModel):
    home_team_strength: float
    away_team_strength: float
    home_advantage: float
    recent_form_home: float
    recent_form_away: float
    head_to_head: float
    injuries_suspensions: float

# --- Prediction route ---
@app.post("/predict", response_model=PredictResponse)
async def predict(data: Union[PredictRequest, SportsMatchFeatures, List[float]] = Body(...)):
    try:
        # Handle multiple input types
        if isinstance(data, SportsMatchFeatures):
            features = [
                data.home_team_strength,
                data.away_team_strength,
                data.home_advantage,
                data.recent_form_home,
                data.recent_form_away,
                data.head_to_head,
                data.injuries_suspensions
            ]
            match_details = data.dict()
        elif isinstance(data, PredictRequest):
            features = data.features
            match_details = data.dict(exclude={"features"})
        elif isinstance(data, list):
            features = data
            match_details = None
        else:
            raise HTTPException(status_code=400, detail="Invalid request format")

        if not features or len(features) < 7:
            raise HTTPException(status_code=400, detail="At least 7 features required for prediction")

        # Run prediction
        result = ml_predictor.predict(features)

        logger.info(f"ML Prediction: {result['prediction']} with confidence: {result['confidence']}")

        return PredictResponse(
            prediction=result["prediction"],
            confidence=result["confidence"],
            probabilities=result["probabilities"],
            model_version=result["model_version"],
            match_details=match_details
        )

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# --- Batch prediction route ---
@app.post("/predict/batch")
async def predict_batch(matches: List[SportsMatchFeatures]):
    try:
        results = []
        for match in matches:
            features = [
                match.home_team_strength,
                match.away_team_strength,
                match.home_advantage,
                match.recent_form_home,
                match.recent_form_away,
                match.head_to_head,
                match.injuries_suspensions
            ]
            result = ml_predictor.predict(features)
            results.append({
                "prediction": result["prediction"],
                "confidence": result["confidence"],
                "probabilities": result["probabilities"],
                "model_version": result["model_version"]
            })

        return {"predictions": results, "total_processed": len(results)}

    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

# --- Model info ---
@app.get("/model/status")
async def model_status():
    return ml_predictor.get_model_info()

# --- Features template ---
@app.get("/features/template")
async def get_features_template():
    return {
        "features_template": {
            "home_team_strength": "float (0.0-1.0)",
            "away_team_strength": "float (0.0-1.0)",
            "home_advantage": "float (0.0-1.0)",
            "recent_form_home": "float (0.0-1.0)",
            "recent_form_away": "float (0.0-1.0)",
            "head_to_head": "float (0.0-1.0)",
            "injuries_suspensions": "float (0.0-1.0)"
        },
        "example_request": {
            "home_team_strength": 0.75,
            "away_team_strength": 0.65,
            "home_advantage": 0.6,
            "recent_form_home": 0.8,
            "recent_form_away": 0.7,
            "head_to_head": 0.55,
            "injuries_suspensions": 0.9
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)