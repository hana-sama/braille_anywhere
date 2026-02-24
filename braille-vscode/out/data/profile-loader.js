"use strict";
// ============================================================
// Profile Loader: Reads braille-lib JSON files
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
exports.loadAllProfiles = loadAllProfiles;
exports.loadSystemProfiles = loadSystemProfiles;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Load all JSON profiles from a directory.
 * Each subdirectory (kana/, ueb/, nemeth/) contains one or more JSON files.
 */
function loadAllProfiles(dataDir) {
    const profiles = new Map();
    if (!fs.existsSync(dataDir)) {
        console.warn(`[Braille] Data directory not found: ${dataDir}`);
        return profiles;
    }
    const systemDirs = fs
        .readdirSync(dataDir, { withFileTypes: true })
        .filter(d => d.isDirectory());
    for (const dir of systemDirs) {
        const systemId = dir.name;
        const systemPath = path.join(dataDir, systemId);
        const jsonFiles = fs
            .readdirSync(systemPath)
            .filter(f => f.endsWith(".json"));
        const systemProfiles = [];
        for (const file of jsonFiles) {
            try {
                const content = fs.readFileSync(path.join(systemPath, file), "utf-8");
                const profile = JSON.parse(content);
                systemProfiles.push(profile);
            }
            catch (e) {
                console.warn(`[Braille] Failed to load ${systemId}/${file}:`, e);
            }
        }
        if (systemProfiles.length > 0) {
            profiles.set(systemId, systemProfiles);
        }
    }
    return profiles;
}
/**
 * Load profiles for a specific system (e.g., "ueb", "kana").
 */
function loadSystemProfiles(dataDir, systemId) {
    const systemPath = path.join(dataDir, systemId);
    if (!fs.existsSync(systemPath)) {
        console.warn(`[Braille] System directory not found: ${systemPath}`);
        return [];
    }
    const jsonFiles = fs.readdirSync(systemPath).filter(f => f.endsWith(".json"));
    const profiles = [];
    for (const file of jsonFiles) {
        try {
            const content = fs.readFileSync(path.join(systemPath, file), "utf-8");
            profiles.push(JSON.parse(content));
        }
        catch (e) {
            console.warn(`[Braille] Failed to load ${systemId}/${file}:`, e);
        }
    }
    return profiles;
}
//# sourceMappingURL=profile-loader.js.map