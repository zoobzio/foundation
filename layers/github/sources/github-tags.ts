import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fetchTags, hasPath } from "./utils/api";
import { downloadTagDocs, buildContentMap } from "./utils/download";
import {
  sortVersionsDesc,
  filterVersions,
  isPrerelease,
} from "./utils/semver";

export interface GitHubTagSourceOptions {
  /** Repository in "owner/repo" format */
  repository: string;
  /** Path to docs folder within the repository (default: "docs") */
  docsPath?: string;
  /** Regex pattern to filter tags (default: "^v\\d+\\.\\d+\\.\\d+") */
  tagPattern?: string;
  /** GitHub token for API access (default: process.env.GITHUB_TOKEN) */
  token?: string;
  /** Explicit latest version override (default: highest semver) */
  latestVersion?: string;
  /** Include prerelease versions (default: false) */
  includePrereleases?: boolean;
  /** Cache directory relative to rootDir (default: ".content-cache") */
  cacheDir?: string;
}

export interface VersionManifest {
  versions: string[];
  latest: string;
  generatedAt: string;
}

/**
 * Create a custom collection source that fetches docs from GitHub tags.
 *
 * @example
 * ```ts
 * import { defineGitHubTagSource } from "@foundation/github/sources/github-tags";
 *
 * export default defineContentConfig({
 *   collections: {
 *     docs: defineCollection({
 *       type: "page",
 *       source: defineGitHubTagSource({
 *         repository: "owner/repo",
 *         docsPath: "docs",
 *       }),
 *     }),
 *   },
 * });
 * ```
 */
export function defineGitHubTagSource(options: GitHubTagSourceOptions) {
  const {
    repository,
    docsPath = "docs",
    tagPattern = "^v\\d+\\.\\d+\\.\\d+",
    token = process.env.GITHUB_TOKEN,
    latestVersion,
    includePrereleases = false,
    cacheDir = ".content-cache",
  } = options;

  let resolvedCacheDir: string;
  let contentMap: Map<string, string>;
  let versions: string[] = [];

  return {
    _resolved: true as const,
    cwd: "",
    include: "**/*",
    async prepare({ rootDir }: { rootDir: string }) {
      resolvedCacheDir = join(rootDir, cacheDir);
      await mkdir(resolvedCacheDir, { recursive: true });

      console.log(`[github-tags] Fetching tags from ${repository}...`);

      // Fetch all tags
      const allTags = await fetchTags({ repository, token });
      const tagNames = allTags.map((t) => t.name);

      // Filter by pattern
      let filtered = filterVersions(tagNames, tagPattern);

      // Filter out prereleases if not included
      if (!includePrereleases) {
        filtered = filtered.filter((v) => !isPrerelease(v));
      }

      // Sort by semver (newest first)
      const sorted = sortVersionsDesc(filtered);

      if (sorted.length === 0) {
        console.warn(
          `[github-tags] No tags found matching pattern "${tagPattern}" in ${repository}`,
        );
        versions = [];
        contentMap = new Map();
        return;
      }

      console.log(`[github-tags] Found ${sorted.length} tags, checking for ${docsPath}/...`);

      // Filter to only tags that contain the docs path
      const checks = await Promise.all(
        sorted.map(async (tag) => ({
          tag,
          hasDocs: await hasPath({ repository, ref: tag, path: docsPath, token }),
        })),
      );
      versions = checks.filter((c) => c.hasDocs).map((c) => c.tag);

      const skipped = sorted.length - versions.length;
      if (skipped > 0) {
        console.log(`[github-tags] Skipped ${skipped} tags without ${docsPath}/`);
      }

      if (versions.length === 0) {
        console.warn(
          `[github-tags] No tags contain a ${docsPath}/ directory in ${repository}`,
        );
        contentMap = new Map();
        return;
      }

      console.log(`[github-tags] Found ${versions.length} versions with docs: ${versions.join(", ")}`);

      // Download docs for each version
      for (const tag of versions) {
        await downloadTagDocs({
          repository,
          tag,
          docsPath,
          cacheDir: resolvedCacheDir,
          token,
        });
      }

      // Build content map
      contentMap = await buildContentMap(resolvedCacheDir, versions, docsPath);

      console.log(`[github-tags] Indexed ${contentMap.size} content files`);

      // Generate version manifest
      const manifest: VersionManifest = {
        versions,
        latest: latestVersion ?? versions[0],
        generatedAt: new Date().toISOString(),
      };

      await writeFile(
        join(resolvedCacheDir, "version-manifest.json"),
        JSON.stringify(manifest, null, 2),
      );

      console.log(`[github-tags] Version manifest written`);
    },

    async getKeys(): Promise<string[]> {
      return Array.from(contentMap.keys());
    },

    async getItem(key: string) {
      const filePath = contentMap.get(key);
      if (!filePath) {
        throw new Error(`Content not found: ${key}`);
      }
      return readFile(filePath, "utf-8");
    },
  };
}
