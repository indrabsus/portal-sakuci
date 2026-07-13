export function generateKode(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
