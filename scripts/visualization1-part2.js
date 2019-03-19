let outputObj = {
  unitType:[],
  CallType:[],
  priority:[],
  reactionTime:[],
  unitTypeNum:[],
  callTypeNum:[],
}
var LoadingData = function(){
convertRow = function(row, index){
  let out = {};
  for (let col in row){
    switch (col) {
      case "UnitType":
       outputObj.unitType.push(row[col]);
       break;
      case "CallType":
    //  out[col] = parseInt(row[col]);
      outputObj.CallType.push(+row[col]);
      break;
      case "Priority":
      outputObj.priority.push(+row[col]);
      break;
      case "AvgResp":
      outputObj.reactionTime.push(+(row[col]));
      break;
      case "UnitTypeNum":
      outputObj.unitTypeNum.push(+(row[col]));
      break;
      case "CallTypeNum":
      outputObj.callTypeNum.push(+(row[col]));
      break;
    }
  }
  return out;
}
 d3.csv("..\\..\\input\\visualization1\\reaction_time.csv", convertRow)
 .then(() => {
  // console.log(outputObj.reactionTime[0]);
  DrawParallelCoordinate();
    })
}

var DrawParallelCoordinate = function(){
let svg = d3.select("body").select("section:nth-child(3)").select("div").select("svg");
let margin = {
  top:    15,
  right:  35,
  bottom: 30,
  left:   40
};
let bounds = svg.node().getBoundingClientRect();
let plotWidth = bounds.width - margin.right - margin.left;
let plotHeight = bounds.height - margin.top - margin.bottom;

let unitScale = d3.scaleLinear()
        .domain([1, d3.max(outputObj.unitTypeNum)])
        .range([0, plotHeight])
        .nice();

let CallTypeScale = d3.scaleLinear()
  .domain([1, 4])
  .range([0, plotHeight])
  .nice();

  let priorityScale = d3.scaleLinear()
          .domain([1, 3])
          .range([0, plotHeight])
          .nice();

  let reactionScale = d3.scaleLinear()
                  .domain([d3.min(outputObj.reactionTime), d3.max(outputObj.reactionTime)])
                  .range([plotHeight, 0])
                  .nice();
let reverseScale = d3.scaleLinear()
                   .domain([plotHeight, 0])
                   .range([d3.min(outputObj.reactionTime), d3.max(outputObj.reactionTime)])
                   .nice();

let plot = svg.select("g#plot2");

if (plot.size() < 1) {
        plot = svg.append("g").attr("id", "plot2");
        plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      }
    let xAxis = d3.axisTop(priorityScale);
    let xAxis1 = d3.axisBottom(unitScale);
    let xAxis2 = d3.axisBottom(CallTypeScale);
    let xAxis3 = d3.axisTop(reactionScale);

   xAxis.tickValues(['1', '2', '3']);
   xAxis1.tickValues(['']);
   xAxis2.tickValues(['']);

    if (plot.select("g#x-axis1").size() < 1) {
    let xGroup = plot.append("g").attr("id", "x-axis1");
        xGroup.call(xAxis);
    xGroup.attr("transform", "translate(0," + plotHeight + ")"+ 'rotate(270)')
    let xGroup1 = plot.append("g").attr('id', 'x-axis1').attr('transform', 'translate(' + 280 + ','+ 0 +')' + 'rotate(90, 0, 2)')
    xGroup1.call(xAxis1);

    let xGroup2 = plot.append("g").attr('id', 'x-axis2').attr('transform', 'translate(' + 604 + ','+ 0 +')' + 'rotate(90, 0, 2)')
    xGroup2.call(xAxis2);

    let xGroup3 = plot.append("g").attr('id', 'x-axis2').attr('transform', 'translate(' + 968 + ','+ 0 +')' + 'rotate(90, 0, 2)')
    xGroup3.call(xAxis3);



  }
  else {
    plot.select("g#y-axis2").call(yAxis);
}
var colorScale = d3.scaleOrdinal()
    .domain(1, 7)
    .range(['#e6194b', '#4363d8', '#ffe119', '#f58231', '#3cb44b', '#911eb4', '#46f0f0']);

for(var i = 0; i<45; i++){
svg.append("line")
      .attr('x1', plotHeight + 18)
      .attr('y1', 40+ priorityScale(outputObj.priority[i]))
      .attr('x2', 92)
      .attr('y2',37+ plotHeight- unitScale(outputObj.unitTypeNum[i]))
      .attr('transform', 'translate(' + 378 + ',' + -310 +')' + 'rotate(-180, 18, 360)')
      .attr('id' ,(d, j)=>"line"+i)
      .attr("stroke-width", 0.8)
      .attr('fill-opacity', 0.5)
      .attr('stroke-opacity', 0.8)
      .attr("stroke",function(d){
        return colorScale(outputObj.unitTypeNum[i])
      }).on('mouseover', function(d){
        let id = d3.select(this).attr("id");
        let id2 ="l"+id;
          let id3 ="ll"+id;

          d3.selectAll('line')
          .attr("stroke-width", 0.8)
          .attr('fill-opacity', 0.5)
          .attr('stroke-opacity', 0.8)

         d3.select("#"+id)
        .attr("stroke-width", 4)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 2);

        d3.select("#"+id2)
       .attr("stroke-width", 4)
       .attr('fill-opacity', 1)
       .attr('stroke-opacity', 2);

       d3.select("#"+id3)
      .attr("stroke-width", 4)
      .attr('fill-opacity', 1)
      .attr('stroke-opacity', 2);

       let y = reactionScale.invert(d3.select("#"+id3).attr('y2')).toFixed(2);
       y =  y + " minutes";

       svg.append("text")
        .attr('class', 'label1')
        .attr("dy", ".5em")
        .style('font-familly', 'Arial')
        .attr('x', 1050)
        .attr('y',  300)
        .style('font-size', 13)
        .attr("class","label")
        .style("fill", "Black")
        .text(y)
      }).on("mouseout", function(d){
        d3.selectAll('line')
        .transition()
        .duration(function(d,i){
          return 2*i;
        })
        .attr("stroke-width", 0.8)
        .attr('fill-opacity', 0.5)
        .attr('stroke-opacity', 0.8)
        svg.select(".label").remove();
   });
 }

   for(var i = 0; i<45; i++){
   svg.append("line")
         .attr('x1', -34)
         .attr('y1', -5+unitScale(outputObj.unitTypeNum[i]))
         .attr('x2', 288)
         .attr('y2',-5+ CallTypeScale(outputObj.callTypeNum[i]))
         .attr('id' ,(d, j)=>"lline"+i)
         .attr('transform', 'translate(' + 355 + ',' + 23+')')
         .attr("stroke-width", 0.8)
         .attr('fill-opacity', 0.5)
         .attr('stroke-opacity', 0.8)
         .attr("stroke",function(d){
           return colorScale(outputObj.unitTypeNum[i])
         }).on('mouseover', function(d){
           let id2 = d3.select(this).attr("id");
           let id1 = id2.substring(1);
           let id3 = "l"+id2;

           d3.selectAll('line')
           .attr("stroke-width", 0.8)
           .attr('fill-opacity', 0.5)
           .attr('stroke-opacity', 0.8)

            d3.select("#"+id1)
           .attr("stroke-width", 4)
           .attr('fill-opacity', 1)
           .attr('stroke-opacity', 2)


           d3.select("#"+id2)
          .attr("stroke-width", 4)
          .attr('fill-opacity', 1)
          .attr('stroke-opacity', 2);


          d3.select("#"+id3)
         .attr("stroke-width", 4)
         .attr('fill-opacity', 1)
         .attr('stroke-opacity', 2);


           let y = reactionScale.invert(d3.select("#"+id3).attr('y2')).toFixed(2);
         y = y + " minutes";

         svg.append("text")
           .attr('class', 'label1')
           .attr("dy", ".5em")
           .style('font-familly', 'Arial')
           .attr('x', 1050)
           .attr('y',  300)
           .style('font-size', 13)
           .attr("class","label")
           .style("fill", "Black")
           .text(y)

         }).on("mouseout", function(d){
           let id2 = d3.select(this).attr("id");
           let id1 = id2.substring(1);
           let id3 = "l"+id2;

           d3.selectAll('line')
           .transition()
           .duration(function(d,i){
             return 2*i;
           })
           .attr("stroke-width", 0.8)
           .attr('fill-opacity', 0.5)
           .attr('stroke-opacity', 0.8)

           svg.select(".label").remove();
         });
      }
    for(var i = 0; i<45; i++){
    svg.append("line")
          .attr('x1', 288)
          .attr('y1', -5 +  CallTypeScale(outputObj.callTypeNum[i]))
          .attr('x2',655)
          .attr('y2', reactionScale(outputObj.reactionTime[i]))
          .attr('transform', 'translate(' + 355 + ',' + 23+')')
          .attr("stroke-width", 0.7)
          .attr('id' ,(d, j)=>"llline"+i)
          .attr('fill-opacity', 0.5)
          .attr('stroke-opacity', 0.8)
          .attr("stroke",function(d){return colorScale(outputObj.unitTypeNum[i])})
          .on('mouseover', function(d){
            let id3 = d3.select(this).attr("id");
            let id2 = id3.substring(1);
            let id1 = id3.substring(2);

            let y = reactionScale.invert(d3.select("#"+id3).attr('y2')).toFixed(2);
            y = y + " minutes";

            svg.append("text")
              .attr('class', 'label1')
              .attr("dy", ".5em")
              .style('font-familly', 'Arial')
              .attr('x', 1050)
              .attr('y',  300)
              .style('font-size', 13)
              .attr("class","label")
              .style("fill", "Black")
              .text(y)

              d3.selectAll('line')
              .attr("stroke-width", 0.8)
              .attr('fill-opacity', 0.5)
              .attr('stroke-opacity', 0.8)

            d3.selectAll("#"+id1)
            .attr("stroke-width", 4)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 2);

            d3.selectAll("#"+id2)
            .attr("stroke-width", 4)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 2);

            d3.selectAll("#"+id3)
            .attr("stroke-width", 4)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 2);

          }).on("mouseout", function(d){
            let id3 = d3.select(this).attr("id");
            let id2 = id3.substring(1);
            let id1 = id3.substring(2);

           d3.selectAll('line')
           .transition()
           .duration(function(d,i){
             return 2*i;
           })
           .attr("stroke-width", 0.8)
           .attr('fill-opacity', 0.5)
           .attr('stroke-opacity', 0.8)

           svg.select(".label").remove();
       });
       }

       svg.append("text")
      .style("text-anchor", "middle")
      .text("Priority")
      .attr('transform', 'translate(' + 14 + ',' + 200 +')' + 'rotate(-90)')
  svg.append("text")
         .style("text-anchor", "middle")
         .text("Unit Type")
         .attr('transform', 'translate(' + 315 + ',' + 200 +')' + 'rotate(-90)')
  svg.append("text")
                .style("text-anchor", "middle")
                .text("Call Type")
                .attr('transform', 'translate(' + 630 + ',' + 200 +')' + 'rotate(-90)')
  svg.append("text")
               .style("text-anchor", "middle")
               .text("Average Response Time (minutes)")
               .attr('transform', 'translate(' + 1040 + ',' + 200 +')' + 'rotate(-90)')

               let labels = ["Alarm", "Medical Incident","Structure Fire", "Traffic Collision"];
for(let i=0; i<4; i++){
  let pos = 30 + i*105;
             svg.append("text")
            .style("text-anchor", "middle")
            .style('font-size', '12')
            .text(labels[i])
            .attr('transform', 'translate(' + 660 + ',' + pos +')' + 'rotate(-90)')
}
let labels2 = ["ENGINE", "TRUCK","CHIEF","PRIVATE", "MEDIC", "SUPPORT", "INVESTIGATION"];
for(let i=0; i<7; i++){
let pos = 30 + i*55;
svg.append("text")
.style("text-anchor", "middle")
.style('font-size', '8')
.text(labels2[i])
.attr('transform', 'translate(' + 340 + ',' + pos +')' + 'rotate(-90)')
}

svg.append("text")
.style("text-anchor", "middle")
.style('font-size', '12')
.text("Unit Types")
.attr('x', 1076)
.attr('y', 25)
.style('font-weight', 'bold')

          for(let j =0; j< 7; j++){
          svg.append("g").append('rect')
          .attr("fill", function(d){
            return colorScale(j+1);
          })
          .attr('width', '10')
          .attr('height','10')
          .attr('x', '1048')
          .attr('y', function(d){
            return (30 + j*13);
          });

svg.append("text")
.text(function(d){
  return labels2[j];
}).style('font-familly', 'Arial')
.style('font-size', 10)
.style("fill", "black")
.attr('x', '1060')
.attr('y', function(d){
return (38 + j*13)
});}

svg.append("g").append('rect')
.attr("fill","white")
.attr('width', '90')
.attr('height', '40')
.attr('x', 1045)
.attr('y',  280)


}
LoadingData();
