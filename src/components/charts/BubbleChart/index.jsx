import * as d3 from "d3";
import React, { Component } from "react";
import data from "../../../utils/Indonesia-map.json";
import "./BubbleChart.css";

class BubbleChart extends Component {
  el = React.createRef();

  state = {
    width: window.innerWidth >= 768 ? 400 : 150, // Responsive width
    height: window.innerWidth >= 768 ? 400 : 150, // Responsive height
  };

  createSVG() {
    d3.select(this.el.current).select("svg").remove();
    d3.select(this.el.current).select(".tooltip").remove(); // Remove old tooltip

    return d3.select(this.el.current).append("svg")
      .attr("width", this.state.width)
      .attr("height", this.state.height)
      .attr("style", "");
  }

  drawChart(svg) {
    let hierachalData = this.makeHierarchy(data.features, this.props.property);
    let packLayout = this.pack([this.state.width - 5, this.state.height - 5]);
    const root = packLayout(hierachalData);

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
      .attr("r", 0)
      .attr("fill-opacity", 0.7)
      .attr("fill", (d) => {
        const menData = d.data.properties.men;
        let fillColor = "red"; // Default color
        
        if (menData) {
          switch (this.props.property) {
            case "single":
              fillColor = "red";
              break;
            case "married":
              fillColor = "navy";
              break;
            case "divorced":
              fillColor = "purple";
              break;
            case "widowed":
              fillColor = "darkgray";
              break;
            default:
              fillColor = "red";
          }
        }
        return fillColor;
      })
      .transition()
      .duration(1000)
      .attr("r", (d) => d.r);
    
    leaf
      .select("circle")
      .on("mouseover", (event, d) => {
        const menData = d.data.properties.men;
        let totalValue = "N/A";
        let hoverClass = "";
        
        if (menData) {
          switch (this.props.property) {
            case "single":
              totalValue = menData.single;
              hoverClass = "single-blink";
              break;
            case "married":
              totalValue = menData.married;
              hoverClass = "married-blink";
              break;
            case "divorced":
              totalValue = menData.divorced;
              hoverClass = "divorced-blink";
              break;
            case "widowed":
              totalValue = menData.widowed;
              hoverClass = "widowed-blink";
              break;
            default:
              totalValue = "N/A";
              hoverClass = "";
          }
        }
      
        const tooltipContent = `
          <div>
            <strong>${d.data.properties.name}</strong><br>
            Total: ${totalValue}
          </div>
        `;
        tooltip.style("visibility", "visible").html(tooltipContent);
        
        d3.select(event.currentTarget)
          .classed("blinking", true)
          .classed(hoverClass, true);
      })
      .on("mousemove", function (event) {
        tooltip.style("top", event.pageY + 5 + "px").style("left", event.pageX + 5 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).classed("blinking", false).classed(hoverClass, false);
      });
  }

  pack(size) {
    return d3.pack().size(size).padding(3);
  }

  makeHierarchy(features, property) {
    return d3.hierarchy({ children: features }).sum((d) => {
      if (d.properties && d.properties.men) {
        switch (property) {
          case "single":
            return parseFloat(d.properties.men.single.replace(",", "."));
          case "married":
            return parseFloat(d.properties.men.married.replace(",", "."));
          case "divorced":
            return parseFloat(d.properties.men.divorced.replace(",", "."));
          case "widowed":
            return parseFloat(d.properties.men.widowed.replace(",", "."));
          default:
            return 0;
        }
      }
      return 0;
    });
  }

  handleResize = () => {
    this.setState({
      width: window.innerWidth >= 768 ? 400 : 100,
      height: window.innerWidth >= 768 ? 400 : 100,
    }, () => {
      let svg = this.createSVG();
      this.drawChart(svg);
    });
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    let svg = this.createSVG();
    this.drawChart(svg);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.property !== this.props.property) {
      let svg = this.createSVG();
      this.drawChart(svg);
    }
  }

  render() {
    return (
      <div className="flex-col justify-center items-center text-center ">
        <div id="bubblechart" ref={this.el} />
      </div>
    );
  }
}

export default BubbleChart;
