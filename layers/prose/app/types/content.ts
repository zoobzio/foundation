/**
 * Common page content metadata fields
 */
export interface PageContent {
  id: string;
  path: string;
  title: string;
  description?: string;
  author?: string;
  published?: string;
  updated?: string;
  readtime?: string;
  tags?: string[];
}
