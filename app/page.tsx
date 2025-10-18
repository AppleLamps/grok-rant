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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-amber-50 to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-amber-100 to-blue-600 shadow-xl relative overflow-hidden" role="banner">
        {/* Gold accent stripes */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>

        <div className="container mx-auto px-4 py-8 sm:py-10 relative mobile-spacing">
          <div className="flex items-center justify-center mb-3">
            <span className="text-5xl sm:text-6xl">🇺🇸</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-gray-900 font-[family-name:var(--font-playfair)] leading-tight">
            Trump Letter Generator
          </h1>
          <p className="text-center text-gray-800 mt-3 text-base sm:text-lg font-medium max-w-2xl mx-auto">
            Get a personalized letter from President Trump based on your X profile
          </p>
          <p className="text-center text-sm text-gray-700 mt-2 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Powered by Grok AI
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12" role="main">
        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 mobile-spacing">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-900 font-bold text-lg">Oops! Something went wrong</h3>
                  <p className="text-red-800 text-base mt-2 font-medium">{error}</p>
                  <div className="mt-4 p-3 bg-white/50 rounded-lg">
                    <p className="font-semibold text-red-800 text-sm mb-2">💡 Try these suggestions:</p>
                    <ul className="space-y-1.5 text-sm text-red-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>Double-check the username spelling</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>Make sure the account exists and is public</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>Wait a moment and try again</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Form - Always visible */}
        {(state === 'idle' || state === 'searching') && (
          <>
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
                className="btn-animate text-blue-600 hover:text-blue-800 underline font-semibold text-lg"
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
                className="btn-animate px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg min-h-[48px]"
              >
                Search another user
              </button>
              <button
                type="button"
                onClick={() => setState('preview')}
                className="btn-animate px-6 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-lg min-h-[48px]"
              >
                View analysis
              </button>
            </div>
          </>
        )}

        {/* Instructions */}
        {state === 'idle' && (
          <div className="max-w-3xl mx-auto mt-12 mobile-spacing">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-6 sm:p-8 border-2 border-blue-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)] text-center">
                How it works:
              </h2>
              <ol className="space-y-4 text-gray-700">
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">1</span>
                  <span className="pt-1 text-base sm:text-lg">Enter any X (Twitter) username</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">2</span>
                  <span className="pt-1 text-base sm:text-lg">Grok AI searches and analyzes their posts to understand their interests and personality</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">3</span>
                  <span className="pt-1 text-base sm:text-lg">AI generates a personalized letter written in President Trump's distinctive style</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">4</span>
                  <span className="pt-1 text-base sm:text-lg">Copy, download, or share your letter!</span>
                </li>
              </ol>
              <div className="mt-8 p-4 sm:p-5 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg shadow-md">
                <p className="text-sm sm:text-base text-yellow-900">
                  <strong className="text-yellow-800">⚠️ Note:</strong> This is a parody/entertainment tool. Letters are generated by AI and are not actually from Donald Trump.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 border-t-2 border-gray-300 mt-20" role="contentinfo">
        <div className="container mx-auto px-4 py-8 text-center text-gray-700">
          <p className="font-semibold text-base">Built with Next.js, React, and Grok AI</p>
          <p className="mt-2 text-sm">For entertainment purposes only</p>
          <p className="mt-3 text-xs text-gray-500">© 2024 Trump Letter Generator</p>
        </div>
      </footer>
    </div>
  );
}

