/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
      aspectRatio: {
        'portrait': '3 / 4',
        'landscape': '4 / 3',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 1s ease-in',
        'slide-in': 'slideIn 0.8s ease-out',
        'fall-heart': 'fallHeart 3s ease-in forwards',
        'fall-star': 'fallStar 4s ease-in forwards',
        'twinkle': 'twinkle 1.5s ease-in-out infinite',
        'message-slide-up': 'messageSlideUp 0.8s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fallHeart: {
          '0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        fallStar: {
          '0%': { transform: 'translateY(-50px) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) scale(0.5)', opacity: '0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        messageSlideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(219, 39, 119, 0.3), 0 0 10px rgba(236, 72, 153, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(219, 39, 119, 0.6), 0 0 30px rgba(236, 72, 153, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
