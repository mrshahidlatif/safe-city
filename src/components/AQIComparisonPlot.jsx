import React, {useEffect, useRef, useState} from 'react'
import * as d3 from 'd3';

export default function AQIDistributionPlot(props){
    const svgRef = useRef(null);

    const margin = {top: 60, right: 20, left: 150, bottom:30};

    const height = 350 - margin.top - margin.bottom;
    const width = 400 - margin.left - margin.right;

    let svgContainer = d3.select(svgRef.current);
    const {year, county} = props;
    const [foundCounty, setFoundCounty] = useState(true);

    useEffect (() => {
        if(!props.data || !props.county) return
        const {year, county} = props;
        const data = [];
        for (const [key, val] of Object.entries(props.data)){
            if (!val[year]) {
                continue
            } 
            data.push({
                county: key,
                medianAQI: +val[year]['median_aqi'] || 0,
                maxAQI: +val[year]['max_aqi'] || 0,
                percentile90AQI: +val[year]['percentile_90_aqi'] || 0,
            });
        }
        const sortedData = data.sort((a,b) => d3.ascending(a.medianAQI, b.medianAQI));
        const activeCounty = sortedData.find((c) => c.county == county);
        setFoundCounty(!(activeCounty == undefined));

        //comparison not possible due to missing AQI data of the selected county
        if(!activeCounty) {
            svgContainer.selectAll("*").remove();
            return
        }

        const comparisonData = [...sortedData.slice(0,5), 
            activeCounty, 
            ...sortedData.slice(-5)
            ];

        let xscale = d3.scaleLinear()
            .domain([0, d3.max(comparisonData, d => d?.maxAQI)])
            .range([0, width]);
        
        let yscale = d3.scaleBand()
            .domain(comparisonData.map(d=>d?.county))
            .range([0, height])
            .padding(0.1);
        
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
            .attr('width', d => xscale(d.maxAQI) - xscale(d.medianAQI))
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
            .attr('font-weight', d => d.county === county ? 'bold': 'normal')
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
        
        //Legend
        const legend = svgContainer
            .append('g')
            .attr("transform", `translate(${50},${margin.top})`);

        legend.append('rect')
            .attr('fill', 'gray')
            .attr('x', width/2 - 75)
            .attr('y', -30)
            .attr('width', 150)
            .attr('height', 5);

        legend
            .append('circle')
            .attr('fill', 'gray')
            .attr('cx', width/2)
            .attr('cy', -28) //+2 to center the circles
            .attr('r', 5);
        
        legend
            .append('text')
            .attr('fill', 'gray')
            .attr('font-size', "12px")
            .attr('x', width/2 - 120)
            .attr('y', -25) //+2 to center the circles
            .text('median');

        legend
            .append('text')
            .attr('fill', 'gray')
            .attr('font-size', "12px")
            .attr('x', width/2 + 80)
            .attr('y', -25) //+2 to center the circles
            .text('max');
        
        legend
            .append('text')
            .attr('fill', 'gray')
            .attr('font-size', "12px")
            .attr('x', width/2 - 5)
            .attr('y', -38) //+2 to center the circles
            .text('329d have lower value than this');

    });
        
    return (
        <>
            <div className='chartTitle'>
                Air Quality of <b>{county}</b> with Top / bottom 5 Counties, <b>{year}</b>
            </div>
            {!foundCounty && <div className='error'> Not found </div>}
            <svg
                ref = {svgRef}
                style={{
                    height: 380,
                    width: 400,
                    display:'block',
                    margin: 'auto',
                }}
            >
            </svg>
        </>
    );
}