import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PieChart3 = ({ property }) => {
  const myElementRef = useRef(null);
  const [radius, setRadius] = useState(window.innerWidth > 768 ? 150 : 75); // Initial radius based on screen size
  const totalWidth = radius * 2;
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768); // Track screen size
  const [genderData, setGenderData] = useState([]);

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
    const handleMessage = (event) => {
      if (event.data && event.data.type === "updateData") {
        console.log("Received Data:", event.data.payload);
        // setUserData(event.data.payload.userData); // Data untuk Barchart
        setGenderData(event.data.payload.genderData); // Data untuk Piechart
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (genderData.length === 0) return;

    const svg = d3.select(myElementRef.current);
    svg.selectAll("*").remove();

    const color = ["#1f77b4", "#ff7f0e"]; // Warna untuk Male & Female

    const pie = d3.pie().value((d) => d.count);
    const dataReady = pie(genderData);

    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    const slices = svg
      .selectAll(".mySlices")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d, i) => color[i])
      .attr("stroke", "black")
      .attr("stroke-width", "2px")
      .attr("opacity", 0.7)
      .attr("transform", `translate(${radius},${radius})`);

    // Tambahkan label nama gender di bawah slice pie chart
    svg
      .selectAll(".mySlices")
      .data(dataReady)
      .enter()
      .append("text")
      .text((d) => `${d.data.gender} : ${d.data.count}`)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .attr("fill", "black")
      .attr("transform", (d) => `translate(${arcGenerator.centroid(d)}) translate(${radius},${radius + 20})`);
  }, [genderData, radius]);

  return (
    <div className="">
      <svg ref={myElementRef} width={totalWidth} height={totalWidth}></svg>
    </div>
  );
};

export default PieChart3;
