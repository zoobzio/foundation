export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  raw: string;
}

/**
 * Parse a version string (with or without "v" prefix) into components.
 * Returns null if the string doesn't match semver format.
 */
export function parseSemver(version: string): SemVer | null {
  const match = version.match(
    /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?$/,
  );
  if (!match) return null;

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4],
    raw: version,
  };
}

/**
 * Compare two semver objects for sorting.
 * Returns negative if a < b, positive if a > b, zero if equal.
 */
export function compareSemver(a: SemVer, b: SemVer): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;

  // Prereleases sort before releases
  if (a.prerelease && !b.prerelease) return -1;
  if (!a.prerelease && b.prerelease) return 1;
  if (a.prerelease && b.prerelease) {
    return a.prerelease.localeCompare(b.prerelease);
  }

  return 0;
}

/**
 * Check if a version string represents a prerelease.
 */
export function isPrerelease(version: string): boolean {
  const parsed = parseSemver(version);
  return parsed?.prerelease !== undefined;
}

/**
 * Sort version strings by semver in descending order (newest first).
 * Non-semver strings are filtered out.
 */
export function sortVersionsDesc(versions: string[]): string[] {
  return versions
    .map((v) => parseSemver(v))
    .filter((v): v is SemVer => v !== null)
    .sort((a, b) => -compareSemver(a, b))
    .map((v) => v.raw);
}

/**
 * Filter versions by a regex pattern.
 */
export function filterVersions(
  versions: string[],
  pattern: string,
): string[] {
  const regex = new RegExp(pattern);
  return versions.filter((v) => regex.test(v));
}
