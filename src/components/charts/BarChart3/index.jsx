import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

const BarChart3 = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, value: 0, x: 0, y: 0 });

  useEffect(() => {
    const w = 300;
    const h = 300;
    const marginBottom = 50; // Tambahkan margin bawah untuk label sumbu X

    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h + marginBottom) // Tambahkan tinggi untuk label
      .style("overflow", "visible")
      .style("margin-top", "75px");

    svg.selectAll("*").remove();

    // Setting the scaling
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, w])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.age) || 100])
      .range([h, 0]);

    // Setting the axes
    const xAxis = d3.axisBottom(xScale).tickSize(0); // Hilangkan garis kecil pada tick
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g").call(yAxis);

    const xAxisGroup = svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`);

    // **Rotasi label X ke bawah**
    xAxisGroup
      .selectAll("text")
      .style("text-anchor", "end") // Posisi anchor agar rapi
      .attr("transform", "rotate(-45)") // Putar 45 derajat
      .attr("dx", "-0.8em") // Geser horizontal agar lebih rapi
      .attr("dy", "0.5em"); // Geser sedikit ke bawah agar sejajar

    // Setting the SVG data
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(d.age))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => h - yScale(d.age))
      .attr("fill", "steelblue")
      .on("mouseenter", (event, d) => {
        const rect = event.target.getBoundingClientRect();
        setTooltip({
          visible: true,
          value: `${d.name} (${d.age})`,
          x: rect.x + rect.width / 2,
          y: rect.y,
        });
      })
      .on("mouseleave", () => {
        setTooltip({ visible: false, value: 0, x: 0, y: 0 });
      });
  }, [data]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "updateData") {
        console.log("Received Data:", event.data.payload);
        setData(event.data.payload.userData); // Data untuk Barchart
        // setGenderData(event.data.payload.genderData);  // Data untuk Piechart
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div>
      <div className="pl-10">
        <svg ref={svgRef}></svg>
      </div>

      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y - 30,
            left: tooltip.x,
            transform: "translate(-50%, -100%)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            pointerEvents: "none",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.value}
        </div>
      )}
    </div>
  );
};

export default BarChart3;
