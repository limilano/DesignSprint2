// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var pieChart = d3.select("#PieChart")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    majorsPie = {}; //map



// set the color scale
var color = d3.scaleOrdinal()
  .domain(["Asians", "Minorities", "Whites"])
  .range(d3.schemeDark2);

  var Tooltip = d3.select("#PieToolTip")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")



    var mouseoverPie = function(d) {
      Tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemovePie = function(d) {
      Tooltip
        .html("Ethnicity: " + d.data.key + `<br>`+ "Number: " + d.data.value)
        .style("left", (d3.mouse(this)[0]+70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleavePie = function(d) {
      Tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

// A function that create / update the plot for a given variable:
function updatePieChart(lookformajor) {
  data = d3.csv("graduates.csv").then(data => {
    data.forEach(d => {
      d.Value = +d.Value;
    });
  
    
  
    //const id = d => d.Education.Major;
  
    data.forEach(d => {
      const curID = d.Major;
      const year = d.Year;
      if (!majorsPie.hasOwnProperty(curID) && year == "2010") { //if id not in our map
        majorsPie[curID] = {
          asians: +d.Asians,
          minorities: +d.Minorities,
          whites: +d.Whites,
          label: curID
        };
      }
  
    });
  
  
  

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  var data_ready = pie(d3.entries(majorsPie[lookformajor]))
  
  // map to data
  var u = pieChart.selectAll("path")
    .data(data_ready)

    

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .enter()
    .append('path')
    .on("mouseover", mouseoverPie)
    .on("mousemove", mousemovePie)
    .on("mouseleave", mouseleavePie)
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)
    

  // remove the group that is not present anymore
  u
    .exit()
    .remove()

  });

}

// Initialize the plot with the first dataset
updatePieChart("Agricultural Economics")
