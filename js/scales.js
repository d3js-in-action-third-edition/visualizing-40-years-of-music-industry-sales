const xScale = d3.scaleBand();
const yScaleNormalized = d3.scaleLinear();
const yScaleMiddle = d3.scaleLinear();
const colorScale = d3.scaleOrdinal();
 
const initializeScales = (data) => {
  // Scale for horizontal axis
  xScale
    .domain(data.map(d => d.year))
    .range([0, innerWidth])
    .paddingInner(0.2);

  // Scales for vertical axis
  // Normalized between 0 and 1
  yScaleNormalized
    .domain([0, 1])
    .range([innerHeight, 0]);
  // With baseline shifted to the middle
  yScaleMiddle
    .domain([-12000, 12000])
    .range([innerHeight, 0]);
  
  // Color scale
  colorScale
    .domain(formatsInfo.map(f => f.id))
    .range(formatsInfo.map(f => f.color));
};