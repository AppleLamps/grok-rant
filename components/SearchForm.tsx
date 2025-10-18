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
    <div className="w-full max-w-2xl mx-auto mobile-spacing">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-[var(--foreground)] mb-3">
            Enter X (Twitter) Username
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" aria-hidden="true">
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
                className="w-full pl-10 pr-4 py-4 border-2 border-gray-600 bg-[var(--navy-light)] text-white rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-[var(--gold)] disabled:bg-gray-800 disabled:cursor-not-allowed text-lg transition-all placeholder:text-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              aria-describedby={isLoading ? "loading-status" : undefined}
              className="btn-animate px-8 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] text-black font-bold rounded-lg hover:from-[var(--gold-dark)] hover:to-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-dark)] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none shadow-lg min-h-[56px]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Searching...
                </span>
              ) : (
                'Search'
              )}
            </button>
          </div>
          {error && (
            <div id="username-error" className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <p className="text-sm text-red-800 font-medium">{error}</p>
              <p className="text-xs text-red-600 mt-1">💡 Try checking the spelling or use a different username</p>
            </div>
          )}
          {isLoading && (
            <div id="loading-status" className="sr-only">Searching X and analyzing posts...</div>
          )}
        </div>
      </form>
    </div>
  );
}

