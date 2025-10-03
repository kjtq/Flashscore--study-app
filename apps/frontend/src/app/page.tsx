'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Analytics", href: "/management/analytics" },
  { label: "Content", href: "/management/content" },
  { label: "Notifications", href: "/management/notifications" },
  { label: "Payments", href: "/management/payments" },
  { label: "Predictions", href: "/management/predictions" },
  { label: "Settings", href: "/management/settings" },
  { label: "Users", href: "/management/users" },
];

export default function HomePage() {
  const pathname = usePathname();
  const [news, setNews] = useState<any[]>([]);

  // Fetch latest news (placeholder API)
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news"); // 👈 hook to your backend/news service
        if (!res.ok) return;
        const data = await res.json();
        setNews(data.slice(0, 5)); // show top 5
      } catch (err) {
        console.error("News fetch failed:", err);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
          <div className="text-xl font-bold text-blue-600">Sports Central</div>
          <div className="flex space-x-6">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium hover:text-blue-500 ${
                    active ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 🔹 Welcome Section */}
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Sports Central ⚽🏀🎾
          </h1>
          <p className="text-gray-600">
            Navigate through <strong>Predictions, Analytics, Content</strong> and more from the menu above.
          </p>
        </div>

        {/* 🔹 News Section */}
        <section className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Latest Sports News 📰</h2>
          {news.length === 0 ? (
            <p className="text-gray-500">No news available.</p>
          ) : (
            <ul className="space-y-3">
              {news.map((n, idx) => (
                <li key={idx} className="border-b last:border-0 pb-2">
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {n.title}
                  </a>
                  <p className="text-sm text-gray-500">{n.date}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* 🔹 Footer */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sports Central. All rights reserved.
      </footer>
    </div>
  );
}