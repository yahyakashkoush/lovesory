'use client';

import { useEffect, useState } from 'react';

export default function Hero({ content }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate random hearts for background
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-100 to-rose-200 opacity-60"></div>

      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute text-4xl opacity-20 animate-float"
            style={{
              left: `${heart.left}%`,
              top: '-50px',
              animation: `float ${heart.duration}s ease-in-out infinite`,
              animationDelay: `${heart.delay}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="fade-in">
          {/* Names */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-4 text-romantic animate-pulse">
            {content?.maleFirstName} ❤️ {content?.femaleFirstName}
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-rose-700 max-w-2xl mx-auto mb-8 text-romantic leading-relaxed slide-in">
            {content?.tagline}
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent to-rose-400"></div>
            <span className="text-3xl twinkle">✨</span>
            <div className="w-12 h-1 bg-gradient-to-l from-transparent to-rose-400"></div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => {
              document.getElementById('music').scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-smooth transform hover:scale-105 shadow-lg"
          >
            Explore Our Story ↓
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-rose-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
