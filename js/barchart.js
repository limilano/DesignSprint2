// Update SVG dimensions: new treeWidth 700 and treeHeight 850
const treeWidth = 710;
const treeHeight = 700;

// Load data
d3.csv("data/graduates2010.csv").then(data => {
    // Process data
    data.forEach(d => {
        d.major = d.major;
        d.median_salaries = +d.median_salaries;
        d.heads = +d.demographics_total;
        d.females = +d.females; 
        d.males = +d.males; 
		d.females_bachelors_median_income = +d.females_bachelors_median_income;
		d.females_masters_median_income = +d.females_masters_median_income;
		d.females_doctorate_median_income = +d.females_doctorate_median_income;
		d.males_bachelors_median_income = +d.males_bachelors_median_income;
		d.males_masters_median_income = +d.males_masters_median_income;
		d.males_doctorate_median_income = +d.males_doctorate_median_income;
    });

    // BEGINNING OF THE TREE MAP GENERATING CODE

    // Create a scale for font sizes based on salary values
    const fontSizeScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.median_salaries))
        .range([10, 19]);

    // Create a root node from the data and sum the values
    const root = d3.hierarchy({ children: data })
        .sum(d => d.median_salaries) // Use total demographics for treemap size
        .sort((a, b) => b.value - a.value);

    // Create the treemap layout
    const treemap = d3.treemap()
        .size([treeWidth, treeHeight])
        .padding(2)
        .round(true);

    // Generate the treemap layout
    treemap(root);

    // Create the SVG container with updated dimensions
    const treemapSvg = d3.select("#treemap")
        .append("svg")
        .attr("width", treeWidth)
        .attr("height", treeHeight)
        .style("font-family", "Arial, sans-serif");

    // Create nodes for each leaf
    const nodes = treemapSvg.selectAll(".node")
        .data(root.leaves())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    // Append rectangles for each node
    nodes.append("rect")
        .attr("id", d => d.data.major)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => {
			return d.data.major === "All" ? "red" : "#3698e3";
		});

    //This function updates the barchart 
    function updateBarChart(selectedMajor) {
        // Filter by the selected major
        const filteredData = data.find(d => d.major === selectedMajor);
        
        if (filteredData) {
            renderBarChart([
                { gender: 'Women', count: filteredData.females },
                { gender: 'Men', count: filteredData.males }
            ], 
			selectedMajor);
        } else {
            console.error("No data found for the selected major");
        }
    }

	// Function to update the line graph based on the selected major
	function updateLineGraph(selectedMajor) {
		// Filter the data for the selected major
		const filteredData = data.find(d => d.major === selectedMajor);

		// Format the data to match the line chart format
		if (filteredData){
			renderLineGraph([
				{ degree: 'Bachelors', male: filteredData.males_bachelors_median_income, female: filteredData.females_bachelors_median_income },
				{ degree: 'Masters', male: filteredData.males_masters_median_income, female: filteredData.females_masters_median_income },
				{ degree: 'Doctorate', male: filteredData.males_doctorate_median_income, female: filteredData.females_doctorate_median_income }
			], selectedMajor);
		} else {
			console.error("No data found for the selected major");
		}
	}

    nodes.on('click', function(event, d) {
		// Change the fill color of all rectangles back to their original color
		treemapSvg.selectAll("rect").attr("fill", "#3698e3"); // reset

		// Change the fill color of the selected rectangle to red
		d3.select(this).select("rect").attr("fill", "red");

        // Call a function to update the bar chart with the selected major
        updateBarChart(d.data.major);
		updateLineGraph(d.data.major)
    });

    // Append text labels for each node
    nodes.append("text")
        .attr("x", 5)
        .attr("y", 15)
        .style("fill", "white")
        .style("font-size", d => `${fontSizeScale(d.data.median_salaries)}px`)
        .each(function (d) {
            const node = d3.select(this);
            const textWidth = d.x1 - d.x0 - 5;
            const textHeight = d.y1 - d.y0;

            let fontSize = fontSizeScale(d.data.median_salaries);
            node.style("font-size", `${fontSize}px`);

            let textContent = d.data.major + ": $" + d.data.median_salaries;

            // Call the text wrapping function
            const lines = wrapText(textContent, textWidth, fontSize);

            // Clear the original text and append tspan elements for each line
            node.selectAll("tspan").remove();
            lines.forEach((line, i) => {
                node.append("tspan")
                    .attr("x", 5)
                    .attr("y", 20 + i * (fontSize + 2))
                    .text(line);
            });

            // Hide text if it overflows the height
            const totalTextHeight = lines.length * (fontSize + 2);
            if (totalTextHeight > textHeight) {
                node.style("display", "none");
            }
        });

    // Function to wrap text into multiple lines based on the width of the rectangle
    function wrapText(text, width, fontSize) {
        const words = text.split(/\s+/);
        let line = [], lines = [], lineLength = 0;
        const charWidth = fontSize * 0.6;

        words.forEach(word => {
            line.push(word);
            lineLength += word.length * charWidth;

            if (lineLength > width) {
                line.pop();
                lines.push(line.join(" "));
                line = [word];
                lineLength = word.length * charWidth;
            }
        });

        lines.push(line.join(" "));
        return lines;
    }

    // END OF THE TREE MAP GENERATING CODE

	// BEGINNING OF BAR CHART
    // CHART AREA
    var margin = { top: 60, right: 80, bottom: 40, left: 120 },
        width = $('#chart-area').width() - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    width = width > 400 ? 400 : width;

    var svg = d3.select("#chart-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // AXIS
    var x = d3.scaleBand()
        .rangeRound([0, width*0.7])
        .padding(0.1);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    var xAxisGroup = svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", `translate(0, ${height})`);

    var yAxisGroup = svg.append("g")
        .attr("class", "y-axis axis");


    // Render bar chart
    function renderBarChart(data, selectedMajor) {
        // Validate data
        if (data.length === 0) {
            errorMessage("No data available!");
            return;
        }

        // Scale the domains
        x.domain(data.map(d => d.gender));
        y.domain([0, d3.max(data, d => d.count)]);

        // DRAW BARS
        var bars = svg.selectAll(".bar")
            .data(data);

		  // ENTER
		  bars.enter().append("rect")
		  .attr("class", "bar")
		  .attr("x", d => x(d.gender) + (x.bandwidth()*0.6) / 2) // Center the bars
		  .attr("width", x.bandwidth()*0.4) // Set the new, thinner width
		  .attr("y", d => y(d.count))
		  .attr("height", d => height - y(d.count))
		  .attr("fill", d => d.gender === "Women" ? "orange" : (d.gender === "Men" ? "#69b3a2" : "#FF69B4"));
  
	  // UPDATE
	  bars.transition()
		  .duration(200)
		  .attr("x", d => x(d.gender) + (x.bandwidth()*0.6) / 2) // Center the bars
		  .attr("width", x.bandwidth()*0.4) // Set the new, thinner width
		  .attr("y", d => y(d.count))
		  .attr("height", d => height - y(d.count))
		  .attr("fill", d => d.gender === "Women" ? "orange" : (d.gender === "Men" ? "#69b3a2" : "#FF69B4"));
  
        // REMOVE
        bars.exit().remove();

        // DRAW AXIS
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
	
		// Clear previous title
		svg.selectAll("text.axis-title").remove();

        // Axis title
        svg.select("text.axis-title").remove();
        svg.append("text")
            .attr("class", "axis-title")
            .attr("x", width / 2 - 80)
            .attr("y", -45)
			.attr("text-anchor", "middle")       // Center text
			.style("font-size", "20px")  
            .text("Gender Distribution of");

		// Append second line of the title
		svg.append("text")
        .attr("class", "axis-title")
        .attr("x", width / 2 - 80)  // Center the title
        .attr("y", -20)         // Position just below the first line
        .attr("text-anchor", "middle") // Center text
        .style("font-size", "22px") // Make this larger if needed
        .style("font-weight", "bold") // Optional: Make this bold
        .text(selectedMajor + " Major");  // Dynamic Major
    }
	// END OF BAR CHART

	// BEGINING OF LINE GRAPH

	// Define dimensions for the new line chart
	const lineWidth = 400;  // Width of the line chart area
	const lineHeight = 300; // Height of the line chart area
	const lineMargin = { top: 30, right: 50, bottom: 50, left: 50 };

	// Create a new SVG container for the line chart
	const lineChartSvg = d3.select("#line-chart-area")
		.append("svg")
		.attr("width", lineWidth + lineMargin.left + lineMargin.right)
		.attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
		.append("g")
		.attr("transform", "translate(" + lineMargin.left + "," + lineMargin.top + ")");

	// Function to render the line graph based on the selected major
	function renderLineGraph(data, selectedMajor) {
		// Set up scales based on the formatted data
		const lineX = d3.scalePoint()
			.domain(data.map(d => d.degree))  // Map `degree` to x-axis
			.range([0, lineWidth]);

		const lineY = d3.scaleLinear()
			.domain([0, d3.max(data, d => Math.max(d.male, d.female))])  // Max value from `male` and `female`
			.range([lineHeight, 0]);

		// Create the line generators for males and females
		// Create the line generators for males and females
		const lineMale = d3.line()
			.x(d => lineX(d.degree))  // Use `d.degree` for x position
			.y(d => lineY(d.male));    // Use `d.male` for y position

		const lineFemale = d3.line()
			.x(d => lineX(d.degree))
			.y(d => lineY(d.female));

		// Clear previous line paths and dots
		lineChartSvg.selectAll("*").remove();

		// Draw male salary line
		lineChartSvg.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "#69b3a2") // Green for males
			.attr("stroke-width", 2)
			.attr("d", lineMale);

		// Draw female salary line
		lineChartSvg.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "orange") // Orange for females
			.attr("stroke-width", 2)
			.attr("d", lineFemale);

		// Append circles at data points for males
		lineChartSvg.selectAll(".male-dot")
			.data(data)
			.enter().append("circle")
			.attr("class", "male-dot")
			.attr("cx", d => lineX(d.degree))
			.attr("cy", d => lineY(d.male))
			.attr("r", 4)
			.attr("fill", "#69b3a2");

		// Append circles at data points for females
		lineChartSvg.selectAll(".female-dot")
			.data(data)
			.enter().append("circle")
			.attr("class", "female-dot")
			.attr("cx", d => lineX(d.degree))
			.attr("cy", d => lineY(d.female))
			.attr("r", 4)
			.attr("fill", "orange");

		// Create and append axes
		const lineXAxis = d3.axisBottom(lineX);
		const lineYAxis = d3.axisLeft(lineY);

		lineChartSvg.append("g")
			.attr("class", "x-axis")
			.attr("transform", "translate(0," + lineHeight + ")")
			.call(lineXAxis);

		lineChartSvg.append("g")
			.attr("class", "y-axis")
			.call(lineYAxis);

		// Add chart title
		lineChartSvg.append("text")
			.attr("x", (lineWidth / 2))             
			.attr("y", 0 - (lineMargin.top / 2))
			.attr("text-anchor", "middle")  
			.style("font-size", "16px") 
			.style("text-decoration", "underline")  
			.text(`Median Salaries by Degree and Gender`);

			// --- Add Legend ---
		const legend = lineChartSvg.append("g")
			.attr("class", "legend")
			.attr("transform", `translate(${lineWidth - 90}, 220)`);  // Position legend at top-right corner
	
		// Legend for Male
		legend.append("circle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 6)
			.attr("fill", "#69b3a2");
	
		legend.append("text")
			.attr("x", 10)
			.attr("y", 4)
			.text("Male")
			.style("font-size", "12px")
			.attr("alignment-baseline", "middle");
	
		// Legend for Female
		legend.append("circle")
			.attr("cx", 0)
			.attr("cy", 20)
			.attr("r", 6)
			.attr("fill", "orange");
	
		legend.append("text")
			.attr("x", 10)
			.attr("y", 24)
			.text("Female")
			.style("font-size", "12px")
			.attr("alignment-baseline", "middle");
	}

	// END OF LINE GRAPH

    // Error message function
    function errorMessage(message) {
        console.log(message);
    }

    // Initial render with the first major
    updateBarChart(data[data.length-1].major);
	updateLineGraph(data[data.length-1].major);
	

}).catch(error => {
    console.error("Error loading or processing data:", error);
});