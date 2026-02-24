"use strict";
// ============================================================
// Chord Detector: Detects simultaneous key presses using a time window
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChordDetector = void 0;
/**
 * Detects "chords" (simultaneous key presses) using a time-window approach.
 * When multiple dots are pressed within the timeout window, they are
 * treated as a single chord and emitted together.
 */
class ChordDetector {
    constructor(timeoutMs, onChord) {
        this.activeDots = new Set();
        this.commitTimer = null;
        this.timeoutMs = timeoutMs;
        this.onChord = onChord;
    }
    /**
     * Called when a dot key is pressed.
     * Dot 0 = space (immediate commit of space character).
     */
    press(dot) {
        if (dot === 0) {
            // Space: flush any pending chord first, then emit space
            this.flush();
            this.onChord(new Set([0]));
            return;
        }
        this.activeDots.add(dot);
        this.resetTimer();
    }
    /**
     * Update the chord timeout.
     */
    setTimeout(ms) {
        this.timeoutMs = ms;
    }
    /**
     * Force-flush any pending chord immediately.
     */
    flush() {
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
    cancel() {
        if (this.commitTimer) {
            clearTimeout(this.commitTimer);
            this.commitTimer = null;
        }
        this.activeDots.clear();
    }
    resetTimer() {
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
exports.ChordDetector = ChordDetector;
//# sourceMappingURL=chord-detector.js.map