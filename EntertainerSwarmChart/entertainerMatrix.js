

function bubbleMatrix(){
	// Setting constants for sizing, come back here for mobile adjustments
	var width = 1000;
	var height = 800;

	// Variables to be set later (in create_nodes and create_vis)
	var svg = null;
	var bubbles = null;
	var nodes = [];


	// Setting color scheme for bubbles
	var fillColor = d3.scaleOrdinal()
		.domain("Acting Entertainer", "Musical Entertainer", "Musical / Acting Entertainer", "News Entertainer", "Reality TV Star", "Athlete / News Entertainer", "Special")
		.range(['#4EEA4E' /* green*/, '#28E6FD', "#EF4041", "#4EEA4E", '#4EEA4E', '#AD83E9' /* purple*/, "#28E6FD" /*blue*/])
	



  				


  	//////////////////////////////////////////////////////////////////////
	///////////////////////////////  CHART ///////////////////////////////
	//////////////////////////////////////////////////////////////////////		
	
	// This function imports and manipulates the raw data to create bubbles	
	function createNodes(rawData) {

		// map() used to convert raw data into node data
		// setting the y value equal to the ranking number
		// allows for the bubbles to be separated into layers
		// within the circle

		// The max number of appearances should be the maximum in this scale
		var maxAmount = d3.max(rawData, function(d){
			return +d.count; 
		});


		var radiusScale = d3.scaleSqrt()
			.domain([1, maxAmount])
			.range([width * 0.0033, width * 0.025])

		var yScale = d3.scaleOrdinal()
    		.domain(rawData.map(function(d) { return d.Character; }))


		

		var myNodes = rawData.map(function (d){
			return {
				name: d.Character,
				value: +d.count,
				radius: radiusScale(+d.count),
				category: d.Category,
				year: +d.year,
				x: +d.year, 
				y: yScale(+d.Character)
			};	
		});

		return myNodes;

	}


	// Now to start chart initialization process

	var chart = function chart(selector, rawData) {
		// convert raw data into nodes data
		nodes = createNodes(rawData);	

	var y = d3.scaleBand()
    		.rangeRound([0, width], .1);		


		// create SVG element inside selector with desired size
		svg = d3.select(selector)
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr('id', "chart")
			.attr("viewBox", "0 0 " + width + " " + height);


		//////////////////////////////////////////////////////////////////////
		/////////////////////////////  TOOL TIPS /////////////////////////////
		//////////////////////////////////////////////////////////////////////	
	
		// Setting up variable for tooltip
	  	var tooltip = d3.select("#vis")
    		.append("div")
    		.style("visibility", "hidden")
    		.classed("tooltip", true)
    	

    	// Tool tip mousemove functions
		var mousemove = function() {
          	return tooltip;
      	}	 

      	// to hide tooltip when search or random is displayed
      	function hideTooltip() {
    		tooltip.style('opacity', 0);
  		}	



		//////////////////////////////////////////////////////////////////////
	    /////////////////////////////  BUBBLES  //////////////////////////////
	    //////////////////////////////////////////////////////////////////////	


		// Bind nodes data to what will become DOM elements
		bubbles = svg.selectAll('circle.node')
			.data(nodes)
			/*.attr("r", function(d){
        		return d.radius
    			});*/


		// Create new circles with class 'bubble', radius = 0
		var bubblesE = bubbles.enter().append('circle')
			.classed('bubble', true)
			.attr('r', function(d){
				console.log(d)
				return d.radius;
			})
			.attr('fill', function(d) {
				return fillColor(d.Category);
			})
			.attr('cx', function(d){
				return d.x;
			})
			.attr('cy', function(d){
				return yScale(d.Character);
			})
			// on click, bubble tooltip becomes "locked"
			// released after mousing over the inner circle or out of outer circle
			
			.on("mouseover", function(d) {
			   	if(d3.selectAll(".lockedBubble").empty()){
				d3.selectAll("bubble")	
					.classed("active", true)	
              	tooltip.html('<span class="name">' +
						d.name + 
						'</span>' +
						'<span class="impersonations">Impersonations: <span>' +
						d.value +
						'</span></span>'  +
						'<span class="description">' +
						d.description +
						'</span>');
              tooltip.style("visibility", "visible")
              mousemove();
              d3.selectAll(".search-input-one")
					.style("display", "none") }
      		})

      		/////// Add: click feature to "lock" tooltip
      		//// mouseover center circle to unlock
      		//// mouseout outer circle to unlock



		//	Merge the original empty selection and the enter selection
		bubbles = bubbles.merge(bubblesE);


		// Fancy transition to make bubbles appear and grow to correct radius
		bubbles
			.transition()
			/*.duration(function(d){
				return Math.random() * 2000
			})*/
			.duration(2000)
			.attr('r', function(d){
				return d.radius;
			});





		//////////////////////////////////////////////////////////////////////
	    ////////////////////////////  RESPONSIVE  ////////////////////////////
	    //////////////////////////////////////////////////////////////////////	

		// make chart responsive
		d3.select("#vis")
   			.append("div")
   			.classed("svg-container", true) //container class to make it responsive
   			.append("svg")

   		//responsive SVG needs these 2 attributes and no width and height attr
   			.attr("preserveAspectRatio", "xMinYMin meet")
   			.attr("viewBox", function(d){
   				"0 0 700 700";
   			})

   		//class to make it responsive
   			.classed("svg-content-responsive", true);	


	

		

	    //////////////////////////////////////////////////////////////////////
	    /////////////////////////  GLOW & GRADIENTS  /////////////////////////
	    //////////////////////////////////////////////////////////////////////	


		/////////////////////////////  GRADIENTS  ////////////////////////////	

		/* Adding gradients to behind button elements (code via Nadieh Bremer 
			http://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html)*/

		//Append a defs (for definition) element to your SVG
		var defs = svg.append("defs");

		//Append a linearGradient element to the defs and give it a unique id
		// Creating a linear gradient for behind dice
		var linearGradient = defs.append("linearGradient")
    		.attr("id", "linear-gradient-dice")	
    		.attr("x1", "0%")
    		.attr("y1", "100%")
    		.attr("x2", "0%")
    		.attr("y2", "0%");

    	linearGradient.append("stop") 
    		.attr("offset", "0%")   
    		.attr("stop-color", "#28E6FD")
    		.attr("stop-opacity", .15);	

    	linearGradient.append("stop") 
    		.attr("offset", "100%")   
    		.attr("stop-color", "#ffffff")
    		.attr("stop-opacity", 0);	

    	// Need opposite linear gradient for behind search
    	var linearGradient = defs.append("linearGradient")
    		.attr("id", "linear-gradient-search")	
    		.attr("x1", "0%")
    		.attr("y1", "0%")
    		.attr("x2", "0%")
    		.attr("y2", "100%");

    	linearGradient.append("stop") 
    		.attr("offset", "0%")   
    		.attr("stop-color", "#28E6FD")
    		.attr("stop-opacity", .15);	

    	linearGradient.append("stop") 
    		.attr("offset", "100%")   
    		.attr("stop-color", "#ffffff")
    		.attr("stop-opacity", 0);		



    	///////////////////////////////  GLOW  //////////////////////////////		

    	/* Making it glow with code from Nadieh Bremer 
    	http://www.visualcinnamon.com/2016/06/glow-filter-d3-visualization.html*/
		
		//Container for the gradients
		var defs = svg.append("defs");

		//Filter for the outside glow
		//////// Low Glow Level ////////
		var filter = defs.append("filter")
			.attr("id","glowLow");

		filter.append("feGaussianBlur")
			.attr("stdDeviation","1")
			.attr("result","coloredBlur");

		var feMerge = filter.append("feMerge");

		feMerge.append("feMergeNode")
			.attr("in","coloredBlur");

		feMerge.append("feMergeNode")
			.attr("in","SourceGraphic");

		//Filter for the outside glow
		//////// High Glow Level ////////
		var filter = defs.append("filter")
			.attr("id","glowHigh");

		filter.append("feGaussianBlur")
			.attr("stdDeviation","7")
			.attr("result","coloredBlur");

		var feMerge = filter.append("feMerge");

		feMerge.append("feMergeNode")
			.attr("in","coloredBlur");

		feMerge.append("feMergeNode")
			.attr("in","SourceGraphic");	



		// Adding glow to inner and outer circles
		d3.selectAll(".centerCircle")
			.style("filter", "url(#glowHigh)");	
		
		d3.selectAll(".outerCircle")
			.style("filter", "url(#glowHigh)");	

		// Glow on hover added in CSS
		



	    //////////////////////////////////////////////////////////////////////
	    ///////////////////////////  SCROLL EVENTS  //////////////////////////
	    //////////////////////////////////////////////////////////////////////

	 	var graphicEl = d3.select('.graphic')
	 	var graphicVisEl = graphicEl.select('.graphic__vis')
	 	var graphicProseEl = graphicEl.select('.graphic__prose')

	 	var steps = [
	 		function step0(){
	 			// try changing circles white
	 			var t = d3.transition()
	 				.duration(800)
	 				.ease(d3.easeQuadInOut)

	 			var item = graphicVisEl.selectAll('.item')
	 			console.log(item)
	 			
	 			item.transition(t)
	 				.style("fill", "ffffff")	
	 		}
	 	]

	 	// update chart
	 	function update(step) {
			steps[step].call()
		}




	};

   

	// return chart function from closure
	return chart;



}	


// Calling and displaying bubble chart with correct data file!
var myBubbleMatrix = bubbleMatrix();

function display(error, data) {
	if (error) {
		console.log(error);
	}

	myBubbleMatrix('#vis', data);

 	
}

d3.csv('entertainerMatrix.csv', display);
