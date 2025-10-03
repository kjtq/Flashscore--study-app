import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiHome, FiUsers, FiBookOpen, FiStar, FiWallet, FiMoreHorizontal } from "react-icons/fi";
import { menuItems } from "../../config/menuItems";

// Mapping ids to icons
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

  // Responsive breakpoint
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleSubmenuToggle = (id: string) =>
    setSubmenuOpen((open) => (open === id ? null : id));

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
          <FiStar className="text-blue-500" />
          Sports Central
        </Link>
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <li key={item.id} className="relative group">
              <Link href={item.link} className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-all">
                {iconMap[item.id] || <FiMoreHorizontal />}
                {item.title}
              </Link>
              {/* Submenu */}
              {item.subMenu && (
                <ul className="absolute left-0 top-full mt-1 bg-white border rounded shadow-lg min-w-[160px] hidden group-hover:block">
                  {item.subMenu.map((sub) => (
                    <li key={sub.id}>
                      <Link
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
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
