import React, { useState } from 'react';
import GoogleStyleMenu from './GoogleStyleMenu';

// Map menu item IDs to icons. You can customize/add more as needed!
const iconMap: Record<string, React.ReactNode> = {
  home: <FiHome />,
  news: <FiBookOpen />,
  predictions: <FiStar />,
  leaderboard: <FiUsers />,
  wallet: <FiWallet />,
  more: <FiMoreHorizontal />,
};

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);

const quickMenuItems = [
  { label: '🏠 Home', link: '/' },
  { label: '📰 News', link: '/news' },
  { label: '📊 Predictions', link: '/predictions' },
  { label: '📂 Archive', link: '/archive' },
  { label: '✍️ Author', link: '/author' },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-[#0a0e1a] text-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo with Hover Menu */}
          <div className="flex-shrink-0 flex items-center relative group">
            <a 
              href="/" 
              className="text-green-400 font-bold text-xl cursor-pointer hover:text-green-300 transition-colors"
              onClick={(e) => {
                // Allow navigation
                window.location.href = '/';
              }}
            >
              ⚡ Sports Central
            </a>
            
            {/* Hover Menu - Only shows on hover */}
            <div className="absolute left-0 top-full mt-2 bg-[#1f2937] rounded-md shadow-lg overflow-hidden z-50 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
                        className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl text-blue-700 focus:outline-none"
          onClick={handleMenuToggle}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t z-50">
          <ul className="flex flex-col py-2">
            {menuItems.map((item) => (
              <li key={item.id} className="relative">
                <Link
                  href={item.link}
                  className="flex items-center gap-2 px-4 py-3 font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  {iconMap[item.id] || <FiMoreHorizontal />}
                  {item.title}
                </Link>
                {/* Mobile Submenu */}
                {item.subMenu && (
                  <>
                    <button
                      className="absolute right-4 top-3 text-gray-400 text-lg"
                      onClick={() => handleSubmenuToggle(item.id)}
                      aria-label="Expand submenu"
                    >
                      <FiMoreHorizontal />
                    </button>
                    {submenuOpen === item.id && (
                      <ul className="bg-gray-50 border-l ml-8 mt-1 rounded">
                        {item.subMenu.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={sub.link}
                              className="block px-4 py-2 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                              onClick={() => {
                                setMenuOpen(false);
                                setSubmenuOpen(null);
                              }}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </div>

          {/* Right-side quick links / buttons */}
          <div className="flex items-center space-x-4">
            <GoogleStyleMenu />
            <button className="px-3 py-2 bg-green-500 rounded-full text-sm font-medium hover:bg-green-600 transition cursor-pointer">
              Sign Up
            </button>
            <button className="px-3 py-2 bg-yellow-500 rounded-full text-sm font-medium hover:bg-yellow-600 transition cursor-pointer">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
