// Constructor-injected seams — a plain state container, vi.fn() per-variant
// Actions fakes, and vi.fn() listeners. Every test drives a state transition
// and asserts both the new state and the side-channel contracts (fetch
// params, events).
import { describe, expect, it, vi } from "vitest";
import { ChartService } from "../src/service";
import { createChartState } from "../src/state";
import type {
  BreakdownData,
  Change,
  Config,
  Options,
  State,
} from "../src/types";
import {
  fakeBreakdown,
  fakeConfig,
  fakeDistribution,
  fakeRange,
  fakeSeries,
} from "./data";
import type { FakeRow } from "./data";

const makeActions = () => ({
  breakdown: vi.fn(async (): Promise<BreakdownData> => fakeBreakdown),
  series: vi.fn(async () => fakeSeries),
  distribution: vi.fn(async () => fakeDistribution),
  comparison: vi.fn(async () => fakeSeries),
});

const makeService = (
  overrides: {
    state?: State<FakeRow>;
    actions?: Partial<ReturnType<typeof makeActions>>;
    config?: Config<FakeRow>;
    options?: Options<FakeRow>;
  } = {},
) => {
  const config = overrides.config ?? fakeConfig;
  const state = overrides.state ?? createChartState<FakeRow>(config);
  const actions = { ...makeActions(), ...overrides.actions };
  const service = new ChartService<FakeRow>(
    "test-chart",
    config,
    state,
    actions,
    overrides.options,
  );
  const updated = vi.fn();
  const variantChanged = vi.fn();
  const rendererChanged = vi.fn();
  service.on("updated", updated);
  service.on("variantChanged", variantChanged);
  service.on("rendererChanged", rendererChanged);
  return { service, state, actions, updated, variantChanged, rendererChanged };
};

const otherRange: [Date, Date] = [
  new Date("2024-01-01T00:00:00Z"),
  new Date("2024-12-31T00:00:00Z"),
];

describe("config", () => {
  it("exposes the declared variants in order", () => {
    const { service } = makeService();
    expect(service.variants.map((v) => v.type)).toEqual([
      "breakdown",
      "series",
      "distribution",
      "comparison",
    ]);
    expect(service.config).toBe(fakeConfig);
  });

  it("throws when the config declares no variants", () => {
    const config: Config<FakeRow> = { topic: "contacts" };
    expect(
      () =>
        new ChartService<FakeRow>(
          "empty",
          config,
          createChartState(config),
          {},
        ),
    ).toThrow("chart empty declares no variants");
  });

  it("derives the active variant config and the title", () => {
    const { service, state } = makeService();
    expect(service.activeVariantConfig.type).toBe("breakdown");
    expect(service.title).toBe("contacts Breakdown");
    state.activeVariant = "ghost";
    expect(service.activeVariantConfig.type).toBe("breakdown");
    expect(service.title).toBe("contacts ghost");
  });
});

describe("setVariant", () => {
  it("series: resets the selection, takes the first bucket and the default range", () => {
    const { service, actions, variantChanged } = makeService();
    service.setVariant("series");
    expect(service.activeVariant).toBe("series");
    expect(service.activeRenderer).toBe("line");
    expect(service.activeField).toBe("amount");
    expect(service.activeGroupBy).toBe("status");
    expect(service.activeX).toBe("amount");
    expect(service.activeY).toBe("status");
    expect(service.activeBucket).toBe("1d");
    expect(service.activeRange).toBe(fakeRange);
    expect(variantChanged).toHaveBeenCalledWith({
      id: "test-chart",
      variant: "series",
    });
    expect(actions.series).toHaveBeenCalledOnce();
  });

  it("distribution: takes the default range with no bucket", () => {
    const { service, state, actions } = makeService();
    state.activeBucket = "1w";
    service.setVariant("distribution");
    expect(service.activeRenderer).toBe("scatter");
    expect(service.activeX).toBe("amount");
    expect(service.activeY).toBe("id");
    expect(service.activeBucket).toBeNull();
    expect(service.activeRange).toBe(fakeRange);
    expect(actions.distribution).toHaveBeenCalledOnce();
  });

  it("breakdown and comparison: clear bucket and range", () => {
    const { service, state, actions } = makeService();
    state.activeBucket = "1w";
    state.activeRange = fakeRange;
    service.setVariant("comparison");
    expect(service.activeRenderer).toBe("bar");
    expect(service.activeBucket).toBeNull();
    expect(service.activeRange).toBeNull();
    expect(actions.comparison).toHaveBeenCalledOnce();

    state.activeBucket = "1w";
    state.activeRange = fakeRange;
    service.setVariant("breakdown");
    expect(service.activeBucket).toBeNull();
    expect(service.activeRange).toBeNull();
    expect(actions.breakdown).toHaveBeenCalledOnce();
  });

  it("ignores an undeclared variant", () => {
    const { service, actions, variantChanged } = makeService();
    service.setVariant("ghost");
    expect(service.activeVariant).toBe("breakdown");
    expect(variantChanged).not.toHaveBeenCalled();
    expect(actions.breakdown).not.toHaveBeenCalled();
  });

  it("emits variantChanged after the selection lands", () => {
    const { service, variantChanged } = makeService();
    variantChanged.mockImplementation(() => {
      expect(service.activeVariant).toBe("series");
      expect(service.activeBucket).toBe("1d");
    });
    service.setVariant("series");
    expect(variantChanged).toHaveBeenCalledOnce();
  });
});

describe("setRenderer", () => {
  it("switches within the active variant's renderers and emits", () => {
    const { service, actions, rendererChanged } = makeService();
    service.setRenderer("bar");
    expect(service.activeRenderer).toBe("bar");
    expect(rendererChanged).toHaveBeenCalledWith({
      id: "test-chart",
      renderer: "bar",
    });
    expect(actions.breakdown).not.toHaveBeenCalled();
  });

  it("ignores a renderer the active variant does not declare", () => {
    const { service, rendererChanged } = makeService();
    service.setRenderer("line");
    expect(service.activeRenderer).toBe("pie");
    expect(rendererChanged).not.toHaveBeenCalled();
  });
});

describe("dimension selectors", () => {
  it("setField takes a declared field and refetches", () => {
    const { service, actions } = makeService();
    service.setField("name");
    expect(service.activeField).toBe("name");
    expect(actions.breakdown).toHaveBeenLastCalledWith(
      { field: "name", limit: 2 },
      service,
    );
  });

  it("setField ignores a field outside the active variant", () => {
    const { service, actions } = makeService();
    service.setField("amount");
    expect(service.activeField).toBe("status");
    expect(actions.breakdown).not.toHaveBeenCalled();
  });

  it("setGroupBy takes a declared field and refetches", () => {
    const { service, actions } = makeService();
    service.setVariant("comparison");
    service.setGroupBy("status");
    expect(service.activeGroupBy).toBe("status");
    expect(actions.comparison).toHaveBeenLastCalledWith(
      { field: "status", groupBy: "status", limit: 3 },
      service,
    );
    service.setGroupBy("amount");
    expect(service.activeGroupBy).toBe("status");
    expect(actions.comparison).toHaveBeenCalledTimes(2);
  });

  it("setX and setY take declared fields and refetch", () => {
    const { service, actions } = makeService();
    service.setVariant("distribution");
    service.setX("id");
    service.setY("amount");
    expect(service.activeX).toBe("id");
    expect(service.activeY).toBe("amount");
    expect(actions.distribution).toHaveBeenLastCalledWith(
      { x: "id", y: "amount", range: fakeRange },
      service,
    );
    service.setX("status");
    service.setY("status");
    expect(service.activeX).toBe("id");
    expect(service.activeY).toBe("amount");
    expect(actions.distribution).toHaveBeenCalledTimes(3);
  });

  it("setBucket takes a declared bucket on a series variant and refetches", () => {
    const { service, actions } = makeService();
    service.setVariant("series");
    service.setBucket("1w");
    expect(service.activeBucket).toBe("1w");
    expect(actions.series).toHaveBeenLastCalledWith(
      { field: "amount", bucket: "1w", range: fakeRange },
      service,
    );
  });

  it("setBucket ignores an unknown bucket and a non-series variant", () => {
    const { service, state, actions } = makeService();
    service.setVariant("series");
    service.setBucket("1mo");
    expect(service.activeBucket).toBe("1d");
    expect(actions.series).toHaveBeenCalledOnce();

    service.setVariant("breakdown");
    state.activeBucket = "1d";
    service.setBucket("1w");
    expect(service.activeBucket).toBe("1d");
    expect(actions.breakdown).toHaveBeenCalledOnce();
  });

  it("setRange stores the range and refetches", () => {
    const { service, actions } = makeService();
    service.setVariant("series");
    service.setRange(otherRange);
    expect(service.activeRange).toBe(otherRange);
    expect(actions.series).toHaveBeenLastCalledWith(
      { field: "amount", bucket: "1d", range: otherRange },
      service,
    );
  });
});

describe("init", () => {
  it("fetches once and guards re-entry", async () => {
    const { service, actions } = makeService();
    expect(await service.init()).toBe(true);
    expect(await service.init()).toBe(true);
    expect(actions.breakdown).toHaveBeenCalledTimes(1);
    expect(service.initialized).toBe(true);
  });
});

describe("fetch", () => {
  it("breakdown: passes the field and limit, collapses the result to the limit", async () => {
    const { service, actions } = makeService();
    await service.fetch();
    expect(actions.breakdown).toHaveBeenCalledWith(
      { field: "status", limit: 2 },
      service,
    );
    expect(service.variantData).toEqual({
      labels: ["Active", "Inactive", "Other"],
      values: [5, 2, 1],
    });
  });

  it("breakdown: keeps the result whole without a limit", async () => {
    const { service } = makeService({
      config: {
        topic: "contacts",
        breakdown: { fields: ["status"], renderers: [{ type: "pie" }] },
      },
    });
    await service.fetch();
    expect(service.variantData).toBe(fakeBreakdown);
  });

  it("series: passes field, bucket, and range", async () => {
    const { service, state, actions } = makeService();
    state.activeVariant = "series";
    state.activeField = "amount";
    state.activeBucket = "1w";
    state.activeRange = fakeRange;
    await service.fetch();
    expect(actions.series).toHaveBeenCalledWith(
      { field: "amount", bucket: "1w", range: fakeRange },
      service,
    );
    expect(service.variantData).toBe(fakeSeries);
  });

  it("distribution: passes x, y, and range", async () => {
    const { service, state, actions } = makeService();
    state.activeVariant = "distribution";
    state.activeX = "amount";
    state.activeY = "id";
    state.activeRange = fakeRange;
    await service.fetch();
    expect(actions.distribution).toHaveBeenCalledWith(
      { x: "amount", y: "id", range: fakeRange },
      service,
    );
    expect(service.variantData).toBe(fakeDistribution);
  });

  it("comparison: passes field, groupBy, and limit", async () => {
    const { service, state, actions } = makeService();
    state.activeVariant = "comparison";
    state.activeField = "status";
    state.activeGroupBy = "name";
    await service.fetch();
    expect(actions.comparison).toHaveBeenCalledWith(
      { field: "status", groupBy: "name", limit: 3 },
      service,
    );
    expect(service.variantData).toBe(fakeSeries);
  });

  it("leaves the data untouched when the variant's action is missing", async () => {
    const { service, updated } = makeService({
      actions: { breakdown: undefined },
    });
    await service.fetch();
    expect(service.variantData).toBeNull();
    expect(updated).toHaveBeenCalledWith({
      id: "test-chart",
      variant: "breakdown",
      data: null,
    });
  });

  it("leaves the data untouched when a required input is null", async () => {
    const { service, state, actions } = makeService();
    state.activeField = null;
    await service.fetch();
    expect(actions.breakdown).not.toHaveBeenCalled();

    state.activeVariant = "series";
    state.activeField = "amount";
    state.activeBucket = null;
    state.activeRange = fakeRange;
    await service.fetch();
    expect(actions.series).not.toHaveBeenCalled();

    state.activeVariant = "distribution";
    state.activeX = "amount";
    state.activeY = null;
    await service.fetch();
    expect(actions.distribution).not.toHaveBeenCalled();

    state.activeVariant = "comparison";
    state.activeField = "status";
    state.activeGroupBy = null;
    await service.fetch();
    expect(actions.comparison).not.toHaveBeenCalled();
    expect(service.variantData).toBeNull();
  });

  it("holds loading during flight and clears it after", async () => {
    const box: { resolve?: (r: BreakdownData) => void } = {};
    const actions = makeActions();
    actions.breakdown.mockImplementationOnce(
      () =>
        new Promise<BreakdownData>((res) => {
          box.resolve = res;
        }),
    );
    const { service } = makeService({ actions });

    const flight = service.fetch();
    expect(service.loading).toBe(true);
    box.resolve?.(fakeBreakdown);
    await flight;
    expect(service.loading).toBe(false);
  });

  it("clears loading and still emits when the action throws", async () => {
    const actions = makeActions();
    actions.breakdown.mockRejectedValueOnce(new Error("boom"));
    const { service, updated } = makeService({ actions });

    await expect(service.fetch()).rejects.toThrow("boom");
    expect(service.loading).toBe(false);
    expect(updated).toHaveBeenCalledWith({
      id: "test-chart",
      variant: "breakdown",
      data: null,
    });
  });

  it("emits updated with the variant and the fresh data", async () => {
    const { service, updated } = makeService();
    await service.fetch();
    expect(updated).toHaveBeenCalledWith({
      id: "test-chart",
      variant: "breakdown",
      data: service.variantData,
    });
  });
});

describe("change events", () => {
  it("emits one change per field written, after the write", async () => {
    const { service } = makeService();
    const changes: Change<FakeRow>[] = [];
    service.on("change", (change) => changes.push(change));
    await service.fetch();
    expect(changes).toEqual([
      { field: "loading", before: false, after: true },
      {
        field: "variantData",
        before: null,
        after: service.variantData,
      },
      { field: "loading", before: true, after: false },
    ]);
  });

  it("setRenderer emits change before rendererChanged", () => {
    const { service } = makeService();
    const order: string[] = [];
    service.on("change", (change) => order.push(change.field));
    service.on("rendererChanged", () => order.push("rendererChanged"));
    service.setRenderer("bar");
    expect(order).toEqual(["activeRenderer", "rendererChanged"]);
  });
});

describe("middleware", () => {
  it("get middleware shapes what the service reads", () => {
    const { service } = makeService({
      options: {
        get: { state: { activeRenderer: (type) => `${type}!` } },
      },
    });
    expect(service.activeRenderer).toBe("pie!");
  });

  it("set middleware shapes what the service stores", () => {
    const { service, state } = makeService({
      options: {
        set: { state: { activeRenderer: (type) => type.toUpperCase() } },
      },
    });
    service.setRenderer("bar");
    expect(state.activeRenderer).toBe("BAR");
    expect(service.activeRenderer).toBe("BAR");
  });
});
