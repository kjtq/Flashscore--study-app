
'use client';

import React, { useState, useEffect } from 'react';

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: string;
  component?: string;
  userAgent?: string;
  url?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default function ErrorMonitor() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadErrorLogs();
    
    // Listen for new errors
    const handleError = (event: ErrorEvent) => {
      logError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const loadErrorLogs = () => {
    try {
      const stored = localStorage.getItem('error_logs');
      if (stored) {
        setErrors(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load error logs:', e);
    }
  };

  const logError = (errorData: any) => {
    const newError: ErrorLog = {
      id: Date.now().toString(),
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: errorData.url || window.location.href,
      severity: determineSeverity(errorData.message)
    };

    setErrors(prev => {
      const updated = [newError, ...prev].slice(0, 100); // Keep last 100 errors
      try {
        localStorage.setItem('error_logs', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save error logs:', e);
      }
      return updated;
    });
  };

  const determineSeverity = (message: string): ErrorLog['severity'] => {
    if (message.toLowerCase().includes('critical') || message.toLowerCase().includes('crash')) {
      return 'critical';
    }
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')) {
      return 'high';
    }
    if (message.toLowerCase().includes('warning') || message.toLowerCase().includes('deprecated')) {
      return 'medium';
    }
    return 'low';
  };

  const clearErrors = () => {
    setErrors([]);
    localStorage.removeItem('error_logs');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-800 bg-red-100';
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors z-50"
        title={`${errors.length} errors logged`}
      >
        🐛 {errors.length}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Error Monitor ({errors.length} errors)</h2>
          <div className="flex gap-2">
            <button
              onClick={clearErrors}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-96 p-4">
          {errors.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No errors logged</p>
          ) : (
            <div className="space-y-3">
              {errors.map(error => (
                <div key={error.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(error.severity)}`}>
                      {error.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(error.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 mb-1">{error.message}</p>
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600">Stack Trace</summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
