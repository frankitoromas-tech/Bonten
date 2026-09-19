interface BontenAudio {
  playChime: (x: number, y: number, f: number) => void;
  playTactilePop: () => void;
  playSuccess: () => void;
  playToggle: () => void;
}

/**
 * Acceso tipado al motor de audio global expuesto por AudioController.
 * Elimina la necesidad de casts repetitivos `(window as unknown as ...)`.
 */
export function getBontenAudio(): BontenAudio | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { bontenAudio?: BontenAudio };
  return w.bontenAudio ?? null;
}
