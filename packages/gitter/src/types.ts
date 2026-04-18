export interface GitterModuleOptions {
  /** GitHub API token (default: process.env.GITHUB_TOKEN) */
  token?: string;
}

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

export interface DownloadOptions {
  /** Repository in "owner/repo" format */
  repository: string;
  /** Git ref to download (tag, branch, commit) */
  ref: string;
  /** Path within the repository to extract */
  path: string;
  /** Local cache directory */
  cacheDir: string;
  /** GitHub API token */
  token?: string;
}

export interface CacheEntry {
  etag: string;
  downloadedAt: string;
}

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  raw: string;
}
