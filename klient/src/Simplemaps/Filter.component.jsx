import React, {useEffect, useState} from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Checkbox, FormControlLabel} from "@mui/material";
import Box from "@mui/material/Box";

const Filter = ({ filtersChanged }) => {
    const [checked, setChecked] = useState([true, true, true, true]);
    const [oldFilters, setOldFilters] = useState(['lasteaed', 'põhikool', 'gümnaasium', 'kutseõppeasutus']);

    const handleChange1 = (event) => {
        setChecked([event.target.checked, event.target.checked, event.target.checked, event.target.checked]);
    };

    const handleChange2 = (event) => {
        setChecked([event.target.checked, checked[1], checked[2], checked[3]]);
    };

    const handleChange3 = (event) => {
        setChecked([checked[0], event.target.checked, checked[2], checked[3]]);
    };

    const handleChange4 = (event) => {
        setChecked([checked[0], checked[1], event.target.checked, checked[3]]);
    };

    const handleChange5 = (event) => {
        setChecked([checked[0], checked[1], checked[2], event.target.checked]);
    };

    useEffect(() => {
        const schoolTypes = ['lasteaed', 'põhikool', 'gümnaasium', 'kutseõppeasutus'];
        const filteredSchools = checked.map((bool, i) => {
            if (bool) {
                return schoolTypes[i];
            } return null;
        }).filter(item => !!item);

        if (JSON.stringify(oldFilters) !== JSON.stringify(filteredSchools)) {
            filtersChanged(filteredSchools);
            setOldFilters(filteredSchools);
        }
    }, [checked, filtersChanged, oldFilters]);

    const children = (
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            <FormControlLabel
                label="Lasteaiad"
                control={<Checkbox
                    size={window.innerWidth < 600 ? 'small' : 'medium'}
                    checked={checked[0]} onChange={handleChange2} />}
            />
            <FormControlLabel
                label="Põhikoolid"
                control={<Checkbox
                    size={window.innerWidth < 600 ? 'small' : 'medium'}
                    checked={checked[1]} onChange={handleChange3} />}
            />
            <FormControlLabel
                label="Gümnaasiumid"
                control={<Checkbox
                    size={window.innerWidth < 600 ? 'small' : 'medium'}
                    checked={checked[2]} onChange={handleChange4} />}
            />
            <FormControlLabel
                label="Kutseõppeasutused"
                control={<Checkbox
                    size={window.innerWidth < 600 ? 'small' : 'medium'}
                    checked={checked[3]} onChange={handleChange5} />}
            />
        </Box>
    );

    return (
        <div>
            <FormControlLabel
                label="Kõik koolid"
                control={
                    <Checkbox
                        size={window.innerWidth < 600 ? 'small' : 'medium'}
                        checked={checked[0] && checked[1] && checked[2] && checked[3]}
                        indeterminate={new Set(checked).size !== 1}
                        onChange={handleChange1}
                    />
                }
            />
            {children}
        </div>
    );
};
export default Filter;