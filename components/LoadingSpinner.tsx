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
    <div className="w-full max-w-4xl mx-auto mt-16 mobile-spacing">
      <div className="bg-[var(--navy-light)]/95 border-4 border-[var(--gold)]/80 rounded-2xl shadow-2xl p-10 backdrop-blur-sm relative overflow-hidden">
        {/* Presidential background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-16 h-16">
            <img src="/seal.svg" alt="" aria-hidden="true" className="w-full h-full" />
          </div>
        </div>

        {/* Official status ribbon */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-red-600 via-white to-blue-600 text-black font-bold text-sm tracking-widest uppercase px-6 py-2 rounded-full shadow-lg border border-white/30">
            EXECUTIVE PROCESSING UNIT
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Enhanced Spinner with presidential seal */}
          <div className="relative" role="status" aria-label="Loading">
            <div className="w-24 h-24 border-6 border-yellow-200/30 border-t-[var(--gold)] rounded-full animate-spin shadow-lg" aria-hidden="true"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[var(--navy-dark)] rounded-full flex items-center justify-center border-2 border-[var(--gold)]/50" aria-hidden="true">
              <img src="/seal.svg" alt="" className="w-10 h-10 opacity-80" />
            </div>
          </div>

          {/* Official message */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-black text-[var(--gold)] uppercase tracking-wide">
              Presidential Processing Active
            </h3>
            <p className="text-lg font-bold text-white">{message}</p>
            <p className="text-sm text-[var(--foreground)]/80 font-medium">Intelligence analysis in progress...</p>
          </div>

          {/* Presidential Quote Box */}
          <div className="bg-[var(--navy-dark)]/90 border-2 border-[var(--gold)]/60 rounded-xl p-6 shadow-xl backdrop-blur-sm max-w-lg relative">
            {/* Quote icon */}
            <div className="absolute -top-3 left-6 bg-[var(--gold)] text-black text-xl font-bold px-2 rounded-full">
              "
            </div>
            <p className="text-base italic text-gray-200 font-semibold leading-relaxed pt-2">"{quote}"</p>
            <div className="mt-4 pt-4 border-t border-[var(--gold)]/30">
              <p className="text-sm text-[var(--gold)] font-bold uppercase tracking-wide">
                — The 45th President of the United States
              </p>
            </div>
          </div>

          {/* Enhanced Progress Indicators */}
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <div className="w-4 h-4 bg-red-600 rounded-full animate-bounce shadow-lg [animation-delay:0ms]"></div>
              <div className="w-4 h-4 bg-white border-2 border-[var(--gold)] rounded-full animate-bounce shadow-lg [animation-delay:150ms]"></div>
              <div className="w-4 h-4 bg-[var(--gold)] rounded-full animate-bounce shadow-lg [animation-delay:300ms]"></div>
            </div>
            <span className="text-sm text-[var(--foreground)]/70 font-semibold uppercase tracking-wider">
              Processing...
            </span>
          </div>

          {/* Security clearance indicator */}
          <div className="bg-black/40 border border-[var(--gold)]/50 rounded-lg px-4 py-2 backdrop-blur-sm">
            <p className="text-xs text-[var(--gold)] font-bold uppercase tracking-wide text-center">
              🔐 Security Clearance: ACTIVE • Executive Level Access Granted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

