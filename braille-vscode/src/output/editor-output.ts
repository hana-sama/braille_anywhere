// ============================================================
// Editor Output: Inserts text into the active VS Code editor
// ============================================================

import * as vscode from "vscode";

/**
 * Handles inserting braille-converted text into the active editor.
 */
export class EditorOutput {
  /**
   * Insert text at the current cursor position in the active editor.
   */
  async insert(text: string): Promise<boolean> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return false;
    }

    return editor.edit(editBuilder => {
      editor.selections.forEach(selection => {
        if (selection.isEmpty) {
          editBuilder.insert(selection.active, text);
        } else {
          editBuilder.replace(selection, text);
        }
      });
    });
  }

  /**
   * Insert a space character.
   */
  async insertSpace(): Promise<boolean> {
    return this.insert(" ");
  }

  /**
   * Insert a newline.
   */
  async insertNewline(): Promise<boolean> {
    return this.insert("\n");
  }

  /**
   * Delete the last character (backspace).
   */
  async backspace(): Promise<void> {
    await vscode.commands.executeCommand("deleteLeft");
  }
}
