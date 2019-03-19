let outputObj2 = {
  calltype:[],
  avgresp: [],
  callcount: [],
  low: [],
  high: [],
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
        case "numrecords":
          outputObj2.callcount.push(+row[col]);
          break;
        case "low":
          outputObj2.low.push(+row[col]);
          break;
        case "high":
          outputObj2.high.push(+row[col]);
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

var color = d3.scaleLinear()
    .domain([13, 44])
    .range(["#ff8080", "#ff0000"]);

var color2 = d3.scaleLinear()
    .domain([1, 6])
    .range(["#ccffcc", "#004d00"]);
/*-------------------------*/

/*-------------------------*/
var drawBarChart2 = function() {

  var tooltip = d3.select("body").append("div").attr("class", "toolTip");
  var reset = d3.select("body").select("section.section").select("div").select("div.reset");
  var viewLowerData = d3.select("body").select("section.section").select("div").select("div.lowerData");
  var topFive = d3.select("body").select("section.section").select("div").select("div.fiveCommon");
  //var viewLowerData = d3.select("body").select("section.section").select("div").select("div.lowerData").select("input");
  let countMin = 0;
  let countMax = 45;

  viewLowerData.on("click", function(d, i) {
    loadLowerRange();
  })

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

    reset.style("margin-left", plotWidth);
    let responsetime = d3.scaleLinear()
      .domain([0, countMax])
      .range([0, plotWidth])
      .nice();

      let categories = d3.scaleBand()
          .domain(outputObj2.calltype)
          .rangeRound([plotHeight, 12])
          .paddingInner(0.1);

          let plot = svg.select("g#plotChart2");
          console.log("Plot size: " + plot.size());

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
                .attr("fill", function(d, i) {
                  if (outputObj2.avgresp[i] > 12) {
                    return color(outputObj2.avgresp[i])
                  }
                  else {
                    return color2(outputObj2.avgresp[i])
                  }
                  })
                //.attr("fill", "blue")
                .on("click", function (d, i) {
                  console.log("clicked " + i);
                  plot.selectAll("rect").attr("fill", function(d, j) {
                    if (i != j) {
                      return "gray";
                    }
                    else {
                      if (outputObj2.avgresp[i] > 12) {
                        return color(outputObj2.avgresp[i])
                      }
                      else {
                        return color2(outputObj2.avgresp[i])
                      }
                    }
                  });
                })

                .on("mouseenter", function (d, i) {
                  console.log("test");
                  tooltip
                  .style("left", d3.event.pageX + 30 + "px")
                  .style("top", d3.event.pageY + 10 + "px")
                  .style("display", "inline-block")
                  .html(("<strong>Call Type: </strong>" + outputObj2.calltype[19 - i])
                   + "<br>" + "<strong>Avg Response in Minutes: </strong>"
                   + Math.round(outputObj2.avgresp[i] * 100) / 100 + "<br>"
                   + "<strong>Number of Calls: </strong>" + outputObj2.callcount[i]
                   + "<br>" + "<strong>Low Value: </strong>" + outputObj2.low[i]
                   + "<br>" + "<strong>High Value: </strong>" + outputObj2.high[i])
                })
                .on("mouseout", function(d){ tooltip.style("display", "none");});

            bars2.transition()
              // .attr("y", function(d, i) { return responsetime(d.value); })
              // .attr("height", function(d) { return plotHeight - responsetime(d.value); });

            bars2.exit()
              .each(function(d, i, nodes) {
                console.log("Removing bar for:", d.key);
              })
              .transition()
              .attr("y", function(d) { return responsetime(countMin); })
              .attr("height", function(d) { return plotHeight - responsetime(countMin); })
              .remove();

              reset.on("click", function(d, i) {
                console.log("clicked reset");
                responsetime.domain([0, countMax]);
                svg.select("xAxis")
                  .call(xAxis);
                plot.selectAll("rect")
                  .attr("fill", function(d, j) {
                    if (outputObj2.avgresp[j] > 12) {
                      return color(outputObj2.avgresp[j])
                    }
                    else {
                      return color2(outputObj2.avgresp[j])
                    }
                  })
                  .transition().attr("width", function(d, k) {
                    console.log(k);
                    console.log(outputObj2.avgresp[k]);
                  return responsetime(outputObj2.avgresp[k]);
                });
                plot.transition().select("g#x-axisChart2").call(xAxis);
              })

               topFive.on("click", function (d, i) {
                 console.log("clicked topfive");
                 plot.transition().selectAll("rect").attr("fill", function(d, j) {
                   console.log("counting");
                    if (outputObj2.calltype[19 - j] == "Medical Incident" || outputObj2.calltype[19 - j] == "Alarms"
                        || outputObj2.calltype[19 - j] == "Structure Fire" || outputObj2.calltype[19 - j] == "Traffic Collision") {
                          console.log(19 - j)
                          if (outputObj2.avgresp[j] > 12) {
                            return color(outputObj2.avgresp[j])
                          }
                          else {
                            return color2(outputObj2.avgresp[j])
                          }
                    }
                    else {
                      return "gray"
                    }
                 });
               })

        svg.append("text")
          .attr("transform",
            "translate(" + (130) + " ," +
                           (10 + margin.top) + ")")
          .style("text-anchor", "middle")
          .text("Incident Category");

          svg.append("text")
            .attr("transform",
              "translate(" + (plotWidth - 250) + " ," +
                             (590) + ")")
            .style("text-anchor", "middle")
            .text("Average Response Time (minutes)");

          var loadLowerRange = function() {
            console.log("in loadLowerRange 1");
            responsetime.domain([0, 6]).nice();
            svg.select("xAxis")
              .call(xAxis);
            plot.selectAll("rect")
              .transition().attr("width", function(d, i) {
                if (outputObj2.avgresp[i] > 12) {
                  return 0;
                }
                else {
                  return responsetime(outputObj2.avgresp[i]);
                }

              //return responsetime(outputObj2.avgresp[i]);
            });
            plot.transition().select("g#x-axisChart2").call(xAxis);

          }

          var drawLegend = function() {
                console.log("in drawLegend");
                //const svg = d3.select(DOM.svg(width, height));
                const defs = svg.append("defs");

                const linearGradient = defs.append("linearGradient")
                    .attr("id", "linear-gradient");

                colorScale = d3.scaleSequential(d3.interpolate("#ff8080", "#ff0000"));
                barHeight = 20

                linearGradient.selectAll("stop")
                  .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
                  .enter().append("stop")
                  .attr("offset", d => d.offset)
                  .attr("stop-color", d => d.color);

                svg.append('g')
                  .attr('transform', `translate(780,20)`)
                  .append("rect")
                  .attr('transform', `translate(${plotWidth - 700}, 0)`)
              	.attr("width", 125)
              	.attr("height", barHeight)
              	.style("fill", "url(#linear-gradient)");

                let colorScaleAxis = d3.scaleLinear()
                  .domain([10, 45])
                  .range([0, 125])

                let colorAxis = d3.axisTop(colorScaleAxis)
                                .ticks(5);

                svg.append('g')
                  .call(colorAxis)
                  .attr('transform', `translate(${plotWidth + 80},20)`);

                colorScale = d3.scaleSequential(d3.interpolatePiYG).domain([0, 42]);

          }

          var drawLegend2 = function() {
            console.log("in drawLegend");
            const defs2 = svg.append("defs");

            const linearGradient2 = defs2.append("linearGradient")
                .attr("id", "linear-gradient2");

            colorScale2 = d3.scaleSequential(d3.interpolate("#ccffcc", "#004d00"));
            barHeight2 = 20

            linearGradient2.selectAll("stop")
              .data(colorScale2.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale2(t) })))
              .enter().append("stop")
              .attr("offset", d => d.offset)
              .attr("stop-color", d => d.color);

            svg.append('g')
              .attr('transform', `translate(625,20)`)
              .append("rect")
              .attr('transform', `translate(${plotWidth - 700}, 0)`)
            .attr("width", 125)
            .attr("height", barHeight2)
            .style("fill", "url(#linear-gradient2)");

            let colorScaleAxis2 = d3.scaleLinear()
              .domain([0, 6])
              .range([0, 125])

            let colorAxis2 = d3.axisTop(colorScaleAxis2)
                            .ticks(3);

            svg.append('g')
              .call(colorAxis2)
              .attr('transform', `translate(${plotWidth - 75},20)`);

          }
          drawLegend();
          drawLegend2();
}
