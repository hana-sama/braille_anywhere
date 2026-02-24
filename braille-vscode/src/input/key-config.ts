// ============================================================
// Key Config: Defines key-to-dot mappings for different layouts
// ============================================================

import { DotNumber, KeyLayout } from "../data/types";

/** Available key layouts */
export const KEY_LAYOUTS: Record<string, KeyLayout> = {
  "fds-jkl": {
    f: 1,
    d: 2,
    s: 3,
    j: 4,
    k: 5,
    l: 6
  },
  "dwq-kop": {
    d: 1,
    w: 2,
    q: 3,
    k: 4,
    o: 5,
    p: 6
  }
};

/**
 * Get the key layout by name.
 * Falls back to 'fds-jkl' if not found.
 */
export function getKeyLayout(name: string): KeyLayout {
  return KEY_LAYOUTS[name] || KEY_LAYOUTS["fds-jkl"];
}

/**
 * Reverse lookup: dot number → key character (for display purposes).
 */
export function dotToKeyChar(
  layout: KeyLayout,
  dot: DotNumber
): string | undefined {
  for (const [key, d] of Object.entries(layout)) {
    if (d === dot) {
      return key;
    }
  }
  return undefined;
}
