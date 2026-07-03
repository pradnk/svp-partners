import Link from 'next/link';
import { Partner } from '@/lib/sheets';
import { ensureUrl } from '@/lib/utils';

const TAG_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-green-100 text-green-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
  'bg-teal-100 text-teal-800',
];

export default function PartnerCard({ partner }: { partner: Partner }) {
  const allFocuses = [...partner.focuses, ...partner.additionalFocusAreas];
  const detailHref = `/partners/${partner.slug}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">
          <Link href={detailHref} className="hover:underline">{partner.name}</Link>
        </h3>
        {partner.legalStatus && (
          <span className="shrink-0 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap">
            {partner.legalStatus}
          </span>
        )}
      </div>

      {/* Focus tags */}
      {allFocuses.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allFocuses.slice(0, 3).map((f, i) => (
            <span
              key={i}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
            >
              {f}
            </span>
          ))}
          {allFocuses.length > 3 && (
            <Link
              href={detailHref}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              +{allFocuses.length - 3} more
            </Link>
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

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {partner.feeStructure && (
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{partner.feeStructure}</span>
        )}
        {partner.programDuration && (
          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{partner.programDuration}</span>
        )}
        {partner.targetOrgSize && (
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
        <Link
          href={detailHref}
          className="text-xs font-medium text-gray-500 hover:text-black shrink-0 ml-2 transition-colors"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
