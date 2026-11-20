import { describe, expect, it } from "vitest";
import { dayOf, groupOf, groupsOf, merge, timeOf } from "../src/util";
import { commit, commits } from "./data";

describe("timeOf", () => {
  it("reads a date-time, a count of milliseconds, and a Date", () => {
    const at = new Date("2026-03-04T09:00:00Z");
    expect(timeOf("2026-03-04T09:00:00Z")).toEqual(at);
    expect(timeOf(at.getTime())).toEqual(at);
    expect(timeOf(at)).toEqual(at);
  });

  it("reads nothing from what is not a time", () => {
    expect(timeOf("soon")).toBeNull();
    expect(timeOf(undefined)).toBeNull();
    expect(timeOf(null)).toBeNull();
    expect(timeOf({})).toBeNull();
    expect(timeOf(new Date("nope"))).toBeNull();
  });
});

describe("dayOf", () => {
  it("reads the day of an instant in a zone", () => {
    const at = new Date("2026-03-03T23:30:00Z");
    expect(dayOf(at, "UTC")).toBe("2026-03-03");
    expect(dayOf(at, "Asia/Tokyo")).toBe("2026-03-04");
    expect(dayOf(at, "America/Los_Angeles")).toBe("2026-03-03");
  });
});

describe("groupOf", () => {
  const at = new Date("2026-03-03T23:30:00Z");

  it("cuts the day to the grouping", () => {
    expect(groupOf(at, "day", "UTC")).toBe("2026-03-03");
    expect(groupOf(at, "month", "UTC")).toBe("2026-03");
    expect(groupOf(at, "year", "UTC")).toBe("2026");
    expect(groupOf(at, "none", "UTC")).toBe("");
  });

  it("has no key for no time", () => {
    expect(groupOf(null, "day", "UTC")).toBe("");
  });
});

describe("groupsOf", () => {
  const by = (grouping: Parameters<typeof groupOf>[1], zone = "UTC") =>
    groupsOf(commits, (record) =>
      groupOf(new Date(record.at), grouping, zone),
    ).map((group) => [group.key, group.records.map((record) => record.sha)]);

  it("groups each run of records that share a day", () => {
    expect(by("day")).toEqual([
      ["2026-03-04", ["e5", "d4"]],
      ["2026-03-03", ["c3", "b2"]],
      ["2026-02-27", ["a1"]],
    ]);
  });

  it("reads the day in the zone", () => {
    expect(by("day", "Asia/Tokyo")).toEqual([
      ["2026-03-05", ["e5"]],
      ["2026-03-04", ["d4", "c3"]],
      ["2026-03-03", ["b2"]],
      ["2026-02-27", ["a1"]],
    ]);
  });

  it("groups by the month, the year, or nothing", () => {
    expect(by("month")).toEqual([
      ["2026-03", ["e5", "d4", "c3", "b2"]],
      ["2026-02", ["a1"]],
    ]);
    expect(by("year")).toEqual([["2026", ["e5", "d4", "c3", "b2", "a1"]]]);
    expect(by("none")).toEqual([["", ["e5", "d4", "c3", "b2", "a1"]]]);
  });

  it("keeps the records in the order they come, and has no group of none", () => {
    expect(groupsOf([], () => "")).toEqual([]);
    const keys = ["a", "b", "a"];
    expect(
      groupsOf(commits.slice(0, 3), () => keys.shift() ?? "").map(
        (group) => group.key,
      ),
    ).toEqual(["a", "b", "a"]);
  });
});

describe("merge", () => {
  const lay = (incoming: typeof commits, order: "desc" | "asc" = "desc") =>
    merge(
      order === "desc"
        ? commits
        : commits.map((_, index) => commits[commits.length - 1 - index]!),
      incoming,
      (record) => record.sha,
      (record) => Date.parse(record.at),
      order,
    );

  it("replaces a record it holds where it stands", () => {
    const next = commit("c3", "2026-03-03T23:30:00Z", { message: "Amended" });
    const merged = lay([next]);
    expect(merged.map((record) => record.sha)).toEqual(
      commits.map((record) => record.sha),
    );
    expect(merged[2]).toBe(next);
  });

  it("places a new record by its time, ahead of the held ones of that time", () => {
    const merged = lay([
      commit("g7", "2026-03-05T08:00:00Z"),
      commit("f6", "2026-03-04T09:00:00Z"),
      commit("z0", "2026-01-01T00:00:00Z"),
    ]);
    expect(merged.map((record) => record.sha)).toEqual([
      "g7",
      "e5",
      "f6",
      "d4",
      "c3",
      "b2",
      "a1",
      "z0",
    ]);
  });

  it("places a new record the other way where the timeline runs forward", () => {
    const merged = lay(
      [
        commit("g7", "2026-03-05T08:00:00Z"),
        commit("z0", "2026-01-01T00:00:00Z"),
      ],
      "asc",
    );
    expect(merged.map((record) => record.sha)).toEqual([
      "z0",
      "a1",
      "b2",
      "c3",
      "d4",
      "e5",
      "g7",
    ]);
  });

  it("leaves what it was given as it was", () => {
    const before = [...commits];
    lay([commit("g7", "2026-03-05T08:00:00Z")]);
    expect(commits).toEqual(before);
  });
});
