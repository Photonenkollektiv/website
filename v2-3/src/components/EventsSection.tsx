"use client";
import { useEffect, useState } from 'react';

export interface EventItem {
  title: string;
  startDate: string;
  endDate: string;
}

interface EventsSectionProps {
  backendBase: string;
}

/**
 * Renders a list of upcoming events.  Data is fetched from a
 * configurable backend.  If no events are available a placeholder
 * message is shown.
 */
export default function EventsSection({ backendBase }: EventsSectionProps) {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${backendBase}/customerapi/public-events`);
        if (!res.ok) return;
        const data = await res.json();
        setEvents(data);
      } catch {
        /* ignore network errors */
      }
    };
    fetchEvents();
  }, [backendBase]);

  const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <section id="events" className="px-6 py-24 md:px-12">
      <h2 className="mb-8 text-3xl font-akony text-magenta">Nächste Events</h2>
      <ul className="relative border-l border-white/10 pl-4">
        {events.length === 0 && (
          <li className="mb-4 text-gray-400">Aktuell keine öffentlichen Events</li>
        )}
        {events.map(e => {
          const start = new Date(e.startDate);
          const end = new Date(e.endDate);
          return (
            <li key={e.title + e.startDate} className="mb-6 ml-2 flex flex-col gap-1">
              <span className="text-sm font-mono text-cyan">
                {fmt(start)}{fmt(end) !== fmt(start) ? ` – ${fmt(end)}` : ''}
              </span>
              <span className="text-base text-white">{e.title || 'Event'}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}