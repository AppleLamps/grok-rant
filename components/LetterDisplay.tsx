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
  const sanitizedUser = username.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const referenceCode = `FILE 45-${sanitizedUser || 'PATRIOT'}`;
  const issuedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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
      <div className="w-full max-w-5xl mx-auto mt-10 space-y-6 mobile-spacing">
        <div className="letter-backdrop">
          <div className="constellation-overlay" aria-hidden="true"></div>
          <div className="presidential-letter">
            <div className="corner-medallion top-6 left-6" aria-hidden="true">
              <img src="/seal.svg" alt="Presidential insignia" />
            </div>
            <div className="corner-medallion top-6 right-6" aria-hidden="true">
              <img src="/seal.svg" alt="Presidential insignia" />
            </div>
            {/* Header */}
            <div className="trump-gradient-blue px-6 sm:px-10 py-8 border-b-2 border-[var(--gold)] text-center relative ribbon-top overflow-hidden">
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(2px_2px_at_20px_20px,white,transparent_2px)] [background-size:48px_48px]"></div>
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60"></div>
              <div className="relative">
                <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full trump-gradient-gold border-[3px] border-white/30 flex items-center justify-center presidential-badge overflow-hidden">
                  <img src="/seal.svg" alt="Presidential crest" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg" />
                </div>
                <h2 className="presidential-title mt-4 text-[clamp(1.65rem,2vw+1rem,2.5rem)] font-black text-white font-[family-name:var(--font-playfair)]">
                  LETTER FROM PRESIDENT TRUMP
                </h2>
                <p className="executive-subtitle mt-2 text-[0.7rem] sm:text-xs uppercase text-white/80">
                  Executive Office of the President
                </p>
                <p className="executive-subtitle text-[0.65rem] sm:text-[0.75rem] uppercase text-white/70 mt-1">
                  The White House • Washington, District of Columbia
                </p>
                <p className="mt-4 text-sm sm:text-base font-semibold text-white/90">
                  To: @{username}
                </p>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm border-y border-white/10 px-6 sm:px-10 py-4 flex flex-col sm:flex-row gap-3 sm:gap-6 text-white/70 text-[0.7rem] sm:text-xs tracking-[0.35em] uppercase justify-between">
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/40 bg-white/10 text-[0.6rem] font-bold text-white">45</span>
                Presidential Correspondence
              </span>
              <span className="tracking-[0.3em]">Issued {issuedDate}</span>
              <span className="tracking-[0.3em]">Reference {referenceCode}</span>
            </div>

            {/* Letter Content */}
            <div className="p-6 sm:p-8">
              <div className="parchment parchment-edge parchment-deluxe rounded-2xl p-6 sm:p-8 border border-black/10 relative">
                <div className="parchment-grid" aria-hidden="true"></div>
                {/* Watermark */}
                <img src="/seal.svg" alt="Watermark" className="pointer-events-none select-none opacity-10 absolute -right-8 -bottom-10 w-56 sm:w-64 h-56 sm:h-64" />
                <div className="prose prose-lg max-w-none">
                  <div className="letter-body whitespace-pre-wrap leading-relaxed font-serif text-[var(--parchment-ink)] text-base sm:text-lg">
                    {letter}
                  </div>
                  <div className="letter-footer">
                    <div className="flex flex-col gap-1 text-[var(--parchment-ink)]/65 text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase">
                      <span>The White House</span>
                      <span className="tracking-[0.28em]">Washington, District of Columbia</span>
                    </div>
                    <div className="wax-seal" aria-hidden="true">
                      <img src="/seal.svg" alt="Embossed presidential seal" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-10">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 sm:px-8 pb-8 pt-4 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={handleCopy}
                className="btn-animate w-full sm:w-auto px-6 py-3 trump-gradient-gold text-black font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 min-h-[48px] border border-white/10"
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
                className="btn-animate w-full sm:w-auto px-6 py-3 trump-gradient-blue text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 min-h-[48px] border border-white/10"
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
                className="btn-animate w-full sm:w-auto px-6 py-3 bg-black text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 min-h-[48px] border border-white/10"
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
                className="btn-animate w-full sm:w-auto px-6 py-3 trump-gradient-red text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 min-h-[48px] border border-white/10"
                aria-label="Generate a new letter"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* Fun disclaimer */}
        <div className="text-center text-xs text-white/60 uppercase tracking-[0.35em] italic">
          <p>Parody letter generated by AI • Not official correspondence</p>
        </div>
      </div>
    </>
  );
}

