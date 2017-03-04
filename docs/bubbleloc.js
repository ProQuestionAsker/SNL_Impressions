

function bubbleChart(){
	// Setting constants for sizing, come back here for mobile adjustments
	var width = 700;
	var height = 700;

	// Variables to be set later (in create_nodes and create_vis)
	var svg = null;
	var bubbles = null;
	var nodes = [];


	// Setting color scheme for bubbles
	var fillColor = d3.scaleOrdinal()
		.domain('Entertainers', "Politicians & Law Professionals", "Other", "Center")
		.range(['#AD83E9', '#4EEA4E', '#28E6FD', '#ffffff'])
	



  				


  	//////////////////////////////////////////////////////////////////////
	///////////////////////////////  CHART ///////////////////////////////
	//////////////////////////////////////////////////////////////////////		
	
	// This function imports and manipulates the raw data to create bubbles	
	function createNodes(rawData) {

		// map() used to convert raw data into node data
		// setting the y value equal to the ranking number
		// allows for the bubbles to be separated into layers
		// within the circle

		var myNodes = rawData.map(function (d){
			return {
				name: d.Character,
				num: +d.id,
				value: +d.appearances,
				radius: +d.r,
				appearances: +d.appearances,
				description: d.Occupation,
				category: d.Category,
				HigherCategory: d.HigherCategory,
				rank: +d.Rank,
				x: +d.x, 
				y: +d.y,
			};
		});

		return myNodes;

	}


	// Now to start chart initialization process

	var chart = function chart(selector, rawData) {
		// convert raw data into nodes data
		nodes = createNodes(rawData);		


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
			.attr('r', 0)
			.attr('fill', function(d) {
				return fillColor(d.HigherCategory);
			})
			.attr('cx', function(d){
				return d.x + 25;
			})
			.attr('cy', function(d){
				return d.y + 25;
			})
			// on click, bubble tooltip becomes "locked"
			// released after mousing over the inner circle or out of outer circle
			.on("click", function(d){
				d3.select(this)
					.classed("lockedBubble", 
				d3.select(this)
					.classed("lockedBubble") ? false : true);
			
				tooltip.style("visibility", "visible")
			})
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
	    /////////////////////////  FRAMING ELEMENTS  /////////////////////////
	    //////////////////////////////////////////////////////////////////////	


	    ///////////////////////////  CENTER CIRCLE  //////////////////////////
		
		// Adding center circle shape (to surround tool tip)
		var centerCircle = svg.append("g")
			.attr("transform", "translate(25, 25)")
		
		// dim all bubbles if coming from pre-dimmed section 
			.on("mouseover", function(d) {
        		if(d3.select(".tooltip").style("visibility") === "hidden"){
            d3.selectAll(".bubble")
            	.classed("unselected", true);    
            }

            d3.selectAll(".bubble")	
            	.classed("lockedBubble", false)
        })

			.on("mouseout", function(d){
				d3.selectAll(".bubble")
					.classed("unselected", false)
					.classed("active", true)
				})
				
		
			

		var drawing = centerCircle.append("path")
			.classed("centerCircle", true)
			.attr("id", "center") //very important to give the path element a unique ID to reference later
			.attr("d", "M474.74,325c0-65.464-42.027-121.08-100.557-141.434c-3.957,23.595-24.463,41.576-49.182,41.576 c-24.721,0-45.229-17.981-49.183-41.576c-58.534,20.354-100.56,75.97-100.56,141.434c0,65.463,42.025,121.081,100.56,141.434 c3.954-23.594,24.462-41.576,49.183-41.576c24.719,0,45.225,17.98,49.182,41.576C432.713,446.078,474.74,390.463,474.74,325z")
			.style("fill", "transparent")
			.style("stroke", "#28E6FD")
			.attr("stroke-opacity", 0)
			.transition()
			.delay(1500)
			.duration(10000)
			.attr("stroke-opacity", 100);



		///////////////////////////  OUTER CIRCLE  //////////////////////////	

		var outerCircle = svg.append("g")
			.on("mouseleave", function(d){
				d3.selectAll(".bubble")	
            	.classed("lockedBubble", false)
			})

		var outerCircleShape = outerCircle.append("circle")
			.classed("outerCircle", true)
			.attr("cx", width/2)
			.attr("cy", width/2)
			.attr("r", 340)
			.attr("fill", "none")
			.attr("stroke", "#28E6FD")
			.attr("stroke-opacity", 0)
			.transition()
			.delay(1500)
			.duration(10000)
			.attr("stroke-opacity", 100);	


		
		//////////////////////////////////////////////////////////////////////
	    //////////////////////////////  BUTTONS  /////////////////////////////
	    //////////////////////////////////////////////////////////////////////
		

		///////////////////////////////  DICE  ///////////////////////////////

		// Putting dice icon and background hover in group

		var diceArea = svg.append("g")
			.classed("diceGroup", true)
			.attr("title", "Random Bubble")

			// dim all bubbles in preparation of random clicking
			.on("mouseover", function(d){
				d3.selectAll(".bubble")
					.classed("selected", false)
					.classed("unselected", true)
			// hide the search bar when the dice is moused over
              	d3.selectAll(".search-input-one")
					.style("display", "none")
				//tooltip.style("visibility", "hidden")		
			})

			// add click function to select random bubble
			.on("click", function(d){
				// reclass anything currently selected as "unclassed"
				// this way, no 2 circles are lit up simultaneously
				d3.select(".selected")
					.classed("selected", false)
				d3.selectAll(".bubble")
					.classed("unselected", true)

				// generate a random number between 1 and 2603
				var randomID = Math.floor(Math.random() * (2603 - 1 + 1) + 1)

				// select any bubbles whose ID number match the random number generated
				var matchingElements = d3.selectAll('.bubble')
    				.filter(function(d) {
        				return +d.num === +randomID
    				})

    			// code above selected an array, this selects nodes
    			var element = d3.select(matchingElements.nodes()[0])	
    			
    			// need to get at the data within the nodes
    			var datum = element.datum()
    				tooltip.html('<span class="name">' +
						datum.name + 
						'</span>' +
						'<span class="impersonations">Impersonations: <span>' +
						datum.value +
						'</span></span>'  +
						'<span class="description">' +
						datum.description +
						'</span>')
    				
    				// re-classify any selected element as "selected"
    				element.classed("selected", true)

              		tooltip.style("visibility", "visible")

              		mousemove()

              		
			})
			// return all bubbles to normal color after mouseout
			.on("mouseout", function(d){
				d3.selectAll(".bubble")
					.classed("unselected", false)
					.classed("active", true)
				})
			
		
		// Adding background element behind dice
		// Allows for easier clicking and pretty hover event
		var behindRandom = diceArea.append("path")
			.classed("behind", true)
			.attr("d", "M399.64,208.28 c-5.069,22.46-25.87,41.86-49.64,41.86c-23.98,0-45.88-18.8-50.77-41.46c15.86-5.7,32.95-8.81,50.77-8.81 C367.4,199.87,384.1,202.83,399.64,208.28z")
			.style("fill", "url(#linear-gradient-dice)");


		// Adding dice icon
		 var iconRandom = diceArea.append("path")
			.attr("d", "M357.094,211.688h-12.5c-2.148,0-3.906,1.758-3.906,3.906v12.5c0,2.148,1.758,3.906,3.906,3.906h12.5 c2.148,0,3.906-1.758,3.906-3.906v-12.5C361,213.445,359.242,211.688,357.094,211.688z M346.156,228.875 c-1.295,0-2.344-1.049-2.344-2.344s1.049-2.344,2.344-2.344s2.344,1.049,2.344,2.344S347.451,228.875,346.156,228.875z M346.156,219.5c-1.295,0-2.344-1.049-2.344-2.344s1.049-2.344,2.344-2.344s2.344,1.049,2.344,2.344S347.451,219.5,346.156,219.5z M350.844,224.188c-1.295,0-2.344-1.049-2.344-2.344s1.049-2.344,2.344-2.344s2.344,1.049,2.344,2.344 S352.139,224.188,350.844,224.188z M355.531,228.875c-1.295,0-2.344-1.049-2.344-2.344s1.049-2.344,2.344-2.344 s2.344,1.049,2.344,2.344S356.826,228.875,355.531,228.875z M355.531,219.5c-1.295,0-2.344-1.049-2.344-2.344 s1.049-2.344,2.344-2.344s2.344,1.049,2.344,2.344S356.826,219.5,355.531,219.5z M356.232,210.125 c-0.364-1.777-1.944-3.125-3.826-3.125h-12.5c-2.148,0-3.906,1.758-3.906,3.906v12.5c0,1.881,1.348,3.462,3.125,3.827v-15.546 c0-0.859,0.703-1.562,1.562-1.562H356.232z") 
			.classed("icon", true)
			.attr("fill-opacity", 0)
			.transition()
			.delay(1800)
			.duration(11000)
			.attr("fill-opacity", 100);



		//////////////////////////////  SEARCH  //////////////////////////////	

		
		// Generating list of names to search by
		/*var bubbleNames = [];
		
		bubbleNames 
			.filter(rawData, function(d,i) {
			return re.test(d.Character)});

  		console.log(bubbleNames)*/









		// Putting magnifying glass icon and background hover in group

		var searchArea = svg.append("g")
			.classed("searchGroup", true)
			.attr("title", "Search for a name")
			// dimming bubbles on hover in preparation for search
			.on("mouseover", function(d){
				d3.selectAll(".bubble")
					.classed("selected", false)
					.classed("unselected", true)
				tooltip.style("visibility", "hidden")	
			})

			.on("click", function(d){
				console.log("clicked")
				
				d3.selectAll(".selected")
					.classed("selected", false)
					.classed("unselected", true)

				d3.selectAll(".search-input-one")
					.style("display", "inline-block");
			})

			// return all bubbles to normal color after mouseout
			.on("mouseout", function(d){
				d3.selectAll(".bubble")
					.classed("unselected", false)
					.classed("active", true)
			})

		// Adding gradient SVG path behind icon
		var behindSearch = searchArea.append("path")
			.classed("behind", true)
			.attr("d", "M399.64,491.73 c-5.069-22.461-25.87-41.861-49.64-41.861c-23.98,0-45.88,18.801-50.77,41.461c15.86,5.699,32.95,8.81,50.77,8.81 C367.4,500.14,384.1,497.18,399.64,491.73z")
			.style("fill", "url(#linear-gradient-search)");


		// Adding button icons
		 var iconSearch = searchArea.append("path")
			.attr("d", "M359.747,488.08l-5.681-4.83c-0.587-0.528-1.215-0.771-1.723-0.748c1.341-1.571,2.151-3.608,2.151-5.835 c0-4.967-4.026-8.992-8.992-8.992c-4.966,0-8.993,4.025-8.993,8.992c0,4.966,4.026,8.992,8.993,8.992 c2.227,0,4.264-0.811,5.835-2.151c-0.023,0.508,0.22,1.136,0.748,1.723l4.83,5.681c0.828,0.919,2.18,0.996,3.003,0.172 C360.743,490.26,360.666,488.908,359.747,488.08z M345.503,482.662c-3.311,0-5.995-2.685-5.995-5.995s2.684-5.994,5.995-5.994 s5.995,2.684,5.995,5.994S348.813,482.662,345.503,482.662z") 
			.classed("icon", true)
			.attr("fill-opacity", 0)
			.transition()
			.delay(1800)
			.duration(11000)
			.attr("fill-opacity", 100);

  		// Adding search button functionality
  		function searchbar(d){
  			// hide tooltip
  			hideTooltip();


  		}



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
var myBubbleChart = bubbleChart();

function display(error, data) {
	if (error) {
		console.log(error);
	}

	myBubbleChart('#vis', data);

 	
}

d3.csv('Data/bubbleLocations.csv', display);


		// setting up triggered scroll events
		/*(function() {

			function graphscroll() {
				// select elements using d3 here since this is a d3 library...
				var graphicEl = d3.select('.graphic')
				var graphicVisEl = graphicEl.select('.graphic__vis')
				var triggerEls = graphicEl.selectAll('.trigger')

				// viewport height
				var viewportHeight = window.innerHeight
				var halfViewportHeight = viewportHeight / 2

				// a global function creates and handles all the vis + updates
				var graphic = myBubbleChart

				

				// this is it, graph-scroll handles pretty much everything
				// it will automatically add class names to the elements,
				// so you just need to handle the fixed positions with css
				d3.graphScroll()
					.container(graphicEl)
					.graph(graphicVisEl)
					.sections(triggerEls)
					.offset(halfViewportHeight)
					.on('active', function(i) {
						graphic.update(i)
					})
			}

			graphscroll()

		})()*/



