'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Partner } from '@/lib/sheets';
import PartnerCard from './PartnerCard';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1ZKUJX53bNGfduy9wyBpykxpjd-_xaIy1Mabo4RRxr0g/edit?usp=sharing';

export default function PartnerDirectory({ partners }: { partners: Partner[] }) {
  const [search, setSearch] = useState('');
  const [selectedFocus, setSelectedFocus] = useState('');
  const [selectedFee, setSelectedFee] = useState('');

  const allFocuses = useMemo(() => {
    const s = new Set<string>();
    partners.forEach((p) => [...p.focuses, ...p.additionalFocusAreas].forEach((f) => f && s.add(f)));
    return Array.from(s).sort();
  }, [partners]);

  const allFees = useMemo(() => {
    const s = new Set<string>();
    partners.forEach((p) => p.feeStructure && s.add(p.feeStructure));
    return Array.from(s).sort();
  }, [partners]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return partners.filter((p) => {
      if (q) {
        const hay = [p.name, p.mission, p.serviceDescription, p.focusArea, p.serviceAreas, ...p.focuses]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (selectedFocus) {
        const allF = [...p.focuses, ...p.additionalFocusAreas, p.focusArea];
        if (!allF.includes(selectedFocus)) return false;
      }
      if (selectedFee && p.feeStructure !== selectedFee) return false;
      return true;
    });
  }, [partners, search, selectedFocus, selectedFee]);

  const hasFilters = search || selectedFocus || selectedFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center gap-5">
          <Image
            src="/svp-logo-white.png"
            alt="SVP India"
            width={90}
            height={48}
            className="shrink-0"
            priority
          />
          <div className="border-l border-white/20 pl-5">
            <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-0.5">
              Bengaluru Chapter
            </p>
            <h1 className="text-xl font-bold leading-tight">Partner Directory</h1>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-white/40 text-xs">{partners.length} partners</p>
            <a
              href={SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white text-xs transition-colors"
            >
              View source sheet ↗
            </a>
          </div>
        </div>
      </header>

      {/* Search + Filters bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-2.5">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, expertise, mission…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Focus dropdown */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-400 font-medium whitespace-nowrap">Focus area</label>
              <select
                value={selectedFocus}
                onChange={(e) => setSelectedFocus(e.target.value)}
                className={`text-xs border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-black transition-colors ${
                  selectedFocus
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <option value="">All areas</option>
                {allFocuses.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <span className="text-gray-200 text-sm">|</span>

            {/* Fee chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-400 font-medium">Fee</span>
              {allFees.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFee(selectedFee === f ? '' : f)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    selectedFee === f
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setSelectedFocus(''); setSelectedFee(''); }}
                className="ml-auto text-xs text-gray-400 hover:text-black transition-colors"
              >
                Clear all ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400">
            {hasFilters
              ? `${filtered.length} of ${partners.length} partners`
              : `${partners.length} partners`}
          </p>
          {/* Mobile sheet link */}
          <a
            href={SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-black sm:hidden transition-colors"
          >
            View source sheet ↗
          </a>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <PartnerCard key={i} partner={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-sm">No partners match your filters.</p>
            <button
              onClick={() => { setSearch(''); setSelectedFocus(''); setSelectedFee(''); }}
              className="mt-3 text-xs text-black underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-8 py-6 text-center">
        <p className="text-xs text-gray-400">
          SVP India · Bengaluru Chapter ·{' '}
          <a href={SHEET_URL} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
            Edit in Google Sheets ↗
          </a>
        </p>
      </footer>
    </div>
  );
}
