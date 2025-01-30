import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.value);
   
    const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    const pieData = pie(data);

    const arcs = svg.selectAll('.arc')
      .data(pieData)
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .style('fill', (d, i) => color(i))
      // Tooltip
      .on('mouseover', (event, d) => {
        d3.select(event.target).style('opacity', 0.7);
        tooltipRef.current.style.visibility = 'visible';
        tooltipRef.current.textContent = `${d.data.label}: ${d.data.value}`;
      })
      .on('mousemove', (event, d) => {
        const tooltipWidth = tooltipRef.current.offsetWidth;
        const tooltipHeight = tooltipRef.current.offsetHeight;

        const [x, y] = arc.centroid(d);
     
        const adjustedX = x + width / 2 - tooltipWidth / 2;
        const adjustedY = y + height / 2 - tooltipHeight - 10; 

        tooltipRef.current.style.left = `${adjustedX}px`;
        tooltipRef.current.style.top = `${adjustedY}px`;
      })
      .on('mouseout', (event) => {
        d3.select(event.target).style('opacity', 1); 
        tooltipRef.current.style.visibility = 'hidden'; 
      });
    
    arcs.append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text(d => d.data.label);

  }, [data]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef}></svg>
      <div
  ref={tooltipRef}
  className="absolute hidden bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10"
></div>

    </div>
  );
};

export default PieChart;
