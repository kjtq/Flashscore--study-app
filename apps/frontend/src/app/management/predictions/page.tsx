'use client';

import React, { useEffect, useState } from "react";

interface Prediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number;
  league: string;
  date: string;
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const res = await fetch("/api/predictions");
        if (!res.ok) return;
        const data = await res.json();
        setPredictions(data);
      } catch (err) {
        console.error("Prediction fetch failed:", err);
      }
    }
    fetchPredictions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">AI Predictions 📊</h1>
      {predictions.length === 0 ? (
        <p className="text-gray-500">No predictions available.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Match</th>
                <th className="px-4 py-2">League</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Prediction</th>
                <th className="px-4 py-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr key={p.matchId} className="border-b">
                  <td className="px-4 py-2">
                    {p.homeTeam} vs {p.awayTeam}
                  </td>
                  <td className="px-4 py-2">{p.league}</td>
                  <td className="px-4 py-2">{p.date}</td>
                  <td className="px-4 py-2 font-semibold">{p.prediction}</td>
                  <td className="px-4 py-2">{p.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}