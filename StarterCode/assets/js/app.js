//Define SVG area dimensions
const svgWidth = 960;
const svgHeight = 660; 
/********************************************************/

// Define the chart's margins as an object
const chartMargin = {
  top: 40,
  right: 40,
  bottom: 150,
  left: 150,
};
/********************************************************/
// Define dimensions of the chart area
const chartWidth = svgWidth - chartMargin.left - chartMargin.right;
const chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
/********************************************************/

// Select body, append SVG area to it, and set the dimensions
const svg = d3
  .select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);
/********************************************************/
const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import Data
const datafile = "data.csv"
d3.csv(datafile).then(function(demographicData) {  

// Step 1: Parse Data/Cast as numbers
    // ==============================
    demographicData.forEach(function(data) {
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });  

// Step 2: Create scale functions
    // ==============================
    let xLinearScale = d3.scaleLinear()
      .domain([d3.min(demographicData, d => d.obesity), d3.max(demographicData, d => d.obesity)])
      .range([0, chartWidth]);

    let yLinearScale = d3.scaleLinear()
      .domain([d3.min(demographicData, d => d.smokes), d3.max(demographicData, d => d.smokes)])
      .range([chartHeight, 0]);

// Step 3: Create axis functions
    // ==============================
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
  
      // Step 5: Create Circles
    // ==============================
    let circlesGroup = chartGroup.selectAll("circle")
    .data(demographicData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "pink");
    // .attr("opacity", "");;

    // Step 6: Add State Abbreviation to circle
    let textGroup = chartGroup.selectAll(".stateText")
    .data(demographicData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.obesity))
    .attr("y", d => yLinearScale(d.smokes))
    .text(d=> d.abbr)
    .attr("class", "stateText");

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokes");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
      .attr("class", "axisText")
      .text("Obesity");
 
});
