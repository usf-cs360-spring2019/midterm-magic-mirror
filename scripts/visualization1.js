let output = {
  CallType:[],
  NumRecords:[],
};
var LoadingData = function(){
convertRow = function(row, index){
  let out = {};
  for (let col in row){
    switch (col) {
      case "CallType":
      output.CallType.push(row[col]);
      break;
      case "NumRecords":
      out[col] = +(row[col]);
      output.NumRecords.push((out[col]));
      break;
    }
  }
  return out;
}
d3.csv("..\\..\\input\\visualization1\\pie-chart-calltypes.csv", convertRow)
.then(() => {
DrawBarChart();
});
}
DrawBarChart = function(){
let margin = {
  top:    15,
  right:  35,
  bottom: 30,
  left:   40
};
let svg = d3.select("body").select("section.section").select("div").select("svg");

let bounds = svg.node().getBoundingClientRect();
let plotWidth = bounds.width - margin.right - margin.left;
let plotHeight = bounds.height - margin.top - margin.bottom;
let radius = plotWidth/2;


var arc = d3.arc()
    .outerRadius(radius - 370)
    .innerRadius(0)

var labelArc = d3.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 50)


let g1 =  svg.attr("width", plotWidth)
    .attr("height", plotHeight)
    .append("g")
    .attr('transform', 'translate(' + plotWidth/2  + ',' + plotHeight/2 + ')');

var arcData = d3.pie().sort(null).value(function(d){
  return d;
})(output.NumRecords);


var colorScale = d3.scaleOrdinal()
    .domain(0, arcData)
    .range(["#4E79A7","#F28E2B", "#A0CBE8", "#FABFD2", "#FFBE7D", "#D7B5A6", "#8CD17D", "#B6992D", "#F1CE63", "#499894", "#86BCB6", "#59A14F", "#FF9D9A", "#79706E","#BAB0AC","#D37295","#E15759","#4E79A7","#D4A6C8","#9D7660", "#D7B5A6", "#4E79A7"]);
names = output.CallType;


          g1.selectAll("path")
          .data(arcData)
          .enter()
          .append('g')
          .attr('class', 'label1')
          .append("path")
          .attr('d', arc)
          .attr("fill", function(d, i){return colorScale(i)} )
          .attr("stroke", "black")
          .attr("stroke-width", 0.1)
          .on("mouseover", function(d, i) {
          svg.append("text")
            .attr("dy", ".5em")
            .style('font-familly', 'Arial')
            .attr('x', 180)
            .attr('y', 150)
            .attr('font-size', 14)
            .attr("class","label")
            .style("fill", "Black")
            .text(output.CallType[i] + " " + output.NumRecords[i]);
      })
      .on("mouseout", function(d) {
        svg.select(".label").remove();
      })



         g1.selectAll('.label1').append("text")
         .attr("transform", function(d, i) {
     var d = arc.centroid(d);
     d[0] *= 1.4;	//multiply by a constant factor
     d[1] *= 1.4;	//multiply by a constant factor
     return "translate(" + d + ")";
   })
            .attr('text-anchor', 'middle')
            .style('font-familly', 'Arial')
            .style('font-size', 14)
            .style("fill", "black")
            .text(function(d, i){if (Math.floor((output.NumRecords[i]/(25271))*100) > 1){
              return Math.floor((output.NumRecords[i]/(25271))*100) + "%";
            } else{
              return;
            }});
function handleMouseOver(d, i) {
               d3.select(this).attr({
                 fill: "black",
                 radius: radius * 2
               });
             }
let g2 = svg.append('svg').append('g');
g2.append("text")
.text("Incident Category")
.attr('x', '818')
.attr('y', '15')
.attr('font-size', 16)
.attr('font-weight', 'bold')

for(let j =0; j< 22; j++){
g2.append("g").append('rect')
.attr("fill", function(d){return colorScale(j)} )
.attr('width', '10')
.attr('height', '10')
.attr('x', '818')
.attr('y', function(d){
  return (20 + j*14);
});
g2.append("text")
.text(function(d){
  return output.CallType[j];
}).style('font-familly', 'Arial')
.style('font-size', 14)
.style("fill", "black")
.attr('x', '830')
.attr('y', function(d){
  return (29 + j*14)
});
}

}
LoadingData();
