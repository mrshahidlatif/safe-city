import React, {useEffect, useRef, useState} from 'react'
import * as d3 from 'd3';
import SlopeChart from '../charts/slopegraph';
import { filterWeight } from 'topojson';

export default function AQISlopeGraph(props){
    const svgRef = useRef(null);
    let svgContainer = d3.select(svgRef.current);
    // console.log('Props AQISlopeGraph:', props);
    
    // years for comparison
    let years = [2010, 2021];

    // prepare data for slope graph
    let slopeData = [];
    for (const [key, value] of Object.entries(props.data)){
        for (const year of years) {
            if (!value[year]) continue
            slopeData.push({
                year: value[year]['year'],
                aqi: value[year] ? value[year]['median_aqi'] : 0,
                county: key
            });

        }
    };

    // filtering data for clutter reduction
    let filterCounties = [];
    const diffs = [];
    const counties = [...new Set(slopeData.map(d => d.county))];
    for (const county of counties){
        const vals = slopeData.filter(d => d.county == county)
        if (vals.length < 2) continue;
        const diff = +vals[0].aqi - +vals[1].aqi
        if(Math.abs(diff) > 20){
            diffs.push({diff, county});
            filterCounties.push(...vals)
        }
    }
    const extrema = d3.extent(diffs, d => d.diff );
    const minCounty = diffs.find(d => d.diff === extrema[0] )
    const maxCounty = diffs.find(d => d.diff === extrema[1] )
    console.log('Diffs', slopeData, filterCounties );
    useEffect (() => {
        // if(!props.data) return
        
        let svg = SlopeChart(filterCounties, {
            x: d => d.year,
            y: d => +d.aqi,
            z: d => d.county,
            width:450,
            height: 500,
            strokeOpacity: 0.6
          });

        svgContainer.selectAll("*").remove();
        d3.select(svgRef.current).append(function(){return svg;});

    });

    return (
        <>
            <br></br>
            <br></br>
            <div className='subtitle'>
            Improvement/Deterioration of Air Quality in 10 Years
            </div>
            <div className='para'>
                Out of {slopeData.length} counties, {filterCounties.length} counties experienced a significant change in their air quality. Among these, <span>{minCounty.county}</span> has shown the maximum improvement while <span>{maxCounty.county}</span>'s air quality has deteriorated.
            </div>
            <svg
                ref = {svgRef}
                style={{
                    align: 'center',
                    height: 520,
                    width: '100%',
                    display:'block',
                    margin: 'auto'
                }}
            >
            </svg>
        </>
    );
}