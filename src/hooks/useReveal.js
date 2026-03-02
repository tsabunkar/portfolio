/**
 * hooks/useReveal.js
 * Attaches an IntersectionObserver to a ref and adds .visible
 * once the element enters the viewport. The observer disconnects
 * after the first trigger to avoid memory leaks.
 *
 * Usage:
 *   const ref = useReveal();
 *   <div ref={ref} className="reveal">…</div>
 */

import { useEffect, useRef } from 'react';

/**
 * @param {number} [threshold=0.1] - Fraction of element that must be visible.
 * @returns {React.RefObject}
 */
export function useReveal(threshold = 0.1) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el); // fire once
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
