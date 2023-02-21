
// Constants for frame dimensions and the frame
const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 400; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Constants for vis dimensions
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

// Frame for Scatter
const FRAME1 = d3.select("#vis1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// Display Scatter
function displayScatter() {
  // Read data and create plot
  d3.csv("data/scatter-data.csv").then((data) => {

    // check for our data
    console.log(data);
    
    // Find max values
    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });

    // Define scale functions that maps our x data values 
    // (domain) to pixel values (range)
    const X_SCALE = d3.scaleLinear() 
                      .domain([0, (MAX_X + 1)]) // add some padding  
                      .range([0, VIS_WIDTH]); 

    // Define scale functions that maps our y data values 
    // (domain) to pixel values (range)
    const Y_SCALE = d3.scaleLinear() 
                      .domain([0, (MAX_Y + 1)]) // add some padding  
                      .range([VIS_HEIGHT, 0]); 

    // Use X_SCALE and Y_SCALE to plot our points and create value, circles
    let circles = FRAME1.selectAll("points") 
        .data(data)
        .enter()  
        .append("circle")
          .attr("class", "point")
          .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); })
          .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.bottom); })
          .attr("r", 10)
          .attr("name", (d) => { return "(" + d.x + "," + d.y + ")" });

    // Add x axis to vis
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE).ticks(10)) 
            .attr("font-size", '20px'); 

    // Add y axis to vis
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.bottom + 
                "," + (MARGINS.top) + ")") 
          .call(d3.axisLeft(Y_SCALE).ticks(10)) 
            .attr("font-size", '20px'); 

    // Add a function that adds and removes borders to points with a conditional operator and displays last point
    circles.on("click", function(d) {
      console.log("new point was clicked");

      // Retrieves point name
      let point = d3.select(this).attr('name');

      // Display the last coordinate, have to convert vals to 1-10 scale
      let newText = "Last point clicked: " + point;

      // select the element
      let lastPoint = document.getElementById("last-point");

      // update the displayed text
      lastPoint.innerHTML = newText;

      // Use a conditional statement for adding and removing border on click
      d3.select(this)
        .attr("class") == "addborder" ? d3.select(this).attr("class", "removeborder") : d3.select(this).attr("class", "addborder");
    })

    function addPointClick() { 
      // get dropdowns by ID
      let xDrop = document.getElementById("xDropdown");
      let yDrop = document.getElementById("yDropdown");
    
      // get text from dropdown selection
      let x = xDrop.options[xDrop.selectedIndex].text;
      let y = yDrop.options[yDrop.selectedIndex].text;
      
      const svg = d3.select("svg");
      svg.selectAll("circle");

      // Create new array of data
      const data2 = [
        Array.from(data),
        { x: parseInt(x), y: parseInt(y)},
      ];

      // Use X_SCALE and Y_SCALE to plot our points and create value, circles
      let circles = FRAME1.selectAll("points") 
      .data(data2)
      .enter()  
      .append("circle")
        .attr("class", "point")
        .attr("cx", (X_SCALE(x) + MARGINS.left) )
        .attr("cy", (Y_SCALE(y) + MARGINS.bottom) )
        .attr("r", 10);

      // Add a function that adds and removes borders to points with a conditional operator and displays last point
      circles.on("click", function(d) {
        console.log("new point was clicked");

        // Display the last coordinate, have to convert vals to 1-10 scale
        let newText = "Last point clicked: (" + x + "," + y + ")";

        // select the element
        let lastPoint = document.getElementById("last-point");

        // update the displayed text
        lastPoint.innerHTML = newText;

        // Use a conditional statement for adding and removing border on click
        d3.select(this)
          .attr("class") == "addborder" ? d3.select(this).attr("class", "removeborder") : d3.select(this).attr("class", "addborder");
      })
      }      

      // Add event listeners
      document.getElementById("addPoint").addEventListener("click", addPointClick);
  });
}

// Display graph
displayScatter()

// Frame for Bar
const FRAME2 = d3.select("#vis2") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// Function to display Bar chart
function displayBar() {

  d3.csv("data/bar-data.csv").then((data) => {
    
    // Define scale functions that maps our data x values 
    // (domain) to pixel values (range)
    const X_SCALE2 = d3.scaleBand()   
                      .range([0, VIS_WIDTH])
                      .domain(data.map((d) => { return d.category; }))
                      .padding(0.4); 

    // Find max y value
    const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.amount); });

    // Define scale functions that maps our data y values
    // (domain) to pixel values (range)
    const Y_SCALE2 = d3.scaleLinear()
                      .domain([0, MAX_Y2 +1])
                      .range([VIS_HEIGHT, 0]);

    // Use X_SCALE2 and Y_SCALE2 to plot graph
    FRAME2.selectAll("bars")  
        .data(data) // passed from .then  
        .enter()       
        .append("rect")  
          .attr("x", (d) => { return (X_SCALE2(d.category) + MARGINS.left); }) 
          .attr("y", (d) => { return (Y_SCALE2(d.amount) + MARGINS.bottom); }) 
          .attr("width", X_SCALE2.bandwidth())
          .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE2(d.amount); })
          .attr("class", "bar");

    // Tooltip
    const TOOLTIP = d3.select("#vis2")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 

    // Define event handler functions for tooltips
    function handleMouseover(event, d) {
      // on mouseover, make opaque 
      TOOLTIP.style("opacity", 1); 
      
    }

    function handleMousemove(event, d) {
      // position the tooltip and fill in information 
      TOOLTIP.html("Category: " + d.category + "<br>Value: " + d.amount)
              .style("left", (event.pageX + 10) + "px") //add offset
                                                          // from mouse
              .style("top", (event.pageY - 50) + "px"); 
    }

    function handleMouseleave(event, d) {
      // on mouseleave, make transparant again 
      TOOLTIP.style("opacity", 0); 
    } 

    // Add event listeners
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover)
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);    

    // Add x axis to vis
    FRAME2.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE2).ticks(7)) 
            .attr("font-size", '20px'); 

    // Add y axis to vis
    FRAME2.append("g") 
          .attr("transform", "translate(" + MARGINS.bottom + 
                "," + (MARGINS.top) + ")") 
          .call(d3.axisLeft(Y_SCALE2).ticks(10)) 
            .attr("font-size", '20px'); 

  });
}

// Call function 
displayBar();