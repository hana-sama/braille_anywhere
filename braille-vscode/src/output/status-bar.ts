// ============================================================
// Status Bar: Displays current braille mode in VS Code status bar
// ============================================================

import * as vscode from "vscode";
import { Mode } from "../data/types";

const MODE_LABELS: Record<Mode, string> = {
  grade1: "⠶ G1",
  kana: "⠶ かな",
  grade2: "⠶ G2",
  nemeth: "⠶ Math"
};

const MODE_TOOLTIPS: Record<Mode, string> = {
  grade1: "Braille Mode: Grade 1 (UEB)",
  kana: "Braille Mode: Kana (日本語)",
  grade2: "Braille Mode: Grade 2 (Contractions)",
  nemeth: "Braille Mode: Nemeth (Math)"
};

/**
 * Manages the status bar item showing current braille input state.
 */
export class StatusBar {
  private item: vscode.StatusBarItem;
  private isActive: boolean = false;

  constructor() {
    this.item = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this.item.command = "braille.toggleMode";
    this.update(false, "grade1");
  }

  /**
   * Update the status bar display.
   */
  update(active: boolean, mode: Mode): void {
    this.isActive = active;

    if (active) {
      this.item.text = MODE_LABELS[mode];
      this.item.tooltip = MODE_TOOLTIPS[mode];
      this.item.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground"
      );
      this.item.show();
    } else {
      this.item.text = "⠶ OFF";
      this.item.tooltip = "Braille Input: OFF (click to enable)";
      this.item.backgroundColor = undefined;
      this.item.show();
    }
  }

  /**
   * Show a temporary flash message on the status bar.
   */
  flash(message: string, durationMs: number = 1500): void {
    const prevText = this.item.text;
    this.item.text = message;
    setTimeout(() => {
      if (this.item.text === message) {
        this.item.text = prevText;
      }
    }, durationMs);
  }

  /**
   * Dispose the status bar item.
   */
  dispose(): void {
    this.item.dispose();
  }
}
