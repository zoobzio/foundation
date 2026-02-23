export interface GitHubTag {
  name: string;
  commit: {
    sha: string;
  };
}

export interface FetchTagsOptions {
  repository: string;
  token?: string;
  perPage?: number;
  maxPages?: number;
}

/**
 * Fetch all tags from a GitHub repository with pagination.
 */
export async function fetchTags(options: FetchTagsOptions): Promise<GitHubTag[]> {
  const { repository, token, perPage = 100, maxPages = 10 } = options;
  const tags: GitHubTag[] = [];

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  for (let page = 1; page <= maxPages; page++) {
    const url = `https://api.github.com/repos/${repository}/tags?per_page=${perPage}&page=${page}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository not found: ${repository}`);
      }
      if (response.status === 401) {
        throw new Error("Invalid GitHub token");
      }
      if (response.status === 403) {
        const remaining = response.headers.get("x-ratelimit-remaining");
        if (remaining === "0") {
          const reset = response.headers.get("x-ratelimit-reset");
          const resetDate = reset ? new Date(parseInt(reset, 10) * 1000) : null;
          throw new Error(
            `GitHub rate limit exceeded. Resets at ${resetDate?.toISOString() ?? "unknown"}`,
          );
        }
        throw new Error("GitHub API access forbidden");
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const pageTags = (await response.json()) as GitHubTag[];
    tags.push(...pageTags);

    // Stop if we got fewer than requested (last page)
    if (pageTags.length < perPage) {
      break;
    }
  }

  return tags;
}

/**
 * Check whether a path exists in the repository at the given ref.
 * Uses the GitHub Contents API — returns true on 200, false on 404.
 */
export async function hasPath(options: {
  repository: string;
  ref: string;
  path: string;
  token?: string;
}): Promise<boolean> {
  const { repository, ref, path, token } = options;
  const url = `https://api.github.com/repos/${repository}/contents/${path}?ref=${ref}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { method: "HEAD", headers });
  return response.ok;
}

/**
 * Get the tarball URL for a specific tag.
 */
export function getTarballUrl(repository: string, tag: string): string {
  return `https://api.github.com/repos/${repository}/tarball/${tag}`;
}
