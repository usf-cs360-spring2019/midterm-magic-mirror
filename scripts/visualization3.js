// Set the dimensions and margins of the graph
var svg_width = 960,
svg_height = 500;
margin = {top: 30,
    right: 30,
    bottom: 30,
    left: 30};
    plot_width = svg_width - margin.left - margin.right;
    plot_height = 400;
    
    // Edit the svg object
    var svg = d3.select("#my_viz")
    .attr("width", svg_width)
    .attr("height", svg_height)
    .append("g")
    .attr("id", "plot");
    
    d3.csv("../../input/visualization3/data_processed.csv").then((data) => {
        for (let row of data) {
            row['Avg. Response Time(mins)'] = +(row['Avg. Response Time(mins)']);
        }
        // console.log(data);
        
        // Labels of row and columns
        let columns = d3.map(data, d => d['Neighborhooods - Analysis Boundaries']).keys().sort();
        // console.log(columns);
        let rows = ['Medical Incident', 'Alarms', 'Structure Fire', 'Traffic Collision'];
        rows.reverse();
        // console.log(rows);
        
        
        // Build X scales and axis
        let x = d3.scaleBand()
        .range([0, plot_width - 40])
        .domain(columns)
        .padding(0.05);
        
        svg.append('g')
            .style("font-size", 15)
            .attr("transform", "translate(100,320)")
            .call(d3.axisBottom(x).tickSize(0))
            // .select(".domain").remove()
                .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");
        
        // Build Y scales and axis
        let y = d3.scaleBand()
        .range([ plot_height / 2.22, 0 ])
        .domain(rows)
        .padding(-1.1);
        
        svg.append("g")
        .attr("transform", "translate(" + (margin.left + 60) + "," + margin.top * 2.9 + ")")
        .style("font-size", 12)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove();
        
        // Build color scale
        var color = d3.scaleLinear()
        .domain([3.05, 10, 34.14])
        .range(["#039B0A","#FFCB28", "#D40000"]);
        // console.log(color(1600));
        // console.log(color(1900));
        
        // Title
        svg.append('text')
        .text('Average Response Time in different Neighborhoods by Call Type')
        .attr('x', 260)
        .attr('y', 20)
        .style("font-size", "16px")
        .style('font-weight', 'bold')
        .style('font-family', 'Helvetica');
        
        // X-axis label
        svg.append('text')
        .text('Neighborhoods - Analysis Boundaries')
        .attr('x', 420)
        .attr('y', 40)
        .style("font-size", "10px")
        .style('font-family', 'Helvetica');
        
        // Draw squares
        let plot = svg.append("g").attr("id", "plot");
        plot.attr("transform", "translate(" + (margin.left + 60) + "," + margin.top * 4 + ")");
        
        plot.selectAll()
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => (x(d['Neighborhooods - Analysis Boundaries'])))
        .attr("y", d => (y(d['Call Type'])))
        .attr("width", 25.5)
        .attr("height", 62)
        .style("fill", d => (color(d['Avg. Response Time(mins)'])));
        
        // Draw gradient bar
        let plot2 = svg.append("g").attr("id", "plot2");
        plot2.attr("transform", "translate(780, 20)");
        
        var defs = svg.append("defs");
        
        var gradient = defs.append("linearGradient")
        .attr("id", "svgGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");
        
        gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#039B0A")
        .attr("stop-opacity", 1);

        gradient.append("stop")
        .attr("offset", "30%")
        .attr("stop-color", "#FFCB28")
        .attr("stop-opacity", 1);
        
        gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#D40000")
        .attr("stop-opacity", 1);
        
        // Paint gradient
        plot2.append("rect")
        .attr("width", 150)
        .attr("height", 10)
        .attr("fill", "url(#svgGradient)")
        .attr("x", 20)
        .attr("y", 5);
        
        plot2.append('text')
        .text('Avg. Res Times(mins)')
        .attr('x', 20)
        .attr('y', 0)
        .style("font-size", "10px")
        .style('font-family', 'Helvetica');
        
        plot2.append('text')
        .text('3.05')
        .attr('x', 20)
        .attr('y', 25)
        .style("font-size", "10px")
        .style('font-family', 'Helvetica');
        
        plot2.append('text')
        .text('34.14')
        .attr('x', 140)
        .attr('y', 25)
        .style("font-size", "10px")
        .style('font-family', 'Helvetica');
        
        // Highlight
        let status1 = d3.select("#highlight1");
        let status2 = d3.select("#highlight2");
        let status3 = d3.select("#highlight3");
        let rects = plot.selectAll("rect");
        
        rects.on("mouseover", function(d) { 
            d3.select(this)
            .raise() // bring to front
            .style("stroke", "red")
            .style("stroke-width", 2);
            
            status1.text("Call Type: " + d['Call Type']);
            status2.text("Neighborhooods: " + d['Neighborhooods - Analysis Boundaries']);
            status3.text("Average Response Time: " + d['Avg. Response Time(mins)']);
        });
        
        rects.on("mouseout.highlight", function(d) {
            d3.select(this).style("stroke", null);
            status1.text("Call Type: ");
            status2.text("Neighborhooods: ");
            status3.text("Average Response Time: ");
        });
    })