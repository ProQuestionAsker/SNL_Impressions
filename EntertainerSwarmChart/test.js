// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;


// Set the ranges
var x = d3.scaleLinear()
    .range([0, width]);
var y = d3.scaleOrdinal()
    .range(function(d){
        return d.Character;
    });

// Define the axes
var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(10);

var yAxis = d3.axisLeft()
    .scale(y);

    
// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("entertainersMatrix.csv", function(error, data) {
    data.forEach(function(d) {
        d.year = +d.year;
        d.count = +d.count;
        d.Character = d.Character;
        d.Category = d.Category;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
 


    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", function(d) {return (d.count)})
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.Character); });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});