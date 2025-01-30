import * as d3 from "d3";
import React, { Component } from "react";
import data from "../../../utils/Indonesia-map.json";

class BubbleChart4 extends Component {
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
      .attr("r", (d) => d.r)
      .attr("fill-opacity", 0.7)
      .attr("fill", "red")
      .on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible").html(d.data.properties.name); // Menampilkan nama dari properties
      })
      .on("mousemove", function (event) {
        tooltip.style("top", event.pageY + 5 + "px").style("left", event.pageX + 5 + "px"); // Menyusun posisi tooltip mengikuti kursor
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden"); // Menyembunyikan tooltip saat mouse keluar
      });
  }

  pack(size) {
    return d3.pack().size(size).padding(3);
  }

  makeHierarchy(features) {
    return d3.hierarchy({ children: features }).sum((d) => {
      if (d.properties && d.properties.men && d.properties.men.single) {
        return parseFloat(d.properties.men.single.replace(",", "."));
      }
      return 0; // Jika 'men.single' tidak ada, kembalikan 0
    });
  }

  componentDidMount() {
    let svg = this.createSVG();
    this.drawChart(svg);
  }

  render() {
    return (
      <div className="flex justify-center items-center">
        <h2>Single</h2>
        <div id="bubblechart" ref={this.el} />
      </div>
    );
  }
}

export default BubbleChart4;
