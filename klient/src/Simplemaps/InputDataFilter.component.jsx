import React from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";

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
                <FormControlLabel value={1} control={<Radio size={window.innerWidth < 600 ? 'small' : 'medium'} />} label="Kogusumma" />
                <FormControlLabel value={2} control={<Radio size={window.innerWidth < 600 ? 'small' : 'medium'} />} label="Toetus õpilase kohta" />
            </RadioGroup>
        </FormControl>
    );
};
export default InputDataFilter;