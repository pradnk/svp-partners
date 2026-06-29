'use client';

import { useEffect } from 'react';
import { SheetEvent } from '@/lib/sheets';

const TYPE_STYLES: Record<string, string> = {
  Funding: 'bg-red-50 text-red-700',
  Application: 'bg-amber-50 text-amber-700',
  Workshop: 'bg-blue-50 text-blue-700',
  Conference: 'bg-purple-50 text-purple-700',
  Training: 'bg-teal-50 text-teal-700',
};

function parseDeadline(raw: string): Date | null {
  if (!raw) return null;
  // GViz date format: Date(2026,5,30)
  const m = raw.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (m) return new Date(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function daysUntil(raw: string): number | null {
  const d = parseDeadline(raw);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / 86400000);
}

function urgencyClass(days: number | null) {
  if (days === null) return '';
  if (days <= 7) return 'border-l-2 border-red-400';
  if (days <= 30) return 'border-l-2 border-amber-400';
  return 'border-l-2 border-gray-200';
}

function deadlineLabel(days: number | null, raw: string): string {
  if (days === null) return raw || '';
  if (days < 0) return 'Deadline passed';
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  if (days <= 30) return `${days} days left`;
  const d = parseDeadline(raw);
  return d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : raw;
}

function deadlineBadgeClass(days: number | null) {
  if (days === null) return 'text-gray-400';
  if (days <= 7) return 'text-red-600 font-medium';
  if (days <= 30) return 'text-amber-600 font-medium';
  return 'text-gray-500';
}

function ensureUrl(url: string) {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
}

interface Props {
  events: SheetEvent[];
  open: boolean;
  onClose: () => void;
}

export default function EventsSidebar({ events, open, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        aria-label="Upcoming events"
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900 text-base">Upcoming Events</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {events.length > 0
                ? `${events.length} active ${events.length === 1 ? 'event' : 'events'}`
                : 'No events yet'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close events panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Event list */}
        <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No events added yet.</p>
              <p className="text-xs mt-1">Add rows to the Events tab in Google Sheets.</p>
            </div>
          ) : (
            events.map((ev, i) => {
              const days = daysUntil(ev.deadline);
              return (
                <div
                  key={i}
                  className={`bg-white rounded-lg border border-gray-200 p-4 ${urgencyClass(days)}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {ev.type && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          TYPE_STYLES[ev.type] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {ev.type}
                      </span>
                    )}
                    {ev.deadline && (
                      <span className={`text-xs ml-auto ${deadlineBadgeClass(days)}`}>
                        {deadlineLabel(days, ev.deadline)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">
                    {ev.title}
                  </h3>

                  {ev.organizer && (
                    <p className="text-xs text-gray-500 mb-2">{ev.organizer}</p>
                  )}

                  {ev.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{ev.description}</p>
                  )}

                  {ev.link && (
                    <a
                      href={ensureUrl(ev.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-black border border-gray-300
                        rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                      View details
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 shrink-0">
          <p className="text-xs text-gray-400 text-center">
            Add events in the{' '}
            <a
              href="https://docs.google.com/spreadsheets/d/1ZKUJX53bNGfduy9wyBpykxpjd-_xaIy1Mabo4RRxr0g/edit#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:underline"
            >
              Events tab ↗
            </a>
          </p>
        </div>
      </aside>
    </>
  );
}
