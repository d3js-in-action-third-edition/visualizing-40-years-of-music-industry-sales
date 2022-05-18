const drawDonutCharts = (data) => {
  const formats = data.columns.filter(support => support !== "year");
  console.log("formats", formats);

  const svg = d3.select("#donut")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

   const donutsContainer = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const years = [1975, 1995, 2013];
  years.forEach(year => {
    const yearData = data.find(d => d.year === year);
    const pieData = [];
    formats.forEach(support => {
      pieData.push({ support: support, sales: yearData[support] });
    });

    const donutContainer = donutsContainer
      .append("g")
        .attr("transform", `translate(${xScale(year)}, ${innerHeight/2})`);

    // Initialize the pie generator
    const pieGenerator = d3.pie()
      .value(d => d.sales)
      .sortValues((a, b) => b - a);

    // Call the pie generator to obtain the annotated data
    const arcsData = pieGenerator(pieData);

    // Initialize arc generator
    const arcGenerator = d3.arc()
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .innerRadius(60)
      .outerRadius(100)
      .padAngle(0.02)
      .cornerRadius(3);

    // Append arcs
    const arcs = donutContainer
      .selectAll(`path.arc-${year}`)
      .data(arcsData)
      // .join("path")
      //   .attr("class", `arc-${year}`)
      //   .attr("d", arcGenerator)
      //   .attr("fill", d => colorScale(d.data.support));
      .join("g")
        .attr("class", `arc-${year}`);
    arcs
      .append("path")
        .attr("d", arcGenerator)
        .attr("fill", d => colorScale(d.data.support));
    arcs
      .append("text")
        .text(d => {
          d["percentage"] = (d.endAngle - d.startAngle) / (2 * Math.PI);
          return d3.format(".0%")(d.percentage);
        })
        .attr("x", d => {
          d["centroid"] = arcGenerator
            .startAngle(d.startAngle)
            .endAngle(d.endAngle)
            .centroid();
          return d.centroid[0];
        })
        .attr("y", d => d.centroid[1])
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "16px")
        .style("font-weight", 500)
        .style("fill", "#f6fafc")
        .style("fill-opacity", d => d.percentage < 0.05 ? 0 : 1);

    // Append years
    donutContainer
      .append("text")
        .text(year)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "24px")
        .style("font-weight", 500);


  });

  
};