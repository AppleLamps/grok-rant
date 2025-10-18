import type { Metadata } from 'next';
import { Playfair_Display, Merriweather } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// Change Inter to Merriweather for the body font
const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
  weight: ['400', '700'] // Include weights
});

export const metadata: Metadata = {
  title: 'Trump Letter Generator - Powered by Grok',
  description: 'Get a personalized letter from President Trump based on your X (Twitter) profile',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Update the body class to use the new font variable */}
      <body className={`${merriweather.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

