import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { createGunzip } from "node:zlib";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { extract } from "tar";
import type { DownloadOptions, CacheEntry } from "../types";
import { githubHeaders, getTarballUrl } from "./api";

/**
 * Download and extract a path from a GitHub ref's tarball.
 * Uses ETag caching to avoid re-downloading unchanged content.
 */
export async function downloadPath(options: DownloadOptions): Promise<void> {
  const { repository, ref, path, cacheDir, token } = options;

  const refCacheDir = join(cacheDir, ref);
  const cacheMetaPath = join(refCacheDir, ".cache-meta.json");

  // Check existing cache
  let existingEtag: string | undefined;
  try {
    const meta = JSON.parse(await readFile(cacheMetaPath, "utf-8")) as CacheEntry;
    existingEtag = meta.etag;
  } catch {
    // No cache exists
  }

  const url = getTarballUrl(repository, ref);
  const headers = githubHeaders(token);

  if (existingEtag) {
    headers["If-None-Match"] = existingEtag;
  }

  const response = await fetch(url, { headers });

  // Cache hit — content unchanged
  if (response.status === 304) {
    return;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to download tarball for ${ref}: ${response.status} ${response.statusText}`,
    );
  }

  const etag = response.headers.get("etag") ?? "";

  // Clear existing cache for this ref
  try {
    await rm(refCacheDir, { recursive: true, force: true });
  } catch {
    // Ignore if doesn't exist
  }

  await mkdir(refCacheDir, { recursive: true });

  const body = response.body;
  if (!body) {
    throw new Error("No response body");
  }

  // GitHub tarballs have a root folder like "owner-repo-sha/"
  // Strip it and filter to the requested path
  const pathPattern = new RegExp(`^[^/]+/${path}(/|$)`);

  await pipeline(
    Readable.fromWeb(body as import("stream/web").ReadableStream),
    createGunzip(),
    extract({
      cwd: refCacheDir,
      strip: 1,
      filter: (entry) => pathPattern.test(entry),
    }),
  );

  // Save cache metadata
  const cacheMeta: CacheEntry = {
    etag,
    downloadedAt: new Date().toISOString(),
  };
  await writeFile(cacheMetaPath, JSON.stringify(cacheMeta, null, 2));
}

/**
 * Build a map of `ref/relative-path` → absolute file path for cached downloads.
 */
export async function buildFileMap(
  cacheDir: string,
  refs: string[],
  path: string,
  pattern = "**/*.md",
): Promise<Map<string, string>> {
  const { glob } = await import("glob");
  const fileMap = new Map<string, string>();

  for (const ref of refs) {
    const refDir = join(cacheDir, ref, path);
    const files = await glob(pattern, { cwd: refDir });

    for (const file of files) {
      const key = `${ref}/${file}`;
      const filePath = join(refDir, file);
      fileMap.set(key, filePath);
    }
  }

  return fileMap;
}
