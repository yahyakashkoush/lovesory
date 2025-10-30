import './globals.css';

export const metadata = {
  title: 'Ahmed ❤️ Mai - Our Love Story',
  description: 'A romantic love story website celebrating Ahmed and Mai',
  icons: {
    icon: '❤️',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
        {children}
      </body>
    </html>
  );
}
