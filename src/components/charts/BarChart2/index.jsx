import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

const BarChart2 = () => {
  const [data, setData] = useState([]); // Data untuk grafik batang
  const [inputValue, setInputValue] = useState(""); // State untuk input pengguna
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, value: 0, x: 0, y: 0 });

  useEffect(() => {
    // Setting up SVG container
    const w = 300;
    const h = 300;
    const svg = d3.select(svgRef.current).attr("width", w).attr("height", h).style("overflow", "visible").style("margin-top", "75px");

    // Clear previous chart
    svg.selectAll("*").remove();

    // Setting the scaling
    const xScale = d3
      .scaleBand()
      .domain(data.map((val, i) => i))
      .range([0, w])
      .padding(0.5);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data) || h])
      .range([h, 0]);

    // Setting the axes
    const xAxis = d3.axisBottom(xScale).ticks(data.length);
    const yAxis = d3.axisLeft(yScale).ticks(5);
    svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`);
    svg.append("g").call(yAxis);

    // Setting the SVG data
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (v, i) => xScale(i))
      .attr("y", (val) => yScale(val))
      .attr("width", xScale.bandwidth())
      .attr("height", (val) => h - yScale(val))
      .attr("fill", "steelblue")
      .on("mouseenter", (event, value) => {
        const rect = event.target.getBoundingClientRect(); // Get position of the bar
        setTooltip({
          visible: true,
          value,
          x: rect.x + rect.width / 2, // Center of the bar
          y: rect.y, // Top of the bar
        });
      })
      .on("mouseleave", () => {
        setTooltip({ visible: false, value: 0, x: 0, y: 0 });
      });
  }, [data]);

  useEffect(() => {
    const handleMessage = (event) => {
      console.log("Message received:", event.data);

      const { type, payload } = event.data;
      if (type === "updateData") {
        console.log("Updating data with:", payload);
        setData(payload);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleAddData = () => {
    const newValue = parseInt(inputValue, 10);
    if (!isNaN(newValue)) {
      setData([...data, newValue]); // Tambahkan nilai baru ke data
      setInputValue(""); // Reset input
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddData(); // Panggil fungsi handleAddData saat Enter ditekan
    }
  };

  return (
    <div>
      {/* Form untuk input data */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} // Tambahkan event listener untuk Enter
          placeholder="Enter a value"
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleAddData} style={{ padding: "5px 10px" }}>
          Add Data
        </button>
      </div>

      {/* Barchart */}
      <div className="pl-10">
        <svg ref={svgRef}></svg>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y - 30, // Adjust for tooltip height
            left: tooltip.x,
            transform: "translate(-50%, -100%)", // Center and position above
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

export default BarChart2;
