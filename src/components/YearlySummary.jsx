import React, {useEffect, useRef} from 'react'
import * as d3 from 'd3';

export default function YearlySummary(props){
    const svgRef = useRef(null);
    let svgContainer = d3.select(svgRef.current);

    useEffect (() => {
        if(!props.data) return
        const {data, year} = props;
        
        const dataObj = data[year];
        const summaryData = [
            {type: "Good", value: dataObj?.good_days},
            {type: "Moderate", value: dataObj?.moderate_days},
            {type: "Unhealthy (Sensitive)", value: dataObj?.unhealthy_sensitive_days},
            {type: "Unhealthy", value: dataObj?.unhealthy_days},
            {type: "V. Unhealthy",  value: dataObj?.very_unhealthy_days},
            {type: "Hazardous", value: dataObj?.hazardous_days}
        ];

        const margin = {top: 20, right: 20, left: 100, bottom:30};
        const [boxSize, interval] = [80, 20]
        const colors = ['#A9D18E', '#FFD966', '#F4B183', '#FF5050', '#7030A0', '#C00000'];

        svgContainer.selectAll("*").remove();

        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .selectAll('rect')
            .data(summaryData)
            .join('rect')
            .attr('fill', (d,i) => colors[i])
            .attr('x', (d,i) => i*boxSize + interval)
            .attr('y', 0)
            .attr('width', boxSize - interval)
            .attr('height', 35)

        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .selectAll('text')
            .data(summaryData)
            .join('text')
            .attr('x', (d,i) => i*boxSize + interval + 5)
            .attr('y', 27)
            .attr('font-size', "28px")
            .attr('fill','white')
            .text(d => d.value)
        
        svgContainer
            .append('g')
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .selectAll('text')
            .data(summaryData)
            .join('text')
            .attr('x', (d,i) => i*boxSize + interval)
            .attr('y', 50)
            .attr('font-size', "12px")
            .attr('fill','gray')
            .text(d => d.type)
            
        svgContainer
            .append('g')
            .attr("transform", `translate(${0},${margin.top})`)
            .append('text')
            .attr('x', 30)
            .attr('y', 25)
            .attr('font-size', "20px")
            .attr('fill','gray')
            .text("# Days")

    });

    return (
        <svg
            ref = {svgRef}
            style={{
                align: 'center',
                height: 75,
                width: '60%',
                marginRight: "0px",
                marginLeft: "0px",
              }}
        >
        </svg>
    );
}