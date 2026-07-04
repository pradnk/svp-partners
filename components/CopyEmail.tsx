'use client';

import { useState } from 'react';

interface Props {
  email: string;
  variant?: 'button' | 'inline' | 'icon';
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function CopyEmail({ email, variant = 'inline' }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (variant === 'button') {
    return (
      <button
        onClick={copy}
        className="flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        {copied ? (
          <><CheckIcon className="w-4 h-4" /> Copied!</>
        ) : (
          <><ClipboardIcon className="w-4 h-4" /> Copy email</>
        )}
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={copy}
        title={copied ? 'Copied!' : `Copy: ${email}`}
        className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-black transition-colors hidden sm:flex"
      >
        {copied
          ? <CheckIcon className="w-3.5 h-3.5 text-green-600" />
          : <ClipboardIcon className="w-3.5 h-3.5" />}
      </button>
    );
  }

  // inline — email text + copy icon, used in card footer
  return (
    <span className="flex items-center gap-1.5 min-w-0">
      <span className="text-gray-600 truncate text-xs">{email}</span>
      <button
        onClick={copy}
        title={copied ? 'Copied!' : 'Copy email address'}
        className="shrink-0 text-gray-400 hover:text-black transition-colors"
      >
        {copied
          ? <CheckIcon className="w-3 h-3 text-green-600" />
          : <ClipboardIcon className="w-3 h-3" />}
      </button>
    </span>
  );
}
