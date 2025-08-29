"use client";
import { FormEvent } from 'react';

/**
 * A simple contact form.  When submitted it thanks the user via a
 * browser alert and resets the form.  In production this could be
 * replaced with an API call.
 */
export default function ContactSection() {
  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);
    const name = formData.get('name') as string;
    alert(`Vielen Dank, ${name || 'Freund/in'}! Wir werden uns bald bei dir melden.`);
    evt.currentTarget.reset();
  };

  return (
    <section id="contact" className="relative px-6 py-24 md:px-12">
      <h2 className="mb-8 text-3xl font-akony text-magenta">Kontakt</h2>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-gray-400">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Dein Name"
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:border-magenta focus:outline-none focus:ring-1 focus:ring-magenta"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-gray-400">E‑Mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="deine@email.de"
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:border-magenta focus:outline-none focus:ring-1 focus:ring-magenta"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm text-gray-400">Nachricht</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="Wie können wir helfen?"
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:border-magenta focus:outline-none focus:ring-1 focus:ring-magenta"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-magenta px-5 py-2 font-semibold text-dark transition-colors hover:bg-magenta/90 focus:outline-none focus:ring-2 focus:ring-magenta focus:ring-offset-2 focus:ring-offset-dark"
        >
          Absenden
        </button>
      </form>
    </section>
  );
}