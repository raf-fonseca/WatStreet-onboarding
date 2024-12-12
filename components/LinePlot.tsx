"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { StockData } from "@/app/types";

interface LinePlotProps {
    data: StockData[];
    timerange: "1d" | "1w" | "1m" | "1y";
}

const LinePlot: React.FC<LinePlotProps> = ({ data, timerange }) => {
    const ref = useRef<SVGSVGElement | null>(null);
    const [viewportStart, setViewportStart] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);

    useEffect(() => {
        // Clear any existing SVG elements before rendering
        d3.select(ref.current).selectAll("*").remove();

        const parsedData = data.map((d, i) => ({
            date: i,
            timestamp: new Date(d.timestamp),
            price: d.price,
            volume: d.volume,
        }));

        const margin = { top: 70, right: 80, bottom: 60, left: 50 };
        const width = 1200 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Calculate visible data range (show quarter of the data for more zoom)
        const visibleDataCount = Math.floor(parsedData.length / 4);
        const visibleData = parsedData.slice(
            viewportStart,
            viewportStart + visibleDataCount
        );

        const svg = d3
            .select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .style("fill", "#ffffff");

        // Use scaleLinear for x-axis with consistent padding
        const xPadding = visibleDataCount * 0.05;
        const x = d3
            .scaleLinear()
            .domain([-xPadding, visibleDataCount - 1 + xPadding])
            .range([0, width])
            .nice();

        const yMin = d3.min(visibleData, (d) => d.price) || 0;
        const yMax = d3.max(visibleData, (d) => d.price) || 0;
        const yPadding = (yMax - yMin) * 0.1; // Increased y-padding for better visibility
        const y = d3
            .scaleLinear()
            .domain([yMin - yPadding, yMax + yPadding])
            .range([height, 0])
            .nice();

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

        const xAxis = d3
            .axisBottom(x)
            .ticks(numTicks - 1)
            .tickFormat((i) => {
                const index = Math.round(i as number);
                const dataIndex = index + viewportStart;
                return dataIndex >= 0 && dataIndex < parsedData.length
                    ? d3.timeFormat(tickFormat)(parsedData[dataIndex].timestamp)
                    : "";
            });

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("fill", "#ffffff");

        const yAxis = d3.axisRight(y).ticks(8).tickFormat(d3.format(".2f")); // Increased number of y-axis ticks
        svg.append("g")
            .attr("transform", `translate(${width}, 0)`)
            .call(yAxis)
            .selectAll("text")
            .style("fill", "#ffffff");

        const line = d3
            .line<{ date: number; price: number }>()
            .x((d) => x(d.date - viewportStart))
            .y((d) => y(d.price))
            .curve(d3.curveMonotoneX);

        // Split visible data into segments
        const segments = [];
        let currentSegment = [visibleData[0]];

        for (let i = 1; i < visibleData.length; i++) {
            const prev = visibleData[i - 1];
            const curr = visibleData[i];
            currentSegment.push(curr);

            if (
                i === visibleData.length - 1 ||
                curr.price > prev.price !==
                    visibleData[i + 1]?.price > curr.price
            ) {
                segments.push({
                    data: currentSegment,
                    increasing: curr.price > prev.price,
                });
                currentSegment = [curr];
            }
        }

        segments.forEach((segment) => {
            svg.append("path")
                .datum(segment.data)
                .attr("fill", "none")
                .attr("stroke", segment.increasing ? "#22c55e" : "#ef4444")
                .attr("stroke-width", 2.5) // Increased line width
                .attr("d", line);
        });

        svg.selectAll("circle")
            .data(visibleData)
            .enter()
            .append("circle")
            .attr("cx", (d) => x(d.date - viewportStart))
            .attr("cy", (d) => y(d.price))
            .attr("r", 3) // Increased default circle size
            .attr("fill", (d, i) => {
                if (i === 0) return "#22c55e";
                return visibleData[i].price > visibleData[i - 1].price
                    ? "#22c55e"
                    : "#ef4444";
            })
            .on("mouseover", function (event, d) {
                d3.select(this).attr("r", 5).attr("fill", "#3b82f6"); // Increased hover circle size
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
                    const idx = visibleData.indexOf(d);
                    const color =
                        idx === 0
                            ? "#22c55e"
                            : visibleData[idx].price >
                              visibleData[idx - 1].price
                            ? "#22c55e"
                            : "#ef4444";
                    d3.select(this).attr("r", 3).attr("fill", color);
                }
            );

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

        // Add drag behavior
        const dragRect = svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "transparent")
            .style("cursor", "grab");

        dragRect
            .on("mousedown", (event) => {
                setIsDragging(true);
                setDragStart(event.clientX);
            })
            .on("mousemove", (event) => {
                if (isDragging) {
                    const dx = event.clientX - dragStart;
                    const dataShift = Math.floor(
                        dx / (width / visibleDataCount)
                    );
                    const newStart = Math.max(
                        0,
                        Math.min(
                            parsedData.length - visibleDataCount,
                            viewportStart - dataShift
                        )
                    );
                    setViewportStart(newStart);
                    setDragStart(event.clientX);
                }
            })
            .on("mouseup", () => {
                setIsDragging(false);
            })
            .on("mouseleave", () => {
                setIsDragging(false);
            });

        return () => {
            d3.select(ref.current).selectAll("*").remove();
        };
    }, [data, timerange, viewportStart, isDragging, dragStart]);

    return (
        <div>
            <svg ref={ref}></svg>
        </div>
    );
};

export default LinePlot;
