import { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleThreshold } from "d3";
import useResizeObserver from "../../../utils/useResizeObserver";

function GeoChart({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const svg = select(svgRef.current);

    // Remove existing legend to avoid duplicates
    svg.selectAll(".legend").remove();

    // Define the range thresholds and colors
    const thresholds = [0, 25, 50];
    const colors = ["#60a5fa", "#3b82f6", "#2563eb"];


    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

    const projection = geoMercator()
      .fitSize([width, height], selectedCountry || data)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .attr("class", "country")
      .attr("d", (feature) => pathGenerator(feature))
      .attr("fill", (feature) => {
        // Check if 'men' property exists and get the corresponding value
        const men = feature.properties.men || {};
        let value;

        switch (property) {
          case "single":
            value = parseFloat((men.single || "0").replace(",", "."));
            break;
          case "married":
            value = parseFloat((men.married || "0").replace(",", "."));
            break;
          case "divorced":
            value = parseFloat((men.divorced || "0").replace(",", "."));
            break;
          case "widowed":
            value = parseFloat((men.widowed || "0").replace(",", "."));
            break;
          default:
            value = NaN;
        }

        // Handle cases where the value is not a number
        if (isNaN(value)) {
          return "#d1d5db"; // Light grey color for N/A
        }

        // Check value ranges and assign corresponding colors
        if (value >= 0 && value <= 25) {
          return "#60a5fa"; // Blue color for 0-50
        } else if (value > 25 && value <= 50) {
          return "#3b82f6"; // Darker blue color for 51-75
        } else if (value > 50) {
          return "#2563eb"; // Dark blue color for >75
        }

        return "#fee2e2"; // Default light red color
      })
      .on("mouseover", (event, feature) => {
        const men = feature.properties.men || {};
        let content;

        switch (property) {
          case "single":
            content = <p>Total: {men.single || "N/A"}</p>;
            break;
          case "married":
            content = <p>Total: {men.married || "N/A"}</p>;
            break;
          case "divorced":
            content = <p>Total: {men.divorced || "N/A"}</p>;
            break;
          case "widowed":
            content = <p>Total: {men.widowed || "N/A"}</p>;
            break;
          default:
            content = <p>Total: N/A</p>;
        }

        setTooltip({
          x: event.pageX,
          y: event.pageY,
          content: (
            <div className="bg-white border-solid border-2 border-gray-300 rounded-lg p-2">
              <h1 className="font-bold">{feature.properties.name}</h1>
              <hr className="my-2 border-gray-300" />
              {content}
            </div>
          ),
        });

        const [cx, cy] = pathGenerator.centroid(feature);

        select(event.target).raise().transition().duration(300).attr("transform", `translate(${cx}, ${cy}) scale(1.1) translate(${-cx}, ${-cy})`).attr("stroke", "black").attr("stroke-width", 2);

        svg
          .selectAll(".country-label")
          .filter((d) => d === feature)
          .raise()
          .transition()
          .duration(300)
          .style("font-size", "12px")
          .style("fill", "black");
      })

      .on("mouseout", (event, feature) => {
        setTooltip(null);

        select(event.target).transition().duration(300).attr("transform", "scale(1)").attr("stroke", "none");

        svg
          .selectAll(".country-label")
          .filter((d) => d === feature)
          .transition()
          .duration(300)
          .style("font-size", "10px")
          .style("fill", "#000");
      })

      .on("click", (event, feature) => {
        setSelectedCountry(selectedCountry === feature ? null : feature);

        const [cx, cy] = pathGenerator.centroid(feature);

        select(event.target).raise().transition().duration(300).attr("transform", `translate(${cx}, ${cy}) scale(1.5) translate(${-cx}, ${-cy})`).attr("stroke", "blue").attr("stroke-width", 2);

        svg
          .selectAll(".country-label")
          .filter((d) => d === feature)
          .raise()
          .transition()
          .duration(300)
          .style("font-size", "14px")
          .style("fill", "blue");
      });
    if(isLargeScreen){
      svg
      .selectAll(".country-label")
      .data(data.features)
      .join("text")
      .attr("class", "country-label")
      .text((feature) => feature.properties.name)
      .attr("x", (feature) => pathGenerator.centroid(feature)[0])
      .attr("y", (feature) => pathGenerator.centroid(feature)[1])
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("font-size", "10px")
      .style("fill", "#000")
      .style("pointer-events", "none");
    }else{
      svg
      .selectAll(".country-label")
      .data(data.features)
      .join("text")
      .attr("class", "country-label")
      .attr("x", (feature) => pathGenerator.centroid(feature)[0])
      .attr("y", (feature) => pathGenerator.centroid(feature)[1])
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("font-size", "10px")
      .style("fill", "#000")
      .style("pointer-events", "none");
    }
    

    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      .text((feature) => feature && feature.properties.name + ": " + feature.properties[property]?.toLocaleString())
      .attr("x", 10)
      .attr("y", 25);

    // Add Legend
    const legendWidth = 300;
    const legendHeight = 10;
    const legendX = 20;
    const legendY = height - 50;

    // Append a group for the legend and give it a class for easier selection
    const legendGroup = svg.append("g").attr("class", "legend").attr("transform", `translate(${legendX}, ${legendY})`);

    // Create rectangles for each color in the legend
    colors.forEach((color, i) => {
      legendGroup
        .append("rect")
        .attr("x", (i * legendWidth) / colors.length)
        .attr("y", 0)
        .attr("width", legendWidth / colors.length)
        .attr("height", legendHeight)
        .style("fill", color);
    });

    thresholds.forEach((threshold, i) => {
      legendGroup
        .append("text")
        .attr("x", (i * legendWidth) / colors.length)
        .attr("y", legendHeight + 15)
        .style("font-size", "12px")
        .text(threshold.toLocaleString())
        .attr("text-anchor", "middle");
    });

    // Add final text for >1,000,000
    legendGroup
      .append("text")
      .attr("x", legendWidth)
      .attr("y", legendHeight + 15)
      .style("font-size", "12px")

      .attr("text-anchor", "middle");
  }, [data, dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%", backgroundColor: "" }}>
      <svg ref={svgRef} width="100%" height="100%"></svg>
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            padding: "5px",
            pointerEvents: "none",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

export default GeoChart;
