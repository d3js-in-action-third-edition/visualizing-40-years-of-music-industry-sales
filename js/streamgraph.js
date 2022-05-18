const drawStreamGraph = (data) => {

  const svg = d3.select("#streamgraph")
    .append("svg")
      .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const bottomAxisStream = d3.axisBottom(xScale)
    .tickValues(d3.range(1975, 2020, 5))
    .tickSizeOuter(0)
    .tickSize(innerHeight * -1);
  innerChart
    .append("g")
      .attr("class", "axis axis-x-stream")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxisStream);
    

  // Initialize the stack generator
  const stack = d3.stack()
    .keys(formatsInfo.map(f => f.id))
    .order(d3.stackOrderInsideOut)
    .offset(d3.stackOffsetSilhouette);

  // Call the stack generator to produce a stack for the data
  let series = stack(data);
  console.log("series", series);

  // Initialize the area generator
  const area = d3.area()
    .x(d => xScale(d.data.year))
    .y0(d => yScaleMiddle(d[0]))
    .y1(d => yScaleMiddle(d[1]))
    .curve(d3.curveCatmullRom);

  // Append paths
  innerChart
    .append("g")
      .attr("class", "stream-paths")
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("d", area)
      .attr("fill", d => colorScale(d.key));
  
  const leftAxisStream = d3.axisLeft(yScaleMiddle);
  innerChart
    .append("g")
      .attr("class", "axis axis-y")
      .call(leftAxisStream);
  d3.selectAll(".axis-y text")
    .attr("dx", "-5px");

  const leftAxisLabel = svg
    .append("text")
    .attr("dominant-baseline", "hanging");
  leftAxisLabel
    .append("tspan")
      .text("Total revenue (million USD)");
  leftAxisLabel
    .append("tspan")
      .text("(Adjusted for inflation - 2017)")
      .attr("x", 0)
      .attr("dy", 20)
      .attr("fill-opacity", 0.7)
      .style("font-size", "14px")
      .style("font-style", "italic");

};