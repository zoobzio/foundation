/** A commit, as the tests' timelines hold one. */
export type Commit = {
  sha: string;
  message: string;
  author: string;
  at: string;
};

export const commit = (
  sha: string,
  at: string,
  rest: Partial<Commit> = {},
): Commit => ({ sha, message: `Commit ${sha}`, author: "ada", at, ...rest });

/** Five commits over three days, the latest first. */
export const commits: Commit[] = [
  commit("e5", "2026-03-04T16:00:00Z"),
  commit("d4", "2026-03-04T09:00:00Z"),
  commit("c3", "2026-03-03T23:30:00Z"),
  commit("b2", "2026-03-03T08:00:00Z"),
  commit("a1", "2026-02-27T12:00:00Z"),
];
