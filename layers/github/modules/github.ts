import { existsSync, readFileSync } from "node:fs";
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { addTemplate, defineNuxtModule, useLogger } from "@nuxt/kit";
import type { VersionManifest } from "../sources/github-tags";

const logger = useLogger("github");

interface StatItem {
  label: string;
  value: string;
}

export interface GitHubModuleOptions {
  /** Repository in "owner/repo" format or full GitHub URL */
  repo?: string;
  /** Cache directory relative to rootDir (default: ".content-cache") */
  cacheDir?: string;
  /** GitHub usernames to fetch avatars for */
  avatars?: string[];
}

function parseRepo(repo: string): { owner: string; repo: string } | null {
  const urlMatch = repo.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] };
  const slugMatch = repo.match(/^([^/]+)\/([^/]+)$/);
  if (slugMatch) return { owner: slugMatch[1], repo: slugMatch[2] };
  return null;
}

function githubHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchCoverage(owner: string, repo: string): Promise<StatItem | null> {
  try {
    const res = await fetch(`https://codecov.io/api/v2/github/${owner}/repos/${repo}`);
    if (!res.ok) return null;
    const data = await res.json();
    const coverage = data?.totals?.coverage;
    if (coverage == null) return null;
    return { label: "Test Coverage", value: `${Math.round(coverage)}%` };
  } catch {
    return null;
  }
}

async function fetchGoReport(owner: string, repo: string): Promise<StatItem | null> {
  try {
    const res = await fetch(`https://goreportcard.com/report/github.com/${owner}/${repo}`);
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/var\s+response\s*=\s*(\{.*\})\s*;/);
    if (!match) return null;
    const data = JSON.parse(match[1]);
    if (!data.grade) return null;
    return { label: "Go Report", value: data.grade };
  } catch {
    return null;
  }
}

async function fetchLicense(owner: string, repo: string, token?: string): Promise<StatItem | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: githubHeaders(token),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const license = data?.license?.spdx_id;
    if (!license || license === "NOASSERTION") return null;
    return { label: "License", value: license };
  } catch {
    return null;
  }
}

async function fetchGoVersion(owner: string, repo: string, token?: string): Promise<StatItem | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/go.mod`, {
      headers: githubHeaders(token),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.encoding !== "base64" || !data.content) return null;
    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    const match = decoded.match(/^go\s+(\S+)/m);
    if (!match) return null;
    return { label: "Go Version", value: `${match[1]}+` };
  } catch {
    return null;
  }
}

async function fetchLatestRelease(owner: string, repo: string, token?: string): Promise<StatItem | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
      headers: githubHeaders(token),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.tag_name) return null;
    return { label: "Latest Release", value: data.tag_name };
  } catch {
    return null;
  }
}

async function resolveStats(
  repoUrl: string,
): Promise<StatItem[]> {
  const parsed = parseRepo(repoUrl);
  if (!parsed) {
    logger.warn("Could not parse repo:", repoUrl);
    return [];
  }

  const { owner, repo } = parsed;
  const token = process.env.GITHUB_TOKEN;

  logger.info(`Fetching stats for ${owner}/${repo}...`);

  const results = await Promise.all([
    fetchCoverage(owner, repo),
    fetchGoReport(owner, repo),
    fetchLicense(owner, repo, token),
    fetchGoVersion(owner, repo, token),
    fetchLatestRelease(owner, repo, token),
  ]);

  const stats = results.filter((s): s is StatItem => s !== null);

  if (stats.length === 0) {
    logger.warn("No stats could be fetched");
    return [];
  }

  logger.info(`Fetched ${stats.length} stats: ${stats.map((s) => s.label).join(", ")}`);
  return stats;
}

function resolveVersions(cacheDir: string): VersionManifest | null {
  const manifestPath = join(cacheDir, "version-manifest.json");
  if (!existsSync(manifestPath)) {
    logger.warn("No version manifest found");
    return null;
  }

  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as VersionManifest;
    logger.info(`Loaded ${manifest.versions.length} versions, latest: ${manifest.latest}`);
    return manifest;
  } catch (err) {
    logger.error("Failed to read version manifest:", err);
    return null;
  }
}

async function fetchAvatar(username: string, dir: string) {
  const dest = join(dir, `${username}.png`);
  if (existsSync(dest)) return;

  try {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    logger.info(`Fetching avatar for ${username}...`);
    const res = await fetch(`https://github.com/${username}.png?size=512`);

    if (!res.ok) {
      logger.error(`Failed to fetch avatar for ${username}: ${res.status}`);
      return;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buffer);
    logger.success(`Avatar saved: avatars/${username}.png`);
  } catch (e) {
    logger.error(`Failed to fetch avatar for ${username}: ${e}`);
  }
}

async function findAuthors(contentDirs: string[]): Promise<Set<string>> {
  const authors = new Set<string>();

  for (const dir of contentDirs) {
    if (!existsSync(dir)) continue;
    const files = await readdir(dir, { recursive: true });

    for (const file of files) {
      if (!String(file).endsWith(".md")) continue;
      const content = await readFile(join(dir, String(file)), "utf-8");
      const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
      if (!match) continue;
      const authorMatch = match[1].match(/^author:\s*(.+)$/m);
      if (authorMatch) authors.add(authorMatch[1].trim());
    }
  }

  return authors;
}

export default defineNuxtModule<GitHubModuleOptions>({
  meta: {
    name: "github",
    configKey: "github",
  },
  defaults: {
    cacheDir: ".content-cache",
  },
  async setup(options, nuxt) {
    const cacheDir = join(nuxt.options.rootDir, options.cacheDir!);

    // Read version manifest after content sources have written it, but before appConfig is serialized
    nuxt.hook("app:templates", () => {
      const versionManifest = resolveVersions(cacheDir);
      if (versionManifest) {
        nuxt.options.appConfig.version = {
          versions: versionManifest.versions,
          latest: versionManifest.latest,
          latestOnly: versionManifest.latestOnly,
          current: "",
        };
      }
    });

    // Stats
    let statsData: StatItem[] = [];
    if (options.repo) {
      statsData = await resolveStats(options.repo);
    }

    addTemplate({
      filename: "github/stats.ts",
      write: true,
      getContents: () =>
        `export const stats = ${JSON.stringify(statsData)} as const;\n`,
    });

    nuxt.options.alias["#github/stats"] = join(
      nuxt.options.buildDir,
      "github/stats",
    );

    // Avatars
    const avatarDir = join(nuxt.options.rootDir, "public/avatars");
    const usernames = new Set<string>();

    // Explicit avatars from module config
    if (options.avatars) {
      for (const u of options.avatars) usernames.add(u);
    }

    const github = nuxt.options.appConfig?.github as string | undefined;
    if (github) usernames.add(github);

    // Scan local content dirs + cache dir for author frontmatter
    const contentDirs = nuxt.options._layers
      .map((l) => join(l.cwd, "content"))
      .filter((d) => existsSync(d));
    if (existsSync(cacheDir)) contentDirs.push(cacheDir);
    const authors = await findAuthors(contentDirs);
    for (const author of authors) usernames.add(author);

    if (usernames.size > 0) {
      await Promise.all(
        [...usernames].map((u) => fetchAvatar(u, avatarDir)),
      );
    }
  },
});
