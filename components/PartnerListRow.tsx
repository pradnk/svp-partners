import Link from 'next/link';
import { Partner } from '@/lib/sheets';
import { ensureUrl } from '@/lib/utils';
import CopyEmail from './CopyEmail';

const TAG_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-green-100 text-green-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
  'bg-teal-100 text-teal-800',
];

export default function PartnerListRow({ partner }: { partner: Partner }) {
  const allFocuses = [...partner.focuses, ...partner.additionalFocusAreas];
  const detailHref = `/partners/${partner.slug}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      {/* Fixed widths for the fee + action columns keep rows aligned regardless of content */}
      <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,2fr)_minmax(0,1.7fr)_11rem_auto] gap-x-4 gap-y-2 px-4 py-3 items-center">
        {/* Left: name + mission */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={detailHref} className="font-semibold text-sm text-gray-900 hover:underline">
              {partner.name}
            </Link>
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
              <Link href={detailHref} className="text-xs text-gray-400 hover:text-gray-600">
                +{allFocuses.length - 2}
              </Link>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">
            {[partner.targetOrgSize, partner.programDuration].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* Fee — own fixed-width cell so badges line up across rows */}
        <div className="hidden sm:block min-w-0">
          {partner.feeStructure && (
            <span
              className="inline-block max-w-full truncate align-middle text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full"
              title={partner.feeStructure}
            >
              {partner.feeStructure}
            </span>
          )}
        </div>

        {/* Actions — fixed-width slots so icons and Details align even when absent */}
        <div className="flex items-center gap-2 shrink-0">
          {partner.email ? (
            <CopyEmail email={partner.email} variant="icon" />
          ) : (
            <span className="w-4 hidden sm:inline-block" aria-hidden="true" />
          )}
          {partner.website ? (
            <a
              href={ensureUrl(partner.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-4 text-center text-xs text-indigo-600 hover:text-indigo-800"
              title="Website"
            >
              🌐
            </a>
          ) : (
            <span className="w-4 hidden sm:inline-block" aria-hidden="true" />
          )}
          <Link
            href={detailHref}
            className="text-xs font-medium text-gray-500 hover:text-black ml-1 whitespace-nowrap transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
