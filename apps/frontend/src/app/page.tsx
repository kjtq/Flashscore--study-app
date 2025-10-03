import React, { useEffect, useState } from "react";

interface Prediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number;
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect if user is on mobile
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const refreshInterval = isMobile ? 30000 : 60000; // 30s mobile, 60s desktop

  const fetchPredictions = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/predictions"); // 🔹 Change API endpoint if needed
      if (!res.ok) throw new Error("Failed to fetch predictions");
      const data = await res.json();
      setPredictions(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Auto refresh
  useEffect(() => {
    fetchPredictions(); // first load
    const interval = setInterval(fetchPredictions, refreshInterval);
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Live Predictions</h1>
        <button
          onClick={fetchPredictions}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Now
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading predictions...</p>}
      {error && <p className="text-red-500">⚠ {error}</p>}

      <ul className="space-y-3">
        {predictions.map((p) => (
          <li
            key={p.id}
            className="p-4 bg-white shadow rounded-lg border border-gray-200"
          >
            <p className="font-semibold">
              {p.homeTeam} vs {p.awayTeam}
            </p>
            <p>
              Prediction: <span className="font-medium">{p.prediction}</span>
            </p>
            <p className="text-sm text-gray-500">
              Confidence: {p.confidence}%
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}