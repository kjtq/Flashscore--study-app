"use server";

import { revalidatePath } from "next/cache";
import { MongoClient } from "mongodb";

// MongoDB Connection
const uri = process.env.MONGODB_URI as string;
let client: MongoClient | null = null;

async function getClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

// Types
export interface Prediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  predictedWinner: string;
  confidence: number;
  odds?: number;
  status: "upcoming" | "completed";
  matchDate: Date;
  source: "scraping" | "ml" | "hybrid";
  createdAt?: Date;
}

// Service: Fetch from Express Backend (Port 3000)
async function fetchScrapedMatches(): Promise<any[]> {
  const response = await fetch(`http://localhost:3000/scrape/matches`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch scraped matches");
  }

  return response.json();
}

// Service: ML Prediction from FastAPI (Port 8000)
async function getMlPrediction(match: any): Promise<any> {
  const response = await fetch(`http://localhost:8000/ml/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to get ML prediction");
  }

  return response.json();
}

// Server Action: Create Single Prediction
export async function createPrediction(prediction: Prediction) {
  try {
    const client = await getClient();
    const db = client.db("magajico");
    const predictions = db.collection("predictions");

    const record = {
      ...prediction,
      createdAt: new Date(),
    };

    await predictions.insertOne(record);
    revalidatePath("/predictions");

    return { success: true, data: record };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Server Action: Generate Predictions (Main Action)
export async function generatePredictions(mode: "scraping" | "ml" | "hybrid") {
  try {
    // Fetch matches from Express backend
    const scrapedMatches = await fetchScrapedMatches();
    const predictions: any[] = [];

    for (const match of scrapedMatches) {
      let mlResult: any = {};

      // Get ML prediction if needed
      if (mode !== "scraping") {
        mlResult = await getMlPrediction(match);
      }

      const prediction: Prediction = {
        matchId: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        predictedWinner: mlResult.predictedWinner || match.homeTeam,
        confidence: mlResult.confidence || 50,
        odds: match.odds,
        status: "upcoming",
        matchDate: new Date(match.date),
        source: mode,
      };

      const result = await createPrediction(prediction);

      if (result.success) {
        predictions.push(result.data);
      }
    }

    return {
      success: true,
      predictions,
      count: predictions.length,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to generate predictions",
    };
  }
}

// Server Action: Fetch All Predictions
export async function getPredictions() {
  try {
    const client = await getClient();
    const db = client.db("magajico");
    const predictions = db.collection("predictions");

    const data = await predictions.find({}).sort({ createdAt: -1 }).toArray();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(data)), // Serialize for client
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
