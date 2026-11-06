export function pct(value: number): string {
  return `${Math.round(value)}%`;
}

export function signedMs(value: number): string {
  const rounded = Math.round(value);
  return `${rounded >= 0 ? '+' : '-'}${Math.abs(rounded)} ms`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
