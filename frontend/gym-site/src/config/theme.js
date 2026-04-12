/**
 * JS-side design tokens (mirrors :root in styles/variables.css).
 * Use for inline styles, charts, or runtime theming — not a replacement for CSS variables.
 */
export const theme = {
  colors: {
    primary: '#e63946',
    primaryHover: '#d62828',
    accentRed: '#ef4444',
    bg: '#0A0A0A',
    bgCard: '#12151e',
    textMain: '#ffffff',
    textMuted: '#9ca3af',
    border: 'rgba(255, 255, 255, 0.08)',
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    md: 12,
    lg: 16,
  },
  maxWidth: 1200,
};
