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
      <h2 style={{ color: '#fff', marginBottom: '16px' }}>Preview Manager</h2>

      <div style={{ display: 'grid', gap: '12px' }}>
        {previewItems.map(item => (
          <div
            key={item.id}
            onClick={() => setActivePreview(activePreview === item.id ? null : item.id)}
            style={{
              background: activePreview === item.id ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <h3 style={{ color: '#fff', margin: '0 0 4px 0' }}>{item.title}</h3>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>
              Type: {item.type}
            </p>
          </div>
        ))}
      </div>

      {activePreview && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <p style={{ color: '#22c55e', margin: 0 }}>
            Preview active for: {previewItems.find(item => item.id === activePreview)?.title}
          </p>
        </div>
      )}
    </div>
  );
};

export default PreviewManager;