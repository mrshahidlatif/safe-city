import React, {useEffect, useRef} from 'react'
import * as d3 from 'd3';
import Calendar from '../charts/calendar';

export default function AQIDailyPlot(props){
    const svgRef = useRef(null);

    const margin = {top: 50, right: 20, left: 50, bottom:30};

    const height = 350 - margin.top - margin.bottom;
    const width = 400 - margin.left - margin.right;

    let svgContainer = d3.select(svgRef.current);

    useEffect (() => {
        if(!props.data) return
        const data = Object.values(props.data);
        let svg = Calendar(data, {
            x: (d) => new Date(d.date + 'Z'),
            y: d => +d.aqi
        });

        svgContainer.selectAll("*").remove();
        d3.select(svgRef.current).append(function(){return svg;});
    });
    return (
        <svg
            ref = {svgRef}
            style={{
                align: 'center',
                height: 180,
                width: '100%',
                marginRight: "0px",
                marginLeft: "0px",
              }}
        >
        </svg>
    );
}