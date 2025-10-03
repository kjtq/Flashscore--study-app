"use client";
import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  date: string;
}

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news"); // 🔗 Hook into backend news API
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    }
    fetchNews();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Welcome Header */}
      <h1 className="text-4xl font-bold text-green-600 mb-2">Sports Central</h1>
      <p className="text-gray-600 mb-8">
        ⚽🏀🎾 Your hub for predictions, analytics & live sports news
      </p>

      {/* News Feed Section */}
      <section className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
        {news.length === 0 ? (
          <p className="text-gray-500">Loading news...</p>
        ) : (
          <ul className="space-y-3">
            {news.map((item) => (
              <li
                key={item.id}
                className="p-4 border rounded-lg hover:bg-gray-100 transition"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-medium"
                >
                  {item.title}
                </a>
                <p className="text-sm text-gray-500">{item.date}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}