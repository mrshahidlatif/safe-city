import React, {useEffect, useRef} from 'react'
import * as d3 from 'd3';
import Calendar from '../charts/calendar';

export default function AQIDailyPlot(props){
    const svgRef = useRef(null);

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
                width: '85%',
                display:'block',
                margin: 'auto'
              }}
        >
        </svg>
    );
}