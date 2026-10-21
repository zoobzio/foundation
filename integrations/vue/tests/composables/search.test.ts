import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useSearch } from "../../src/composables/search";
import { fakeGroups } from "#test/data/groups";
import { withSetup } from "#test/mount/composable";

const labels = (results: { options: { label: string }[] }[]) =>
  results.flatMap((group) => group.options.map((o) => o.label));

describe("useSearch", () => {
  it("passes every group through when the search is empty", () => {
    const { result } = withSetup(() => useSearch(ref(""), fakeGroups));
    expect(result.results.value).toEqual(fakeGroups);
    expect(result.hasResults.value).toBe(true);
  });

  it("treats undefined and whitespace as an empty search", () => {
    const search = ref<string | undefined>(undefined);
    const { result } = withSetup(() => useSearch(search, fakeGroups));
    expect(labels(result.results.value)).toHaveLength(4);
    search.value = "   ";
    expect(labels(result.results.value)).toHaveLength(4);
  });

  it("matches a case-insensitive substring of the label by default", () => {
    const { result } = withSetup(() => useSearch(ref("AN"), fakeGroups));
    expect(labels(result.results.value)).toEqual(["Banana"]);
    const apple = fakeGroups[0]?.options[0];
    if (!apple) throw new Error("fakeGroups is empty");
    expect(result.match(apple)).toBe(false);
  });

  it("searches the configured keys", () => {
    // "archived" only appears in `value` once the label is capitalised away
    const { result } = withSetup(() =>
      useSearch(ref("archiv"), fakeGroups, () => ({ keys: ["value"] })),
    );
    expect(labels(result.results.value)).toEqual(["Archived"]);
  });

  it("drops groups left empty and keeps the group's own fields", () => {
    const { result } = withSetup(() => useSearch(ref("act"), fakeGroups));
    expect(result.results.value).toHaveLength(1);
    expect(result.results.value[0]?.key).toBe("status");
    expect(result.results.value[0]?.label).toBe("Status");
  });

  it("ands the filter predicate with the text match", () => {
    const { result } = withSetup(() =>
      useSearch(ref(""), fakeGroups, () => ({
        filter: (option) => option.count !== 0,
      })),
    );
    expect(labels(result.results.value)).toEqual(["Apple", "Banana", "Active"]);
  });

  it("re-evaluates a reactive filter", () => {
    const keepZero = ref(false);
    const { result } = withSetup(() =>
      useSearch(ref("arch"), fakeGroups, () => ({
        filter: (option) => keepZero.value || option.count !== 0,
      })),
    );
    expect(result.hasResults.value).toBe(false);
    keepZero.value = true;
    expect(labels(result.results.value)).toEqual(["Archived"]);
  });

  it("tracks the search ref and reports no results", () => {
    const search = ref("app");
    const { result } = withSetup(() => useSearch(search, fakeGroups));
    expect(labels(result.results.value)).toEqual(["Apple"]);
    search.value = "zzz";
    expect(result.results.value).toEqual([]);
    expect(result.hasResults.value).toBe(false);
  });

  it("tracks a getter source of groups", () => {
    const groups = ref(fakeGroups.slice(0, 1));
    const { result } = withSetup(() => useSearch(ref(""), () => groups.value));
    expect(result.results.value).toHaveLength(1);
    groups.value = fakeGroups;
    expect(result.results.value).toHaveLength(2);
  });
});
