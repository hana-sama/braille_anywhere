"use strict";
// ============================================================
// Unified Table: Builds merged dot→output mapping from all profiles
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUnifiedData = buildUnifiedData;
/** Maps a system_id to a Mode */
function systemIdToMode(systemId, brailleType) {
    if (systemId === "kana") {
        return "kana";
    }
    if (systemId === "nemeth") {
        return "nemeth";
    }
    // UEB: distinguish grade1 vs grade2 by braille_type
    if (brailleType.includes("grade2")) {
        return "grade2";
    }
    return "grade1";
}
/** Normalize dots array to a canonical key: ["1", "2"] → "12", ["14"] → "14" */
function dotsToKey(dots) {
    if (dots.length === 1) {
        // Single cell: sort digit characters for canonical form
        return dots[0].split("").sort().join("");
    }
    // Multi-cell: join with pipe separator
    return dots.map(d => d.split("").sort().join("")).join("|");
}
/**
 * Build unified data structures from raw profiles.
 */
function buildUnifiedData(allProfiles) {
    const singleCellMap = new Map();
    const indicators = [];
    const multiCellEntries = [];
    for (const [systemId, profiles] of allProfiles) {
        for (const profile of profiles) {
            const mode = systemIdToMode(systemId, profile.braille_type);
            for (const entry of profile.entries) {
                if (entry.role === "indicator" || entry.category === "indicator") {
                    // Process as indicator
                    processIndicator(entry, indicators);
                }
                else if (entry.dots.length === 1) {
                    // Single-cell entry → unified map
                    processSingleCell(entry, mode, singleCellMap);
                }
                else if (entry.dots.length > 1 && entry.print) {
                    // Multi-cell entry
                    processMultiCell(entry, mode, multiCellEntries);
                }
            }
        }
    }
    return { singleCellMap, indicators, multiCellEntries };
}
function processSingleCell(entry, mode, map) {
    if (!entry.print) {
        return;
    }
    const key = dotsToKey(entry.dots);
    const mapping = {
        print: entry.print,
        role: entry.role,
        id: entry.id
    };
    let unified = map.get(key);
    if (!unified) {
        unified = { dots: key, mappings: {} };
        map.set(key, unified);
    }
    // Only set if not already defined (first definition wins per priority)
    if (!unified.mappings[mode]) {
        unified.mappings[mode] = mapping;
    }
}
function processIndicator(entry, indicators) {
    const isTerminator = entry.tags.includes("terminator") || entry.id.includes("terminator");
    const action = isTerminator ? "exit" : "enter";
    // Determine target mode from tags/subcategory
    let targetMode = "grade1";
    if (entry.tags.includes("kana") || entry.subcategory === "kana") {
        targetMode = "kana";
    }
    else if (entry.tags.includes("grade1") || entry.subcategory === "grade1") {
        // grade1 indicator means "switch TO grade1" (from grade2 context)
        targetMode = "grade1";
    }
    else if (entry.subcategory === "nemeth" || entry.tags.includes("nemeth")) {
        targetMode = "nemeth";
    }
    // Determine scope from tags
    let scope = "symbol";
    if (entry.tags.includes("passage")) {
        scope = "passage";
    }
    else if (entry.tags.includes("word")) {
        scope = "word";
    }
    indicators.push({
        id: entry.id,
        dots: entry.dots,
        dotsKey: dotsToKey(entry.dots),
        action,
        targetMode,
        scope,
        tags: entry.tags
    });
}
function processMultiCell(entry, mode, multiCells) {
    multiCells.push({
        id: entry.id,
        dots: entry.dots,
        dotsKey: dotsToKey(entry.dots),
        print: entry.print,
        mode,
        role: entry.role
    });
}
//# sourceMappingURL=unified-table.js.map