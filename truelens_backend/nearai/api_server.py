from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import json
from datetime import datetime
import os

# Create the FastAPI app
app = FastAPI(title="News Analyzer API", description="API to receive processed news articles")

# Define the data models
class TradingRecommendation(BaseModel):
    symbol: str
    reason: str

class TradingRecommendations(BaseModel):
    buy: List[TradingRecommendation]
    sell: List[TradingRecommendation]

class ArticleGroup(BaseModel):
    summary: str
    sentiment: str
    sentiment_explanation: str
    trading_recommendations: TradingRecommendations
    sources: List[str]
    original_titles: List[str]
    original_sources: Optional[List[str]] = None

class NewsPayload(BaseModel):
    timestamp: str
    article_groups: List[ArticleGroup]

# In-memory storage for received data (would use a database in production)
received_data = []

# Ensure the data directory exists
os.makedirs("data", exist_ok=True)

@app.post("/api/news")
async def receive_news(payload: NewsPayload = Body(...)):
    """
    Receive processed news articles from the NEAR AI agent.
    """
    # Add the payload to our in-memory storage
    received_data.append(payload.dict())
    
    # Save to disk as well for persistence
    try:
        timestamp = datetime.fromisoformat(payload.timestamp).strftime("%Y%m%d_%H%M%S")
        with open(f"data/news_{timestamp}.json", "w") as f:
            json.dump(payload.dict(), f, indent=2)
    except Exception as e:
        print(f"Error saving data to disk: {e}")
    
    return {"status": "success", "message": f"Received {len(payload.article_groups)} article groups"}

@app.get("/api/news")
async def get_news():
    """
    Get all processed news articles.
    """
    return received_data

@app.get("/api/news/latest")
async def get_latest_news():
    """
    Get the most recently processed news articles.
    """
    if not received_data:
        return {"message": "No news data available"}
    
    return received_data[-1]

def start_server():
    """
    Start the API server.
    """
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    start_server() 