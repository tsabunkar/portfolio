/**
 * theme/index.js
 * Central source of truth for all design tokens.
 * Tokens are applied as CSS custom properties on <html> —
 * one DOM write per toggle, zero React re-renders for colour changes.
 */

export const THEMES = {
  dark: {
    '--bg':            '#000000',
    '--bg-alt':        '#080808',
    '--bg-card':       '#0f0f0f',
    '--bg-card-hover': '#141414',
    '--border':        'rgba(255,255,255,0.09)',
    '--border-hover':  'rgba(255,255,255,0.22)',
    '--text':          '#f5f5f7',
    '--text-mid':      'rgba(245,245,247,0.62)',
    '--text-low':      'rgba(245,245,247,0.35)',
    '--nav-bg':        'rgba(0,0,0,0.75)',
    '--skill-bg':      'rgba(255,255,255,0.06)',
    '--skill-border':  'rgba(255,255,255,0.09)',
    '--divider':       'rgba(255,255,255,0.05)',
    '--shadow-blue':   'rgba(0,113,227,0.35)',
    '--toggle-track':  '#0071e3',
    '--scroll-ring':   'rgba(255,255,255,0.35)',
    '--hero-glow-1':   'rgba(0,113,227,0.13)',
    '--hero-glow-2':   'rgba(48,209,88,0.08)',
  },
  light: {
    '--bg':            '#ffffff',
    '--bg-alt':        '#f5f5f7',
    '--bg-card':       '#ffffff',
    '--bg-card-hover': '#fafafa',
    '--border':        'rgba(0,0,0,0.08)',
    '--border-hover':  'rgba(0,0,0,0.20)',
    '--text':          '#1d1d1f',
    '--text-mid':      'rgba(29,29,31,0.62)',
    '--text-low':      'rgba(29,29,31,0.38)',
    '--nav-bg':        'rgba(255,255,255,0.75)',
    '--skill-bg':      'rgba(0,0,0,0.04)',
    '--skill-border':  'rgba(0,0,0,0.08)',
    '--divider':       'rgba(0,0,0,0.05)',
    '--shadow-blue':   'rgba(0,113,227,0.22)',
    '--toggle-track':  '#d1d1d6',
    '--scroll-ring':   'rgba(0,0,0,0.25)',
    '--hero-glow-1':   'rgba(0,113,227,0.07)',
    '--hero-glow-2':   'rgba(48,209,88,0.05)',
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
  if (meta) meta.setAttribute('content', mode === 'dark' ? '#000000' : '#ffffff');
}
