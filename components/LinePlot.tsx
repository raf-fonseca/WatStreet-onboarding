"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { StockData } from "@/app/types";

interface LinePlotProps {
    data: StockData[];
    timerange: "1d" | "1w" | "1m" | "1y";
}

const LinePlot: React.FC<LinePlotProps> = ({ data, timerange }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Clear any existing SVG elements before rendering
        d3.select(ref.current).selectAll("*").remove();

        const parsedData = data.map((d, i) => ({
            date: i, // Use index instead of date for linear scale
            timestamp: new Date(d.timestamp), // Keep timestamp for tooltips/formatting
            price: d.price,
            volume: d.volume,
        }));

        const margin = { top: 70, right: 80, bottom: 60, left: 50 };
        const width = 1200 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3
            .select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .style("fill", "#ffffff");

        // Use scaleLinear for x-axis with consistent padding
        const xPadding = parsedData.length * 0.05; // 5% padding on each side
        const x = d3
            .scaleLinear()
            .domain([-xPadding, parsedData.length - 1 + xPadding])
            .range([0, width])
            .nice();

        const yMin = d3.min(parsedData, (d) => d.price) || 0;
        const yMax = d3.max(parsedData, (d) => d.price) || 0;
        const yPadding = (yMax - yMin) * 0.05; // 5% padding on top and bottom
        const y = d3
            .scaleLinear()
            .domain([yMin - yPadding, yMax + yPadding])
            .range([height, 0])
            .nice();

        // Determine number of ticks based on timerange
        let numTicks: number;
        let tickFormat: string;
        switch (timerange) {
            case "1d":
                numTicks = 6;
                tickFormat = "%H:%M";
                break;
            case "1w":
                numTicks = 7;
                tickFormat = "%d %b %H:%M";
                break;
            case "1m":
                numTicks = 10;
                tickFormat = "%d %b";
                break;
            case "1y":
                numTicks = 12;
                tickFormat = "%b %Y";
                break;
        }

        // Create x-axis with linear scale
        const xAxis = d3
            .axisBottom(x)
            .ticks(numTicks - 1)
            .tickFormat((i) => {
                const index = Math.round(i as number);
                return index >= 0 && index < parsedData.length
                    ? d3.timeFormat(tickFormat)(parsedData[index].timestamp)
                    : "";
            });

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("fill", "#ffffff");

        const yAxis = d3.axisRight(y).ticks(6).tickFormat(d3.format(".2f"));
        svg.append("g")
            .attr("transform", `translate(${width}, 0)`)
            .call(yAxis)
            .selectAll("text")
            .style("fill", "#ffffff");

        const line = d3
            .line<{ date: number; price: number }>()
            .x((d) => x(d.date))
            .y((d) => y(d.price))
            .curve(d3.curveMonotoneX);

        // Split data into segments based on price changes
        const segments = [];
        let currentSegment = [parsedData[0]];

        for (let i = 1; i < parsedData.length; i++) {
            const prev = parsedData[i - 1];
            const curr = parsedData[i];
            currentSegment.push(curr);

            // Start new segment when price direction changes or at end
            if (
                i === parsedData.length - 1 ||
                curr.price > prev.price !==
                    parsedData[i + 1]?.price > curr.price
            ) {
                segments.push({
                    data: currentSegment,
                    increasing: curr.price > prev.price,
                });
                currentSegment = [curr];
            }
        }

        // Draw line segments with different colors
        segments.forEach((segment) => {
            svg.append("path")
                .datum(segment.data)
                .attr("fill", "none")
                .attr("stroke", segment.increasing ? "#22c55e" : "#ef4444")
                .attr("stroke-width", 2)
                .attr("d", line);
        });

        svg.selectAll("circle")
            .data(parsedData)
            .enter()
            .append("circle")
            .attr("cx", (d) => x(d.date))
            .attr("cy", (d) => y(d.price))
            .attr("r", 2)
            .attr("fill", (d, i) => {
                if (i === 0) return "#22c55e";
                return parsedData[i].price > parsedData[i - 1].price
                    ? "#22c55e" // green
                    : "#ef4444"; // red
            })
            .on("mouseover", function (event, d) {
                d3.select(this).attr("r", 3).attr("fill", "#3b82f6");
            })
            .on(
                "mouseout",
                function (
                    this: SVGCircleElement,
                    event: any,
                    d: {
                        date: number;
                        timestamp: Date;
                        price: number;
                        volume: number;
                    }
                ) {
                    const idx = parsedData.indexOf(d);
                    const color =
                        idx === 0
                            ? "#22c55e"
                            : parsedData[idx].price > parsedData[idx - 1].price
                            ? "#22c55e"
                            : "#ef4444";
                    d3.select(this).attr("r", 3).attr("fill", color);
                }
            );

        // Add chart title
        svg.append("text")
            .attr("y", 0)
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("AAPL");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .attr("fill", "#ffffff");

        return () => {
            // Clean up the SVG before re-rendering
            d3.select(ref.current).selectAll("*").remove();
        };
    }, [data, timerange]);

    // Helper function to determine tick format based on range
    const getTickFormat = (timerange: "1d" | "1w" | "1m" | "1y"): string => {
        switch (timerange) {
            case "1d":
                return "%H:%M"; // Hour:Minute
            case "1w":
                return "%d %b %H:%M"; // Day Month Hour:Minute
            case "1m":
                return "%d %b"; // Day Month
            case "1y":
                return "%b %Y"; // Month Year
            default:
                return "%b %Y";
        }
    };

    return (
        <div>
            <svg ref={ref}></svg>
        </div>
    );
};

export default LinePlot;
