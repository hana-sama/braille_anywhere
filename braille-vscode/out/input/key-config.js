"use strict";
// ============================================================
// Key Config: Defines key-to-dot mappings for different layouts
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEY_LAYOUTS = void 0;
exports.getKeyLayout = getKeyLayout;
exports.dotToKeyChar = dotToKeyChar;
/** Available key layouts */
exports.KEY_LAYOUTS = {
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
function getKeyLayout(name) {
    return exports.KEY_LAYOUTS[name] || exports.KEY_LAYOUTS["fds-jkl"];
}
/**
 * Reverse lookup: dot number → key character (for display purposes).
 */
function dotToKeyChar(layout, dot) {
    for (const [key, d] of Object.entries(layout)) {
        if (d === dot) {
            return key;
        }
    }
    return undefined;
}
//# sourceMappingURL=key-config.js.map