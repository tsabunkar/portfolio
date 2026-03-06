/**
 * theme/index.js
 * Central source of truth for all design tokens.
 * Tokens are applied as CSS custom properties on <html> —
 * one DOM write per toggle, zero React re-renders for colour changes.
 */

export const THEMES = {
  dark: {
    '--bg':            '#1a1a1a',
    '--bg-alt':        '#0f0f0f',
    '--bg-card':       '#2a2a2a',
    '--bg-card-hover': '#333333',
    '--border':        'rgba(255,255,255,0.15)',
    '--border-hover':  'rgba(255,255,255,0.30)',
    '--text':          '#f5f5f5',
    '--text-mid':      'rgba(245,245,245,0.70)',
    '--text-low':      'rgba(245,245,245,0.45)',
    '--nav-bg':        'rgba(26,26,26,0.85)',
    '--skill-bg':      'rgba(255,255,255,0.06)',
    '--skill-border':  'rgba(255,255,255,0.15)',
    '--divider':       'rgba(255,255,255,0.10)',
    '--shadow-card':   'rgba(0,0,0,0.30)',
    '--accent-yellow': '#F4C542',
    '--toggle-track':  '#F4C542',
    '--scroll-ring':   'rgba(244,197,66,0.5)',
    '--hero-glow-1':   'rgba(244,197,66,0.08)',
    '--hero-glow-2':   'rgba(244,197,66,0.05)',
  },
  light: {
    '--bg':            '#F5F3ED',
    '--bg-alt':        '#EEEAE0',
    '--bg-card':       '#FFFEF8',
    '--bg-card-hover': '#F9F8F2',
    '--border':        '#1a1a1a',
    '--border-hover':  '#000000',
    '--text':          '#1a1a1a',
    '--text-mid':      'rgba(26,26,26,0.75)',
    '--text-low':      'rgba(26,26,26,0.50)',
    '--nav-bg':        'rgba(245,243,237,0.90)',
    '--skill-bg':      'rgba(26,26,26,0.04)',
    '--skill-border':  'rgba(26,26,26,0.15)',
    '--divider':       'rgba(26,26,26,0.15)',
    '--shadow-card':   'rgba(0,0,0,0.05)',
    '--accent-yellow': '#F4C542',
    '--toggle-track':  '#d1d1d6',
    '--scroll-ring':   'rgba(26,26,26,0.30)',
    '--hero-glow-1':   'rgba(244,197,66,0.12)',
    '--hero-glow-2':   'rgba(244,197,66,0.08)',
  },
};

/**
 * Writes all theme tokens as CSS custom properties to :root.
 * Much faster than re-rendering the React tree.
 *
 * @param {'dark'|'light'} mode
 */
export function applyTheme(mode) {
  const vars  = THEMES[mode];
  const root  = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.setAttribute('data-theme', mode);
  // Keep meta theme-color in sync for mobile browsers
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', mode === 'dark' ? '#1a1a1a' : '#F5F3ED');
}
