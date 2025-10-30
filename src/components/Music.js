'use client';

import { useState, useRef } from 'react';

export default function Music({ content }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!content?.song?.url) {
    return null;
  }

  return (
    <section id="music" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-rose-700 mb-12 text-romantic animate-pulse">
          Our Song 🎵
        </h2>

        <div className="glass rounded-3xl p-8 sm:p-12 shadow-2xl glow-effect message-slide-up">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Cover Image */}
            <div className="flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56">
              {content?.songCover?.url ? (
                <img
                  src={content.songCover.url}
                  alt="Song Cover"
                  className="w-full h-full object-cover rounded-2xl shadow-lg transform transition-smooth hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-300 to-pink-400 rounded-2xl flex items-center justify-center text-6xl shadow-lg heart-pulse">
                  🎵
                </div>
              )}
            </div>

            {/* Player Controls */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-semibold text-rose-700 mb-4 text-romantic">
                Our Love Song
              </h3>

              <p className="text-rose-600 mb-8">
                Listen to the melody of our love story
              </p>

              {/* Audio Player */}
              <audio
                ref={audioRef}
                src={content.song.url}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Play Button */}
              <button
                onClick={togglePlay}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-smooth transform hover:scale-110 mb-6 shadow-lg"
              >
                {isPlaying ? (
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <p className="text-sm text-rose-600">
                {isPlaying ? 'Now Playing...' : 'Click to play'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
