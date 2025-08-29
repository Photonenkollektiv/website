import { ReactNode } from 'react';

interface CardProps {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  big?: boolean;
}

/**
 * A reusable card component with a gradient background and subtle hover
 * animation.  Cards can optionally be rendered larger by passing the
 * `big` prop.
 */
export default function Card({ icon, title, children, big = false }: CardProps) {
  return (
    <div
      className={`relative rounded-xl border border-white/10 p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl ${
        big ? 'md:col-span-2' : ''
      }`}
      style={{
        background:
          'linear-gradient(135deg, rgba(11,10,19,0.6) 0%, rgba(15,14,26,0.6) 40%, rgba(15,14,26,0.4) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {icon && <div className="mb-4 text-3xl">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-magenta">{title}</h3>
      <p className="text-sm text-gray-300">{children}</p>
    </div>
  );
}