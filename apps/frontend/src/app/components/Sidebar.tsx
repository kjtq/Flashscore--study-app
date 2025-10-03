"use client";
import React, { useState } from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  // Start minimized by default on smaller screens
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  // Hide completely on mobile (< 768px)
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <aside
      className={`
        h-screen bg-gray-900 text-white transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
        fixed top-0 left-0 flex flex-col
      `}
    >
      {/* Sticky header */}
      <div className="sticky top-0 bg-gray-900 z-10 flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className={`text-lg font-bold transition-opacity ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
          Management
        </h2>
        <button
          onClick={toggleSidebar}
          className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
        >
          {isOpen ? "<" : ">"}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {[
            { name: "Users", path: "/management/users" },
            { name: "Content", path: "/management/content" },
            { name: "Payments", path: "/management/payments" },
            { name: "Notifications", path: "/management/notifications" },
            { name: "Predictions", path: "/management/predictions" },
            { name: "Settings", path: "/management/settings" },
            { name: "Analytics", path: "/management/analytics" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="block px-3 py-2 rounded hover:bg-gray-800 transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;