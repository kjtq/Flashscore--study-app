"use client";

import { useState, useEffect } from "react";
import MagajiCoManager from "./components/MagajiCoManager";
import PredictionsPreview from "./components/PredictionsPreview";
import PredictionPreview from "./components/PredictionPreview";
import PreviewManager from "./components/PreviewManager";
import SmartPersonalization from "./components/SmartPersonalization";
import PredictionLeague from "./components/PredictionLeague";
import SocialHub from "./components/SocialHub";
import MobileAdvancedFeatures from "./components/MobileAdvancedFeatures";
import AdvancedAnalytics from "./components/AdvancedAnalytics";

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState("checking...");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Smooth loading animation
    setTimeout(() => setIsLoaded(true), 100);

    // Test backend health endpoint
    fetch("/api/backend/health")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => setBackendStatus("✅ Connected"))
      .catch(() => setBackendStatus("❌ Disconnected"));
  }, []);

  return (
    <div
      className={`min-h-screen text-white font-sans transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      {/* Enhanced Background with Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Enhanced Header */}
        <header className="text-center mb-12 animate-slide-in-elegant">
          <div className="inline-block p-6 rounded-3xl glass-card mb-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              ⚽ MagajiCo
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-medium">
              Smart Football Predictions Platform
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>
        </header>

        {/* Enhanced Grid Layout */}
        <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* System Status Card */}
          <div className="glass-card p-8 hover-lift group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                🖥️
              </div>
              <h2 className="text-2xl font-bold">System Status</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300">Backend:</span>
                <span
                  className={`font-semibold ${backendStatus.includes("✅") ? "text-green-400" : "text-red-400"}`}
                >
                  {backendStatus}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-gray-300">Frontend:</span>
                <span className="text-green-400 font-semibold">✅ Running</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="glass-card p-8 hover-lift group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h2 className="text-2xl font-bold">Quick Actions</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full ios-button bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  🔮 View Predictions
                </span>
              </button>
              <button className="w-full ios-button bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  🧪 Test Backend
                </span>
              </button>
            </div>
          </div>

          {/* Advanced UX Features */}
          <div className="md:col-span-2 lg:col-span-3">
            <SmartPersonalization />
            <PredictionLeague />
            <SocialHub />
            <AdvancedAnalytics />
            <MobileAdvancedFeatures />
          </div>

          {/* Features Preview Card */}
          <div className="glass-card p-8 hover-lift group md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl">
                ✨
              </div>
              <h2 className="text-2xl font-bold">Features</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <span className="text-blue-400">🤖</span>
                <span>AI Predictions</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <span className="text-green-400">💰</span>
                <span>Pi Coin Rewards</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <span className="text-purple-400">🧠</span>
                <span>Sports Quizzes</span>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="glass-card p-8 hover-lift group md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <h2 className="text-2xl font-bold">Welcome to MagajiCo</h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              Experience the future of sports predictions with our advanced
              AI-powered platform. Get real-time predictions, earn Pi coins, and
              join a community of passionate sports enthusiasts.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-sm font-medium border border-blue-500/30">
                Real-time Data
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full text-sm font-medium border border-green-500/30">
                AI Powered
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm font-medium border border-purple-500/30">
                Community Driven
              </span>
            </div>
          </div>

          {/* New Preview Components */}
          <PreviewManager />
          <PredictionPreview />
          <PredictionsPreview />
        </div>

        {/* Enhanced Footer */}
        <footer className="text-center mt-16 opacity-80">
          <div className="inline-block p-4 rounded-2xl glass-card">
            <p className="text-lg font-medium">
              🏆 Powered by MagajiCo Technology | Next.js + Fastify
            </p>
          </div>
        </footer>

        <MagajiCoManager />
      </div>
    </div>
  );
}
