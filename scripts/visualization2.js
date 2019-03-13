let outputObj2 = {
  calltype:[],
  avgresp: [],
}

var loadingChart2 = function() {
  convertRow = function(row, index) {
    let out2 = {};

    for (col in row) {
      switch (col) {
        case "calltype":
          outputObj2.calltype.push(row[col]);
          break;
        case "responsetime":
          outputObj2.avgresp.push(+row[col]);
          break;
        default:
          break;
      }
    }
    return out2;
  }
  d3.csv("../../input/visualization2/avg-response-time-data.csv", convertRow).then(() => {}).then(function() {
    outputObj2.calltype.reverse();
  }).then(drawBarChart2).then();
}

var drawBarChart2 = function() {
  var tooltip = d3.select("body").append("div").attr("class", "toolTip");


  let countMin = 0;
  let countMax = 45;
  let svg = d3.select("body").select("section.section").select("div").select("svg");
  var div = d3.select("body").select("section.section").select("div").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  let margin = {
    top: 15,
    right: 35,
    bottom: 50,
    left: 200
  };
    let bounds = svg.node().getBoundingClientRect();
    let plotWidth = bounds.width - margin.right - margin.left;
    let plotHeight = bounds.height - margin.top - margin.bottom;

    let responsetime = d3.scaleLinear()
      .domain([0, countMax])
      .range([0, plotWidth])
      .nice();

      let categories = d3.scaleBand()
          .domain(outputObj2.calltype)
          .rangeRound([plotHeight, 12])
          .paddingInner(0.1);

          let plot = svg.select("g#plotChart2");

            if (plot.size() < 1) {
              plot = svg.append("g").attr("id", "plotChart2");
              plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }

            let xAxis = d3.axisBottom(responsetime);
            let yAxis = d3.axisLeft(categories);

            if (plot.select("g#y-axisChart2").size() < 1) {
              let xGroup = plot.append("g").attr("id", "x-axisChart2");

              xGroup.call(xAxis);

              xGroup.attr("transform", "translate(0," + plotHeight + ")");

              let yGroup = plot.append("g").attr("id", "y-axisChart2");
              yGroup.call(yAxis);
            }
            else {
              plot.select("g#y-axisChart2").call(yAxis);
            }

            let bars2 = plot.selectAll("rect")
              .data(outputObj2.calltype);

              bars2.enter().append("rect")
                .attr("class", "bar")
                .attr("width", function(d, i) {
                  return responsetime(outputObj2.avgresp[i]);
                })
                .attr("x", function(d, i) {
                  return categories(outputObj2.avgresp[i]);
                })
                .attr("y", function(d, i) {
                  return plotHeight - 9 - categories(outputObj2.calltype[i]);
                })
                .attr("height", function(d, i) {
                  return categories.bandwidth();
                })
                .attr("fill", "blue")
                .on("mouseover", function (d, i) {
                  console.log("test");
                  tooltip
                  .style("left", d3.event.pageX - 50 + "px")
                  .style("top", d3.event.pageY - 70 + "px")
                  .style("display", "inline-block")
                  .html(("Call Type: " + outputObj2.calltype[19 - i]) + "<br>" + "Avg Response in Minutes: " + (outputObj2.avgresp[i]));
                })
                .on("mouseout", function(d){ tooltip.style("display", "none");});

            bars2.transition()
              .attr("y", function(d) { return responsetime(d.value); })
              .attr("height", function(d) { return plotHeight - responsetime(d.value); });

            bars2.exit()
              .each(function(d, i, nodes) {
                console.log("Removing bar for:", d.key);
              })
              .transition()
              .attr("y", function(d) { return responsetime(countMin); })
              .attr("height", function(d) { return plotHeight - responsetime(countMin); })
              .remove();

        svg.append("text")
          .attr("transform",
            "translate(" + (130) + " ," +
                           (10 + margin.top) + ")")
          .style("text-anchor", "middle")
          .text("Incident Category");

          // svg.append("text")
          //   .attr("transform",
          //     "translate(" + (plotWidth/2) + " ," +
          //                    (390) + ")")
          //   .style("text-anchor", "middle")
          //   .text("Number of Records");


}
