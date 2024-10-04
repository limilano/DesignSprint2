
var margin = { top: 20, right: 20, bottom: 50, left: 70 },
  width = 1100 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;



var svg = d3.select("#MFbarchart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g") //group
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

data = d3.csv("graduates.csv").then(data => {
  data.forEach(d => {
    d.Value = +d.Value;
  });

  majors = {}; //map

  //const id = d => d.Education.Major;

  data.forEach(d => {
    const curID = d.Major;
    const year = d.Year;
    if (!majors.hasOwnProperty(curID) && year == "2010") { //if id not in our map
      majors[curID] = {
        females: +d.Females,
        males: +d.Males,
        label: curID
      };
    }

  });

  majors = d3.values(majors); //convert to array

  majors.forEach(d => {
    if (!isNaN(d.males)) {
      d.diff = Math.max(d.males, d.females);
    } else {
      d.diff = d.females;
    }
  });




  //axes
  x = d3.scaleBand()
    .rangeRound([30, width])
    .padding(.2)
    .domain(majors.map(d => d.label));


  y = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([0, d3.max(majors, d => d.diff)]);


    var Tooltip = d3.select("#bcToolTip")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html("Major: " + d.label + `<br>` + " Females: " + d.females + `<br>`+ " Males: " + d.males)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }


  // Female bars with mouseover
  const entriesFemale = svg.selectAll(".pinkBar")
    .data(majors)
    .enter()
    .append("rect")
    .attr("class", "pinkBar")
    .attr("x", d => x(d.label))
    .attr("width", x.bandwidth() / 2)
    .attr("y", d => y(d.females))
    .attr("height", d => height - y(d.females))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

  // Male bars with mouseover
  const entriesMale = svg.selectAll(".blueBar")
    .data(majors)
    .enter()
    .append("rect")
    .attr("class", "blueBar")
    .attr("x", d => x(d.label) + (x.bandwidth() / 2))
    .attr("width", x.bandwidth() / 2)
    .attr("y", d => y(d.males))
    .attr("height", d => height - y(d.males))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    





  svg.append("g")
    .attr("transform", "translate(30, 0)")
    .call(d3.axisLeft(y));

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "axis-x")
    .call(d3.axisBottom(x));

  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + 35) + ")")
    .style("text-anchor", "middle")
    .text("Amount of Females vs Males per Major");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -35)
    .style("text-anchor", "middle")
    .text("Number of People");




});
