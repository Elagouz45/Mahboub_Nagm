export const BRAND_ACCENT_COLORS: Readonly<Record<string, string>> = {
  carrier: '#00529B',
  philips: '#0066B3',
  samsung: '#034EA2',
  lg: '#A50034',
  sharp: '#E60012',
  tcl: '#E60012',
  toshiba: '#E60012',
  fresh: '#151515',
  tornado: '#202124',
};

export function brandAccentColor(slug: string): string {
  return BRAND_ACCENT_COLORS[slug] ?? '#c4bfb6';
}
