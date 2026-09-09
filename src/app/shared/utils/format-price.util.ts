export function formatEgp(value: number): string {
  return `${new Intl.NumberFormat('en-EG', { maximumFractionDigits: 0 }).format(value)} جنيه`;
}
