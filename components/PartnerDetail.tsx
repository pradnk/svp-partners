import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

// Placeholder answers like "NA" carry no information for the reader
function hasValue(v: string): boolean {
  if (!v) return false;
  const t = v.trim().toLowerCase().replace(/[./]/g, '');
  return t !== '' && t !== 'na' && t !== '-';
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  if (!hasValue(value)) return null;
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</dt>
      <dd className="text-sm text-gray-800 whitespace-pre-line">{value.trim()}</dd>
    </div>
  );
}

function Section({
  title,
  values,
  children,
}: {
  title: string;
  values: string[];
  children: ReactNode;
}) {
  if (!values.some(hasValue)) return null;
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">{title}</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">{children}</dl>
    </section>
  );
}

export default function PartnerDetail({ partner: p }: { partner: Partner }) {
  const allFocuses = [...p.focuses, ...p.additionalFocusAreas];
  const glance = [
    { label: 'Fee structure', value: p.feeStructure },
    { label: 'Program duration', value: p.programDuration },
    { label: 'Target org size', value: p.targetOrgSize },
    { label: 'Training formats', value: p.trainingFormats },
    { label: 'Service areas', value: p.serviceAreas },
  ].filter((g) => hasValue(g.value));
  const testimonials = p.testimonials.filter(hasValue);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-5">
          <Link href="/" className="shrink-0">
            <Image src="/svp-logo-white.png" alt="SVP India" width={90} height={48} priority />
          </Link>
          <div className="border-l border-white/20 pl-5">
            <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-0.5">
              Bengaluru Chapter
            </p>
            <h1 className="text-xl font-bold leading-tight">Partner Directory</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <Link href="/" className="inline-block text-sm text-gray-400 hover:text-black transition-colors">
          ← Back to directory
        </Link>

        {/* Partner header */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 leading-snug">{p.name}</h1>
              <p className="text-sm text-gray-400 mt-1">
                {[p.legalStatus, hasValue(p.yearEstablished) ? `Est. ${parseInt(p.yearEstablished) || p.yearEstablished}` : '']
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {p.email && (
                <a
                  href={`mailto:${p.email}`}
                  className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  ✉ Email
                </a>
              )}
              {p.website && (
                <a
                  href={ensureUrl(p.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:border-gray-400 transition-colors"
                >
                  🌐 Website
                </a>
              )}
            </div>
          </div>

          {allFocuses.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {allFocuses.map((f, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          {glance.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5 pt-4 border-t border-gray-100">
              {glance.map((g) => (
                <div key={g.label}>
                  <p className="text-xs text-gray-400 mb-0.5">{g.label}</p>
                  <p className="text-sm font-medium text-gray-800">{g.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Section title="About" values={[p.mission, p.serviceDescription]}>
          <Field label="Mission / primary focus" value={p.mission} wide />
          <Field label="Services offered" value={p.serviceDescription} wide />
        </Section>

        <Section
          title="Services & Reach"
          values={[p.focusArea, p.targetSectors, p.clientBase, p.orgsTrainedCount]}
        >
          <Field label="Focus area" value={p.focusArea} />
          <Field label="Target non-profit sectors" value={p.targetSectors} />
          <Field label="Approximate client base" value={p.clientBase} />
          <Field label="Organisations trained / served" value={p.orgsTrainedCount} />
        </Section>

        <Section
          title="Engagement & Pricing"
          values={[p.costPerOrg, p.customization, p.followUpSupport, p.qualityMetrics]}
        >
          <Field label="Approximate cost per organisation" value={p.costPerOrg} />
          <Field label="Customization capability" value={p.customization} />
          <Field label="Follow-up and support" value={p.followUpSupport} />
          <Field label="Quality metrics used" value={p.qualityMetrics} />
        </Section>

        <Section
          title="Team & Credentials"
          values={[p.staffStrength, p.subjectMatterExperts, p.keyQualifications, p.certifications, p.yearsInSector]}
        >
          <Field label="Total staff strength" value={p.staffStrength} />
          <Field label="Subject matter experts" value={p.subjectMatterExperts} />
          <Field label="Key qualifications of core team" value={p.keyQualifications} wide />
          <Field label="Certifications / accreditations" value={p.certifications} />
          <Field label="Years in non-profit sector" value={p.yearsInSector} />
        </Section>

        <Section
          title="Track Record"
          values={[p.majorAchievements, p.partneringOrgs, p.memberships, p.donorSupport]}
        >
          <Field label="Major achievements / notable projects" value={p.majorAchievements} wide />
          <Field label="Partnering organisations" value={p.partneringOrgs} />
          <Field label="Memberships / network affiliations" value={p.memberships} />
          <Field label="Donor / funding support" value={p.donorSupport} />
        </Section>

        {testimonials.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Testimonials</h2>
            <div className="space-y-3">
              {testimonials.map((t, i) => (
                <blockquote
                  key={i}
                  className="border-l-4 border-gray-200 bg-gray-50 rounded-r-lg px-4 py-3 text-sm text-gray-700 italic whitespace-pre-line"
                >
                  &ldquo;{t.trim()}&rdquo;
                </blockquote>
              ))}
            </div>
          </section>
        )}

        <Section title="Collaboration" values={[p.collaborationOpportunities, p.additionalInfo]}>
          <Field label="Opportunities for collaboration" value={p.collaborationOpportunities} wide />
          <Field label="Additional information" value={p.additionalInfo} wide />
        </Section>

        <Section
          title="Contact"
          values={[p.contactPerson, p.contactPerson2, p.email, p.address, p.website]}
        >
          <Field label="Key contact person" value={p.contactPerson} />
          <Field label="Key contact person 2" value={p.contactPerson2} />
          {p.email && (
            <div>
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Email</dt>
              <dd className="text-sm">
                <a href={`mailto:${p.email}`} className="text-indigo-600 hover:text-indigo-800">
                  {p.email}
                </a>
              </dd>
            </div>
          )}
          {p.website && (
            <div>
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Website</dt>
              <dd className="text-sm">
                <a
                  href={ensureUrl(p.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 break-all"
                >
                  {p.website}
                </a>
              </dd>
            </div>
          )}
          <Field label="Office address" value={p.address} wide />
        </Section>

        <div className="pb-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-black transition-colors">
            ← Back to directory
          </Link>
        </div>
      </div>
    </div>
  );
}
