import React, {useEffect, useRef, useState} from 'react'
import * as d3 from 'd3';

export default function AQIDistributionPlot(props){
    const svgRef = useRef(null);
    const [selectedYear, setSelectedYear] = useState('2022')

    const margin = {top: 50, right: 20, left: 50, bottom:30};

    const height = 350 - margin.top - margin.bottom;
    const width = 400 - margin.left - margin.right;

    let svgContainer = d3.select(svgRef.current);

    useEffect(() => {
        props.handleYearSelection(selectedYear);
    })

    useEffect (() => {
        if(!props.data) return
        const data = Object.values(props.data);

        let xscale = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.max_aqi)])
            .range([0, width]);
        
        let yscale = d3.scaleBand()
            .domain(data.map(d=>d.year))
            .range([0, height])
            .padding(0.1);
        
        const colorPicker = d3.scaleThreshold()
            .domain([50, 100, 150, 200, 300, 500])
            .range(['green', 'yellow', 'orange', 'red', 'purple', 'maroon']);
        
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
            .attr('y', d => yscale(d.year))
            .attr('width', d => xscale(d.max_aqi) - xscale(d.median_aqi))
            .attr('height', 5)

        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('fill', 'gray')
            .attr('cx', d => xscale(d.percentile_90_aqi))
            .attr('cy', d => yscale(d.year) + 2) //+2 to center the circles
            .attr('r', 5);

        svgContainer
            .append('g')
            .attr("transform", `translate(${0},${margin.top})`)
            .selectAll('text')
            .data(data)
            .join('text')
            .attr('class', 'yearLabel')
            .attr('font-size', "14px")
            .attr('color','gray')
            .attr("x", 5)
            .attr("y", d => yscale(d.year) + 2)
            .text(d => d.year)
            .on('click', function (e, d) {
                //TODO: properly handle highlighting!
                console.log('Selection', d)
                d3.select(this).attr('color', 'black');
                setSelectedYear(d.year.toString());
            });

        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${height + margin.top})`)
            .call(xaxis)
            .attr('font-size', "14px")
            .attr('color','gray');

    });
        
    return (
        <>
            <div className='chartTitle'>
                Air Quality Index Over the Years
            </div>
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
        </>
    );
}