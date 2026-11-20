// The commit history of the example: a timeline over a fake backend, an
// array in memory that `fetch` reads a batch at a time. The commits are
// dated back from now, a few a day, so the page always has today on it.
import type { FetchParams, FetchResult } from "@zoobzio/timeline";

import { createTimeline } from "@zoobzio/nuxt/factories/timeline";

/** A commit, as the backend serves one. */
export type Commit = {
  sha: string;
  message: string;
  author: string;
  at: string;
};

export const AUTHORS = ["ada", "grace", "linus", "margaret"];

const VERBS = ["Add", "Fix", "Tidy", "Rename", "Drop", "Document", "Test"];
const THINGS = [
  "the loader",
  "a stale cursor",
  "the state container",
  "column pinning",
  "the sync interval",
  "saved views",
  "the search toolbar",
  "an empty state",
  "the changelog",
];

const HOUR = 3_600_000;

/** A sha that reads like one, from a number. */
const sha = (seed: number): string =>
  ((seed * 2_654_435_761) >>> 0).toString(16).padStart(8, "0").slice(0, 7);

const started = Date.now() - HOUR;

/** The hours between a commit and the one before it: from two to five. */
const gap = (index: number): number => 2 + (index % 4);

/** The history, the latest first: each commit a few hours before the last, so a day holds several. */
let commits: Commit[] = [];
for (let index = 0, at = started; index < 96; at -= gap(index++) * HOUR) {
  commits.push({
    sha: sha(index + 1),
    message: `${VERBS[index % VERBS.length]} ${THINGS[(index * 5) % THINGS.length]}`,
    author: AUTHORS[(index * 3) % AUTHORS.length] ?? "ada",
    at: new Date(at).toISOString(),
  });
}

let pushed = 0;

/** The backend's write: a commit made now, by the next author in turn. */
export const push = (): Commit => {
  pushed += 1;
  const made: Commit = {
    sha: sha(1_000 + pushed),
    message: `Push number ${pushed} from the page`,
    author: AUTHORS[pushed % AUTHORS.length] ?? "ada",
    at: new Date().toISOString(),
  };
  commits = [made, ...commits];
  return made;
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The backend's read: a batch of the commits the search leaves, from the
 * cursor, which is how many to pass over. The text is looked for in the
 * message, and an `author` filter keeps one author's.
 */
const fetch = async ({
  cursor,
  limit,
  query,
  filters,
}: FetchParams): Promise<FetchResult<Commit>> => {
  await pause(200);
  const text = query.toLowerCase();
  const authors = filters.filter((f) => f.key === "author").map((f) => f.value);
  const left = commits.filter(
    (entry) =>
      entry.message.toLowerCase().includes(text) &&
      authors.every((author) => entry.author === author),
  );
  const from = Number(cursor ?? 0);
  const next = from + limit;
  return {
    data: structuredClone(left.slice(from, next)),
    cursor: next < left.length ? String(next) : null,
  };
};

export const useHistory = createTimeline<Commit>("history", {
  fetch,
  key: "sha",
  label: "message",
  limit: 12,
  fields: { author: { label: "Author", values: AUTHORS } },
  timeZone: "UTC",
});
