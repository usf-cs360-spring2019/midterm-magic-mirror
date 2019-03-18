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
      case "ReactionTimeInterval":
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
                  .domain([0, d3.max(outputObj.reactionTime)])
                  .range([plotHeight, 0])
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
   xAxis1.tickValues(['1', '2', '3', '4', '5', '6', '7']);
   xAxis2.tickValues(['1', '2', '3', '4']);

    // xAxis1.tickFormat([function(d){
    //   switch (d) {
    //   case 1:
    //       return "Engine";
    //       break;
    //   case 2:
    //     return "Truck"
    //         break;
    //   case 3:
    //     return "Chief"
    //     break;
    //   case 4:
    //     return "Private"
    //     break;
    // case 5:
    //   return "Medic"
    // case 6:
    // return "Support"
    // case 7:
    //   return "Investigation"
    //   break;
    //     default:
    //   }
    // }]);


    if (plot.select("g#x-axis1").size() < 1) {
    let xGroup = plot.append("g").attr("id", "x-axis1");
        xGroup.call(xAxis);
    xGroup.attr("transform", "translate(0," + plotHeight + ")"+ 'rotate(270)')
    let xGroup1 = plot.append("g").attr('id', 'x-axis1').attr('transform', 'translate(' + 280 + ','+ 0 +')' + 'rotate(90, 0, 2)')
    xGroup1.call(xAxis1);

    let xGroup2 = plot.append("g").attr('id', 'x-axis2').attr('transform', 'translate(' + 604 + ','+ 0 +')' + 'rotate(90, 0, 2)')
    xGroup2.call(xAxis2);

    let xGroup3 = plot.append("g").attr('id', 'x-axis2').attr('transform', 'translate(' + 968 + ','+ 2 +')' + 'rotate(90, 0, 2)')
    xGroup3.call(xAxis3);



  }
  else {
    plot.select("g#y-axis2").call(yAxis);
}
var colorScale = d3.scaleOrdinal()
    .domain(1, 7)
    .range(["#69bf8b", "#aebf69", "#d9d11b","#FAD23C" , "#bf6969", "#800000", "black"]);

for(var i = 0; i<47; i++){
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

         d3.select("#"+id)
        .attr("stroke-width", 4)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 2);
        svg.style('background', '#whitesmoke')

        d3.select("#"+id2)
       .attr("stroke-width", 4)
       .attr('fill-opacity', 1)
       .attr('stroke-opacity', 2);

       d3.select("#"+id3)
      .attr("stroke-width", 4)
      .attr('fill-opacity', 1)
      .attr('stroke-opacity', 2);
      svg.style('background', '#whitesmoke')

      svg.append("text")
        .attr('class', 'label1')
        .attr("dy", ".5em")
        .style('font-familly', 'Arial')
        .attr('x', 990)
        .attr('y',  d3.select(this).attr('y2'))
        .style('font-size', 27)
        .attr("class","label")
        .style("fill", "Black")
        .text(d3.select("#"+id3).attr('y2'))


      }).on("mouseout", function(d){
        let id = d3.select(this).attr("id");
        let id2 ="l"+id;
        let id3 ="ll"+id;
        d3.select("#"+id)
        .attr("stroke-width", 0.8)
        .attr('fill-opacity', 0.5)
        .attr('stroke-opacity', 0.8)
        svg.style('background', 'whitesmoke')

        d3.select("#"+id2)
        .attr("stroke-width", 0.8)
        .attr('fill-opacity', 0.5)
        .attr('stroke-opacity', 0.8)
        svg.style('background', 'whitesmoke')

        d3.select("#"+id3)
        .attr("stroke-width", 0.8)
        .attr('fill-opacity', 0.5)
        .attr('stroke-opacity', 0.8)
        svg.style('background', 'whitesmoke')
        svg.select(".label").remove();
   });
 }

   for(var i = 0; i<47; i++){
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
            d3.select("#"+id1)
           .attr("stroke-width", 4)
           .attr('fill-opacity', 1)
           .attr('stroke-opacity', 2)
           .attr("stdDeviation","3.5")
           .attr("result","coloredBlur")
           svg.style('background', '#whitesmoke')

           d3.select("#"+id2)
          .attr("stroke-width", 4)
          .attr('fill-opacity', 1)
          .attr('stroke-opacity', 2);
          svg.style('background', '#whitesmoke')

          d3.select("#"+id3)
         .attr("stroke-width", 4)
         .attr('fill-opacity', 1)
         .attr('stroke-opacity', 2);
         svg.style('background', '#whitesmoke')

         svg.append("text")
           .attr('class', 'label1')
           .attr("dy", ".5em")
           .style('font-familly', 'Arial')
           .attr('x', 990)
           .attr('y',  d3.select(this).attr('y2'))
           .style('font-size', 27)
           .attr("class","label")
           .style("fill", "Black")
           .text(d3.select("#"+id3).attr('y2').substring(0, 8))

         }).on("mouseout", function(d){
           let id2 = d3.select(this).attr("id");
           let id1 = id2.substring(1);
           let id3 = "l"+id2;
            d3.selectAll("#"+id1)
           .attr("stroke-width", 0.8)
           .attr('fill-opacity', 0.5)
           .attr('stroke-opacity', 0.8)
           svg.style('background', 'whitesmoke')

           d3.selectAll("#"+id2)
          .attr("stroke-width", 0.8)
          .attr('fill-opacity', 0.5)
          .attr('stroke-opacity', 0.8)
          svg.style('background', 'whitesmoke')

          d3.selectAll("#"+id3)
         .attr("stroke-width", 0.8)
         .attr('fill-opacity', 0.5)
         .attr('stroke-opacity', 0.8)
         svg.style('background', 'whitesmoke')
         svg.select(".label").remove();


      });
      }
    for(var i = 0; i<47; i++){
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

            let y = d3.select(this).attr('y2');


            svg.append("text")
              .attr('class', 'label1')
              .attr("dy", ".5em")
              .style('font-familly', 'Arial')
              .attr('x', 990)
              .attr('y',  d3.select(this).attr('y2'))
              .style('font-size', 27)
              .attr("class","label")
              .style("fill", "Black")
              .text(y)

            d3.selectAll("#"+id1)
            .attr("stroke-width", 4)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 2);
            svg.style('background', 'whitesmoke')

            d3.selectAll("#"+id2)
            .attr("stroke-width", 4)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 2);
            svg.style('background', 'whitesmoke')

            d3.selectAll("#"+id3)
            .attr("stroke-width", 4)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 2);
            svg.style('background', 'whitesmoke')

          }).on("mouseout", function(d){
            let id3 = d3.select(this).attr("id");
            let id2 = id3.substring(1);
            let id1 = id3.substring(2);

             d3.selectAll("#"+id1)
            .attr("stroke-width", 0.8)
            .attr('fill-opacity', 0.5)
            .attr('stroke-opacity', 0.8)
            svg.style('background', 'whitesmoke')


             d3.selectAll("#"+id2)
            .attr("stroke-width", 0.8)
            .attr('fill-opacity', 0.5)
            .attr('stroke-opacity', 0.8)
            svg.style('background', 'whitesmoke')

            d3.selectAll("#"+id3)
           .attr("stroke-width", 0.8)
           .attr('fill-opacity', 0.5)
           .attr('stroke-opacity', 0.8)
           svg.style('background', 'whitesmoke')
           svg.select(".label").remove();
       });
       }

       svg.append("text")
      .style("text-anchor", "middle")
      .text("Priority")
      .attr('transform', 'translate(' + 14 + ',' + 200 +')' + 'rotate(-90)')
  svg.append("text")
         .style("text-anchor", "middle")
         .text("Group Type")
         .attr('transform', 'translate(' + 340 + ',' + 200 +')' + 'rotate(-90)')
  svg.append("text")
                .style("text-anchor", "middle")
                .text("Call Type")
                .attr('transform', 'translate(' + 660 + ',' + 200 +')' + 'rotate(-90)')
  svg.append("text")
               .style("text-anchor", "middle")
               .text("LOG2 Reaction Time")
               .attr('transform', 'translate(' + 1040 + ',' + 200 +')' + 'rotate(-90)')

               for(let j =0; j< 7; j++){
          svg.append("g").append('rect')
          .attr("fill", function(d){
            if(j*9 < 47){
            return colorScale(outputObj.unitTypeNum[j*9])
          }
          else{
            return colorScale(7)
          }})
          .attr('width', '10')
          .attr('height', '10')
          .attr('x', '1048')
          .attr('y', function(d){
            return (30 + j*13);
          });
          svg.append("text")
.text(function(d){
  if(j*9 < 47){
  return outputObj.unitType[j*9]
}
else{
  return "INVESTIGATION"
}}).style('font-familly', 'Arial')
.style('font-size', 10)
.style("fill", "black")
.attr('x', '1060')
.attr('y', function(d){
return (38 + j*13)
});}

// svg.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + plotHeight + ")")
//     .call(xAxis1)
//   .selectAll("text")
//     .attr("y", 0)
//     .attr("x", 9)
//     .attr("dy", ".35em")
//     .attr("transform", "rotate(-90)")
//     .style("text-anchor", "start");


}
LoadingData();
