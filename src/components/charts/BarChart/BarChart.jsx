import * as d3 from "d3";
import { useEffect, useRef } from "react";

const BarChart = ({ data, property }) => {
  const ref = useRef();
  console.log("Data received:", data.features);

  useEffect(() => {
    if (!data || !property || !data.features) return;

    // Memproses data menjadi format { Country, Value } dan mengambil 10 data dengan nilai tertinggi
    const processedData = data.features
      .map((feature) => ({
        Country: feature.properties.brk_name,
        Value: feature.properties[property],
      }))
      .filter((d) => typeof d.Value === "number" && !isNaN(d.Value))
      .sort((a, b) => b.Value - a.Value) // Urutkan berdasarkan Value (descending)
      .slice(0, 10);

    // Bersihkan elemen SVG sebelumnya
    d3.select(ref.current).selectAll("*").remove();

    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 65 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

      // X axis
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(processedData.map((d) => d.Country))
        .padding(0.2);
      svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x)).selectAll("text").attr("transform", "translate(-10,0)rotate(-45)").style("text-anchor", "end");

      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(processedData, (d) => d.Value)])
        .nice()
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Bars
      svg
        .selectAll("mybar")
        .data(processedData)
        .join("rect")
        .attr("x", (d) => x(d.Country))
        .attr("y", (d) => y(d.Value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.Value))
        .attr("fill", "#69b3a2");
  }, [data, property]);

  return <svg width={460} height={400} id="barchart" ref={ref} />;
};

export default BarChart;
