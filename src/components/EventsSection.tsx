import Card from './Card';

interface EventItem { title: string; startDate: string; endDate: string; }
interface Props { events: EventItem[]; }

export default function EventsSection({ events }: Props) {
  // Safe date formatter (fallback to original string if invalid)
  const fmt = (d: Date, original: string) => isNaN(d.getTime())
    ? original
    : d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return (
    <section id="events" className="will-animate fade-up">
      <span className="section-rail" aria-hidden="true" />
      <h2 className="font-akony">Nächste Events</h2>
      <ul className="events-timeline">
        {events.length === 0 && (
          <li>
            <span className="event-title text-white">Aktuell keine öffentlichen Events</span>
          </li>
        )}
        {events.map(e => {
          const start = new Date(e.startDate);
          const end = new Date(e.endDate);
          return (
            <li key={e.title + e.startDate} className="will-animate">
              <Card variant="bare" className="p-0">
                <span className="event-date text-white">
                  {fmt(start, e.startDate)}
                  {fmt(end, e.endDate) !== fmt(start, e.startDate) ? ` – ${fmt(end, e.endDate)}` : ''}
                </span>
                <span className="event-title text-white">{e.title || 'Event'}</span>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
