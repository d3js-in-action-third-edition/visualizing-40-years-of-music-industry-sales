const drawStackedBars = (data) => {

  const svgBar = d3.select("#bars")
    .append("svg")
      .attr("viewBox", [0, 0, width, height]);

  const innerChartBars = svgBar
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initialize the stack generator
  const stackBars = d3.stack()
    .keys(formatsInfo.map(f => f.id))
    .order(d3.stackOrderDescending)
    .offset(d3.stackOffsetExpand);

  // Call the stack generator to produce a stack for the data
  let seriesBars = stackBars(data);
  console.log("seriesBars", seriesBars);

  // Append rectangles
  seriesBars.forEach(serie => {
    innerChartBars
      .selectAll(`.bar-${serie.key}`)
      .data(serie)
      .join("rect")
        .attr("class", d => `bar-${serie.key} bar-${d.data.year}`)
        .attr("x", d => xScale(d.data.year))
        .attr("y", d => yScaleNormalized(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => Math.abs(yScaleNormalized(d[1]) - yScaleNormalized(d[0])))
        .attr("fill", colorScale(serie.key));
  });

  const bottomAxisBars = d3.axisBottom(xScale)
    .tickValues(d3.range(1975, 2020, 5))
    .tickSizeOuter(0)
  innerChartBars
    .append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxisBars);
  d3.selectAll(".axis-x text")
    .attr("dy", "15px");
  
  const leftAxisBars = d3.axisLeft(yScaleNormalized)
    .tickFormat(d3.format(".0%"))
  innerChartBars
    .append("g")
      .attr("class", "axis axis-y")
      .call(leftAxisBars);
  d3.selectAll(".axis-y text")
    .attr("dx", "-5px");

};