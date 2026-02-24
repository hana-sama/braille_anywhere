"use strict";
// ============================================================
// Indicator Matcher: Detects indicator sequences from dot input
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicatorMatcher = void 0;
/**
 * Matches incoming dot chords against known indicator sequences.
 * Indicators can be multi-cell (e.g., kana indicator = dots 16 + dots 13).
 */
class IndicatorMatcher {
    constructor() {
        this.indicators = [];
        this.pendingCells = [];
        this.maxCells = 1;
    }
    /**
     * Load indicator definitions.
     */
    setIndicators(indicators) {
        this.indicators = indicators;
        this.maxCells = Math.max(1, ...indicators.map(i => i.dots.length));
    }
    /**
     * Try to match a chord (as dotsKey) against indicator sequences.
     * Returns matched indicator, or null if no match (yet or at all).
     *
     * The matcher accumulates cells and checks for multi-cell indicators.
     */
    tryMatch(dotsKey) {
        this.pendingCells.push(dotsKey);
        const pendingKey = this.pendingCells.join("|");
        // Check for exact match
        const exact = this.indicators.find(i => i.dotsKey === pendingKey);
        if (exact) {
            this.pendingCells = [];
            return { type: "matched", indicator: exact };
        }
        // Check for partial match (prefix of some indicator)
        const hasPartial = this.indicators.some(i => i.dotsKey.startsWith(pendingKey + "|"));
        if (hasPartial && this.pendingCells.length < this.maxCells) {
            return { type: "pending" };
        }
        // No match at all — return buffered cells for normal processing
        const buffered = [...this.pendingCells];
        this.pendingCells = [];
        return { type: "none", bufferedCells: buffered };
    }
    /**
     * Check if there are pending (unresolved) cells.
     */
    hasPending() {
        return this.pendingCells.length > 0;
    }
    /**
     * Flush pending cells without matching.
     */
    flushPending() {
        const cells = [...this.pendingCells];
        this.pendingCells = [];
        return cells;
    }
    /**
     * Reset the matcher state.
     */
    reset() {
        this.pendingCells = [];
    }
}
exports.IndicatorMatcher = IndicatorMatcher;
//# sourceMappingURL=indicator-matcher.js.map