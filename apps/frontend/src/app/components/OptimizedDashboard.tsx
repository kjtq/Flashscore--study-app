
"use client";

import React, { useState, useMemo } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

interface DashboardMetrics {
  totalPredictions: number;
  accuracyRate: number;
  piCoinsEarned: number;
  activeUsers: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'error';
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: () => void;
}

const OptimizedDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'predictions' | 'analytics'>('overview');
  const [metrics] = useState<DashboardMetrics>({
    totalPredictions: 1247,
    accuracyRate: 78.5,
    piCoinsEarned: 3420,
    activeUsers: 2341,
    systemHealth: 'excellent'
  });

  const { trackPerformance } = usePerformanceMonitor();

  const quickActions = useMemo<QuickAction[]>(() => [
    {
      id: 'predictions',
      label: 'View Predictions',
      icon: '🔮',
      color: 'from-blue-500 to-blue-600',
      action: () => {
        trackPerformance('quick_action_predictions');
        setActiveSection('predictions');
      }
    },
    {
      id: 'wallet',
      label: 'Pi Wallet',
      icon: '💰',
      color: 'from-green-500 to-green-600',
      action: () => {
        trackPerformance('quick_action_wallet');
        // Navigate to wallet
      }
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊',
      color: 'from-purple-500 to-purple-600',
      action: () => {
        trackPerformance('quick_action_analytics');
        setActiveSection('analytics');
      }
    },
    {
      id: 'community',
      label: 'Community',
      icon: '👥',
      color: 'from-orange-500 to-orange-600',
      action: () => {
        trackPerformance('quick_action_community');
        // Navigate to community
      }
    }
  ], [trackPerformance]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-400 bg-green-500/20';
      case 'good': return 'text-blue-400 bg-blue-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return '🟢';
      case 'good': return '🔵';
      case 'warning': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Navigation */}
        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Sports Central Dashboard
              </h1>
              <p className="text-gray-300 mt-1">Welcome back! Here's your performance overview</p>
            </div>
            
            {/* Section Navigation */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'predictions', label: 'Predictions', icon: '🔮' },
                { id: 'analytics', label: 'Analytics', icon: '📈' }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {section.icon} {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Total Predictions</span>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {metrics.totalPredictions.toLocaleString()}
            </div>
            <div className="text-green-400 text-sm">+12% this month</div>
          </div>

          <div className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Accuracy Rate</span>
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {metrics.accuracyRate}%
            </div>
            <div className="text-blue-400 text-sm">+3.2% improvement</div>
          </div>

          <div className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Pi Coins Earned</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              π{metrics.piCoinsEarned.toLocaleString()}
            </div>
            <div className="text-yellow-400 text-sm">+420 this week</div>
          </div>

          <div className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">System Health</span>
              <span className="text-2xl">{getHealthIcon(metrics.systemHealth)}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1 capitalize">
              {metrics.systemHealth}
            </div>
            <div className={`text-sm px-2 py-1 rounded-full inline-block ${getHealthColor(metrics.systemHealth)}`}>
              All systems operational
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={action.action}
                className={`p-4 rounded-xl bg-gradient-to-r ${action.color} hover:scale-105 transition-all duration-300 text-white font-medium`}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm">{action.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🕒 Recent Activity
            </h2>
            <div className="space-y-3">
              {[
                { time: '2 min ago', action: 'New prediction made', detail: 'Lakers vs Warriors', type: 'prediction' },
                { time: '15 min ago', action: 'Pi coins earned', detail: '+25 π from correct prediction', type: 'reward' },
                { time: '1 hour ago', action: 'Quiz completed', detail: 'NBA Statistics Quiz - 90%', type: 'quiz' },
                { time: '3 hours ago', action: 'League position updated', detail: 'Moved to #127 in Premier League', type: 'league' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    activity.type === 'prediction' ? 'bg-blue-500/20 text-blue-400' :
                    activity.type === 'reward' ? 'bg-green-500/20 text-green-400' :
                    activity.type === 'quiz' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {activity.type === 'prediction' ? '🎯' :
                     activity.type === 'reward' ? '💰' :
                     activity.type === 'quiz' ? '🧠' : '🏆'}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{activity.action}</div>
                    <div className="text-gray-400 text-xs">{activity.detail}</div>
                  </div>
                  <div className="text-gray-500 text-xs">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🎯 Performance Insights
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400">📈</span>
                  <span className="text-green-400 font-medium text-sm">Streak Alert</span>
                </div>
                <p className="text-green-300 text-xs">You're on a 7-day prediction streak!</p>
              </div>

              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-400">🎯</span>
                  <span className="text-blue-400 font-medium text-sm">Accuracy Tip</span>
                </div>
                <p className="text-blue-300 text-xs">Your NBA predictions are 85% accurate this month</p>
              </div>

              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-purple-400">🏆</span>
                  <span className="text-purple-400 font-medium text-sm">Ranking Update</span>
                </div>
                <p className="text-purple-300 text-xs">You've climbed 23 positions this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedDashboard;
