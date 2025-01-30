import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function LineChart() {
  const data = [
    { date: "2025-01-01", value: 200 },
    { date: "2025-01-02", value: 300 },
    { date: "2025-01-03", value: 150 },
    { date: "2025-01-04", value: 400 },
    { date: "2025-01-05", value: 250 },
  ];
  const chartRef = useRef();
  const margin = { top: 20, right: 30, bottom: 30, left: 50 };
  const width = 500;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    d3.select(chartRef.current).select("svg").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)))
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%b %d")));

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    const line = d3
      .line()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value));

    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "grey")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("font-size", "12px");

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(new Date(d.date)))
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", "steelblue")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "orange");
        tooltip
          .style("visibility", "visible")
          .text(
            `Date: ${d3.timeFormat("%b %d")(new Date(d.date))}, Value: ${
              d.value
            }`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "steelblue");
        tooltip.style("visibility", "hidden");
      });
  }, [data]);

  return (
      <div ref={chartRef}></div>
  );
}
