/** A commit, as the test timelines hold one. */
export type Commit = {
  sha: string;
  message: string;
  author: string;
  at: string;
};

/** The instant the test timelines read as now: Wednesday 4 March 2026. */
export const NOW = new Date("2026-03-04T12:00:00Z");

const commit = (
  sha: string,
  at: string,
  message: string,
  author = "ada",
): Commit => ({ sha, message, author, at });

/** Five commits over three days, the latest first. */
export const fakeCommits: Commit[] = [
  commit("e5", "2026-03-04T16:00:00Z", "Fix the build"),
  commit("d4", "2026-03-04T09:00:00Z", "Add a loader", "linus"),
  commit("c3", "2026-03-03T23:30:00Z", "Tidy the types"),
  commit("b2", "2026-03-03T08:00:00Z", "Rename a flag", "linus"),
  commit("a1", "2026-02-27T12:00:00Z", "First commit"),
];
