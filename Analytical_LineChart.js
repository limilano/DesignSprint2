var svgTest = d3.select("#LineGraph").append("svg")
        .attr("width", 1000 + margin.left + margin.right)
        .attr("height", 500 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let majorLine1 = []
let majorLine2 = []
let max1 = 0
let max2 = 0

function updateMajorLine1(lookformajor) {
  majorLine1 = []
  max1 = 0;

  d3.csv("graduates.csv").then(data => {
    // Convert relevant fields to numbers
    data.forEach(d => {
      d.Mean = +d.Mean;
    });

    data.forEach(d => {
      if (d.Major === lookformajor) {
        majorLine1.push({ year: +d.Year, value: +d.Mean });
        if (d.Mean > max1) {
          max1 = d.Mean;
        }
      }
    });
  });
  updateLineGraph();
}

function updateMajorLine2(lookformajor) {
  majorLine2 = []
  max2 = 0;

  d3.csv("graduates.csv").then(data => {
    // Convert relevant fields to numbers
    data.forEach(d => {
      d.Mean = +d.Mean;
    });

    data.forEach(d => {
      if (d.Major === lookformajor) {
        majorLine2.push({ year: +d.Year, value: +d.Mean });
        if (d.Mean > max2) {
          max2 = d.Mean;
        }
      }
    });
  });
  updateLineGraph();

}

function updateLineGraph() {
    // Read the CSV file
    svgTest = d3.select("#LineGraph").select("svg").remove();
    svgTest = d3.select("#LineGraph").append("svg")
        .attr("width", 1000 + margin.left + margin.right)
        .attr("height", 500 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.csv("graduates.csv").then(data => {
      // Convert relevant fields to numbers
      data.forEach(d => {
        d.Mean = +d.Mean;
      });
  
      let max = Math.max(max1, max2)
  
      // Define scales based on filtered data
      var xScale = d3.scaleLinear()
        .domain([1993,2015]) // Calculate domain from data
        .range([0, 1000]);
  
      var yScale = d3.scaleLinear()
        .domain([0, max]) // Input
        .range([500, 0]); // Output
  
      // Add the SVG to the page
      
  
      // Append X axis
      svgTest.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 500 + ")")
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
  
      // Append Y axis
      svgTest.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));
  
      // Define the line generator
      var line = d3.line()
        .x(function(d) { return xScale(d.year); }) // Use year for x values
        .y(function(d) { return yScale(d.value); }); // Use mean for y values
  
      // Bind data and append the path for the line
      svgTest.append("path")
        .datum(majorLine1) // Binds data to the line
        .attr("class", "line1") // Assign a class for styling
        .attr("d", line) // Calls the line generator

        svgTest.append("path")
        .datum(majorLine2) // Binds data to the line
        .attr("class", "line2") // Assign a class for styling
        .attr("d", line) // Calls the line generator

        svgTest.append("text")
    .attr("transform", "translate(" + (1000 / 2) + " ," + (500 + 35) + ")")
    .style("text-anchor", "middle")
    .text("Year");

    svgTest.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(500 / 2))
    .attr("y", -45)
    .style("text-anchor", "middle")
    .text("Mean Salary");
    });
  }
  
  // Call the function to render the line graph
  updateMajorLine1("Agricultural Economics")
  