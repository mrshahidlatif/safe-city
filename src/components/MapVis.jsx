import React, {useEffect, useRef, useState} from 'react'
import * as d3 from 'd3';
import * as topojson from 'topojson';
import Choropleth from '../charts/choropleth';
import Legend from "../charts/legend";

import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default function MapVis(props){
    const svgRef = useRef(null);
    let svgContainer = d3.select(svgRef.current);
    const [aqiMeasure, setAqiMeasure] = useState('3');

    const aqiMeasures = [
        { label: 'Median', measure: 'median_aqi', value: '1' },
        { label: '90th Percentile', measure: 'percentile_90_aqi', value: '2' },
        { label: 'Max', measure: 'max_aqi', value: '3' },
      ];

    useEffect (() => {
        if(!props.data) return
        const {usTopoJSON, year} = props;
        const US = usTopoJSON.objects.counties.geometries;
        const counties = topojson.feature(usTopoJSON, usTopoJSON.objects.counties);
        const states = topojson.feature(usTopoJSON, usTopoJSON.objects.states);
        const statemap = new Map(states.features.map(d => [d.id, d]));
        const statemesh = topojson.mesh(usTopoJSON, usTopoJSON.objects.states, (a, b) => a !== b)

        const mapData = [];
        const measure = aqiMeasures.find(m => m.value === aqiMeasure)?.measure;
        for (const [key, value] of Object.entries(props.data)){
            mapData.push({
                id: US.find(d => d.properties.name === key)?.id,
                aqi: value[year] ? value[year][measure] : 0,
                county: key
            });
        };

        const h = 610
        const w = 975

        let svg = Choropleth(mapData, {
            id: d => d.id,
            value: d => d.aqi,
            scale: d3.scaleQuantize,
            domain: [0, d3.max(mapData, d => d.aqi)],
            title: (f, d) => `${d?.county}, ${statemap.get(f.id.slice(0, 2)).properties.name}\n AQI: ${d?.aqi}`,
            features: counties,
            borders: statemesh,
            width: w,
            height: h
        });

        svgContainer.selectAll("*").remove();

        const legend = Legend(svg.scales.color, {title: 'Air Quality Index'})

        d3.select(svgRef.current).append(function(){return svg;});
        d3.select(svgRef.current)
            .append('g')
            .attr("transform", `translate(${0},${2*h/3-75})`)
            .append(function(){return legend;});

        d3.select(svgRef.current)
            .append('g')
            .attr("transform", `translate(${w/2-15},${35})`)
            .append('text')
            .attr('font-size', 28)
            .attr('font-weight', 'bold')
            .attr('fill', '#e0dede')
            .text(props.year)
    });

    return (
        <>
            <div className='title'>
                Air Quality Across Counties in the United States
            </div>
            <div>
                <ButtonGroup>
                    {aqiMeasures.map((radio, idx) => (
                    <ToggleButton
                        size="sm"
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant='outline-secondary'
                        name="radio"
                        value={radio.value}
                        checked={aqiMeasure === radio.value}
                        onChange={(e) => setAqiMeasure(e.currentTarget.value)}
                    >
                        {radio.label}
                    </ToggleButton>
                    ))}
                </ButtonGroup> 
            </div>
            <svg
                ref = {svgRef}
                style={{
                    align: 'center',
                    height: 400,
                    width: '100%',
                    display:'block',
                    margin: 'auto'
                }}
            >
            </svg>
            <div className='footnote'>
                *Gray color indicates missing observations.
            </div>
            <div className='para'>
                The Western and Mid-western states have comparatively lower air quality. The state of <span>California</span> has the worst air quality with many counties having an AQI of above 300. <span>Platte</span> in <span>Wyoming</span> beats even <span>California</span> with an AQI of 664 - the nation-wide highest. <span>Trinity, California</span> has the second worst air quality (AQI 662).
            </div>
        </>
    );
}