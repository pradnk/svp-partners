'use client';

import { useState, useMemo } from 'react';
import { Partner } from '@/lib/sheets';
import PartnerCard from './PartnerCard';

export default function PartnerDirectory({ partners }: { partners: Partner[] }) {
  const [search, setSearch] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [selectedFee, setSelectedFee] = useState<string | null>(null);

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
      <div className="bg-indigo-700 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-indigo-300 text-sm mb-1 font-medium tracking-wide uppercase">
            SVP India · Bengaluru Chapter
          </p>
          <h1 className="text-3xl font-bold mb-1">Partner Directory</h1>
          <p className="text-indigo-300 text-sm">
            {partners.length} partners · data live from Google Sheets
          </p>
        </div>
      </div>

      {/* Sticky search + filters */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto space-y-3">
          <input
            type="text"
            placeholder="Search by name, expertise, mission..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          {allFocuses.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-400 font-medium shrink-0">Focus area:</span>
              {allFocuses.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFocus(selectedFocus === f ? null : f)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    selectedFocus === f
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {allFees.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-400 font-medium shrink-0">Fee:</span>
              {allFees.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFee(selectedFee === f ? null : f)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    selectedFee === f
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  {f}
                </button>
              ))}
              {hasFilters && (
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedFocus(null);
                    setSelectedFee(null);
                  }}
                  className="text-xs text-red-400 hover:text-red-600 ml-1"
                >
                  ✕ Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-xs text-gray-400 mb-4">
          {filtered.length === partners.length
            ? `${partners.length} partners`
            : `${filtered.length} of ${partners.length} partners`}
        </p>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <PartnerCard key={i} partner={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">No partners match your search. Try different keywords or clear the filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
