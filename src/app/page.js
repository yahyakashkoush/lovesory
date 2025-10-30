'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Music from '@/components/Music';
import Gallery from '@/components/Gallery';
import Message from '@/components/Message';
import Footer from '@/components/Footer';

export default function Home() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    // Poll for updates every 3 seconds
    const interval = setInterval(fetchContent, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">❤️</div>
          <p className="text-rose-600 text-lg">Loading our love story...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative">
      {/* Admin Lock Icon */}
      <a
        href="/admin/login"
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-smooth transform hover:scale-110"
        title="Admin Panel"
      >
        <svg
          className="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 1C6.48 1 2 5.48 2 11v10c0 .55.45 1 1 1h2v3c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-3h6v3c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-3h2c.55 0 1-.45 1-1V11c0-5.52-4.48-10-10-10zm0 2c4.41 0 8 3.59 8 8v8H4v-8c0-4.41 3.59-8 8-8zm3.5 9c.83 0 1.5-.67 1.5-1.5S16.33 9 15.5 9 14 9.67 14 10.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 9 8.5 9 7 9.67 7 10.5 7.67 12 8.5 12z" />
        </svg>
      </a>

      <Hero content={content} />
      <Music content={content} />
      <Gallery content={content} />
      <Message content={content} />
      <Footer content={content} />
    </main>
  );
}
