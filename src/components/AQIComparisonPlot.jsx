import React, {useEffect, useRef, useState} from 'react'
import * as d3 from 'd3';

export default function AQIDistributionPlot(props){
    const svgRef = useRef(null);
    const [selectedYear, setSelectedYear] = useState('2022')

    const margin = {top: 50, right: 20, left: 150, bottom:30};

    const height = 350 - margin.top - margin.bottom;
    const width = 400 - margin.left - margin.right;

    let svgContainer = d3.select(svgRef.current);

    useEffect (() => {
        if(!props.data || !props.county) return
        console.log('AQIComparisonPlot', props);

        const data = [];
        for (const [key, val] of Object.entries(props.data)){
            if (val[props.year]) //only if value exists
                data.push({
                    county: key, 
                    medianAQI: +val[props.year]['median_aqi'] || 0,
                    maxAQI: +val[props.year]['max_aqi'] || 0,
                    percentile90AQI: +val[props.year]['percentile_90_aqi'] || 0,
                });
        }
        const sortedData = data.sort((a,b) => d3.ascending(a.medianAQI, b.medianAQI));
        const comparisonData = [...sortedData.splice(0,5), 
            sortedData.find((c) => c.county == props.county), 
            ...sortedData.splice(-5)
            ];
        
        console.log('data', comparisonData);
        let xscale = d3.scaleLinear()
            .domain([0, d3.max(comparisonData, d => d?.maxAQI)])
            .range([0, width]);
        
        let yscale = d3.scaleBand()
            .domain(comparisonData.map(d=>d?.county))
            .range([0, height])
            .padding(0.1);
        
        const colorPicker = d3.scaleThreshold()
            .domain([50, 100, 150, 200, 300, 500])
            .range(['green', 'yellow', 'orange', 'red', 'purple', 'maroon']);
        
        const xaxis = d3.axisBottom(xscale).ticks(5)
       
        //clear canvas before redrawing
        svgContainer.selectAll("*").remove();

        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .selectAll('rect')
            .data(comparisonData)
            .join('rect')
            .attr('fill', 'gray')
            .attr('x', d => xscale(d.medianAQI))
            .attr('y', d => yscale(d.county))
            .attr('width', d => xscale(d?.maxAQI) - xscale(d.medianAQI))
            .attr('height', 5);

        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .selectAll('circle')
            .data(comparisonData)
            .join('circle')
            .attr('fill', 'gray')
            .attr('cx', d => xscale(d.percentile90AQI))
            .attr('cy', d => yscale(d.county) + 2) //+2 to center the circles
            .attr('r', 5);

        svgContainer
            .append('g')
            .attr("transform", `translate(${0},${margin.top})`)
            .selectAll('text')
            .data(comparisonData)
            .join('text')
            .attr('class', 'countyLabel')
            .attr('font-size', "14px")
            .attr('font-weight', d => d.county === props.county ? 'bold': 'normal')
            .attr('color','gray')
            .attr("x", 5)
            .attr("y", d => yscale(d.county) + 2)
            .text(d => d.county)

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
                Comparison of Air Quality Index with Other Counties
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