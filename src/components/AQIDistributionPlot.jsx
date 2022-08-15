import React, {useEffect, useRef} from 'react'
import * as d3 from 'd3';

export default function AQIDistributionPlot(props){
    const svgRef = useRef(null);

    const margin = {top: 50, right: 20, left: 50, bottom:30};

    const height = 350 - margin.top - margin.bottom;
    const width = 400 - margin.left - margin.right;

    let svgContainer = d3.select(svgRef.current);

    useEffect (() => {
        if(!props.data) return
        const data = Object.values(props.data);

        let xscale = d3.scaleLinear()
            .domain([0, d3.max(data.map(d=>d.max_aqi))])
            .range([0, width]);
        
        let yscale = d3.scaleBand()
            .domain(data.map(d=>d.year))
            .range([0, height])
            .padding(0.5);
        
        const yaxis = d3.axisLeft(yscale);
        const xaxis = d3.axisBottom(xscale);

        //clear canvas before redrawing
        svgContainer.selectAll("*").remove();

        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('fill', 'gray')
            .attr('x', d => xscale(d.median_aqi))
            .attr('y', d => yscale(d.year) - 1)
            .attr('width', d => xscale(d.max_aqi - d.median_aqi))
            .attr('height', 3);

        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('fill', 'gray')
            .attr('cx', d => xscale(d.percentile_90_aqi))
            .attr('cy', d => yscale(d.year))
            .attr('r', 5);


        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${margin.top - 10})`)
            .call(yaxis)
            .attr('font-size', "14px")
            .attr('color','gray')
            .call(g => g.append("text")
            .attr("x", -6)
            .attr("y", -3)
            .attr("fill", "gray")
            .attr("text-anchor", "end")
            .text('Year'));

        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${height + margin.top})`)
            .call(xaxis)
            .attr('font-size', "14px")
            .attr('color','gray')
            .call(g => g.append("text")
            .attr("x", width)
            .attr("y", 25)
            .attr("fill", "gray")
            .attr("text-anchor", "center")
            .text('AQI'));
    })
        
    return (
        <svg
            ref = {svgRef}
            style={{
                height: 350,
                width: 400,
                marginRight: "0px",
                marginLeft: "0px",
              }}
        >
        </svg>
    );
}