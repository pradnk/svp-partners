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

export default function PartnerCard({ partner }: { partner: Partner }) {
  const [expanded, setExpanded] = useState(false);
  const allFocuses = [...partner.focuses, ...partner.additionalFocusAreas];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{partner.name}</h3>
        {partner.legalStatus && (
          <span className="shrink-0 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap">
            {partner.legalStatus}
          </span>
        )}
      </div>

      {/* Focus tags */}
      {allFocuses.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {(expanded ? allFocuses : allFocuses.slice(0, 3)).map((f, i) => (
            <span
              key={i}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
            >
              {f}
            </span>
          ))}
          {!expanded && allFocuses.length > 3 && (
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              +{allFocuses.length - 3} more
            </button>
          )}
        </div>
      )}

      {/* Mission */}
      {partner.mission && (
        <p className="text-sm text-gray-600 line-clamp-2">{partner.mission}</p>
      )}

      {/* Service description */}
      {partner.serviceDescription && (
        <p className="text-sm text-gray-400 line-clamp-2">{partner.serviceDescription}</p>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="text-sm text-gray-600 space-y-1.5 border-t border-gray-100 pt-3">
          {partner.serviceAreas && <p><span className="font-medium">Service areas:</span> {partner.serviceAreas}</p>}
          {partner.targetSectors && <p><span className="font-medium">Target sectors:</span> {partner.targetSectors}</p>}
          {partner.targetOrgSize && <p><span className="font-medium">Org size:</span> {partner.targetOrgSize}</p>}
          {partner.trainingFormats && <p><span className="font-medium">Formats:</span> {partner.trainingFormats}</p>}
          {partner.staffStrength && <p><span className="font-medium">Staff:</span> {partner.staffStrength}</p>}
          {partner.orgsTrainedCount && <p><span className="font-medium">Orgs trained:</span> {partner.orgsTrainedCount}</p>}
          {partner.costPerOrg && <p><span className="font-medium">Cost:</span> {partner.costPerOrg}</p>}
          {partner.collaborationOpportunities && (
            <p><span className="font-medium">Collaboration:</span> {partner.collaborationOpportunities}</p>
          )}
          {partner.contactPerson && <p><span className="font-medium">Contact:</span> {partner.contactPerson}{partner.contactPerson2 ? `, ${partner.contactPerson2}` : ''}</p>}
          {partner.address && <p><span className="font-medium">Address:</span> {partner.address}</p>}
          {partner.yearEstablished && <p><span className="font-medium">Est:</span> {partner.yearEstablished}</p>}
        </div>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {partner.feeStructure && (
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{partner.feeStructure}</span>
        )}
        {partner.programDuration && (
          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{partner.programDuration}</span>
        )}
        {partner.targetOrgSize && !expanded && (
          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{partner.targetOrgSize}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs min-w-0">
          {partner.email && (
            <a
              href={`mailto:${partner.email}`}
              className="text-indigo-600 hover:text-indigo-800 truncate"
            >
              ✉ {partner.email}
            </a>
          )}
          {partner.website && (
            <a
              href={ensureUrl(partner.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 shrink-0"
            >
              🌐 Website
            </a>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-400 hover:text-gray-600 shrink-0 ml-2"
        >
          {expanded ? 'Show less ↑' : 'More ↓'}
        </button>
      </div>
    </div>
  );
}
