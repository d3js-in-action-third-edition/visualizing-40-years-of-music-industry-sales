// Load data
d3.csv("./data/data.csv", d3.autoType).then(data => {
  console.log("data", data);

  drawDonutCharts(data);
  drawStreamGraph(data);
});