'use client';

import { useState } from 'react';
import { Partner } from '@/lib/sheets';

const TAG_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-green-100 text-green-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
  'bg-teal-100 text-teal-800',
];

function ensureUrl(url: string): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
}

export default function PartnerListRow({ partner }: { partner: Partner }) {
  const [expanded, setExpanded] = useState(false);
  const allFocuses = [...partner.focuses, ...partner.additionalFocusAreas];

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      {/* Main row */}
      <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1.6fr_auto] gap-x-4 gap-y-2 px-4 py-3 items-center">
        {/* Left: name + mission */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-gray-900">{partner.name}</span>
            {partner.legalStatus && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">
                {partner.legalStatus}
              </span>
            )}
          </div>
          {partner.mission && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{partner.mission}</p>
          )}
        </div>

        {/* Middle: tags + meta — hidden on small screens */}
        <div className="hidden sm:block min-w-0">
          <div className="flex flex-wrap gap-1 mb-1">
            {allFocuses.slice(0, 2).map((f, i) => (
              <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                {f}
              </span>
            ))}
            {allFocuses.length > 2 && (
              <span className="text-xs text-gray-400">+{allFocuses.length - 2}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">
            {[partner.targetOrgSize, partner.programDuration].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* Right: fee + actions */}
        <div className="flex items-center gap-3 shrink-0">
          {partner.feeStructure && (
            <span className="hidden sm:inline text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full whitespace-nowrap">
              {partner.feeStructure}
            </span>
          )}
          {partner.email && (
            <a
              href={`mailto:${partner.email}`}
              className="text-xs text-indigo-600 hover:text-indigo-800 hidden sm:inline"
              title={partner.email}
            >
              ✉
            </a>
          )}
          {partner.website && (
            <a
              href={ensureUrl(partner.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 hover:text-indigo-800"
              title="Website"
            >
              🌐
            </a>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-400 hover:text-gray-700 ml-1"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-600">
          {partner.serviceDescription && (
            <p className="sm:col-span-2"><span className="font-medium text-gray-700">Services:</span> {partner.serviceDescription}</p>
          )}
          {partner.serviceAreas && <p><span className="font-medium text-gray-700">Areas:</span> {partner.serviceAreas}</p>}
          {partner.targetSectors && <p><span className="font-medium text-gray-700">Sectors:</span> {partner.targetSectors}</p>}
          {partner.trainingFormats && <p><span className="font-medium text-gray-700">Formats:</span> {partner.trainingFormats}</p>}
          {partner.costPerOrg && <p><span className="font-medium text-gray-700">Cost:</span> {partner.costPerOrg}</p>}
          {partner.staffStrength && <p><span className="font-medium text-gray-700">Staff:</span> {partner.staffStrength}</p>}
          {partner.collaborationOpportunities && (
            <p className="sm:col-span-2"><span className="font-medium text-gray-700">Collaboration:</span> {partner.collaborationOpportunities}</p>
          )}
          {partner.email && (
            <p><span className="font-medium text-gray-700">Email:</span>{' '}
              <a href={`mailto:${partner.email}`} className="text-indigo-600 hover:text-indigo-800">{partner.email}</a>
            </p>
          )}
          {partner.contactPerson && (
            <p><span className="font-medium text-gray-700">Contact:</span> {partner.contactPerson}{partner.contactPerson2 ? `, ${partner.contactPerson2}` : ''}</p>
          )}
        </div>
      )}
    </div>
  );
}
