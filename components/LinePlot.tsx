"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { StockData } from "@/app/types";
import { parse } from "path";
interface LinePlotProps {
    data?: StockData[];
}
const LinePlot: React.FC<LinePlotProps> = ({ data }) => {
    const ref = useRef(null);
    if (!data || data.length === 0) {
        // Handle empty or undefined data
        return;
    }
    useEffect(() => {
        const parsedData = data
            .map((d) => ({
                date: new Date(d.timestamp),
                price: d.price,
                volume: d.volume, // Included if needed for future enhancements
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime()); // Ensure data is sorted by date
        console.log("parsedData", parsedData);
        // Set dimensions and margins for the chart
        const margin = { top: 70, right: 80, bottom: 60, left: 30 };
        const width = 1200 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        // Select the SVG element using the ref
        const svg = d3
            .select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        // Define the x and y scales
        const x = d3
            .scaleTime()
            .domain(d3.extent(parsedData, (d) => d.date) as [Date, Date])
            .range([0, width]);
        const y = d3
            .scaleLinear()
            .domain([0, d3.max(parsedData, (d) => d.price)! * 1.1]) // Adding 10% padding on top
            .range([height, 0]);
        // Add the x-axis
        const xAxis = d3.axisBottom(x).ticks(d3.timeMonth.every(1));
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");
        // Add the y-axis
        const yAxis = d3.axisRight(y).ticks(6);
        svg.append("g")
            .attr("transform", `translate(${width}, 0)`) // Move the y-axis to the right side
            .call(yAxis);
        // Create the line generator
        const line = d3
            .line<{ date: Date; price: number }>()
            .x((d) => x(d.date))
            .y((d) => y(d.price))
            .curve(d3.curveMonotoneX); // Smooth the line
        // Add the line path to the SVG element
        svg.append("path")
            .datum(parsedData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);
        // Optional: Add points to the line
        svg.selectAll("circle")
            .data(parsedData)
            .enter()
            .append("circle")
            .attr("cx", (d) => x(d.date))
            .attr("cy", (d) => y(d.price))
            .attr("r", 4)
            .attr("fill", "steelblue")
            .on("mouseover", function (event, d) {
                d3.select(this).attr("r", 6).attr("fill", "orange");
                // Optionally, add tooltip functionality here
            })
            .on("mouseout", function (event, d) {
                d3.select(this).attr("r", 4).attr("fill", "steelblue");
            });
        // Optional: Add chart title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("AAPL")
            .attr("transform", `translate(-${width / 2 - margin.left}, 0)`); // Move the y-axis to the right side
        // Cleanup function to remove the SVG content before the next render
        return () => {
            d3.select(ref.current).selectAll("*").remove();
        };
    }, []);
    return (
        <div>
            <svg ref={ref}></svg>
        </div>
    );
};
export default LinePlot;
