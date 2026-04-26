export const useFakeCharts = () => {
  const chart1 = accessChart1();
  const chart2 = accessChart2();
  const chart3 = accessChart3();
  return { chart1, chart2, chart3 };
};
