"use client";
import React, { useState, useEffect } from "react";

interface PredictionData {
  id: string;
  title: string;
  match: string;
  prediction: string;
  confidence: number;
  sport: string;
  odds: string;
  status: "pending" | "correct" | "incorrect";
  aiScore: number;
  analysis: string;
  riskLevel: "low" | "medium" | "high";
  expectedValue: number;
}

interface PredictionPreviewProps {
  prediction?: PredictionData;
  showFullAnalysis?: boolean;
  compact?: boolean;
}

const PredictionPreview: React.FC<PredictionPreviewProps> = ({
  prediction,
  showFullAnalysis = false,
  compact = false,
}) => {
  const [currentPrediction, setCurrentPrediction] =
    useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prediction) {
      setCurrentPrediction(prediction);
    } else {
      fetchLatestPrediction();
    }
  }, [prediction]);

  const fetchLatestPrediction = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual endpoint
      const mockPrediction: PredictionData = {
        id: "1",
        title: "Manchester United vs Liverpool Preview",
        match: "Manchester United vs Liverpool",
        prediction: "Liverpool Win",
        confidence: 78.5,
        sport: "Football",
        odds: "2.1",
        status: "pending",
        aiScore: 91.2,
        analysis:
          "Liverpool shows superior form with 4 consecutive wins. Key players Salah and Van Dijk confirmed available. Manchester United missing 2 key defenders.",
        riskLevel: "medium",
        expectedValue: 1.65,
      };

      setTimeout(() => {
        setCurrentPrediction(mockPrediction);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "#22c55e";
    if (confidence >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "#22c55e";
      case "medium":
        return "#f59e0b";
      case "high":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(15px)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(255, 255, 255, 0.3)",
            borderTop: "3px solid #fff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 10px",
          }}
        ></div>
        <p style={{ color: "#fff", margin: 0 }}>
          Loading prediction preview...
        </p>
      </div>
    );
  }

  if (!currentPrediction) {
    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(15px)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#9ca3af", margin: 0 }}>No prediction available</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(15px)",
          borderRadius: "12px",
          padding: "12px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h4
              style={{ margin: "0 0 4px 0", color: "#fff", fontSize: "0.9rem" }}
            >
              {currentPrediction.match}
            </h4>
            <p
              style={{
                margin: 0,
                color: "#22c55e",
                fontSize: "0.8rem",
                fontWeight: "600",
              }}
            >
              {currentPrediction.prediction}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                color: getConfidenceColor(currentPrediction.confidence),
                fontSize: "0.8rem",
                fontWeight: "600",
              }}
            >
              {currentPrediction.confidence}%
            </div>
            <div style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
              {currentPrediction.sport}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(15px)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "12px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: "700",
            }}
          >
            🔮 Prediction Preview
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <span
              style={{
                background: getRiskColor(currentPrediction.riskLevel),
                color: "white",
                padding: "4px 8px",
                borderRadius: "8px",
                fontSize: "0.7rem",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              {currentPrediction.riskLevel} Risk
            </span>
            <span
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "4px 8px",
                borderRadius: "8px",
                fontSize: "0.7rem",
                fontWeight: "600",
              }}
            >
              {currentPrediction.sport}
            </span>
          </div>
        </div>

        <h3
          style={{
            margin: "0 0 8px 0",
            color: "#e2e8f0",
            fontSize: "1.2rem",
            fontWeight: "600",
          }}
        >
          {currentPrediction.title}
        </h3>

        <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
          Match: {currentPrediction.match}
        </div>
      </div>

      {/* Main Prediction */}
      <div
        style={{
          background: "rgba(34, 197, 94, 0.1)",
          border: "1px solid rgba(34, 197, 94, 0.3)",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#22c55e",
            fontSize: "1.1rem",
            fontWeight: "600",
            marginBottom: "8px",
          }}
        >
          PREDICTED OUTCOME
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: "2rem",
            fontWeight: "800",
            marginBottom: "12px",
          }}
        >
          {currentPrediction.prediction}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
              Confidence
            </div>
            <div
              style={{
                color: getConfidenceColor(currentPrediction.confidence),
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              {currentPrediction.confidence}%
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>Odds</div>
            <div
              style={{
                color: "#fbbf24",
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              {currentPrediction.odds}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>AI Score</div>
            <div
              style={{
                color: "#8b5cf6",
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              {currentPrediction.aiScore}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      {showFullAnalysis && (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <h4 style={{ margin: "0 0 12px 0", color: "#fff", fontSize: "1rem" }}>
            🧠 AI Analysis
          </h4>
          <p
            style={{
              margin: 0,
              color: "#d1d5db",
              fontSize: "0.9rem",
              lineHeight: "1.5",
            }}
          >
            {currentPrediction.analysis}
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "8px",
            padding: "12px",
            textAlign: "center",
          }}
        >
          <div
            style={{ color: "#3b82f6", fontSize: "0.8rem", fontWeight: "600" }}
          >
            Expected Value
          </div>
          <div style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "700" }}>
            {currentPrediction.expectedValue}x
          </div>
        </div>

        <div
          style={{
            background: "rgba(168, 85, 247, 0.1)",
            borderRadius: "8px",
            padding: "12px",
            textAlign: "center",
          }}
        >
          <div
            style={{ color: "#a855f7", fontSize: "0.8rem", fontWeight: "600" }}
          >
            Status
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: "1.2rem",
              fontWeight: "700",
              textTransform: "capitalize",
            }}
          >
            {currentPrediction.status}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => fetchLatestPrediction()}
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          🔄 Refresh Preview
        </button>

        <button
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          📊 View Full Analysis
        </button>
      </div>

      {/* Preview Footer */}
      <div
        style={{
          marginTop: "16px",
          paddingTop: "16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>
          🤖 Powered by MagajiCo AI • Last updated:{" "}
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PredictionPreview;
"use client";
import React from 'react';

interface PredictionPreviewProps {
  prediction?: {
    match: string;
    prediction: string;
    confidence: number;
    sport: string;
    odds: string;
    aiScore: number;
  };
}

const PredictionPreview: React.FC<PredictionPreviewProps> = ({ prediction }) => {
  const defaultPrediction = {
    match: "Sample Match",
    prediction: "Team A Win",
    confidence: 75,
    sport: "Football",
    odds: "2.1",
    aiScore: 8.5
  };

  const pred = prediction || defaultPrediction;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{ color: '#22c55e', marginBottom: '8px' }}>
        {pred.match}
      </h3>
      <p style={{ color: '#fff', marginBottom: '4px' }}>
        Prediction: {pred.prediction}
      </p>
      <p style={{ color: '#d1fae5', fontSize: '0.9rem' }}>
        {pred.confidence}% confidence
      </p>
      <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
        AI Score: {pred.aiScore}
      </p>
    </div>
  );
};

export default PredictionPreview;
