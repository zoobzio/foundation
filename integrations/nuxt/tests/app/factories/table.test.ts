// Gold standard: factories. `create*` splits the options once and returns the
// id-scoped composable; the tests assert that composition through the shim's
// Nuxt seams — the shared keyed container, the joined actions, the fetch
// wiring, and the hook relay — not the service's own logic.
import type { TableOptions } from "../../../app/types/table";
import type { FakeRow } from "#test/data/table";

import { describe, expect, it, vi } from "vitest";
import { useNuxtApp } from "#app";
import { createTable } from "../../../app/factories/table";
import { fakeColumns, fakeRows, getRowId } from "#test/data/table";

const makeOptions = (
  overrides: Partial<TableOptions<FakeRow>> = {},
): TableOptions<FakeRow> => ({
  columns: fakeColumns,
  getRowId,
  fetch: vi.fn(async () => ({ data: fakeRows, rowCount: 3 })),
  ...overrides,
});

describe("createTable", () => {
  it("returns a composable building a service over fresh store state", () => {
    const useUsers = createTable("users", makeOptions());
    const users = useUsers();
    expect(users.id).toBe("users");
    expect(users.initialized).toBe(false);
    expect(users.data).toEqual([]);
    expect(users.table.atoms.pagination.get().pageIndex).toBe(0);
    expect(users.table.getVisibleLeafColumns().map((c) => c.id)).toEqual([
      "id",
      "name",
      "status",
      "amount",
    ]);
  });

  it("seeds the service from the initial state", () => {
    const useUsers = createTable(
      "users",
      makeOptions({
        initialState: {
          pagination: { pageIndex: 1, pageSize: 20 },
          sorting: [{ id: "name", desc: false }],
        },
      }),
    );
    const { table } = useUsers();
    expect(table.atoms.pagination.get()).toEqual({
      pageIndex: 1,
      pageSize: 20,
    });
    expect(table.getColumn("name")?.getIsSorted()).toBe("asc");
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
    users.table.setRowSelection({ "2": true });
    users.runBulkAction("purge");
    expect(purge).toHaveBeenCalledWith(["2"]);
  });

  it("leaves a table without actions unselectable", () => {
    const users = createTable("users", makeOptions())();
    expect(users.actions).toEqual([]);
    expect(users.bulkActions).toEqual([]);
    expect(users.table.options.enableRowSelection).toBe(false);
  });

  it("init dispatches the wired fetch into the store", async () => {
    const options = makeOptions({
      initialState: { pagination: { pageIndex: 0, pageSize: 20 } },
    });
    const users = createTable("users", options)();
    await users.init();
    expect(options.fetch).toHaveBeenCalledOnce();
    expect(vi.mocked(options.fetch).mock.calls.at(0)?.[0]).toMatchObject({
      pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [],
    });
    expect(users.data).toEqual(fakeRows);
    expect(users.rowCount).toBe(3);
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
    expect(updated).toHaveBeenCalledWith({ id: "users", rowCount: 3 });
    users.query.add({ kind: "literal", key: "text", value: "ali" });
    expect(filtered).toHaveBeenCalledWith({
      id: "users",
      query: "ali",
      filters: [],
    });
  });

  it("logs each relayed event under the service id", async () => {
    const users = createTable("users", makeOptions())();
    await users.init();
    users.query.add({ kind: "literal", key: "text", value: "ali" });
    expect(useNuxtApp().$logger("users").debug.mock.calls).toEqual([
      ["Table updated", { id: "users", rowCount: 3 }],
      ["Table filtered", { id: "users", query: "ali", filters: [] }],
    ]);
  });

  it("every call of one composable shares the id's state", async () => {
    const useUsers = createTable("users", makeOptions());
    const a = useUsers();
    const b = useUsers();
    expect(a).not.toBe(b);
    await a.init();
    a.table.setRowSelection({ "1": true });
    expect(b.data).toEqual(fakeRows);
    expect(b.table.getSelectedRowIds()).toEqual(["1"]);
  });

  it("different ids stay independent", async () => {
    const a = createTable("users", makeOptions())();
    const b = createTable("orders", makeOptions())();
    await a.init();
    expect(b.initialized).toBe(false);
    expect(b.data).toEqual([]);
  });

  it("resolves the columns' and the actions' labels through the app's service", () => {
    const useUsers = createTable(
      "users-text",
      makeOptions({
        columns: [{ accessorKey: "name", meta: { label: "table.columns" } }],
        actions: { remove: { label: "table.clear", action: vi.fn() } },
        bulkActions: { purge: { label: "browser.clear", action: vi.fn() } },
      }),
    );
    const users = useUsers();
    expect(users.config.columns.map((column) => column.meta?.label)).toEqual([
      "Columns",
    ]);
    expect(users.query.fields.name?.label).toBe("Columns");
    expect(users.config.actions?.remove?.label).toBe("Clear");
    expect(users.config.bulkActions?.purge?.label).toBe("Clear");
  });

  it("lays the contract's text literal under a config that names none", () => {
    const users = createTable("users-literal", makeOptions())();
    expect(users.config.literals).toEqual({
      text: { label: "Search", open: '"', close: '"' },
    });
    expect(users.query.literals.text?.label).toBe("Search");
  });

  it("resolves the literals a config declares, and adds none to them", () => {
    const users = createTable(
      "users-literals",
      makeOptions({
        literals: { tag: { label: "table.columns", open: "#", close: " " } },
      }),
    )();
    expect(users.config.literals).toEqual({
      tag: { label: "Columns", open: "#", close: " " },
    });
    expect(users.query.literals.text).toBeUndefined();
  });
});
