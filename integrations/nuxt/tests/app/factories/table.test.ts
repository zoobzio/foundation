// Gold standard: factories. `create*` splits the options once and returns the
// id-scoped composable; the tests assert that composition through the shim's
// Nuxt seams — the shared keyed container, the joined actions, the fetch
// wiring, and the hook relay — not the service's own logic.
import type { TableOptions } from "../../../app/types/table";
import type { FakeRow } from "#test/data/table";

import { describe, expect, it, vi } from "vitest";
import { useNuxtApp } from "#app";
import { createTable } from "../../../app/factories/table";
import { fakeColumns, fakeRows } from "#test/data/table";

const makeOptions = (
  overrides: Partial<TableOptions<FakeRow>> = {},
): TableOptions<FakeRow> => ({
  columns: fakeColumns,
  rowKey: "id",
  fetch: vi.fn(async () => ({
    data: fakeRows,
    total: fakeRows.length,
    pageCount: 4,
  })),
  ...overrides,
});

describe("createTable", () => {
  it("returns a composable building a service over fresh store state", () => {
    const useUsers = createTable("users", makeOptions());
    const users = useUsers();
    expect(users.id).toBe("users");
    expect(users.initialized).toBe(false);
    expect(users.data).toEqual([]);
    expect(users.page).toBe(1);
    expect(users.columnOrder).toEqual(["id", "name", "status", "amount"]);
  });

  it("seeds the service from the initial state", () => {
    const useUsers = createTable(
      "users",
      makeOptions({
        initial: { page: 2, pageSize: 10, sortField: "name" },
      }),
    );
    const users = useUsers();
    expect(users.page).toBe(2);
    expect(users.pageSize).toBe(10);
    expect(users.sortField).toBe("name");
  });

  it("joins each action descriptor to its handler under the config key", () => {
    const edit = vi.fn();
    const purge = vi.fn();
    const useUsers = createTable(
      "users",
      makeOptions({
        actions: { edit: { label: "Edit", action: edit } },
        bulkActions: { purge: { label: "Purge", action: purge } },
      }),
    );
    const users = useUsers();
    expect(users.config.actions).toEqual({ edit: { label: "Edit" } });
    expect(users.config.bulkActions).toEqual({ purge: { label: "Purge" } });
    expect(users.actions.map((a) => [a.key, a.label])).toEqual([
      ["edit", "Edit"],
    ]);
    users.actions[0]?.action(fakeRows[0] as FakeRow);
    expect(edit).toHaveBeenCalledWith(fakeRows[0]);
    users.toggleRow("2");
    users.runBulkAction("purge");
    expect(purge).toHaveBeenCalledWith(new Set(["2"]));
  });

  it("leaves a table without actions unselectable", () => {
    const users = createTable("users", makeOptions())();
    expect(users.actions).toEqual([]);
    expect(users.bulkActions).toEqual([]);
    expect(users.hasActions).toBe(false);
    expect(users.isSelectable).toBe(false);
  });

  it("init dispatches the wired fetch into the store", async () => {
    const options = makeOptions({ initial: { pageSize: 10 } });
    const users = createTable("users", options)();
    await users.init();
    expect(options.fetch).toHaveBeenCalledOnce();
    expect(vi.mocked(options.fetch).mock.calls.at(0)?.[0]).toMatchObject({
      page: 1,
      pageSize: 10,
    });
    expect(users.data).toEqual(fakeRows);
    expect(users.total).toBe(3);
    expect(users.initialized).toBe(true);
  });

  it("relays service events onto the Nuxt hook bus", async () => {
    const updated = vi.fn();
    const filtered = vi.fn();
    useNuxtApp().hooks.addHooks({
      "table:updated": updated,
      "table:filtered": filtered,
    });
    const users = createTable("users", makeOptions())();
    await users.init();
    expect(updated).toHaveBeenCalledWith({ id: "users", total: 3 });
    users.query.add({ kind: "text", value: "ali" });
    expect(filtered).toHaveBeenCalledWith({
      id: "users",
      query: "ali",
      filters: [],
    });
  });

  it("logs each relayed event under the service id", async () => {
    const users = createTable("users", makeOptions())();
    await users.init();
    users.query.add({ kind: "text", value: "ali" });
    expect(useNuxtApp().$logger("users").debug.mock.calls).toEqual([
      ["Table updated", { id: "users", total: 3 }],
      ["Table filtered", { id: "users", query: "ali", filters: [] }],
    ]);
  });

  it("every call of one composable shares the id's state", async () => {
    const useUsers = createTable("users", makeOptions());
    const a = useUsers();
    const b = useUsers();
    expect(a).not.toBe(b);
    await a.init();
    a.toggleRow("1");
    expect(b.data).toEqual(fakeRows);
    expect(b.selected).toEqual(new Set(["1"]));
  });

  it("different ids stay independent", async () => {
    const a = createTable("users", makeOptions())();
    const b = createTable("orders", makeOptions())();
    await a.init();
    expect(b.initialized).toBe(false);
    expect(b.data).toEqual([]);
  });
});
