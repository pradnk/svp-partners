import { fetchPartners, fetchEvents } from '@/lib/sheets';
import PartnerDirectory from '@/components/PartnerDirectory';

export default async function Home() {
  const eventsEnabled = process.env.ENABLE_EVENTS === 'true';

  const [partners, events] = await Promise.all([
    fetchPartners().catch(() => []),
    eventsEnabled ? fetchEvents().catch(() => []) : Promise.resolve([]),
  ]);

  return (
    <PartnerDirectory
      partners={partners}
      events={events}
      eventsEnabled={eventsEnabled}
    />
  );
}
