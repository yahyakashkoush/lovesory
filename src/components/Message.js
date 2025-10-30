'use client';

import { useEffect, useState } from 'react';

export default function Message({ content }) {
  const [particles, setParticles] = useState([]);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const fullMessage = content?.loveMessage || '';

  // Typewriter effect
  useEffect(() => {
    if (!fullMessage) return;

    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index < fullMessage.length) {
        setDisplayedText((prev) => prev + fullMessage[index]);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30); // Speed of typing

    return () => clearInterval(interval);
  }, [fullMessage]);

  // Particle animation
  useEffect(() => {
    const createParticle = () => {
      const id = Math.random();
      const type = Math.random() > 0.5 ? 'heart' : 'star';
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;

      const newParticle = {
        id,
        type,
        left,
        delay,
      };

      setParticles((prev) => [...prev, newParticle]);

      // Remove particle after animation completes
      const timeout = setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, type === 'heart' ? 3500 : 4500);

      return () => clearTimeout(timeout);
    };

    // Create particles at intervals
    const interval = setInterval(createParticle, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Falling particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={particle.type === 'heart' ? 'fall-heart' : 'fall-star'}
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            fontSize: particle.type === 'heart' ? '2rem' : '1.5rem',
          }}
        >
          {particle.type === 'heart' ? '❤️' : '✨'}
        </div>
      ))}

      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-rose-700 mb-12 text-romantic animate-pulse">
          A Message from My Heart 💌
        </h2>

        <div className="glass rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-rose-200 message-slide-up glow-effect">
          <div className="min-h-32 flex items-center justify-center">
            <p className="text-lg sm:text-xl text-rose-800 leading-relaxed text-center text-romantic whitespace-pre-wrap">
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center gap-4 mt-8">
            <span className="text-3xl twinkle">✨</span>
            <span className="text-3xl heart-pulse">❤️</span>
            <span className="text-3xl twinkle">✨</span>
          </div>
        </div>
      </div>
    </section>
  );
}
