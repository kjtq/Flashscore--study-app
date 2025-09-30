from fastapi import FastAPI
from routes import predict, matches, news

app = FastAPI(title="MagajiCo Enhanced API", version="2.0.0")

app.include_router(predict.router, prefix="/api/predict")
app.include_router(matches.router, prefix="/api/matches")
app.include_router(news.router, prefix="/api/news")

@app.get("/")
def root():
    return {"message": "MagajiCo FastAPI backend is running 🚀"}