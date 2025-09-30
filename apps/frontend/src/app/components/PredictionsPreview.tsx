"use client";

import React, { useState } from "react";
import PredictionPreview from "./PredictionPreview";

const PredictionsPreview: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "preview">("list");
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);

  // Mock data for preview
  const predictions = [
    {
      id: 1,
      match: "Team A vs Team B",
      prediction: "Team A Win",
      confidence: 85,
      sport: "Football",
      odds: "1.8",
      status: "pending" as const,
      aiScore: 92.1,
      analysis: "Team A shows dominant home form with 85% win rate",
      riskLevel: "low" as const,
      expectedValue: 1.53,
      title: "Team A vs Team B - Prediction Analysis",
    },
    {
      id: 2,
      match: "Team C vs Team D",
      prediction: "Draw",
      confidence: 72,
      sport: "Football",
      odds: "3.2",
      status: "pending" as const,
      aiScore: 78.4,
      analysis: "Both teams show equal recent form making draw most likely",
      riskLevel: "medium" as const,
      expectedValue: 2.31,
      title: "Team C vs Team D - Draw Analysis",
    },
    {
      id: 3,
      "use client";
import React, { useState } from "react";
import PredictionPreview from "./PredictionPreview";

const PredictionsPreview: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "preview">("list");
  
  const samplePredictions = [
    {
      match: "Team E vs Team F",
      prediction: "Team F Win",
      confidence: 90,
      sport: "Football",
      odds: "2.1",
      status: "correct" as const,
      aiScore: 95.7,
      analysis: "Team F superior attacking stats and key player availability",
      riskLevel: "low" as const,
      expectedValue: 1.89,
      title: "Team E vs Team F - Away Win Prediction",
    },
  ];

  const handlePredictionClick = (prediction: any) => {
    setSelectedPrediction(prediction);
    setViewMode("preview");
  };

  if (viewMode === "preview" && selectedPrediction) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setViewMode("list")}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2"
        >
          ← Back to List
        </button>
        <PredictionPreview
          prediction={selectedPrediction}
          showFullAnalysis={true}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Latest Predictions</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 text-xs rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1 text-xs rounded ${viewMode === "preview" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Preview
          </button>
        </div>
      </div>

      {viewMode === "preview" && !selectedPrediction ? (
        <PredictionPreview showFullAnalysis={false} />
      ) : (
        <div className="space-y-3">
          {predictions.map((pred) => (
            <div
              key={pred.id}
              className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handlePredictionClick(pred)}
            >
              <div>
                <p className="font-medium text-sm">{pred.match}</p>
                <p className="text-xs text-gray-600">{pred.prediction}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {pred.sport}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      pred.status === "correct"
                        ? "bg-green-100 text-green-800"
                        : pred.status === "incorrect"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {pred.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-green-600">
                  {pred.confidence}% confidence
                </p>
                <p className="text-xs text-gray-500">AI: {pred.aiScore}</p>
                <p className="text-xs text-blue-600">Click to preview →</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionsPreview;
