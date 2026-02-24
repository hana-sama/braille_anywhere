// ============================================================
// State Machine: Manages the current braille mode
// ============================================================

import {
  Mode,
  IndicatorDef,
  IndicatorScope,
  TransitionRule
} from "../data/types";

export type ModeChangeCallback = (
  oldMode: Mode,
  newMode: Mode,
  indicator: IndicatorDef
) => void;

/**
 * Manages the current braille input mode and handles transitions
 * triggered by indicator sequences.
 */
export class StateMachine {
  private currentMode: Mode = "grade1";
  private modeStack: Mode[] = []; // For nested mode switches
  private activeScope: IndicatorScope | null = null;
  private symbolCount: number = 0; // Track symbols entered in current mode
  private onModeChange: ModeChangeCallback | null = null;

  constructor(initialMode: Mode = "grade1") {
    this.currentMode = initialMode;
  }

  /** Get the current active mode */
  getMode(): Mode {
    return this.currentMode;
  }

  /** Get the active scope (if any) */
  getScope(): IndicatorScope | null {
    return this.activeScope;
  }

  /** Register a callback for mode changes */
  setModeChangeCallback(cb: ModeChangeCallback): void {
    this.onModeChange = cb;
  }

  /**
   * Process an indicator and potentially switch modes.
   * Returns true if a mode transition occurred.
   */
  processIndicator(indicator: IndicatorDef): boolean {
    if (indicator.action === "enter") {
      return this.enterMode(indicator);
    } else {
      return this.exitMode(indicator);
    }
  }

  /**
   * Called after each character is emitted.
   * For 'symbol' scope, automatically returns to base mode after one character.
   */
  onCharacterEmitted(): void {
    if (this.activeScope === "symbol") {
      this.symbolCount++;
      if (this.symbolCount >= 1) {
        this.returnToBase();
      }
    }
  }

  /**
   * Handle space input.
   * For 'word' scope, space triggers return to base mode.
   */
  onSpace(): void {
    if (this.activeScope === "word") {
      this.returnToBase();
    }
  }

  /** Reset to initial state */
  reset(): void {
    this.currentMode = "grade1";
    this.modeStack = [];
    this.activeScope = null;
    this.symbolCount = 0;
  }

  private enterMode(indicator: IndicatorDef): boolean {
    const oldMode = this.currentMode;
    const newMode = indicator.targetMode;

    if (oldMode === newMode && this.activeScope === indicator.scope) {
      return false; // Already in this mode with same scope
    }

    // Push current mode for potential nesting
    this.modeStack.push(oldMode);
    this.currentMode = newMode;
    this.activeScope = indicator.scope;
    this.symbolCount = 0;

    if (this.onModeChange) {
      this.onModeChange(oldMode, newMode, indicator);
    }

    return true;
  }

  private exitMode(indicator: IndicatorDef): boolean {
    if (this.currentMode === "grade1" && this.modeStack.length === 0) {
      return false; // Already at base, nothing to exit
    }

    const oldMode = this.currentMode;
    this.returnToBase();

    return oldMode !== this.currentMode;
  }

  private returnToBase(): void {
    const oldMode = this.currentMode;
    this.currentMode =
      this.modeStack.length > 0 ? this.modeStack.pop()! : "grade1";
    this.activeScope = null;
    this.symbolCount = 0;

    if (this.onModeChange && oldMode !== this.currentMode) {
      this.onModeChange(oldMode, this.currentMode, {
        id: "auto_return",
        dots: [],
        dotsKey: "",
        action: "exit",
        targetMode: this.currentMode,
        scope: "symbol",
        tags: []
      });
    }
  }
}
