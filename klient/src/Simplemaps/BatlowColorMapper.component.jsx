import React from 'react';
import chroma from 'chroma-js';

const BatlowColorMapper = ({ maxValue, currentValue }) => {
    const getColor = (maxValue, currentValue) => {
        const batlowKeyColors = [
            '#440154',
            '#3B528B',
            '#21908C',
            '#22A884',
            '#44AA00',
            '#7FC97F',
            '#BFE392'
        ];

        const colorScale = chroma.scale(chroma.bezier(batlowKeyColors)).domain([0, maxValue]).mode('lch').colors(256);
        const colorIndex = Math.floor((currentValue / maxValue) * (colorScale.length - 1));
        const hexColor = colorScale[colorIndex];

        return hexColor;
    };

    return getColor(maxValue, currentValue);
};
export default BatlowColorMapper;