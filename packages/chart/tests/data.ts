import type {
  BreakdownData,
  Config,
  DistributionData,
  SeriesData,
} from "../src/types";

export type FakeRow = {
  id: number;
  name: string;
  status: string;
  created: string;
  amount: number;
};

export const fakeRange: [Date, Date] = [
  new Date("2025-01-01T00:00:00Z"),
  new Date("2025-03-31T00:00:00Z"),
];

/** Every variant declared, breakdown first. */
export const fakeConfig: Config<FakeRow> = {
  topic: "contacts",
  breakdown: {
    fields: ["status", "name"],
    renderers: [{ type: "pie" }, { type: "bar", label: "Bars" }],
    limit: 2,
  },
  series: {
    fields: ["amount", "status"],
    renderers: [{ type: "line" }, { type: "bar" }],
    buckets: ["1d", "1w"],
    defaultRange: fakeRange,
  },
  distribution: {
    fields: ["amount", "id"],
    renderers: [{ type: "scatter" }],
    defaultRange: fakeRange,
  },
  comparison: {
    fields: ["status", "name"],
    renderers: [{ type: "bar" }, { type: "radar" }],
    limit: 3,
  },
};

export const fakeBreakdown: BreakdownData = {
  labels: ["Active", "Inactive", "Pending"],
  values: [5, 2, 1],
};

export const fakeSeries: SeriesData = {
  labels: ["2025-01-01", "2025-01-02"],
  datasets: [{ label: "amount", data: [100, 200] }],
};

export const fakeDistribution: DistributionData = {
  datasets: [
    {
      label: "amount",
      data: [
        { x: 1, y: 100 },
        { x: 2, y: 200 },
      ],
    },
  ],
};
