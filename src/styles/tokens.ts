/**
 * Alizia AI Design System Tokens
 * Google Gemini-inspired refined visual language:
 * - Generous whitespace, large radii (12/16/24/pill), soft elevation, tonal separation
 * - Typography: Plus Jakarta Sans / Inter variable (tnum, font-display: swap)
 * - Color tokens: CSS variables (HSL), semantic naming
 * - Brand gradient: #4285F4 (blue) -> #9B72CB (violet) -> #D96570 (rose)
 */

export const fontFamilies = {
  sans: 'var(--font-sans, "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  mono: 'var(--font-mono, "JetBrains Mono", "SFMono-Regular", Consolas, monospace)',
};

export const typeScale = {
  xs: { size: '12px', lineHeight: '16px', letterSpacing: '0.01em' },
  sm: { size: '14px', lineHeight: '20px', letterSpacing: '0' },
  base: { size: '16px', lineHeight: '24px', letterSpacing: '0' },
  md: { size: '18px', lineHeight: '26px', letterSpacing: '-0.01em' },
  lg: { size: '22px', lineHeight: '28px', letterSpacing: '-0.015em' },
  xl: { size: '28px', lineHeight: '34px', letterSpacing: '-0.02em' },
  '2xl': { size: '36px', lineHeight: '42px', letterSpacing: '-0.025em' },
  '3xl': { size: '48px', lineHeight: '54px', letterSpacing: '-0.03em' },
  '4xl': { size: '57px', lineHeight: '64px', letterSpacing: '-0.035em' },
} as const;

export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
  pill: '9999px',
} as const;

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
} as const;

export const layoutWidths = {
  chatColumn: '768px',
  wideView: '1200px',
  sidebarExpanded: '280px',
  sidebarCollapsed: '72px',
} as const;

export const brandColors = {
  blue: '#4285F4',
  violet: '#9B72CB',
  rose: '#D96570',
  gradient: 'linear-gradient(135deg, #4285F4 0%, #9B72CB 50%, #D96570 100%)',
  gradientText: 'linear-gradient(135deg, #4285F4 0%, #9B72CB 50%, #D96570 100%)',
} as const;

export const accentPalettes = {
  gemini: { name: 'Gemini Blue', value: '#4285F4', hsl: '217 89% 61%' },
  purple: { name: 'Alizia Violet', value: '#9B72CB', hsl: '268 47% 62%' },
  rose: { name: 'Radiant Rose', value: '#D96570', hsl: '354 59% 62%' },
  emerald: { name: 'Verifiable Green', value: '#10B981', hsl: '160 84% 39%' },
  amber: { name: 'Warm Amber', value: '#F59E0B', hsl: '38 92% 50%' },
  cyan: { name: 'Aurora Cyan', value: '#06B6D4', hsl: '189 94% 43%' },
} as const;

export type AccentColorKey = keyof typeof accentPalettes;
export type ThemeKey = 'dark' | 'light' | 'amoled' | 'sepia' | 'high-contrast' | 'system';
