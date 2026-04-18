import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { useLogger } from "@nuxt/kit";

const logger = useLogger("github-resources");

interface ResourceDefinition {
  /** Path to the file in the repository (e.g. "README.md") */
  path: string;
  /** Content key used by Nuxt Content (e.g. "readme") */
  key: string;
  /** Display title injected as frontmatter */
  title: string;
  /** Icon name injected as frontmatter */
  icon: string;
}

export interface GitHubResourceSourceOptions {
  /** Repository in "owner/repo" format */
  repository: string;
  /** Resource files to fetch (defaults to README, SECURITY, CONTRIBUTING) */
  resources?: ResourceDefinition[];
  /** GitHub token for API access (default: process.env.GITHUB_TOKEN) */
  token?: string;
  /** Cache directory relative to rootDir (default: ".content-cache") */
  cacheDir?: string;
}

const DEFAULT_RESOURCES: ResourceDefinition[] = [
  { path: "README.md", key: "readme", title: "README", icon: "book-open" },
  { path: "SECURITY.md", key: "security", title: "Security", icon: "shield" },
  { path: "CONTRIBUTING.md", key: "contributing", title: "Contributing", icon: "code" },
];

function githubHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchFileContent(
  repository: string,
  path: string,
  token?: string,
): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${repository}/contents/${path}`,
    { headers: githubHeaders(token) },
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (data.encoding !== "base64" || !data.content) return null;
  return Buffer.from(data.content, "base64").toString("utf-8");
}

function injectFrontmatter(markdown: string, meta: Record<string, string>): string {
  const lines = Object.entries(meta).map(([k, v]) => `${k}: ${v}`);
  return `---\n${lines.join("\n")}\n---\n\n${markdown}`;
}

/**
 * Create a custom collection source that fetches repository resource files from GitHub.
 *
 * @example
 * ```ts
 * import { defineGitHubResourceSource } from "@zoobz-io/github/sources/github-resources";
 *
 * export default defineContentConfig({
 *   collections: {
 *     resources: defineCollection({
 *       type: "page",
 *       source: defineGitHubResourceSource({
 *         repository: "owner/repo",
 *       }),
 *       schema: z.object({
 *         icon: z.string().optional(),
 *       }),
 *     }),
 *   },
 * });
 * ```
 */
export function defineGitHubResourceSource(options: GitHubResourceSourceOptions) {
  const {
    repository,
    resources = DEFAULT_RESOURCES,
    token = process.env.GITHUB_TOKEN,
    cacheDir = ".content-cache",
  } = options;

  let contentMap: Map<string, string>;

  return {
    _resolved: true as const,
    cwd: "",
    include: "**/*",

    async prepare({ rootDir }: { rootDir: string }) {
      const resourceDir = join(rootDir, cacheDir, "resources");
      await mkdir(resourceDir, { recursive: true });

      contentMap = new Map();

      logger.info(`Fetching resources from ${repository}...`);

      for (const resource of resources) {
        const content = await fetchFileContent(repository, resource.path, token);
        if (!content) {
          logger.warn(`${resource.path} not found in ${repository}`);
          continue;
        }

        const withFrontmatter = injectFrontmatter(content, {
          title: resource.title,
          icon: resource.icon,
        });

        const filePath = join(resourceDir, `${resource.key}.md`);
        await writeFile(filePath, withFrontmatter);

        contentMap.set(`${resource.key}.md`, filePath);
      }

      logger.info(`Fetched ${contentMap.size} resources`);
    },

    async getKeys(): Promise<string[]> {
      return Array.from(contentMap.keys());
    },

    async getItem(key: string) {
      const filePath = contentMap.get(key);
      if (!filePath) {
        throw new Error(`Resource not found: ${key}`);
      }
      return readFile(filePath, "utf-8");
    },
  };
}
