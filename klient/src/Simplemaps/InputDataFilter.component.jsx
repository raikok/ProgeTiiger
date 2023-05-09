import React, {useEffect, useState} from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import Box from "@mui/material/Box";

const InputDataFilter = ({ filtersChanged }) => {
    const [value, setValue] = React.useState(1);

    const handleChange = (event) => {
        setValue(event.target.value);
        filtersChanged(event.target.value);
    };

    return (
        <FormControl>
            <FormLabel>Toetuste võrdlus</FormLabel>
            <RadioGroup
                aria-labelledby="radio-buttons-group"
                name="radio-buttons-group"
                value={value}
                onChange={handleChange}
            >
                <FormControlLabel value={1} control={<Radio />} label="Kogusumma" />
                <FormControlLabel value={2} control={<Radio />} label="Toetus õpilase kohta" />
            </RadioGroup>
        </FormControl>
    );
};
export default InputDataFilter;