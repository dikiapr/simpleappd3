import * as d3 from "d3";
import React, { Component } from "react";
import data from "../../../utils/Indonesia-map.json";

class BubbleChart3 extends Component {
  el = React.createRef();

  width = 400;
  height = 400;

  createSVG() {
    d3.select(this.el.current).select("svg").remove();

    return d3.select(this.el.current).append("svg").attr("width", this.width).attr("height", this.height).attr("style", "border: thin red solid");
  }

  drawChart(svg) {
    let hierachalData = this.makeHierarchy(data.features);
    let packLayout = this.pack([this.width - 5, this.height - 5]);
    const root = packLayout(hierachalData);

    // Tooltip div
    const tooltip = d3
      .select(this.el.current)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0,0,0,0.7)")
      .style("color", "white")
      .style("border-radius", "4px")
      .style("padding", "5px");

    const leaf = svg
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

    leaf
      .append("circle")
      .attr("r", 0) // Mulai dengan radius 0 untuk animasi muncul
      .attr("fill-opacity", 0.7)
      .attr("fill", "purple")
      .transition() // Tambahkan transisi
      .duration(1000) // Durasi animasi 1000ms
      .attr("r", (d) => d.r); // Radius akhir sesuai data

    leaf
      .select("circle")
      .on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible").html(d.data.properties.name);
        d3.select(this)
          .transition()
          .duration(300) // Durasi animasi hover
          .attr("fill", "orange") // Ubah warna saat hover
          .attr("r", (d) => d.r * 1.1); // Perbesar lingkaran
      })
      .on("mousemove", function (event) {
        tooltip.style("top", event.pageY + 5 + "px").style("left", event.pageX + 5 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this)
          .transition()
          .duration(300) // Kembalikan ke kondisi awal
          .attr("fill", "purple")
          .attr("r", (d) => d.r);
      });
  }

  pack(size) {
    return d3.pack().size(size).padding(3);
  }

  makeHierarchy(features) {
    return d3.hierarchy({ children: features }).sum((d) => {
      if (d.properties && d.properties.men && d.properties.men.divorced) {
        return parseFloat(d.properties.men.divorced.replace(",", "."));
      }
      return 0; // Jika 'men.divorced' tidak ada, kembalikan 0
    });
  }

  componentDidMount() {
    let svg = this.createSVG();
    this.drawChart(svg);
  }

  render() {
    return (
      <div className="flex-col justify-center items-center text-center">
        <h2 className="font-bold">Divorced</h2>
        <div id="bubblechart" ref={this.el} />
      </div>
    );
  }
}

export default BubbleChart3;
