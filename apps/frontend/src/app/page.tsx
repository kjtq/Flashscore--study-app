// apps/frontend/src/app/page.tsx
"use client";

import Link from "next/link";
import Navbar from "./components/NavBar";

// Mock data (replace with MongoDB later)
const latestNews = [
  { id: 1, title: "Fresh Match Update", date: "2025-10-01" },
  { id: 2, title: "Team A beats Team B", date: "2025-10-02" },
];

const archivedNews = [
  { id: 3, title: "Old Transfer Rumors", date: "2025-09-25" },
];

const predictions = [
  { id: 1, match: "Team X vs Team Y", prediction: "Team X wins", confidence: "78%" },
  { id: 2, match: "Team Z vs Team W", prediction: "Draw", confidence: "65%" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* NavBar Component */}
      <Navbar />

      {/* Add top padding to account for fixed navbar */}
      <div className="pt-16">
        {/* Welcome Banner */}
        <div className="p-6 text-center">
          <h2 className="text-3xl font-semibold">Welcome to Sports Central</h2>
          <p className="text-gray-600">Get the latest sports news and predictions in one place.</p>
        </div>

        {/* Latest News */}
        <section className="p-6">
          <h3 className="text-xl font-bold mb-3">📰 Latest News</h3>
          {latestNews.map((news) => (
            <div key={news.id} className="p-3 bg-white shadow mb-2 rounded-lg">
              <h4>{news.title}</h4>
              <p className="text-sm text-gray-500">{news.date}</p>
            </div>
          ))}
        </section>

        {/* Predictions */}
        <section className="p-6">
          <h3 className="text-xl font-bold mb-3">📊 Predictions</h3>
          {predictions.map((p) => (
            <div key={p.id} className="p-3 bg-blue-50 shadow mb-2 rounded-lg">
              <h4>{p.match}</h4>
              <p>{p.prediction} ({p.confidence})</p>
            </div>
          ))}
        </section>

        {/* Archive */}
        <section className="p-6">
          <h3 className="text-xl font-bold mb-3">📂 Archive</h3>
          {archivedNews.map((news) => (
            <div key={news.id} className="p-3 bg-gray-200 shadow mb-2 rounded-lg">
              <h4>{news.title}</h4>
              <p className="text-sm text-gray-500">{news.date}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}