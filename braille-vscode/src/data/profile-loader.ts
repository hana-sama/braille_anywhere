// ============================================================
// Profile Loader: Reads braille-lib JSON files
// ============================================================

import * as fs from "fs";
import * as path from "path";
import { RawBrailleProfile } from "./types";

/**
 * Load all JSON profiles from a directory.
 * Each subdirectory (kana/, ueb/, nemeth/) contains one or more JSON files.
 */
export function loadAllProfiles(
  dataDir: string
): Map<string, RawBrailleProfile[]> {
  const profiles = new Map<string, RawBrailleProfile[]>();

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

    const systemProfiles: RawBrailleProfile[] = [];
    for (const file of jsonFiles) {
      try {
        const content = fs.readFileSync(path.join(systemPath, file), "utf-8");
        const profile: RawBrailleProfile = JSON.parse(content);
        systemProfiles.push(profile);
      } catch (e) {
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
export function loadSystemProfiles(
  dataDir: string,
  systemId: string
): RawBrailleProfile[] {
  const systemPath = path.join(dataDir, systemId);

  if (!fs.existsSync(systemPath)) {
    console.warn(`[Braille] System directory not found: ${systemPath}`);
    return [];
  }

  const jsonFiles = fs.readdirSync(systemPath).filter(f => f.endsWith(".json"));
  const profiles: RawBrailleProfile[] = [];

  for (const file of jsonFiles) {
    try {
      const content = fs.readFileSync(path.join(systemPath, file), "utf-8");
      profiles.push(JSON.parse(content));
    } catch (e) {
      console.warn(`[Braille] Failed to load ${systemId}/${file}:`, e);
    }
  }

  return profiles;
}
