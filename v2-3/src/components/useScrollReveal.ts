"use client";
import { useEffect } from 'react';

/**
 * Hook to reveal elements when they enter the viewport.  Elements must
 * initially have the `opacity-0` and `translate-y-8` classes applied.
 * When they enter the viewport, these classes are replaced with
 * `opacity-100` and `translate-y-0`.  Users who prefer reduced motion
 * will see content appear without animation.
 */
export default function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
        el.classList.remove('opacity-0', 'translate-y-8');
        el.classList.add('opacity-100', 'translate-y-0');
      });
      return;
    }
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!elements.length) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.remove('opacity-0', 'translate-y-8');
            el.classList.add('opacity-100', 'translate-y-0');
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );
    elements.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}