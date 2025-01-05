"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { HoverData, StockData } from "@/app/types";

interface LinePlotProps {
    data: StockData[];
    timerange: "1d" | "1w" | "1m" | "1y";
    onHover: (data: HoverData | null) => void;
}

const LinePlot: React.FC<LinePlotProps> = ({ data, timerange, onHover }) => {
    const ref = useRef<SVGSVGElement | null>(null);
    const [viewportStart, setViewportStart] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);

    useEffect(() => {
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
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add drag rect first
        const dragRect = svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "transparent")
            .style("cursor", "grab");

        const chartGroup = svg.append("g").attr("class", "chart-content");

        const isAtEnd = viewportStart + visibleDataCount >= parsedData.length;
        const rightPadding = isAtEnd ? visibleDataCount * 0.15 : 0; // Only add padding at the end

        const xPadding = visibleDataCount * 0.05;
        const x = d3
            .scaleLinear()
            .domain([-xPadding, visibleDataCount - 1 + rightPadding])
            .range([0, width]);

        const yMin = d3.min(visibleData, (d) => d.price) || 0;
        const yMax = d3.max(visibleData, (d) => d.price) || 0;
        const yPadding = (yMax - yMin) * 0.1;
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
            .style("fill", "#a3a3a3");

        const yAxis = d3.axisRight(y).ticks(8).tickFormat(d3.format(".2f"));
        svg.append("g")
            .attr("transform", `translate(${width}, 0)`)
            .call(yAxis)
            .selectAll("text")
            .style("fill", "#a3a3a3");

        const line = d3
            .line<{ date: number; price: number }>()
            .x((d) => x(d.date - viewportStart))
            .y((d) => y(d.price))
            .curve(d3.curveMonotoneX);

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

        if (isAtEnd) {
            chartGroup
                .append("rect")
                .attr("x", x(visibleDataCount - 1))
                .attr("y", 0)
                .attr(
                    "width",
                    x(visibleDataCount - 1 + rightPadding) -
                        x(visibleDataCount - 1)
                )
                .attr("height", height)
                .attr("fill", "#09090b")
                .attr("pointer-events", "none");
        }

        segments.forEach((segment) => {
            chartGroup
                .append("path")
                .datum(segment.data)
                .attr("fill", "none")
                .attr("stroke", segment.increasing ? "#22c55e" : "#ef4444")
                .attr("stroke-width", 2.5)
                .attr("d", line);
        });

        // Add visible circles
        chartGroup
            .selectAll(".data-point")
            .data(visibleData)
            .enter()
            .append("circle")
            .attr("class", "data-point")
            .attr("data-index", (d, i) => i)
            .attr("cx", (d) => x(d.date - viewportStart))
            .attr("cy", (d) => y(d.price))
            .attr("r", 3)
            .attr("fill", (d, i) => {
                if (i === 0) return "#22c55e";
                return visibleData[i].price > visibleData[i - 1].price
                    ? "#22c55e"
                    : "#ef4444";
            })
            .on("mouseover", function (event, d) {
                if (!isDragging) {
                    d3.select(this).attr("r", 5).attr("fill", "#3b82f6");
                    onHover({
                        price: d.price,
                        timestamp: d.timestamp,
                        volume: d.volume,
                    });
                }
            })
            .on("mouseout", function (event, d) {
                if (!isDragging) {
                    const idx = visibleData.indexOf(d);
                    const color =
                        idx === 0
                            ? "#22c55e"
                            : visibleData[idx].price >
                              visibleData[idx - 1].price
                            ? "#22c55e"
                            : "#ef4444";
                    d3.select(this).attr("r", 3).attr("fill", color);
                    onHover(null);
                }
            });

        svg.append("text")
            .attr("y", 0)
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("AAPL")
            .style("fill", "#ffffff");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .attr("fill", "#ffffff");

        const handleDragStart = (event: any) => {
            setIsDragging(true);
            setDragStart(event.clientX);
            onHover(null);
        };

        const handleDragMove = (event: any) => {
            if (isDragging) {
                const dx = event.clientX - dragStart;
                const dataShift = Math.floor(dx / (width / visibleDataCount));
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
        };

        const handleDragEnd = () => {
            setIsDragging(false);
        };

        dragRect
            .on("mousedown", handleDragStart)
            .on("mousemove", handleDragMove)
            .on("mouseup", handleDragEnd)
            .on("mouseleave", handleDragEnd);

        return () => {
            d3.select(ref.current).selectAll("*").remove();
        };
    }, [data, timerange, viewportStart, isDragging, dragStart, onHover]);

    return (
        <div>
            <svg ref={ref}></svg>
        </div>
    );
};

export default LinePlot;
