'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Partner, SheetEvent } from '@/lib/sheets';
import PartnerCard from './PartnerCard';
import PartnerListRow from './PartnerListRow';
import EventsSidebar from './EventsSidebar';

type ViewMode = 'grid' | 'list';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1ZKUJX53bNGfduy9wyBpykxpjd-_xaIy1Mabo4RRxr0g/edit?usp=sharing';

interface Props {
  partners: Partner[];
  events: SheetEvent[];
  eventsEnabled: boolean;
}

export default function PartnerDirectory({ partners, events, eventsEnabled }: Props) {
  const [search, setSearch] = useState('');
  const [selectedFocus, setSelectedFocus] = useState('');
  const [selectedFee, setSelectedFee] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const urgentCount = events.filter((e) => {
    if (!e.deadline) return false;
    const m = e.deadline.match(/Date\((\d+),(\d+),(\d+)\)/);
    const d = m
      ? new Date(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]))
      : new Date(e.deadline);
    if (isNaN(d.getTime())) return false;
    const days = Math.ceil((d.getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 30;
  }).length;

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
          <div className="ml-auto flex items-center gap-4">
            {eventsEnabled && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="relative flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors
                  text-black text-sm font-medium px-4 py-2 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Events
                {urgentCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs
                    w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                    {urgentCount}
                  </span>
                )}
              </button>
            )}
            <div className="text-right hidden sm:block">
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
          <div className="flex items-center gap-3">
            {/* Mobile sheet link */}
            <a
              href={SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-black sm:hidden transition-colors"
            >
              View source sheet ↗
            </a>
            {/* View toggle */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setView('grid')}
                title="Grid view"
                className={`px-2.5 py-1.5 transition-colors ${
                  view === 'grid'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-400 hover:text-gray-700'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="1" y="1" width="6" height="6" rx="1"/>
                  <rect x="9" y="1" width="6" height="6" rx="1"/>
                  <rect x="1" y="9" width="6" height="6" rx="1"/>
                  <rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                title="List view"
                className={`px-2.5 py-1.5 border-l border-gray-200 transition-colors ${
                  view === 'list'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-400 hover:text-gray-700'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="1" y="2" width="14" height="2" rx="1"/>
                  <rect x="1" y="7" width="14" height="2" rx="1"/>
                  <rect x="1" y="12" width="14" height="2" rx="1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <PartnerCard key={i} partner={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((p, i) => (
                <PartnerListRow key={i} partner={p} />
              ))}
            </div>
          )
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

      {eventsEnabled && (
        <EventsSidebar
          events={events}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
