// set the dimensions and marginLines of the graph
const marginLine = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - marginLine.left - marginLine.right,
    height = 500 - marginLine.top - marginLine.bottom;

// append the svg object to the body of the page
const svgLine = d3.select("#LineGraph")
  .append("svg")
    .attr("width", width + marginLine.left + marginLine.right)
    .attr("height", height + marginLine.top + marginLine.bottom)
  .append("g")
    .attr("transform", `translate(${marginLine.left},${marginLine.top})`);

//Read the data
d3.csv("graduates.csv").then( function(data) {

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.Major); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Year; }))
    .range([ 0, width ]);
    svgLine.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.Mean; })])
    .range([ height, 0 ]);
    svgLine.append("g")
    .call(d3.axisLeft(y));

  // color palette
  const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  svgLine.selectAll(".line")
      .data(sumstat)
      .join("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.Year); })
            .y(function(d) { return y(+d.Mean); })
            (d[1])
        })

})