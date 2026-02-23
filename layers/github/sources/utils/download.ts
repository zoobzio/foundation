import { createWriteStream } from "node:fs";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { createGunzip } from "node:zlib";
import { join, dirname } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { extract } from "tar";
import { getTarballUrl } from "./api";

export interface DownloadOptions {
  repository: string;
  tag: string;
  docsPath: string;
  cacheDir: string;
  token?: string;
}

export interface CacheEntry {
  etag: string;
  downloadedAt: string;
}

/**
 * Download and extract docs from a GitHub tag's tarball.
 * Uses ETag caching to avoid re-downloading unchanged content.
 */
export async function downloadTagDocs(options: DownloadOptions): Promise<void> {
  const { repository, tag, docsPath, cacheDir, token } = options;

  const tagCacheDir = join(cacheDir, tag);
  const cacheMetaPath = join(tagCacheDir, ".cache-meta.json");

  // Check existing cache
  let existingEtag: string | undefined;
  try {
    const meta = JSON.parse(await readFile(cacheMetaPath, "utf-8")) as CacheEntry;
    existingEtag = meta.etag;
  } catch {
    // No cache exists
  }

  const url = getTarballUrl(repository, tag);
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (existingEtag) {
    headers["If-None-Match"] = existingEtag;
  }

  const response = await fetch(url, { headers });

  // Cache hit - content unchanged
  if (response.status === 304) {
    console.log(`[github-tags] Cache hit for ${tag}`);
    return;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to download tarball for ${tag}: ${response.status} ${response.statusText}`,
    );
  }

  const etag = response.headers.get("etag") ?? "";

  // Clear existing cache for this tag
  try {
    await rm(tagCacheDir, { recursive: true, force: true });
  } catch {
    // Ignore if doesn't exist
  }

  await mkdir(tagCacheDir, { recursive: true });

  // Extract tarball, filtering to only docs path
  const body = response.body;
  if (!body) {
    throw new Error("No response body");
  }

  console.log(`[github-tags] Downloading ${tag}...`);

  // GitHub tarballs have a root folder like "owner-repo-sha/"
  // We need to strip this and filter to docsPath
  // The filter receives paths BEFORE stripping, e.g. "owner-repo-sha/docs/file.md"
  const docsPathPattern = new RegExp(`^[^/]+/${docsPath}(/|$)`);

  await pipeline(
    Readable.fromWeb(body as import("stream/web").ReadableStream),
    createGunzip(),
    extract({
      cwd: tagCacheDir,
      strip: 1, // Remove the root "owner-repo-sha/" folder
      filter: (path) => docsPathPattern.test(path),
    }),
  );

  // Save cache metadata
  const cacheMeta: CacheEntry = {
    etag,
    downloadedAt: new Date().toISOString(),
  };
  await writeFile(cacheMetaPath, JSON.stringify(cacheMeta, null, 2));

  console.log(`[github-tags] Extracted ${tag}`);
}

/**
 * Build a map of content paths to file system paths.
 * Returns paths like "v1.0.0/guides/intro.md" -> "/path/to/cache/v1.0.0/docs/guides/intro.md"
 * Keep .md extension so Nuxt Content recognizes the file type.
 */
export async function buildContentMap(
  cacheDir: string,
  tags: string[],
  docsPath: string,
): Promise<Map<string, string>> {
  const { glob } = await import("glob");
  const contentMap = new Map<string, string>();

  for (const tag of tags) {
    const tagDocsDir = join(cacheDir, tag, docsPath);
    const files = await glob("**/*.md", { cwd: tagDocsDir });

    for (const file of files) {
      const contentKey = `${tag}/${file}`;
      const filePath = join(tagDocsDir, file);
      contentMap.set(contentKey, filePath);
    }
  }

  return contentMap;
}
