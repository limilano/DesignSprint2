
      var margin = {top: 20, right: 20, bottom: 50, left: 70},
        width = 960 - margin.left - margin.right,
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
          if(!majors.hasOwnProperty(curID) && year == "2010") { //if id not in our map
            majors[curID] = {
              females: d.Females,
              males: d.Males,
              label: curID
            };
          } 

        });

        majors = d3.values(majors); //convert to array

        majors.forEach(d => {
            if(!isNaN(d.males)) {
              d.diff = Math.max(d.males, d.females);
            } else {
                d.diff = d.females;
            }
        });


        

        //axes
        x = d3.scaleBand()
          .rangeRound([0, width])
          .padding(.1)
          .domain(majors.map(d => d.label));


        y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(majors, d => d.diff)]);

        purpleColorScale = d3.scaleLinear()
          .domain([0, d3.max(majors, d => d.females)])
          .range(["#d098f5", "#4d004b"]);

        yellowColorScale = d3.scaleLinear()
          .domain([0, d3.max(majors, d => d.males)])
          .range(["#e8a15f","#9c4d22"]);


          const barLabels = svg.selectAll(".text") //group
          .data(majors) //bind data
          .enter()
                .append("text")
                  .text(d => d.diff + "")
                  .attr("font-family" , "sans-serif")
                  .attr("font-size" , "14px")
                  .attr("fill" , "black")
                  .attr("text-anchor", "right")
                  .attr("x", d => x(d.label) + 30)
                  .attr("y", d => y(d.diff) - 10);

        const entries = svg.selectAll("g") //group
          .data(majors) //bind data
          .enter() //every element in data will have a g at the end
            .append("g")
              .append("rect")
                .attr("class","bar")
                .attr("x", d => x(d.label))
                .attr("width", x.bandwidth())
                .attr("y", d => y(d.diff))
                .attr("height", d => height - y(d.diff));
            
        
                
                    

        svg.append("g")
          .call(d3.axisLeft(y));

        svg.append("g")
          .attr("transform","translate(0," + height + ")")
          .call(d3.axisBottom(x));

        svg.append("text")
          .attr("transform", "translate(" + (width/2) + " ," + (height+35) + ")")
          .style("text-anchor", "middle")
          .text("Male v Female in Each Major");

        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -(height/2))
          .attr("y", -35)
          .style("text-anchor", "middle")
          .text("Number of People");

        });
  