const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const FRAME1 = d3.select("#vis1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

d3.csv("data/scatter-data.csv").then((data) => {

  FRAME1.selectAll("circle") 
      .data(data)
      .enter()  
      .append("circle")
        .attr("class", "circ")
        .attr("cx", (d) => { return d.x; })
        .attr("cy", (d) => { return d.y; })
        .attr("r", 10);

});


// Create array of every point on graph
circles = Array.from(document.getElementsByClassName('circ'))

// Adds event listener for point that is clicked
circles.forEach(c => {
  c.addEventListener("click", () => addborder(c));
})

// Toggles border for circle selected
function addborder(c) {
  c.classList.toggle("addborder");
}