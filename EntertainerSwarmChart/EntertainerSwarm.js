/* Creating a function to create a bubbleChart
*
* Organization and style inspired by: https://bost.ocks.org/mike/chart/ and https://github.com/vlandham/bubble_chart_v4
*
*/


function bubbleChart(){
	// Setting constants for sizing, come back here for mobile adjustments
	var width = 1000;
	var height = 400;




	// Setting a forceStrength to be applied to position forces
	var forceStrength = 0.2;

	// Variables to be set later (in create_nodes and create_vis)
	var svg = null;
	var bubbles = null;
	var centerBubble = null;
	var nodes = [];


	// Define charge force to repel bubbles from one another
	var bubbleCharge = function charge(d) {
		// russell: i think i just barely tweaked this, but i forget
    	return -((Math.pow(d.radius, 2)  *  0.09));
    	//return -(radiusScale2(d.appearances) + 1500)
  	}

 	var yearScale = d3.scaleLinear()
		.domain([1970, 2010])
	    .range([200, 800]);


	var radiusScale = d3.scaleSqrt().domain([5, 22]).range([25, 48])

  	var forceX = d3.forceX(function(d) { 
  		return yearScale(d.decade); 
  	}).strength(1.5)

  	var forceY = d3.forceY(height / 2).strength(0.5)
  	var forceYSpecial = d3.forceY(height/2).strength(0.5)

  	var forceCollide = d3.forceCollide(function(d){
  		return d.special ? radiusScale(15) : (radiusScale(+d.count) + 10)
  	})
		.iterations(10);


  	// Create force simulation
  	var simulation = d3.forceSimulation()
    	.force("x", d3.forceX(function(d){
    			return yearScale(d.decade)
    		})
    		.strength(function(d){
    			return d.special ? 4 : forceStrength
    		})

    	)

    	/*.force('x', d3.forceX().strength(function(d) {
    		// russell: total strength on center circle
    		return d.special ? 1.1 : forceStrength
    	}))*/

		.force("y", d3.forceY(height/2).strength(function(d){
			return d.special ? 4 : forceStrength
		}))
		
    	/*.force('y', d3.forceY().strength(function(d) {
    		// russell: total strength on center circle
    		return d.special ? 1.1 : forceStrength
    	}))*/
    	.force("collide", forceCollide)
    	//.force('centerCharge', d3.forceManyBody().strength(centerCharge))
    	.on('tick', ticked)
    	.on('end', endScript);

 



	// Stop the force for now since we don't have nodes yet
	simulation.stop();

	// Setting color scheme for bubbles COME BACK TO THIS!!
	//var fillColor = d3.scaleOrdinal(d3.schemeCategory10);
		
	var fillColor = d3.scaleOrdinal()
		.domain("Acting Entertainer", "Musical Entertainer", "Musical / Acting Entertainer", "News Entertainer", "Reality TV Star", "Athlete / News Entertainer", "Special")
		.range(['#4EEA4E' /* green*/, '#28E6FD', "#EF4041", "#4EEA4E", '#4EEA4E', '#AD83E9' /* purple*/, "#28E6FD" /*blue*/])

	/*var orderScale = d3.scaleOrdinal()
		.domain('Entertainers', "Politicians & Law Professionals", "Other", "special")
		.range([0.75, 0.5, 0.25, 0.5])

	var offsetScale = d3.scaleOrdinal()
		.domain('Entertainers', "Politicians & Law Professionals", "Other", "special")
		.range([-1, 0, 1, 0])*/


	
	// This function imports and manipulates the raw data to create bubbles	
	function createNodes(rawData) {
		// The max number of appearances should be the maximum in this scale
		var maxAmount = d3.max(rawData, function(d){
			return +d.count; 
		});

		// Scale the bubbles' area
		/*var radiusScale = d3.scaleSqrt()
			.domain([1, maxAmount])
			.range([20, 60])*/
			
		
		//var centerCircle = 	

		// map() used to convert raw data into node data
		// setting the y value equal to the ranking number
		// allows for the bubbles to be separated into layers
		// within the circle

		var myNodes = rawData.map(function (d){
			return {
				name: d.Character,
				value: +d.count,
				count: +d.count,
				id: d.id,
				radius: radiusScale(+d.count),
				decade: +d.decade,
				description: d.Occupation,
				category: d.Category,
				HigherCategory: d.HigherCategory,
				x: Math.random() * width, // russell: scatter randomly long x axis
				// y: +d.Rank * 20,
				y: Math.random() * height, // russell: start position in there groups
			};
		});

		// russell: add special center node to data
		/*myNodes.push({
			x: width/2,
			y: height/2,
			radius: width * 0.14,
			special: true,
			HigherCategory: "special",
		})*/

		//Add a few more "circles" to the data that will make room for the decade numbers
		var decades = [1970, 1980, 1990, 2000, 2010];
		var xLocs = [200, 300, 400, 500, 600]
		for(var i=0; i<decades.length; i++) {
			myNodes.push({
				decade: decades[i],
				special: true,
				fixed: true,
				cx: yearScale(decades[i]),
				cy: height/2,
				radius: 30, 
				Category: 'special',
				label: decades[i] + "s"
			});
		}//for i



		// sort the nodes to prevent hiding of smaller ones
		//myNodes.sort(function (a,b) {return b.value - a.value; });
		//myNodes.sort(function(a){
    	//	return a.HigherCategory;
		//})
		
		//myNodes = myNodes.append("circle").attr("fill", "000000").attr("r", 80).merge(myNodes);


		return myNodes;

	}




	// Now to start chart initialization process

	var chart = function chart(selector, rawData) {
		// convert raw data into nodes data
		nodes = createNodes(rawData);


/////////////LEFT OFF HERE//////////////////////////////
		/*
		nodes = nodes.enter()
			.append("circle")
			.attr("fill", "000000")
			.attr("r", 80).merge(nodes);*/

////////////////////////////////////////////////////////			

		// create SVG element inside selector with desired size
		svg = d3.select(selector)
			.append('svg')
			.attr('width', width)
			.attr('height', height);

		// creating a large circle in the middle
		/*var circle = svg.append("circle")
            .attr("cx", width/2)
            .attr("cy", height/2)
            .attr("r", 80)*/

     


    
      


	


		// Bind nodes data to what will become DOM elements
		bubbles = svg.selectAll('circle.node')
			.data(nodes)
			.attr("r", function(d){
        		return d.radius
    			});


		var defs = svg.append("defs")

		defs.append("pattern")
			.attr("id", "Al-Sharpton")
			.attr("height", "100%")
			.attr("width", "100%")	
			.attr("patternContentUnits", "objectBoundingBox")
			.append("image")
			.attr("height", 1)
			.attr("width", 1)
			.attr("preserveAspectRatio", "none")
			.attr("xlink:href", "EntertainerPhotos/Al-Sharpton.jpg")


		defs.selectAll(".entertainer-pattern")
			.data(rawData)
			.enter().append("pattern")
			.attr("class", "entertainer-pattern")
			.attr("id", function(d){
				return d.id
			})
			.attr("height", "100%")
			.attr("width", "100%")	
			.attr("patternContentUnits", "objectBoundingBox")
			.append("image")
			.attr("height", 1)
			.attr("width", 1)
			.attr("preserveAspectRatio", "none")
			.attr("xlink:href", function(d) {
			   		return "EntertainerPhotos/" + d.id + ".jpg"})	




		// Create new circles with class 'bubble', radius = 0
		var bubblesE = bubbles.enter().append('circle')
			.classed('bubble', true)
			.classed('is-special', function(d) { return d.special })
			.classed('is-fixed', function(d) { return d.fixed })
			.attr('r', 0)
			.attr('fill', function(d){
				return "url(#" + d.id + ")"
			})
			.attr('stroke', function(d) {
				return d3.rgb(fillColor(d.category));
			})
			.attr('stroke-width', 3)
			.attr('x2', function(d){
				return +d.decade;
			})
			.attr('y2', function(d){
				return height/2;
			})







			/*.style("background-image",function(d) {
			   		return "url(#EntertainerPhotos/" + d.id + ".jpg)";
				});*/

		/*	var translate = {
			x : width/2,
			y : height/2
		}

		


		centerCircle = nodes[0];
 		centerCircle.radius = 0;
 		centerCircle.fixed = true;
 		centerCircle.charge = centerCharge;*/



   /*var translate = {
			x : width/2,
			y : height/2
		}

		g0 = svg.append("g")
			.attr("transform", "translate("+translate.x+", "+translate.y+")");
		g = svg.append("g")
			.attr("transform", "translate("+translate.x+", "+translate.y+")");

		c = g.append("circle")
			.attr("r", 80)
      		// .attr("fill", "#FFD05B");
      		.attr("class", "center")
      		.attr("fill", "#F8CA00");

      	var center = c
      		/* .attr("fill", "#FF8C2E"); */ 

		// trying to create a circle to repel rest
		/*g0 = svg.append("g")
			.attr("transform", "translate("+translate.x+", "+translate.y+")");
		g = svg.append("g")
			.attr("transform", "translate("+translate.x+", "+translate.y+")");

		c = g.append("circle")
			
			.attr("r", 80)
      // .attr("fill", "#FFD05B");
      		.attr("fill", "#F8CA00");
      /* .attr("fill", "#FF8C2E"); */	

      	// Create the axis
      	
      	var decadeLabels = ["1970s", "1980s", "1990s", "2000s", "2010s"];

      	svg.append("g")
	      .attr("class", "axis axis--x")
	      .attr("transform", "translate(0," + (height/2) + ")")
	      .call(d3.axisBottom(yearScale)
	      	.ticks(5, ".0f")
	      	.tickFormat(function(d, i){
    			return decadeLabels[i] //"Year1 Year2, etc depending on the tick value - 0,1,2,3,4"
			}));
		  
		svg.selectAll(".axis text")
		  .attr("dy", "-0em")
		  .attr("fill", "#fff");


		//	Merge the original empty selection and the enter selection
		bubbles = bubbles.merge(bubblesE);


		

		// Fancy transition to make bubbles appear and grow to correct radius
		bubbles
			// .transition()
			// .duration(2000)
			.attr('r', function(d){
				return d.radius;
			});

	
		// Set the simulation's nodes to our newly created nodes array	
		// Simulation will start running after nodes are set
		simulation.nodes(nodes);
		
		


		// Set initial layout to group
		// groupBubbles();
		// russell: no need to groupBubbles, there init positions are set already
		simulation.alpha(1).restart();



	};


	// Callback function called after ever tick of the force sim
	function ticked() {
		
		bubbles
			.attr('cx', function (d) {
				return d.x;
			})
			.attr('cy', function(d){
				return d.y;
			})	

	}

	function endScript() {
		bubbles
			.attr('cx', function (d) {
				console.log(d.name + ',' + d.x + ',' + d.y + ',' + d.radius);
				return d.x;
			})
		
	}

	





	/*// Forcing bubbles to center (change here if decide to split)
	function groupBubbles() {

		// Reset x force to draw bubbles to the center
		simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

		// Reset the alpha value and restart the simulation
		simulation.alpha(1).restart();
	}*/

//////////////////////////////////////////////////////////////////////
/////////////////////////// TOOL TIPS ////////////////////////////////
//////////////////////////////////////////////////////////////////////	

	// Defining parameters for Tooltips
	function floatingTooltip(tooltipId, width) {
  
  	// Local variable to hold tooltip div for
  	// manipulation in other functions.
  
 
  	var tt = d3.select('body')
    	.append('div')
    	.attr('class', 'tooltip')
    	.attr('id', tooltipId)
    	.style('pointer-events', 'none');

  	// Set a width if it is provided.
  	if (width) {
    	tt.style('width', width);
  	}

  	// Initially it is hidden.
  	hideTooltip();

  	// Display tooltip
  	function showTooltip(content, event) {
    	tt.style('opacity', 0.8)
      	.html(content)
      	//tt.style("font-family", "Whitney SSm A", "Whitney SSm B")
    	.style("text-anchor", "middle")

    	updatePosition(event);
  	}

  	// hide tooltip div
  	function hideTooltip() {
    	tt.style('opacity', 0.0);
  	}

  
  	// figure out tooltip location
  	function updatePosition(event) {
    	var xOffset = 20;
    	var yOffset = 10;

    	var ttw = tt.style('width');
    	var tth = tt.style('height');

    	var wscrY = window.scrollY;
    	var wscrX = window.scrollX;

    	var curX = (document.all) ? event.clientX + wscrX : event.pageX;
    	var curY = (document.all) ? event.clientY + wscrY : event.pageY;
    	var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?
                 curX - ttw - xOffset * 2 : curX + xOffset;

    	if (ttleft < wscrX + xOffset) {
      		ttleft = wscrX + xOffset;
    	}

    	var tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?
                curY - tth - yOffset * 2 : curY + yOffset;

    	if (tttop < wscrY + yOffset) {
      		tttop = curY + yOffset;
    	}

    	tt
      		.style('top', tttop + 'px')
      		.style('left', ttleft + 'px');
  	}

  		return {
    		showTooltip: showTooltip,
    		hideTooltip: hideTooltip,
    		updatePosition: updatePosition
  		};
	}





	// Adding mouseover function tooltip
	function showDetail(d) {
		d3.select(this).attr('stroke', d3.rgb(fillColor(d.HigherCategory)).darker());
	
		var content = '<span class="value"><b>' +
						d.name + 
						'</span><br/><br/></b>' +
						'<i><span class="value">' + 
						d.category +
						'</span></br></br></i>' +
						'<span class ="name">Impersonations: </span> <span class ="value">' +
						d.value +
						'</span> <br/><br/>' +
						'<span class="value">' +
						d.description +
						'</span>';
	
		tooltip.showTooltip(content, d3.event);				
	}

	// Hiding tooltip
	function hideDetail(d) {
		// reset outline
		d3.select(this)
			.attr('stroke', 0);

		tooltip.hideTooltip();	
	}









	// return chart function from closure
	return chart;
}	


// Calling and displaying bubble chart with correct data file!
var myBubbleChart = bubbleChart();

function display(error, data) {
	if (error) {
		console.log(error);
	}

	myBubbleChart('#vis', data);
}

d3.csv('entertainers.csv', display);



