import { notFound } from 'next/navigation';
import { fetchPartners } from '@/lib/sheets';
import PartnerDetail from '@/components/PartnerDetail';

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partners = await fetchPartners().catch(() => []);
  const partner = partners.find((p) => p.slug === slug);
  if (!partner) notFound();

  return <PartnerDetail partner={partner} />;
}
