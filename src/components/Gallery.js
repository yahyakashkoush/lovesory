'use client';

import { useState, useEffect } from 'react';

export default function Gallery({ content }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const images = content?.images || [];

  useEffect(() => {
    if (!autoPlay || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, images.length]);

  if (images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setAutoPlay(false);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-rose-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-rose-700 mb-12 text-romantic animate-pulse">
          Our Memories 📸
        </h2>

        <div className="relative">
          {/* Main Image - Portrait orientation */}
          <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl glow-effect">
            <div className="aspect-[3/4] relative">
              <img
                src={images[currentIndex].url}
                alt={`Memory ${currentIndex + 1}`}
                className="w-full h-full object-cover carousel-fade"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-rose-600 rounded-full p-3 transition-smooth z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-rose-600 rounded-full p-3 transition-smooth z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setAutoPlay(false);
                }}
                className={`h-2 rounded-full transition-smooth ${
                  index === currentIndex
                    ? 'bg-rose-500 w-8'
                    : 'bg-rose-300 w-2 hover:bg-rose-400'
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <p className="text-center text-rose-600 mt-4 text-sm">
            {currentIndex + 1} / {images.length}
          </p>
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-8">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setAutoPlay(false);
                }}
                className={`aspect-square rounded-lg overflow-hidden transition-smooth transform hover:scale-105 ${
                  index === currentIndex ? 'ring-2 ring-rose-500' : ''
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
