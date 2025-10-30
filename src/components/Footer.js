'use client';

export default function Footer({ content }) {
  const startDate = content?.startDate ? new Date(content.startDate) : new Date('2024-01-01');
  const formattedDate = startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <footer className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-2xl sm:text-3xl font-semibold mb-4 text-romantic heart-pulse">
          I love you forever ❤️
        </p>

        <p className="text-lg opacity-90 slide-in">
          Our journey began on {formattedDate}
        </p>

        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-sm opacity-75 fade-in">
            Made with love by Ahmed for Mai ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
