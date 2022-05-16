const drawStreamGraph = (data) => {

  // X scale
  const bandScale = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, innerWidth])
    .paddingInner(0.2);

  // Y scales
  const yScaleMiddle = d3.scaleLinear()
    .domain([-12000, 12000])
    .range([innerHeight, 0]);
  const yScaleNormalized = d3.scaleLinear()
    .domain([0, 1])
    .range([innerHeight, 0]);

  // Color scale
  colorScale = d3.scaleOrdinal()
    .domain(formatsInfo.map(f => f.id))
    .range(formatsInfo.map(f => f.color));

  const svg = d3.select("#streamgraph")
    .append("svg")
      .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const bottomAxisStream = d3.axisBottom(bandScale)
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
    .x(d => bandScale(d.data.year))
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


  // Stacked bars chart
  const svgBar = d3.select("#bars")
    .append("svg")
      .attr("viewBox", [0, 0, width, height]);

  const innerChartBars = svgBar
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initialize the stack generator
  const stackBars = d3.stack()
    .keys(formatsInfo.map(f => f.id))
    // .order(d3.stackOrderNone)
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
        .attr("x", d => bandScale(d.data.year))
        .attr("y", d => yScaleNormalized(d[1]))
        .attr("width", bandScale.bandwidth())
        .attr("height", d => Math.abs(yScaleNormalized(d[1]) - yScaleNormalized(d[0])))
        .attr("fill", colorScale(serie.key));
  });

  const bottomAxisBars = d3.axisBottom(bandScale)
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

  // Append legend
  const legendItems = d3.select(".legend-container")
    .append("ul")
      .attr("class", "color-legend")
    .selectAll(".color-legend-item")
    .data(formatsInfo)
    .join("li")
      .attr("class", "color-legend-item");
  legendItems
    .append("span")
      .attr("class", "color-legend-item-color")
      .style("background-color", d => d.color);
  legendItems
    .append("span")
      .attr("class", "color-legend-item-label")
      .text(d => d.label);

};