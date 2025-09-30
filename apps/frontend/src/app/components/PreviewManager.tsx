
"use client";
import React, { useState } from 'react';

const PreviewManager: React.FC = () => {
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const previewItems = [
    { id: '1', title: 'NBA Predictions', type: 'predictions' },
    { id: '2', title: 'Live Matches', type: 'matches' },
    { id: '3', title: 'User Analytics', type: 'analytics' }
  ];

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{ color: '#22c55e', marginBottom: '16px' }}>
        📋 Preview Manager
      </h3>
      <div style={{ display: 'grid', gap: '12px' }}>
        {previewItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePreview(item.id)}
            style={{
              background: activePreview === item.id 
                ? 'rgba(34, 197, 94, 0.2)' 
                : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PreviewManager;
"use client";
import React, { useState } from 'react';

interface PreviewData {
  id: string;
  title: string;
  type: 'prediction' | 'news' | 'analysis';
  content: string;
  timestamp: Date;
  featured: boolean;
}

const PreviewManager: React.FC = () => {
  const [activePreview, setActivePreview] = useState<string>('predictions');
  const [previewData] = useState<PreviewData[]>([
    {
      id: '1',
      title: 'Top NBA Predictions',
      type: 'prediction',
      content: 'Lakers showing strong momentum against Warriors',
      timestamp: new Date(),
      featured: true
    },
    {
      id: '2',
      title: 'EPL Transfer News',
      type: 'news',
      content: 'Latest transfer updates from Premier League',
      timestamp: new Date(),
      featured: false
    },
    {
      id: '3',
      title: 'AI Analysis Report',
      type: 'analysis',
      content: 'Weekly performance analysis of prediction accuracy',
      timestamp: new Date(),
      featured: true
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'from-green-500 to-emerald-600';
      case 'news': return 'from-blue-500 to-cyan-600';
      case 'analysis': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction': return '🎯';
      case 'news': return '📰';
      case 'analysis': return '📊';
      default: return '📄';
    }
  };

  return (
    <div className="glass-card p-6 hover-lift">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl">
          👁️
        </div>
        <h2 className="text-2xl font-bold text-white">Content Preview Manager</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
        {['predictions', 'news', 'analysis'].map(tab => (
          <button
            key={tab}
            onClick={() => setActivePreview(tab)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
              activePreview === tab
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Preview Content */}
      <div className="space-y-4">
        {previewData
          .filter(item => item.type === activePreview)
          .map(item => (
            <div
              key={item.id}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${getTypeColor(item.type)} rounded-xl flex items-center justify-center text-lg`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <span className="text-xs text-gray-400">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                {item.featured && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <p className="text-gray-300 text-sm mb-3">{item.content}</p>
              
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30 transition-colors">
                  Preview
                </button>
                <button className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/30 transition-colors">
                  Publish
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="ios-button bg-gradient-to-r from-blue-600 to-blue-700 py-3">
          📝 Create Content
        </button>
        <button className="ios-button bg-gradient-to-r from-purple-600 to-purple-700 py-3">
          📊 Analytics
        </button>
      </div>
    </div>
  );
};

export default PreviewManager;
