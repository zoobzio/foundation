interface FakeRow {
  id: number;
  name: string;
  email: string;
  status: string;
  category: string;
  created: string;
}

const categories = ["Engineering", "Marketing", "Sales", "Support"];
const statuses = ["Active", "Inactive", "Pending"];

function generateBreakdown(field: keyof FakeRow): BreakdownData {
  const counts = new Map<string, number>();
  for (let i = 0; i < 50; i++) {
    const val = field === "status" ? statuses[i % 3]! : categories[i % 4]!;
    counts.set(val, (counts.get(val) ?? 0) + 1);
  }
  return {
    labels: [...counts.keys()],
    values: [...counts.values()],
  };
}

function generateSeries(field: keyof FakeRow, bucket: BucketSize): SeriesData {
  const values = field === "status" ? statuses : categories;
  const bucketCount = bucket === "1h" ? 24 : bucket === "1d" ? 7 : bucket === "1w" ? 8 : 6;
  const labels = Array.from({ length: bucketCount }, (_, i) => {
    if (bucket === "1h") return `${i}:00`;
    if (bucket === "1d") return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]!;
    if (bucket === "1w") return `W${i + 1}`;
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]!;
  });
  return {
    labels,
    datasets: values.map((v) => ({
      label: v,
      data: labels.map(() => Math.floor(Math.random() * 20) + 1),
    })),
  };
}

function generateComparison(field: keyof FakeRow, groupBy: keyof FakeRow): ComparisonData {
  const fieldValues = field === "status" ? statuses : categories;
  const groupValues = groupBy === "status" ? statuses : categories;
  return {
    labels: fieldValues,
    datasets: groupValues.map((g) => ({
      label: g,
      data: fieldValues.map(() => Math.floor(Math.random() * 30) + 1),
    })),
  };
}

function generateDistribution(): DistributionData {
  return {
    datasets: [{
      label: "Users",
      data: Array.from({ length: 50 }, (_, i) => ({
        x: i + 1,
        y: Math.floor(Math.random() * 100),
        r: Math.floor(Math.random() * 15) + 3,
      })),
    }],
  };
}

const noAnimation = { animation: false as const };

const now = new Date();
const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

const colorMap: Record<string, string> = {
  Active: "var(--ref-emerald-500)",
  Inactive: "var(--ref-slate-400)",
  Pending: "var(--ref-amber-500)",
  Engineering: "var(--ref-blue-500)",
  Marketing: "var(--ref-pink-500)",
  Sales: "var(--ref-violet-500)",
  Support: "var(--ref-teal-500)",
};

const chartParams = () => ({
  query: "",
  keywords: "",
  match: "all" as const,
  facets: new Set<string>(),
  dateFilters: [],
});

const breakdownConfig: BreakdownConfig<FakeRow> = {
  fields: ["status", "category"],
  limit: 3,
  renderers: [
    { type: "pie", label: "Pie", options: noAnimation },
    { type: "doughnut", label: "Doughnut", options: noAnimation },
    { type: "bar", label: "Bar", options: noAnimation },
    { type: "polarArea", label: "Polar", options: noAnimation },
  ],
  fetch: async ({ field }) => generateBreakdown(field),
};

const seriesConfig: SeriesConfig<FakeRow> = {
  fields: ["status", "category"],
  buckets: ["1h", "1d", "1w", "1mo"],
  defaultRange: [sixMonthsAgo, now],
  renderers: [
    { type: "line", label: "Line", options: { ...noAnimation, scales: { y: { grace: "5%" } } } },
    { type: "bar", label: "Bar", options: { ...noAnimation, scales: { y: { grace: "5%" } } } },
    { type: "radar", label: "Radar", options: noAnimation },
  ],
  fetch: async ({ field, bucket }) => generateSeries(field, bucket),
};

const distributionConfig: DistributionConfig<FakeRow> = {
  fields: ["id", "status", "category", "created"],
  defaultRange: [sixMonthsAgo, now],
  renderers: [
    { type: "scatter", label: "Scatter", options: { ...noAnimation, scales: { x: { grace: "5%" }, y: { grace: "5%" } } } },
    { type: "bubble", label: "Bubble", options: { ...noAnimation, scales: { x: { grace: "5%" }, y: { grace: "5%" } } } },
  ],
  fetch: async () => generateDistribution(),
};

const comparisonConfig: ComparisonConfig<FakeRow> = {
  fields: ["status", "category"],
  renderers: [
    { type: "bar", label: "Bar", options: noAnimation },
    { type: "line", label: "Line", options: noAnimation },
    { type: "radar", label: "Radar", options: noAnimation },
  ],
  fetch: async ({ field, groupBy }) => generateComparison(field, groupBy),
};

export const accessChart1 = createChart<FakeRow>("chart-1", {
  topic: "User",
  colorMap,
  params: chartParams,
  breakdown: breakdownConfig,
  series: seriesConfig,
  distribution: distributionConfig,
  comparison: comparisonConfig,
});

export const accessChart2 = createChart<FakeRow>("chart-2", {
  topic: "User",
  colorMap,
  params: chartParams,
  breakdown: breakdownConfig,
  series: seriesConfig,
  distribution: distributionConfig,
  comparison: comparisonConfig,
});

export const accessChart3 = createChart<FakeRow>("chart-3", {
  topic: "User",
  colorMap,
  params: chartParams,
  breakdown: breakdownConfig,
  series: seriesConfig,
  distribution: distributionConfig,
  comparison: comparisonConfig,
});
