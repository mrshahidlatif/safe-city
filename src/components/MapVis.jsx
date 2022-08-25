import React, {useEffect, useRef} from 'react'
import * as d3 from 'd3';
import * as topojson from 'topojson';
import Choropleth from '../charts/choropleth';

export default function MapVis(props){
    const svgRef = useRef(null);
    console.log('Map Props:', props.data);
    let svgContainer = d3.select(svgRef.current);

    useEffect (() => {
        if(!props.data) return
        const {data, usTopoJSON, year} = props;
        const US = usTopoJSON.objects.counties.geometries;
        const counties = topojson.feature(usTopoJSON, usTopoJSON.objects.counties);
        const states = topojson.feature(usTopoJSON, usTopoJSON.objects.states);
        const statemap = new Map(states.features.map(d => [d.id, d]));
        const statemesh = topojson.mesh(usTopoJSON, usTopoJSON.objects.states, (a, b) => a !== b)

        const mapData = [];
        for (const [key, value] of Object.entries(props.data)){
            mapData.push({
                id: US.find(d => d.properties.name === key)?.id,
                aqi: + value[year]?.median_aqi,
                county: key
            });
        };

        let svg = Choropleth(mapData, {
            id: d => d.id,
            value: d => d.aqi,
            scale: d3.scaleQuantize,
            domain: [0, 150],
            // range: d3.schemeBlues[9],
            title: (f, d) => `${f.county}, ${statemap.get(f.id.slice(0, 2)).properties.name}\n${d?.aqi}`,
            features: counties,
            borders: statemesh,
            width: 975,
            height: 610
        });

        svgContainer.selectAll("*").remove();
        d3.select(svgRef.current).append(function(){return svg;});
    });

    return (
        <svg
            ref = {svgRef}
            style={{
                align: 'center',
                height: 610,
                width: '100%',
                display:'block',
                margin: 'auto'
              }}
        >
        </svg>
    );
}