'use client';

import { useState } from 'react';

interface SearchFormProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = username.trim().replace('@', '');

    if (!cleanUsername) {
      setError('Please enter a valid X username');
      return;
    }

    if (cleanUsername.length < 1 || cleanUsername.length > 15) {
      setError('Username must be between 1 and 15 characters');
      return;
    }

    // Basic validation for username format
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    onSearch(cleanUsername);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mobile-spacing">
      <div className="presidential-form bg-[var(--navy-light)]/90 border-4 border-[var(--gold)]/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Presidential form background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-6 right-6 w-20 h-20">
            <img src="/seal.svg" alt="" aria-hidden="true" className="w-full h-full" />
          </div>
          <div className="absolute bottom-6 left-6 w-16 h-16">
            <img src="/seal.svg" alt="" aria-hidden="true" className="w-full h-full" />
          </div>
        </div>

        {/* Form header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--gold)] uppercase tracking-wide">
            Intelligence Gathering Protocol
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-base tracking-[0.15em] uppercase text-[var(--gold)] mb-4 font-bold text-center">
              Target X (Twitter) Username for Analysis
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--gold)] text-2xl font-bold" aria-hidden="true">
                  @
                </span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="elonmusk"
                  disabled={isLoading}
                  aria-describedby={error ? "username-error" : undefined}
                  className="w-full pl-12 pr-6 py-4 border-3 border-white/40 bg-[var(--navy-dark)]/90 backdrop-blur-sm text-white rounded-xl focus:ring-3 focus:ring-[var(--gold)] focus:border-[var(--gold)] disabled:bg-gray-800 disabled:cursor-not-allowed text-lg transition-all placeholder:text-gray-400 shadow-xl hover:border-white/60 font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                aria-describedby={isLoading ? "loading-status" : undefined}
                className="btn-animate px-8 py-4 trump-gradient-gold text-black font-black rounded-xl hover:opacity-95 focus:outline-none focus:ring-3 focus:ring-[var(--gold-dark)] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none shadow-2xl min-h-[56px] border-2 border-white/30 flex-shrink-0 text-base uppercase tracking-wide"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-base">EXECUTING...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="text-base">🚀 LAUNCH ANALYSIS</span>
                  </span>
                )}
              </button>
            </div>

            {/* Input validation status */}
            <div className="mt-4 text-center">
              <p className="text-sm text-[var(--foreground)]/70">
                Enter a valid X username (1-15 characters, letters/numbers/underscores only)
              </p>
            </div>

            {error && (
              <div id="username-error" className="mt-6 p-5 bg-red-900/30 border-2 border-red-500/60 rounded-xl backdrop-blur-sm" role="alert">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-lg text-red-300 font-bold uppercase tracking-wide">Security Clearance Denied</p>
                </div>
                <p className="text-base text-red-200 font-medium ml-11">{error}</p>
                <p className="text-sm text-red-300 mt-2 ml-11">🔒 Verify credentials and try again</p>
              </div>
            )}
            {isLoading && (
              <div id="loading-status" className="sr-only">Searching X and analyzing posts...</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

