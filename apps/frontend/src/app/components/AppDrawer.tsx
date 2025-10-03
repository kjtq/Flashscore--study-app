
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface DrawerSection {
  title: string;
  items: {
    name: string;
    icon: string;
    href: string;
    badge?: string;
  }[];
}

const drawerSections: DrawerSection[] = [
  {
    title: 'Main',
    items: [
      { name: 'Home', icon: '🏠', href: '/' },
      { name: 'News', icon: '📰', href: '/news', badge: 'New' },
      { name: 'Predictions', icon: '📊', href: '/predictions', badge: 'AI' },
    ]
  },
  {
    title: 'Content',
    items: [
      { name: 'Authors', icon: '✍️', href: '/author' },
      { name: 'Create Author', icon: '➕', href: '/author/new' },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Users', icon: '👥', href: '/management/users' },
      { name: 'Content', icon: '📝', href: '/management/content' },
      { name: 'Analytics', icon: '📈', href: '/management/analytics' },
      { name: 'Payments', icon: '💳', href: '/management/payments' },
      { name: 'Notifications', icon: '🔔', href: '/management/notifications' },
      { name: 'Settings', icon: '⚙️', href: '/management/settings' },
    ]
  },
  {
    title: 'More',
    items: [
      { name: 'Partnerships', icon: '🤝', href: '/partnerships' },
      { name: 'Privacy', icon: '🔒', href: '/privacy' },
      { name: 'Terms', icon: '📜', href: '/terms' },
    ]
  }
];

export default function AppDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Drawer Toggle Button - Mobile Friendly */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-20 z-50 p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all md:hidden"
        aria-label="Open app drawer"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed left-0 top-0 h-full w-80 bg-[#0a0e1a] border-r border-gray-700/50 
        transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">⚡ Sports Central</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white md:hidden"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-4rem)] p-4">
          {drawerSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-gray-400 text-xs font-semibold uppercase mb-2 px-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
