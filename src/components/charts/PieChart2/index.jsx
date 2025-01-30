import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import datasumatera from "../../../utils/DataSumatera.json";
import datajawa from "../../../utils/DataJawa.json";

const PieChart2 = ({ property }) => {
  const myElementRef = useRef(null);
  const [radius, setRadius] = useState(window.innerWidth > 768 ? 150 : 75); // Initial radius based on screen size
  const totalWidth = radius * 2;
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768); // Track screen size

  const [pieData, setPieData] = useState([]);

  // Function to handle window resize and adjust the radius and screen size state
  const handleResize = () => {
    const newRadius = window.innerWidth > 768 ? 150 : 70;
    setRadius(newRadius);
    setIsLargeScreen(window.innerWidth > 768); // Update screen size state
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const processedData = datajawa.features.map((feature) => {
      const name = feature.properties.name;
      const propertyValue = feature.properties.men[property] || "0";
      const value = parseFloat(propertyValue.replace(",", "."));

      return { label: name, value, propertyValue };
    });

    setPieData(processedData);
  }, [property]);

  useEffect(() => {
    if (pieData.length === 0) return;

    const svg = d3.select(myElementRef.current);
    svg.selectAll("*").remove();

    const color = [
      "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
      "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9"
    ];

    const pie = d3.pie().value((d) => d.value);
    const dataReady = pie(pieData);

    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    // Create tooltip div
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.1)");

    // Draw pie chart slices
    const slices = svg
      .selectAll(".mySlices")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d, i) => color[i % color.length])
      .attr("stroke", "black")
      .attr("stroke-width", "2px")
      .attr("opacity", 0.5)
      .attr("transform", `translate(${radius},${radius})`)
      .on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible")
          .text(`${d.data.label}: ${d.data.propertyValue}`);
        d3.select(this).attr("fill", "navy");
      })
      .on("mousemove", function (event) {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function (event, d) {
        tooltip.style("visibility", "hidden");
        const index = d3.select(this).data()[0].index;
        d3.select(this).attr("fill", color[index % color.length]);
      });

    // Add labels only if on a large screen
    if (isLargeScreen) {
      svg
        .selectAll(".mySlices")
        .data(dataReady)
        .enter()
        .append("text")
        .text((d) => `${d.data.label} : ${d.data.value}`)
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("transform", (d) => `translate(${arcGenerator.centroid(d)}) translate(${radius},${radius})`);
    }
  }, [pieData, radius, isLargeScreen]);

  return (
    <div className="">
      <svg ref={myElementRef} width={totalWidth} height={totalWidth}></svg>
    </div>
  );
};

export default PieChart2;
