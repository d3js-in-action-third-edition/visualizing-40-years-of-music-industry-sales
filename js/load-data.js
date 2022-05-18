// Load data
d3.csv("./data/data.csv", d3.autoType).then(data => {
  console.log("data", data);

  initializeScales(data);
  drawDonutCharts(data);
  drawStackedBars(data);
  drawStreamGraph(data);
  addLengend();
});