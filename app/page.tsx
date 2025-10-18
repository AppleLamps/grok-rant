'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import PostsPreview from '@/components/PostsPreview';
import LetterDisplay from '@/components/LetterDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { UserAnalysis, SearchPostsResponse, GenerateLetterResponse } from '@/lib/types';

type AppState = 'idle' | 'searching' | 'preview' | 'generating' | 'complete';

export default function Home() {
  const [state, setState] = useState<AppState>('idle');
  const [analysis, setAnalysis] = useState<UserAnalysis | null>(null);
  const [letter, setLetter] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSearch = async (username: string) => {
    setState('searching');
    setError('');
    setAnalysis(null);
    setLetter('');

    try {
      const response = await fetch('/api/search-user-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data: SearchPostsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search user posts');
      }

      if (data.analysis) {
        setAnalysis(data.analysis);
        setState('preview');
      } else {
        throw new Error('No analysis data received');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search user posts. Please try again.');
      setState('idle');
    }
  };

  const handleGenerateLetter = async () => {
    if (!analysis) return;

    setState('generating');
    setError('');

    try {
      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: analysis.username,
          analysis,
        }),
      });

      const data: GenerateLetterResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate letter');
      }

      if (data.letter) {
        setLetter(data.letter);
        setState('complete');
      } else {
        throw new Error('No letter generated');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate letter. Please try again.');
      setState('preview');
    }
  };

  const handleRegenerate = () => {
    handleGenerateLetter();
  };

  const handleNewSearch = () => {
    setState('idle');
    setAnalysis(null);
    setLetter('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="trump-hero trump-hero-frame relative overflow-hidden" role="banner">
        {/* Faint stars background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_20px,rgba(255,255,255,0.06),transparent_2px)] [background-size:40px_40px]"></div>
        {/* Oversized crest watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <img src="/seal.svg" alt="" aria-hidden="true" className="opacity-12 blur-[0.3px] w-[600px] sm:w-[720px] translate-y-4" />
        </div>
        {/* Official border frame */}
        <div className="pointer-events-none absolute inset-0 border-4 border-[var(--gold)]/30 rounded-lg m-4"></div>
        {/* Corner emblems */}
        <div className="pointer-events-none absolute top-4 left-4 w-12 h-12 opacity-20">
          <img src="/seal.svg" alt="" aria-hidden="true" className="w-full h-full" />
        </div>
        <div className="pointer-events-none absolute top-4 right-4 w-12 h-12 opacity-20">
          <img src="/seal.svg" alt="" aria-hidden="true" className="w-full h-full" />
        </div>

        <div className="container mx-auto px-6 py-8 sm:py-12 relative mobile-spacing">
          <div className="flex items-center justify-center mb-3">
            <div className="presidential-badge w-20 h-20 sm:w-24 sm:h-24 rounded-full trump-gradient-gold flex items-center justify-center border-4 border-white/30 overflow-hidden shadow-2xl">
              <img src="/seal.svg" alt="Presidential crest" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-lg" />
            </div>
          </div>
          <h1 className="presidential-title text-4xl sm:text-5xl md:text-6xl font-black text-center text-white font-[family-name:var(--font-playfair)] leading-none mt-2 drop-shadow-2xl">
            TRUMP LETTER<br/>GENERATOR
          </h1>

          {/* Decorative divider with eagle elements */}
          <div className="flex items-center justify-center mt-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-[var(--gold)]"></div>
              <div className="text-[var(--gold)] text-lg">★</div>
              <div className="mx-auto h-[3px] w-24 rounded-full trump-gradient-gold shadow-lg"></div>
              <div className="text-[var(--gold)] text-lg">★</div>
              <div className="w-6 h-px bg-[var(--gold)]"></div>
            </div>
          </div>

          <p className="text-center text-[var(--foreground)] mt-2 text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Get a personalized letter from President Trump based on your X profile
          </p>

          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/20">
              <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg"></span>
              <span className="text-xs text-[var(--foreground)] font-semibold">Powered by Grok AI</span>
            </div>
          </div>
        </div>

        {/* Enhanced bottom border */}
        <div className="h-3 trump-gradient-gold shadow-inner"></div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6 sm:py-8 flex-1 relative" role="main">
        {/* Official content frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--gold)]/5 to-transparent pointer-events-none"></div>

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 mobile-spacing">
            <div className="bg-red-900/60 border-4 border-red-500/80 rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              {/* Error background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-16 h-16">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-500">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>

              <div className="flex items-start gap-6 relative">
                <div className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center border-2 border-red-400 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl mb-2">Executive Alert: Operation Failed</h3>
                  <p className="text-red-100 text-lg font-medium mb-4">{error}</p>

                  <div className="bg-black/40 border border-red-500/30 rounded-lg p-4">
                    <p className="font-bold text-red-100 text-base mb-3 uppercase tracking-wide">🔧 Troubleshooting Protocol:</p>
                    <ul className="space-y-2 text-base text-red-100">
                      <li className="flex items-start gap-3">
                        <span className="text-red-300 mt-0.5 text-lg">•</span>
                        <span>Verify username spelling and format</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-300 mt-0.5 text-lg">•</span>
                        <span>Confirm account is public and active</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-300 mt-0.5 text-lg">•</span>
                        <span>Allow system to process request</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-4 right-4 w-8 h-8 opacity-20">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-400">
                  <path d="M14.23 12.004a2.236 2.236 0 0 0 2.235-2.236 2.236 2.236 0 0 0-2.235-2.236 2.236 2.236 0 0 0-2.235 2.236 2.236 2.236 0 0 0 2.235 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602a3.936 3.936 0 0 0-3.93 3.93c0 3.208 3.108 6.51 8.817 10.17a.5.5 0 0 0 .535 0c5.71-3.66 8.817-7.04 8.817-10.17a3.936 3.936 0 0 0-3.93-3.93z"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Search Form - Always visible */}
        {(state === 'idle' || state === 'searching') && (
          <>
            <p className="text-center text-sm text-[var(--foreground)] mb-4 opacity-90">Enter an X (Twitter) username to analyze and generate a personalized Trump-style letter.</p>
            <SearchForm onSearch={handleSearch} isLoading={state === 'searching'} />
            {state === 'searching' && (
              <LoadingSpinner message="Searching X and analyzing posts..." />
            )}
          </>
        )}

        {/* Posts Preview */}
        {state === 'preview' && analysis && (
          <>
            <PostsPreview
              analysis={analysis}
              onGenerateLetter={handleGenerateLetter}
              isGenerating={false}
            />
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={handleNewSearch}
                className="btn-animate text-[var(--gold)] hover:text-[var(--gold-dark)] underline font-semibold text-lg"
              >
                Search another user
              </button>
            </div>
          </>
        )}

        {/* Generating State */}
        {state === 'generating' && (
          <LoadingSpinner message="President Trump is writing your letter..." />
        )}

        {/* Letter Display */}
        {state === 'complete' && letter && analysis && (
          <>
            <LetterDisplay
              letter={letter}
              username={analysis.username}
              onRegenerate={handleRegenerate}
            />
            <div className="text-center mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                onClick={handleNewSearch}
                className="btn-animate px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] text-black font-bold rounded-lg shadow-lg min-h-[48px]"
              >
                Search another user
              </button>
              <button
                type="button"
                onClick={() => setState('preview')}
                className="btn-animate px-6 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-lg min-h-[48px]"
              >
                View analysis
              </button>
            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-black/60 border-t-4 border-[var(--gold)]/80 relative overflow-hidden" role="contentinfo">
        {/* Footer background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 left-8 w-12 h-12">
            <img src="/seal.svg" alt="" aria-hidden="true" className="w-full h-full" />
          </div>
          <div className="absolute top-2 right-8 w-12 h-12">
            <img src="/seal.svg" alt="" aria-hidden="true" className="w-full h-full" />
          </div>
        </div>

        {/* Official footer seal */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-[var(--navy-dark)]/80 border-2 border-[var(--gold)]/50 rounded-full p-4 backdrop-blur-sm">
            <img src="/seal.svg" alt="Official Seal" className="w-8 h-8 opacity-60" />
          </div>
        </div>

        <div className="container mx-auto px-6 py-4 text-center relative">
          {/* Main footer content */}
          <div className="space-y-2">
            <p className="text-[var(--foreground)] font-semibold text-xs">
              © 2024 Presidential Letter Generator
            </p>
            <p className="text-yellow-200/80 text-[10px] font-medium">
              ⚠️ Parody tool for entertainment only • AI-generated content • Not official correspondence
            </p>
          </div>

          {/* Decorative divider */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-[var(--gold)]/50"></div>
            <div className="text-[var(--gold)] text-xs">★★★</div>
            <div className="w-12 h-px bg-[var(--gold)]/50"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

