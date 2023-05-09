//import { useCallback, useState, useEffect } from "react"
//import React from "react";
import {ComposableMap, Geographies, Geography, Marker, ZoomableGroup} from 'react-simple-maps';
import jsonData from "../Datamaps/mockData.json";
import statData from "../Datamaps/mockStatisticsData.json";
import maakond from '../Datamaps/maakond.topo.json';
import omavalitsus from '../Datamaps/omavalitsus.topo.json';
import maakondCentroids from '../Datamaps/maakond.centroids.json';

import React, {useCallback, useEffect, useState} from "react";
import {animated, useSpring} from 'react-spring'
import SliderComponent from "../SliderComponent/Slider.component";
import {Container, Popover, Typography} from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Grid from "@mui/material/Unstable_Grid2";
import Filter from "./Filter.component";
import BatlowColorMapper from "./BatlowColorMapper.component";
import axios from "axios";

const Simplemaps = () => {
    const [data, setData] = useState(maakond);
    const [zoom, setZoom] = useState(1);
    const [extra, setExtra] = useState(null);
    const [schools, setSchools] = useState([]);
    const [filters, setFilters] = useState(['lasteaed', 'põhikool', 'gümnaasium', 'kutseõppeasutus']);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [spendings, setSpendings] = useState([]);
    const [years, setYears] = useState([]);
    const [popupLocation, setPopupLocation] = useState(null);
    const [popupValue, setPopupValue] = useState(null);
    const [popupValue2, setPopupValue2] = useState(null);
    const [perChild, setPerChild] = useState(1);

    const handleMarkerEnter = (event, value) => {
        setPopupLocation({ left: event.pageX + 10, top: event.pageY + 10 });
        setPopupValue(value.kooli_nimi);
        setPopupValue2(value);
    };

    const handleClose = () => {
        setPopupLocation(null);
        setPopupValue(null);
        setPopupValue2(null);
    };

    const open = Boolean(popupLocation);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        if (zoom > 4) {
            setData(omavalitsus);
        } else {
            setData(maakond);
        }
    }, [zoom]);

    useEffect(() => {
        if (extra) {
            setExtra(extra);
        }
    }, [extra]);

    const zoomChanged = (a) => {
        handleClose();
        setZoom(a.k);
    }

    const checkIfFilterMatches = (schoolType, filters) => {
        let value = false;
        filters.forEach(filter => {
            if (schoolType.includes(filter)) {
                value = true;
                return true;
            }
        });
        return value;
    }

    const filterSchools = useCallback(filters => {
        setFilteredSchools(schools?.filter(school =>
            checkIfFilterMatches(school.kooli_aste, filters)));
    }, [schools]);

    const loadSchools = useCallback(async () => {
        if (!schools || schools.length === 0) {
            setSchools(jsonData) // mock data
            filterSchools(filters);
        }
        /*if (!schools || schools.length === 0) {
            const values = await axios.get("/api/values/all");
            if (values.data) {
                setSchools(values.data);
                if (filteredSchools.length === 0) {
                    filterSchools(filters);
                }
            }
        }*/
        //setSchools(jsonData.data);
    }, [schools, filterSchools, filteredSchools.length, filters]);

    useEffect(() => {
        loadSchools();
    }, [loadSchools]);

    const sliderChanged = useCallback((years, sums) => {
        setYears(years);
        setSpendings(sums.map((sumObj) => {
            return { ...sumObj, ...maakondCentroids[sumObj.maakonnaNimi] };
        }));
    }, []);

    const zoomStyling = () =>
        zoom < 4 ? {
            default: {
                fill: "#bbbbd9",
                stroke: "#607D8B",
                strokeWidth: 0.3,
                outline: "#0000ff"
            },
            hover: {
                fill: "#b4b4d2",
                stroke: "#4f6772",
                strokeWidth: 0.4,
                outline: "#0000ff"
            }
        } : {
            default: {
                fill: "#bbbbd9",
                stroke: "#607D8B",
                strokeWidth: 0.1,
                outline: "#0000ff"
            },
            hover: {
                fill: "#b4b4d2",
                stroke: "#607D8B",
                strokeWidth: 0.1,
                outline: "#0000ff"
            }
        }

    function Circle({ lastSize, toSize, val, color }) {
        // Use the useSpring hook to create an animation based on the value

        const sizeAnimation = useSpring({
            from: { size: lastSize },
            to: { size: toSize },
            config: { duration: 100 }
        });

        return (
            <animated.circle
                r={sizeAnimation.size}
                onClick={() => console.log(val)}
                fill={color}
            />
        );
    }

    function displayAmount(input) {
        let amount;
        if (input > 10000) {
            amount = (Math.floor(input * 10) / 10).toLocaleString('et');
        } else {
            amount = Math.floor(input * 100) / 100;
        }
        if (typeof amount === 'number' && isNaN(amount)) amount = 0;
        return amount;
    }

    function DisplaySpendingMarkers() {
        if (zoom < 4 && spendings && spendings.length > 0) {
            const maxSpending = Math.max(...spendings.map(value => value.totalSpending));
            const lastMaxSpending = Math.max(...spendings.map(value => value.lastSpending));

            return spendings.map((val) => {
                const radius = Number(val.totalSpending) / maxSpending * 15 + 5 || 0;
                const lastRadius = Number(val.lastSpending) / lastMaxSpending * 15 + 5 || 0;
                const color = BatlowColorMapper({maxValue: maxSpending, currentValue: val.totalSpending});

                return (<Marker key={val.maakonnaNimi.toString()} coordinates={[val.long, val.lat]}>
                    <Circle lastSize={lastRadius} toSize={radius} val={val} color={color}/>
                    <text style={{fill: 'whitesmoke', 'paintOrder': 'stroke', 'stroke': '#000000', 'strokeWidth': radius / 9 + 'px' }} x={-radius * 1.6} fontSize={radius}>{ displayAmount(val.totalSpending) } €</text>
                </Marker>);
            });
        } else {
            return '';
        }
    }

    function DisplaySchoolMarkers() {
        if (zoom > 4 && filteredSchools && filteredSchools.length > 0) {
            return filteredSchools.map((val, i) => {
                const fill = '#F' + val.kooli_id.toString();
                return (<Marker key={val.kooli_id.toString()} coordinates={[val.long, val.lat]}>
                    <circle r={1} onMouseEnter={(event) => handleMarkerEnter(event, val)} onMouseLeave={handleClose} fill={fill}/>
                </Marker>);
            });
        } else {
            return '';
        }
    }

    function DisplaySchoolDialog() {
        if (zoom > 4 && filteredSchools && filteredSchools.length > 0) {
            let spendingAmount = 0;
            if (popupValue2) {
                for (let i = years[1]; i >= years[0]; i--) {
                    Object.keys(popupValue2).forEach(year => {
                        if (year.includes(i)) {
                            spendingAmount += popupValue2[year];
                        }
                    })
                }
            }

            return (
                <div>
                    <Popover
                        id={id}
                        open={open}
                        sx={{
                            pointerEvents: 'none',
                        }}
                        anchorReference="anchorPosition"
                        anchorPosition={popupLocation}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <Typography variant="body2" sx={{ p: 1 }}>{popupValue}</Typography>
                        <Typography variant="caption" sx={{ p: 0.5 }}>Toetussumma valitud vahemikus: {displayAmount(spendingAmount)} €</Typography>
                    </Popover>
                </div>
            );
        } else {
            return '';
        }
    }

    return (
        <div>
            <Container>
                    <Typography align="center" variant="h5" sx={{ p: 2 }}>ProgeTiigri taotlusvooru andmete kaart</Typography>
                <Grid spacing={5} container>
                    <Grid xs={7}>
                        {zoom > 4 && <Grid></Grid>}
                        <SliderComponent sliderChanged={sliderChanged} chosenSchools={filters} zoom={zoom} filterChanged={setPerChild}/>
                        <Grid>
                            <Typography variant="body1" sx={{ p: 1 }}>Maakond: {extra?.MNIMI}</Typography>
                            <Typography variant="body2" sx={{ p: 1 }}>{extra?.ONIMI ? 'Vald või linn: ' + extra.ONIMI : null}</Typography>
                        </Grid>
                    </Grid>
                    <Grid xs={4}>
                        <Grid></Grid>
                        {(perChild === 2 || zoom > 4) &&
                            <Filter filtersChanged={(event) => {
                            filterSchools(event);
                            setFilters(event);
                        }}></Filter>}
                    </Grid>
                </Grid>
            </Container>
            {zoom > 4 && <Grid><br></br></Grid>}
            <ComposableMap projection="geoMercator" projectionConfig={{center: [25, 58.5], scale: 6000}}>
                <ZoomableGroup onMove={zoomChanged} maxZoom={50}>
                    <Geographies geography={data}>
                        {({ geographies }) => geographies.map(geo =>
                            <Geography key={geo.rsmKey}
                                       geography={geo}
                                       onMouseEnter={() => {
                                           setExtra(geo.properties);
                                       }}
                                       onMouseLeave={handleClose}
                                       style={zoomStyling()}
                            />)}
                    </Geographies>

                    <DisplaySpendingMarkers/>
                    <DisplaySchoolDialog/>
                    <DisplaySchoolMarkers/>
                </ZoomableGroup>
            </ComposableMap>
        </div>);
};
// projectionConfig={{x: 464, y: -5, scale: 280}} height={406} width={29}
export default Simplemaps;