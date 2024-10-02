
      var margin = {top: 20, right: 20, bottom: 50, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
  
  
  
      var svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g") //group
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      data = d3.csv("MER_T10_02A.csv").then(data => {
        data.forEach(d => {
            d.Value = +d.Value;
            
        });

        energyData = {}; //map

        const id = d => d.MSN;

        data.forEach(d => {
          const curID = id(d);
          if(!energyData.hasOwnProperty(curID)) { //if id not in our map
            energyData[curID] = {
              date: [],
              value: [],
              label: curID
            };
          } 

          const year = d.YYYYMM;

          if (!energyData[curID].date.includes("2002") 
                && year.substr(0,4) === "2002") {
            energyData[curID].date.push(d.YYYYMM.substr(0,4));
            energyData[curID].value.push(d.Value);
          }


          if (!energyData[curID].date.includes("2022") 
                && year.substr(0,4) === "2022") {
            energyData[curID].date.push(d.YYYYMM.substr(0,4));
            energyData[curID].value.push(d.Value);
          }
        });

        energyData = d3.values(energyData); //convert to array

        energyData.forEach(d => {
            if(!isNaN(d.value[0])) {
              d.diff = Math.round(100*(d.value[1] - d.value[0]))/100;
            } else {
                d.diff = d.value[1];
            }
        });

        const labels = ["Geothermal", "Solar", "Wood", -1, "Hydroelectric", "Geothermal","Solar","Wind",
        "Wood","Waste","Fuel Ethanol","Biomass",-1];

        var count = 0;
        energyData.forEach(d => {
            d.label = labels[count];
            count++;
        });

        energyData = energyData.slice(0, 3).concat(energyData.slice(4));
        energyData.pop();

        

        //axes
        x = d3.scaleBand()
          .rangeRound([0, width])
          .padding(.1)
          .domain(energyData.map(d => d.label));


        y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(energyData, d => d.diff)]);

        purpleColorScale = d3.scaleLinear()
          .domain([0, d3.max(energyData, d => d.diff)])
          .range(["#d098f5", "#4d004b"]);

        yellowColorScale = d3.scaleLinear()
          .domain([0, d3.max(energyData, d => d.diff)])
          .range(["#e8a15f","#9c4d22"]);


          const barLabels = svg.selectAll(".text") //group
          .data(energyData) //bind data
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
          .data(energyData) //bind data
          .enter() //every element in data will have a g at the end
            .append("g")
              .append("rect")
                .attr("class","bar")
                .attr("x", d => x(d.label))
                .attr("width", x.bandwidth)
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
          .text("Source of Renewable Energy");

        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -(height/2))
          .attr("y", -35)
          .style("text-anchor", "middle")
          .text("Trillion BTU");

        });
  