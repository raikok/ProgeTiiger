import React, {useCallback, useEffect, useImperativeHandle, useState} from "react";
import spendingData from "../Datamaps/mockSpendingData.json";

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import axios from "axios";
import InputDataFilter from "../Simplemaps/InputDataFilter.component";
import statData from "../Datamaps/mockStatisticsData.json";
import Grid2 from "@mui/material/Unstable_Grid2";

const SliderComponent = ({ sliderChanged, chosenSchools, zoom, filterChanged }) => {
    const [value, setValue] = useState([2014, 2021]);
    const [spending, setSpending] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [loadingSum, setLoading] = useState(false);
    const [init, setInit] = useState(true);
    const [perChild, setPerChild] = useState(1);

    const marks = [
        {
            value: 2014,
            label: '2014',
        },
        {
            value: 2015,
            label: '2015',
        },
        {
            value: 2016,
            label: '2016',
        },
        {
            value: 2017,
            label: '2017',
        },
        {
            value: 2018,
            label: '2018',
        },
        {
            value: 2019,
            label: '2019',
        },
        {
            value: 2020,
            label: '2020',
        },
        {
            value: 2021,
            label: '2021',
        },
    ];

    const loadSpending = useCallback(async () => {
        setSpending(spendingData);// mock data

        /*await new Promise(async resolve => {
            if (!spending || spending.length === 0) {
                const result = await axios.get("/api/values/spending");
                if (result.data) {
                    setSpending(result.data);
                    resolve();
                }
            }
        });*/
    }, [spending, setSpending]);


    const loadStats = useCallback(async () => {
        setStatistics(statData); // mock data

        /*await new Promise(async resolve => {
            if (!statistics || statistics.length === 0) {
                const values = await axios.get("/api/values/statistics");
                if (values.data) {
                    setStatistics(values.data);
                    resolve();
                }
            }
        });*/
    }, [statistics, setStatistics]);

    const getChildrenByAgeGroup = useCallback((input) => {
        let output = 0;
        if (chosenSchools.includes('gümnaasium') || chosenSchools.includes('kutseõppeasutus')) {
            output += input['gümnaasium'];
        }
        if (chosenSchools.includes('põhikool')) {
            output += input['põhikool'];
        }
        if (chosenSchools.includes('lasteaed')) {
            output += input['lasteaed'];
        }
        return output;
    }, [chosenSchools]);

    const getSumOnYears = useCallback((years, oldYears, perChild) => {
        setLoading(true);

        const sum = spending.map((state, index) => {
            let totalSpendingForState = 0;
            let lastSpendingForState = 0;
            let absoluteSpending = 0;
            let childrenByAgeGroup = 1;

            Object.keys(state).forEach((yearKey) => {
                const year = yearKey.split('_')[0];

                let divider = 1;
                if (year !== 'maakonna' && statistics[state.maakonna_nimi]) {
                    childrenByAgeGroup = getChildrenByAgeGroup(statistics[state.maakonna_nimi][year]);
                    if (perChild === 2) {
                        divider = childrenByAgeGroup;
                    }
                }

                if (Number(year) >= years[0] && Number(year) <= years[1]) {
                    const spending = state[yearKey];
                    totalSpendingForState += spending / divider;
                    absoluteSpending += spending;
                }

                if (Number(year) >= oldYears[0] && Number(year) <= oldYears[1]) {
                    const spending = state[yearKey];
                    lastSpendingForState += spending / divider;
                }
            });

            return {
                maakonnaNimi: state.maakonna_nimi,
                totalSpending: totalSpendingForState,
                lastSpending: lastSpendingForState,
                absoluteSpending: absoluteSpending,
                childrenByAgeGroup: childrenByAgeGroup
            };
        }).sort((a, b) =>
            (a.totalSpending > b.totalSpending) ? -1 : 1);

        setLoading(false);
        return sum;
    }, [spending, getChildrenByAgeGroup, statistics]);

    const handleChange = useCallback((event, newValue, perChild, init) => {
        if (init || JSON.stringify(value) !== JSON.stringify(newValue)) {
            if (!loadingSum) {
                sliderChanged(newValue, getSumOnYears(newValue, value, perChild));
            }
            setValue(newValue);
        }
    }, [getSumOnYears, sliderChanged, value, loadingSum]);

    useEffect(() => {
        loadSpending().then(() => {
            loadStats().then(() => {
                handleChange(value, value, 1, init);
                setInit(false);
            })
        });
    }, [handleChange, loadSpending, loadStats, value, init]);

    useEffect(() => {
        handleChange(value, value, perChild, true);
    }, [chosenSchools, handleChange, perChild, value]);

    function valuetext(value) {
        return `${value}°C`;
    }

    function valueLabelFormat(value) {
        return marks.findIndex((mark) => mark.value === value) + 1;
    }

    return (<div>
        {zoom < 4 && <InputDataFilter filtersChanged={val => {
            setPerChild(Number(val));
            filterChanged(Number(val))
        }}></InputDataFilter>}

        <Grid2 xs={9}>
            <Slider
                value={value}
                valueLabelFormat={valueLabelFormat}
                onChange={(oldValue, newValue) => handleChange(oldValue, newValue, perChild, false)}
                getAriaLabel={() => 'Years range'}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={null}
                marks={marks}
                min={2014}
                max={2021}
            />
        </Grid2>
    </div>);
};
export default SliderComponent;