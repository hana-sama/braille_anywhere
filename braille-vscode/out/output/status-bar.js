"use strict";
// ============================================================
// Status Bar: Displays current braille mode in VS Code status bar
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
exports.StatusBar = void 0;
const vscode = __importStar(require("vscode"));
const MODE_LABELS = {
    grade1: "⠶ G1",
    kana: "⠶ かな",
    grade2: "⠶ G2",
    nemeth: "⠶ Math"
};
const MODE_TOOLTIPS = {
    grade1: "Braille Mode: Grade 1 (UEB)",
    kana: "Braille Mode: Kana (日本語)",
    grade2: "Braille Mode: Grade 2 (Contractions)",
    nemeth: "Braille Mode: Nemeth (Math)"
};
/**
 * Manages the status bar item showing current braille input state.
 */
class StatusBar {
    constructor() {
        this.isActive = false;
        this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.item.command = "braille.toggleMode";
        this.update(false, "grade1");
    }
    /**
     * Update the status bar display.
     */
    update(active, mode) {
        this.isActive = active;
        if (active) {
            this.item.text = MODE_LABELS[mode];
            this.item.tooltip = MODE_TOOLTIPS[mode];
            this.item.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
            this.item.show();
        }
        else {
            this.item.text = "⠶ OFF";
            this.item.tooltip = "Braille Input: OFF (click to enable)";
            this.item.backgroundColor = undefined;
            this.item.show();
        }
    }
    /**
     * Show a temporary flash message on the status bar.
     */
    flash(message, durationMs = 1500) {
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
    dispose() {
        this.item.dispose();
    }
}
exports.StatusBar = StatusBar;
//# sourceMappingURL=status-bar.js.map