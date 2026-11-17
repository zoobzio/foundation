// Gold standard: factories. `createViews` splits the options once and
// returns the id-scoped composable; the tests assert that composition
// through the shim's Nuxt seams — the shared keyed container, the target a
// call is handed, the storage wiring, and the hook relay — not the
// service's own logic. The target is a real table, so the layer's schema
// is checked against what a table yields and takes.
import type { TableView, ViewsOptions } from "../../../app/types/views";
import type { FakeRow } from "#test/data/table";

import { describe, expect, it, vi } from "vitest";
import { useNuxtApp } from "#app";
import {
  BROWSER_VIEW_SCHEMA,
  CALENDAR_VIEW_SCHEMA,
  TABLE_VIEW_SCHEMA,
} from "../../../app/constants/views";
import { json } from "@zoobzio/calendar";
import { createBrowser } from "../../../app/factories/browser";
import { createCalendar } from "../../../app/factories/calendar";
import { createTable } from "../../../app/factories/table";
import { createViews } from "../../../app/factories/views";
import { fakeColumns, fakeRows, getRowId } from "#test/data/table";

const all = TABLE_VIEW_SCHEMA.parse({});

const active: TableView = {
  ...all,
  sorting: [{ id: "name", desc: true }],
  columnVisibility: { amount: false },
  pageSize: 25,
  clauses: [{ kind: "filter", key: "status", value: "Active" }],
};

const makeOptions = (
  overrides: Partial<ViewsOptions<TableView>> = {},
): ViewsOptions<TableView> => ({
  schema: TABLE_VIEW_SCHEMA,
  views: [
    { id: "all", name: "All", payload: all },
    { id: "active", name: "Active", payload: active },
  ],
  ...overrides,
});

const makeTable = (id: string) => {
  const fetch = vi.fn(async () => ({ data: fakeRows, rowCount: 3 }));
  const table = createTable<FakeRow>(id, {
    columns: fakeColumns,
    getRowId,
    fetch,
  })();
  return { table, fetch };
};

describe("createViews", () => {
  it("returns a composable building a service over fresh store state", () => {
    const { table } = makeTable("orders");
    const views = createViews("orders", makeOptions())(table);
    expect(views.id).toBe("orders");
    expect(views.initialized).toBe(false);
    expect(views.views.map((view) => view.id)).toEqual(["all", "active"]);
    expect(views.active).toBe("all");
  });

  it("shares the container between calls under one id", async () => {
    const { table } = makeTable("orders");
    const useViews = createViews("orders", makeOptions());
    await useViews(table).select("active", { force: true });
    expect(useViews(table).active).toBe("active");
  });

  it("applies a view to the table in one fetch, and reads it back", async () => {
    const { table, fetch } = makeTable("orders");
    const views = createViews("orders", makeOptions())(table);
    // Before the table's own init: the view lands, the first fetch reads it.
    await views.init();
    expect(fetch).not.toHaveBeenCalled();
    await table.init();
    expect(fetch).toHaveBeenCalledOnce();
    expect(views.drifted).toBe(false);

    await views.select("active");
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      {
        pagination: { pageIndex: 0, pageSize: 25 },
        sorting: [{ id: "name", desc: true }],
        query: "",
        filters: [{ key: "status", value: "Active" }],
      },
      table,
    );
    expect(table.table.getColumn("amount")?.getIsVisible()).toBe(false);
    expect(views.drifted).toBe(false);
  });

  it("drifts as the table is arranged, and not as it pages or selects", async () => {
    const { table } = makeTable("orders");
    const views = createViews("orders", makeOptions())(table);
    await views.init();
    await table.init();

    table.table.setPageIndex(1);
    expect(views.drifted).toBe(false);

    table.table.setSorting([{ id: "amount", desc: false }]);
    expect(views.drifted).toBe(true);
    table.table.setSorting([]);
    expect(views.drifted).toBe(false);

    table.query.add({ kind: "literal", key: "text", value: "ali" });
    expect(views.drifted).toBe(true);
  });

  it("wires the storage and hands the id to a new view", async () => {
    const save = vi.fn(async () => {});
    const remove = vi.fn(async () => {});
    const load = vi.fn(async () => [
      { id: "mine", name: "Mine", payload: { pageSize: 50 } },
    ]);
    const { table } = makeTable("orders");
    const views = createViews(
      "orders",
      makeOptions({ load, save, remove, key: () => "copy" }),
    )(table);
    await views.init();
    expect(load).toHaveBeenCalledWith(views);
    // The stored view left members out: the schema's defaults fill them.
    expect(views.views.at(-1)).toEqual({
      id: "mine",
      name: "Mine",
      origin: "user",
      payload: { ...all, pageSize: 50 },
    });

    table.table.setPageSize(20);
    const copy = await views.saveAs("Twenty");
    expect(copy.id).toBe("copy");
    expect(save).toHaveBeenCalledWith(copy, views);

    await views.remove("mine", { force: true });
    expect(remove).toHaveBeenCalledOnce();
  });

  it("relays the service's events onto the hook bus", async () => {
    const nuxt = useNuxtApp();
    const names = [
      "views:initialized",
      "views:selected",
      "views:saved",
      "views:renamed",
      "views:removed",
      "views:reverted",
      "views:failed",
    ] as const;
    const heard: string[] = [];
    for (const name of names) {
      nuxt.hook(name, (event) => {
        expect(event.id).toBe("orders");
        heard.push(name);
      });
    }
    const save = vi.fn(async () => {});
    const { table } = makeTable("orders");
    const views = createViews("orders", makeOptions({ save }))(table);
    await views.init();
    await views.select("active");
    await views.saveAs("Copy");
    await views.rename(views.active ?? "", "Mine");
    table.table.setPageSize(5);
    await views.revert({ force: true });
    save.mockRejectedValueOnce(new Error("offline"));
    await expect(views.saveAs("Lost")).rejects.toThrow("offline");
    await views.remove(views.active ?? "", { force: true });
    expect(heard).toEqual([
      "views:initialized",
      "views:selected",
      "views:saved",
      "views:selected",
      "views:renamed",
      "views:reverted",
      "views:failed",
      "views:removed",
      "views:selected",
    ]);
  });

  it("relays a restore from the table and the browser", async () => {
    const nuxt = useNuxtApp();
    const restored = vi.fn();
    nuxt.hook("table:restored", restored);
    nuxt.hook("browser:restored", restored);
    const { table } = makeTable("orders");
    table.restore(active);
    expect(restored).toHaveBeenCalledWith({ id: "orders", snapshot: active });
  });

  it("reads a view stored before the query's clauses were renamed", () => {
    const stored = [{ kind: "filter", key: "status", value: "Active" }];
    expect(TABLE_VIEW_SCHEMA.parse({ entries: stored }).clauses).toEqual(
      stored,
    );
    expect(BROWSER_VIEW_SCHEMA.parse({ entries: stored }).clauses).toEqual(
      stored,
    );
    expect(
      TABLE_VIEW_SCHEMA.parse({ entries: stored, clauses: [] }).clauses,
    ).toEqual([]);
  });

  it("sits over a browser through the browser's schema", async () => {
    const fetch = vi.fn(async () => ({ folders: [], files: [] }));
    const browser = createBrowser<FakeRow>("files", {
      columns: [{ key: "name", label: "Name", sortable: true }],
      fileKey: "id",
      fetch,
    })();
    const base = BROWSER_VIEW_SCHEMA.parse({});
    const views = createViews("files", {
      schema: BROWSER_VIEW_SCHEMA,
      views: [
        { id: "all", name: "All", payload: base },
        {
          id: "named",
          name: "By name",
          payload: { ...base, sortField: "name", sortDirection: "desc" },
        },
      ],
    })(browser);
    await views.init();
    await browser.init();
    browser.sortBy("name");
    expect(views.drifted).toBe(true);
    await views.select("named", { force: true });
    expect(browser.sortDirection).toBe("desc");
    expect(views.drifted).toBe(false);
  });

  it("sits over a calendar through the calendar's schema", async () => {
    const fetch = vi.fn(async () => []);
    const calendar = createCalendar("team", {
      ...json,
      fetch,
      fields: { team: { label: "Team" } },
      initial: { date: "2026-03-04" },
    })();
    const base = CALENDAR_VIEW_SCHEMA.parse({});
    const views = createViews("team", {
      schema: CALENDAR_VIEW_SCHEMA,
      views: [
        { id: "all", name: "All", payload: base },
        {
          id: "design",
          name: "Design week",
          payload: {
            view: "week" as const,
            clauses: [
              { kind: "filter" as const, key: "team", value: "Design" },
            ],
          },
        },
      ],
    })(calendar);
    await views.init();
    await calendar.init();
    calendar.next();
    expect(views.drifted).toBe(false);
    calendar.show("agenda");
    expect(views.drifted).toBe(true);
    await views.select("design", { force: true });
    expect(calendar.view).toBe("week");
    expect(calendar.query.filters).toEqual([{ key: "team", value: "Design" }]);
    expect(views.drifted).toBe(false);
    expect(fetch).toHaveBeenLastCalledWith(
      {
        range: calendar.range,
        query: "",
        filters: [{ key: "team", value: "Design" }],
      },
      calendar,
    );
  });
});
