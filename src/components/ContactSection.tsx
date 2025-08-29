import Card from './Card';
import { FormEvent } from 'react';

interface Props { onSubmit: (evt: FormEvent<HTMLFormElement>) => void; }

export default function ContactSection({ onSubmit }: Props) {
  return (
    <section id="contact" className="will-animate slide-left">
      <span className="section-rail" aria-hidden="true" />
      <h2 className="font-akony">Kontakt</h2>
      <div className="contact-form-wrapper will-animate fade-up">
        <Card as="form" onSubmit={onSubmit as any} className="contact-form" variant="default">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Dein Name" required />

          <label htmlFor="email">E‑Mail</label>
          <input type="email" id="email" name="email" placeholder="deine@email.de" required />

          <label htmlFor="message">Nachricht</label>
          <textarea id="message" name="message" rows={5} placeholder="Wie können wir helfen?" required></textarea>

          <button type="submit">Absenden</button>
        </Card>
      </div>
    </section>
  );
}
