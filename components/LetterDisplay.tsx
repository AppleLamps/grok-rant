'use client';

import { useState } from 'react';
import { useToast } from '@/lib/useToast';
import { ToastContainer } from '@/components/Toast';

interface LetterDisplayProps {
  letter: string;
  username: string;
  onRegenerate: () => void;
}

export default function LetterDisplay({ letter, username, onRegenerate }: LetterDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      success('Letter copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      error('Failed to copy letter. Please try again.');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([letter], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trump-letter-${username}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success('Letter downloaded successfully! 💾');
    } catch (err) {
      console.error('Failed to download:', err);
      error('Failed to download letter. Please try again.');
    }
  };

  const handleShareX = () => {
    const tweetText = `I just got a personalized letter from President Trump! 🇺🇸\n\nGenerate yours at [YOUR_URL] #TrumpLetter #GrokAI`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    success('Opening X to share your letter! 🐦');
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="w-full max-w-4xl mx-auto mt-8 space-y-4 mobile-spacing">
        <div className="bg-[var(--navy-light)] rounded-xl shadow-2xl p-6 sm:p-8 border-4 border-[var(--gold)] relative overflow-hidden">
          {/* Gold accent corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-100 rounded-bl-full"></div>

          {/* Presidential Header */}
          <div className="text-center mb-6 pb-6 border-b-2 border-[var(--gold)] relative">
            <div className="text-5xl mb-3">🇺🇸</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">
              LETTER FROM PRESIDENT TRUMP
            </h2>
            <p className="text-sm text-gray-300 mt-2">To: @{username}</p>
          </div>

          {/* Letter Content */}
          <div className="bg-[var(--parchment)] rounded-lg p-4 sm:p-6 shadow-inner border border-gray-200">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-black leading-relaxed font-serif text-base sm:text-lg">
                {letter}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-animate w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] text-black font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 min-h-[48px]"
              aria-label={copied ? "Letter copied to clipboard" : "Copy letter to clipboard"}
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5 checkmark-animate" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Letter
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="btn-animate w-full sm:w-auto px-6 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 min-h-[48px]"
              aria-label="Download letter as text file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>

            <button
              type="button"
              onClick={handleShareX}
              className="btn-animate w-full sm:w-auto px-6 py-3 bg-black text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 min-h-[48px]"
              aria-label="Share letter on X (Twitter)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>

            <button
              type="button"
              onClick={onRegenerate}
              className="btn-animate w-full sm:w-auto px-6 py-3 bg-red-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 min-h-[48px]"
              aria-label="Generate a new letter"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </button>
          </div>
        </div>

        {/* Fun disclaimer */}
        <div className="text-center text-sm text-gray-400 italic mt-4">
          <p>⚠️ This is a parody letter generated by AI. Not actually from Donald Trump.</p>
        </div>
      </div>
    </>
  );
}

