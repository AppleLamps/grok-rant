'use client';

import { UserAnalysis } from '@/lib/types';

interface PostsPreviewProps {
  analysis: UserAnalysis;
  onGenerateLetter: () => void;
  isGenerating: boolean;
}

export default function PostsPreview({ analysis, onGenerateLetter, isGenerating }: PostsPreviewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6 mobile-spacing">
      <div className="bg-[var(--navy-light)] rounded-xl shadow-2xl p-6 sm:p-8 border-2 border-[var(--gold)]">
        <h2 className="text-2xl font-bold text-white mb-4">
          Profile Analysis for @{analysis.username}
        </h2>

        <div className="space-y-6">
          {/* Main Topics */}
          <div className="bg-[var(--navy-dark)] p-4 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Main Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.mainTopics.map((topic, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-200 text-blue-900 rounded-full text-sm font-medium shadow-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Personality Traits */}
          <div className="bg-[var(--navy-dark)] p-4 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              Personality Traits
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.personalityTraits.map((trait, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-green-200 text-green-900 rounded-full text-sm font-medium shadow-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Communication Style */}
          <div className="bg-[var(--navy-dark)] p-4 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              Communication Style
            </h3>
            <p className="text-[var(--foreground)] text-base leading-relaxed">{analysis.communicationStyle}</p>
          </div>

          {/* Key Interests */}
          <div className="bg-[var(--navy-dark)] p-4 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Key Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keyInterests.map((interest, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-red-200 text-red-900 rounded-full text-sm font-medium shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Letter Button */}
        <div className="mt-6 pt-6 border-t-2 border-gray-700">
          <button
            type="button"
            onClick={onGenerateLetter}
            disabled={isGenerating}
            className="btn-animate w-full px-6 py-5 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] text-black font-bold text-lg sm:text-xl rounded-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[64px]"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Trump Letter...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🇺🇸 Generate Trump Letter 🇺🇸
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

