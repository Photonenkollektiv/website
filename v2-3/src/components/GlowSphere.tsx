"use client";
import { useEffect, useRef } from 'react';

/**
 * GlowSphere draws a colourful orb that slowly pulses and follows the
 * mouse cursor.  It is entirely CSS‑driven and avoids heavy
 * dependencies.  The `follow-mouse` class ensures that the glow reacts
 * smoothly to pointer movement.
 */
export default function GlowSphere() {
  const sphereRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const sphere = sphereRef.current;
      if (!sphere) return;
      const rect = sphere.parentElement?.getBoundingClientRect();
      if (!rect) return;
      // Compute relative offset of cursor within the parent container
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 20; // max 10px shift
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 20;
      sphere.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
      {/* Outer glow */}
      <div
        ref={sphereRef}
        className="follow-mouse absolute -z-10 h-72 w-72 md:h-96 md:w-96 rounded-full opacity-80"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(244,0,143,0.8), rgba(0,241,255,0.3) 60%, rgba(0,0,0,0) 100%)',
          filter: 'blur(50px)',
          animation: 'pulse-slow 10s ease-in-out infinite',
        }}
      />
      {/* Core orb */}
      <div className="h-48 w-48 md:h-60 md:w-60 rounded-full bg-gradient-to-tr from-magenta via-purple to-cyan" />
    </div>
  );
}