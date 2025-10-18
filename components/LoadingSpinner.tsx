'use client';

import { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const TRUMP_QUOTES = [
  "Nobody writes letters better than me, believe me!",
  "This is going to be TREMENDOUS!",
  "We're making letters great again!",
  "You're going to love this letter, it's going to be fantastic!",
  "I write the best letters, everyone says so!",
  "This letter is going to be HUGE!",
  "Nobody knows letters like I know letters!",
  "We're going to make this the greatest letter ever written!",
  "Believe me, this is going to be incredible!",
  "I'm very good at letters, probably the best!",
];

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  const [quote, setQuote] = useState(TRUMP_QUOTES[0]);

  useEffect(() => {
    // Rotate through quotes every 3 seconds
    const interval = setInterval(() => {
      setQuote(TRUMP_QUOTES[Math.floor(Math.random() * TRUMP_QUOTES.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mobile-spacing">
      <div className="bg-[var(--navy-light)] rounded-xl shadow-2xl p-8 border-2 border-[var(--gold)]">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Spinner */}
          <div className="relative" role="status" aria-label="Loading">
            <div className="w-20 h-20 border-4 border-yellow-200/50 border-t-[var(--gold)] rounded-full animate-spin" aria-hidden="true"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl" aria-hidden="true">
              🇺🇸
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-3">
            <p className="text-xl font-bold text-white">{message}</p>
            <p className="text-sm text-gray-300">This may take a moment...</p>
          </div>

          {/* Trump Quote */}
          <div className="bg-[var(--navy-dark)] rounded-lg p-4 border-l-4 border-[var(--gold)] shadow-md max-w-md">
            <p className="text-sm italic text-gray-200 font-medium">"{quote}"</p>
            <p className="text-xs text-gray-400 mt-2 text-right">- Donald J. Trump (probably)</p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce [animation-delay:0ms]"></div>
            <div className="w-3 h-3 bg-white border-2 border-[var(--gold)] rounded-full animate-bounce [animation-delay:150ms]"></div>
            <div className="w-3 h-3 bg-[var(--gold)] rounded-full animate-bounce [animation-delay:300ms]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

