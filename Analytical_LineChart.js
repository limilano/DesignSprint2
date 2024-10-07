var svgTest = d3.select("#LineGraph").append("svg")
        .attr("width", 1000 + margin.left + margin.right)
        .attr("height", 500 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function updateLineGraph(lookformajor) {
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
  
      // Filter data for the specific major
      let majorLine = [];
      let max = 0;
  
      data.forEach(d => {
        if (d.Major === lookformajor) {
          majorLine.push({ year: +d.Year, value: +d.Mean });
          if (d.Mean > max) {
            max = d.Mean;
          }
        }
      });
  
      // Define scales based on filtered data
      var xScale = d3.scaleLinear()
        .domain(d3.extent(majorLine, d => d.year)) // Calculate domain from data
        .range([0, 1000]);
  
      var yScale = d3.scaleLinear()
        .domain([0, max]) // Input
        .range([500, 0]); // Output
  
      // Add the SVG to the page
      
  
      // Append X axis
      svgTest.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 500 + ")")
        .call(d3.axisBottom(xScale));
  
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
        .datum(majorLine) // Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line); // Calls the line generator

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
  updateLineGraph("Agricultural Economics");
  