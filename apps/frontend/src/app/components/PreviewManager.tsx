
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
