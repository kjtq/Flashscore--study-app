// app/api/predictions/route.ts (Full Upgraded)

import { NextResponse } from "next/server";
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

// Service: Scraping Layer
async function fetchScrapedMatches(): Promise<any[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/scrape/matches`);
  return response.json();
}

// Service: ML Layer
async function getMlPrediction(match: any): Promise<any> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ml/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match),
  });
  return response.json();
}

// Create Prediction
export async function createPrediction(prediction: Prediction) {
  const client = await getClient();
  const db = client.db("magajico");
  const predictions = db.collection("predictions");

  const record = {
    ...prediction,
    createdAt: new Date(),
  };

  await predictions.insertOne(record);
  revalidatePath("/predictions");

  return record;
}

// API Route
export async function POST(req: Request) {
  try {
    const { mode } = await req.json(); // mode: "scraping" | "ml" | "hybrid"

    const scrapedMatches = await fetchScrapedMatches();
    const predictions: Prediction[] = [];

    for (const match of scrapedMatches) {
      let mlResult: any = {};

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

      const record = await createPrediction(prediction);
      predictions.push(record);
    }

    return NextResponse.json({ success: true, predictions }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate predictions" },
      { status: 500 }
    );
  }
}