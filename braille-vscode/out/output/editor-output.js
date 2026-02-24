"use strict";
// ============================================================
// Editor Output: Inserts text into the active VS Code editor
// ============================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorOutput = void 0;
const vscode = __importStar(require("vscode"));
/**
 * Handles inserting braille-converted text into the active editor.
 */
class EditorOutput {
    /**
     * Insert text at the current cursor position in the active editor.
     */
    async insert(text) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return false;
        }
        return editor.edit(editBuilder => {
            editor.selections.forEach(selection => {
                if (selection.isEmpty) {
                    editBuilder.insert(selection.active, text);
                }
                else {
                    editBuilder.replace(selection, text);
                }
            });
        });
    }
    /**
     * Insert a space character.
     */
    async insertSpace() {
        return this.insert(" ");
    }
    /**
     * Insert a newline.
     */
    async insertNewline() {
        return this.insert("\n");
    }
    /**
     * Delete the last character (backspace).
     */
    async backspace() {
        await vscode.commands.executeCommand("deleteLeft");
    }
}
exports.EditorOutput = EditorOutput;
//# sourceMappingURL=editor-output.js.map