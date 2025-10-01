
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union, Dict, Any
import logging
from magajico_predictor import MagajiCoMLPredictor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize ML predictor
ml_predictor = MagajiCoMLPredictor()

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
        # Process different input types
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
            match_details = {
                "home_team_strength": data.home_team_strength,
                "away_team_strength": data.away_team_strength,
                "home_advantage": data.home_advantage
            }
        elif isinstance(data, PredictRequest):
            features = data.features
            match_details = {
                "match_id": data.match_id,
                "home_team": data.home_team,
                "away_team": data.away_team
            } if data.match_id else None
        elif isinstance(data, list):
            features = data
            match_details = None
        else:
            features = []
            match_details = None

        if not features or len(features) < 7:
            raise HTTPException(status_code=400, detail="At least 7 features required for prediction")

        # Use MagajiCo ML predictor
        result = ml_predictor.predict(features)
        
        logger.info(f"ML Prediction: {result['prediction']} with confidence: {result['confidence']}")
        
        return PredictResponse(
            prediction=result['prediction'],
            confidence=result['confidence'],
            probabilities=result['probabilities'],
            model_version="MagajiCo-v2.0",
            match_details=match_details
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
        "accuracy": 0.87,
        "features_required": 7,
        "prediction_types": ["home", "draw", "away"]
    }

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
                "prediction": result['prediction'],
                "confidence": result['confidence'],
                "probabilities": result['probabilities']
            })
        
        return {"predictions": results, "total_processed": len(results)}
    
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@app.get("/features/template")
async def get_features_template():
    return {
        "features_template": {
            "home_team_strength": "float (0.0-1.0) - Team's overall strength rating",
            "away_team_strength": "float (0.0-1.0) - Away team's overall strength rating", 
            "home_advantage": "float (0.0-1.0) - Home field advantage factor",
            "recent_form_home": "float (0.0-1.0) - Recent performance of home team",
            "recent_form_away": "float (0.0-1.0) - Recent performance of away team",
            "head_to_head": "float (0.0-1.0) - Historical head-to-head performance",
            "injuries_suspensions": "float (0.0-1.0) - Impact of injuries/suspensions"
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
