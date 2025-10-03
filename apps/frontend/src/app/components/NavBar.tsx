import React, { useState } from 'react';

interface NavItem {
  label: string;
  link?: string;
  subItems?: { label: string; link: string }[];
}

const navItems: NavItem[] = [
  { label: 'Home', link: '/' },
  { label: 'News', link: '/news' },
  { label: 'Predictions', link: '/predictions' },
  { label: 'Authors', link: '/authors' },
  { label: 'Quizzes', link: '/quizzes' },
  {
    label: 'More',
    subItems: [
      { label: 'Leaderboard', link: '/leaderboard' },
      { label: 'Pi Wallet', link: '/wallet' },
      { label: 'Settings', link: '/settings' },
    ],
  },
];

const quickMenuItems = [
  { label: '🏠 Home', link: '/' },
  { label: '📰 News', link: '/news' },
  { label: '📊 Predictions', link: '/predictions' },
  { label: '📂 Archive', link: '/archive' },
  { label: '✍️ Author', link: '/author' },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showHoverMenu, setShowHoverMenu] = useState(false);

  return (
    <nav className="bg-[#0a0e1a] text-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo with Hover Menu */}
          <div 
            className="flex-shrink-0 flex items-center relative"
            onMouseEnter={() => setShowHoverMenu(true)}
            onMouseLeave={() => setShowHoverMenu(false)}
          >
            <a href="/" className="text-green-400 font-bold text-xl cursor-pointer">
              ⚡ Sports Central
            </a>
            
            {/* Hover Menu */}
            {showHoverMenu && (
              <div className="absolute left-0 top-full mt-2 bg-[#1f2937] rounded-md shadow-lg overflow-hidden z-50 min-w-[200px]">
                {quickMenuItems.map((item) => (
                  <a
                    key={item.link}
                    href={item.link}
                    className="block px-4 py-2 text-sm hover:bg-green-500 hover:text-white transition cursor-pointer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <a
                  href={item.link || '#'}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition cursor-pointer"
                >
                  {item.label}
                </a>

                {/* Dropdown */}
                {item.subItems && openDropdown === item.label && (
                  <div className="absolute left-0 mt-2 w-40 bg-[#1f2937] rounded-md shadow-lg overflow-hidden z-50">
                    {item.subItems.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.link}
                        className="block px-4 py-2 text-sm hover:bg-green-500 hover:text-white transition cursor-pointer"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right-side quick links / buttons */}
          <div className="flex items-center space-x-4">
            <button className="px-3 py-2 bg-green-500 rounded-full text-sm font-medium hover:bg-green-600 transition cursor-pointer">
              Sign Up
            </button>
            <button className="px-3 py-2 bg-yellow-500 rounded-full text-sm font-medium hover:bg-yellow-600 transition cursor-pointer">
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Placeholder */}
      <div className="md:hidden">
        {/* You can add a hamburger menu here for mobile */}
      </div>
    </nav>
  );
}