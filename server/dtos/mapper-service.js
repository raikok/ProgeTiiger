function mapSchools(input) {
    return input;
}

function mapSpendingOfCounties(input) {
    return input;
}

function mapStatistics(input, input2) {
    input = JSON.parse(input);
    const map = {};

    const maakonnad = input.dimension.Maakond.category.label;
    const skipAmount = (Object.keys(maakonnad).length - 1) * 12 + 8;

    for (const key in maakonnad) {
        let year = 2014;
        const yearMap = {};

        for (let i = 0; i < input.value.length; i += skipAmount) {
            const pohikool = input.value[i] + input.value[i + 1] + input.value[i + 2] + input.value[i + 3] +
                input.value[i + 4] + input.value[i + 5] + input.value[i + 6] + input.value[i + 7] + input.value[i + 8];

            yearMap[year] = {
                lasteaed: input2.value[i],
                põhikool: pohikool,
                gümnaasium: input.value[i + 3],
            };
            year++;
        }

        map[maakonnad[key]] = yearMap;
    }

    return map;
}
function mapData(jsonData, jsonData2) {
    jsonData = JSON.parse(jsonData);
    jsonData2 = JSON.parse(jsonData2);

    const maakondLabels = jsonData.dimension.Maakond.category.label;
    const years = jsonData.dimension.Aasta.category.label;
    const pohikoolGumnaasiumValues = jsonData.value;
    const lasteaedValues = jsonData2.value;

    const maakondCount = Object.keys(maakondLabels).length;
    const yearCount = Object.keys(years).length;

    let output = {};

    Object.values(maakondLabels).forEach((maakondName, maakondIndex) => {
        output[maakondName] = {};

        Object.values(years).forEach((year, yearIndex) => {
            output[maakondName][year] = {
                lasteaed: lasteaedValues[yearIndex * maakondCount + maakondIndex],
                põhikool: 0,
                gümnaasium: 0,
            };

            for (let grade = 1; grade <= 12; grade++) {
                const gradeIndex = (grade - 1) + 12 * (yearIndex * maakondCount + maakondIndex);

                if (grade >= 1 && grade <= 9) {
                    output[maakondName][year].põhikool += pohikoolGumnaasiumValues[gradeIndex] || 0;
                } else if (grade >= 10 && grade <= 12) {
                    output[maakondName][year].gümnaasium += pohikoolGumnaasiumValues[gradeIndex] || 0;
                }
            }
        });
    })

    return output;
}

module.exports = {
    mapSchools: mapSchools,
    mapSpendingOfCounties: mapSpendingOfCounties,
    mapStatistics: mapStatistics,
    mapData: mapData
};