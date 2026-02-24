// ============================================================
// Chord Detector: Detects simultaneous key presses using a time window
// ============================================================

import { DotNumber } from "../data/types";

export type ChordCallback = (dots: Set<DotNumber>) => void;

/**
 * Detects "chords" (simultaneous key presses) using a time-window approach.
 * When multiple dots are pressed within the timeout window, they are
 * treated as a single chord and emitted together.
 */
export class ChordDetector {
  private activeDots: Set<DotNumber> = new Set();
  private commitTimer: ReturnType<typeof setTimeout> | null = null;
  private timeoutMs: number;
  private onChord: ChordCallback;

  constructor(timeoutMs: number, onChord: ChordCallback) {
    this.timeoutMs = timeoutMs;
    this.onChord = onChord;
  }

  /**
   * Called when a dot key is pressed.
   * Dot 0 = space (immediate commit of space character).
   */
  press(dot: DotNumber): void {
    if (dot === 0) {
      // Space: flush any pending chord first, then emit space
      this.flush();
      this.onChord(new Set([0 as DotNumber]));
      return;
    }

    this.activeDots.add(dot);
    this.resetTimer();
  }

  /**
   * Update the chord timeout.
   */
  setTimeout(ms: number): void {
    this.timeoutMs = ms;
  }

  /**
   * Force-flush any pending chord immediately.
   */
  flush(): void {
    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
      this.commitTimer = null;
    }
    if (this.activeDots.size > 0) {
      const dots = new Set(this.activeDots);
      this.activeDots.clear();
      this.onChord(dots);
    }
  }

  /**
   * Cancel any pending input without emitting.
   */
  cancel(): void {
    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
      this.commitTimer = null;
    }
    this.activeDots.clear();
  }

  private resetTimer(): void {
    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
    }
    this.commitTimer = setTimeout(() => {
      this.commitTimer = null;
      if (this.activeDots.size > 0) {
        const dots = new Set(this.activeDots);
        this.activeDots.clear();
        this.onChord(dots);
      }
    }, this.timeoutMs);
  }
}
