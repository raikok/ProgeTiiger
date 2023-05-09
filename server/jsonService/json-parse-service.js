const databaseService = require('../dbService/database-service.js');

const parseLine = (jsonFile, service) => {
    schools = [];
    counties = [];
    tags = [];

    Object.keys(jsonFile['kooli nimi']).forEach(key => { // 'kooli id', 'kooli nimi', 'maakond', 'kooli tüüp', 'seade', 'seadmete arv', 'tagid', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'
        if (key === undefined) return;
        // add all devices to database
        databaseService.addDevice(key, jsonFile['seade'][key], jsonFile['seadmete arv'][key]);

        // add all schools, years of spending and then bind schools & devices
        const schoolName = jsonFile['kooli nimi'][key];
        const schoolGrade = jsonFile['kooli tüüp'][key];
        let indexOfSchool = schools.indexOf(schoolName);
        if (indexOfSchool === -1) {
            schools.push(schoolName);
            indexOfSchool = schools.indexOf(schoolName);
            databaseService.addSchool(indexOfSchool, schoolName, schoolGrade);
            databaseService.addSpending(indexOfSchool, getYearsOfSpending(key, jsonFile));
        }
        databaseService.addDeviceSchoolBind(key, indexOfSchool);

        // add counties
        const countyName = jsonFile['maakond'][key];
        let indexOfCounty = counties.indexOf(countyName);
        if (indexOfCounty === -1) {
            counties.push(countyName);
            indexOfCounty = counties.indexOf(countyName);
            databaseService.addCounty(indexOfCounty, countyName, getMKOOD(countyName));
        }
        databaseService.addSchoolCountyBind(indexOfSchool, indexOfCounty);

        // add tag strings
        const tagString = jsonFile['tagid'][key];
        if (tagString) {
            const splitTag = tagString.split(';');
            splitTag.forEach((tagName) => {
            if (tagName && tagName !== '') {
                let indexOfTag = tags.indexOf(tagName);
                if (indexOfTag === -1) {
                    tags.push(tagName);
                    indexOfTag = tags.indexOf(tagName);
                    databaseService.addTag(indexOfTag, tagName);
                }
                databaseService.addDeviceTagBind(key, indexOfTag);
            }
            });
        }
    });
}

function getYearsOfSpending(key, jsonFile) {
    const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];
    const yearSpending = [0, 0, 0, 0, 0, 0, 0, 0];
    years.forEach((year, index) => {
        const yearNumber = jsonFile[year][key];
        yearSpending[index] = Number(yearNumber);
    });
    return yearSpending;
}

function getMKOOD(county) {
    return {
        "Harju maakond": "0037",
        "Hiiu maakond": "0039",
        "Ida-Viru maakond": "0045",
        "Järva maakond": "0052",
        "Jõgeva maakond": "0050",
        "Lääne maakond": "0056",
        "Lääne-Viru maakond": "0060",
        "Pärnu maakond": "0068",
        "Põlva maakond": "0064",
        "Rapla maakond": "0071",
        "Saare maakond": "0074",
        "Tartu maakond": "0079",
        "Valga maakond": "0081",
        "Viljandi maakond": "0084",
        "Võru maakond": "0087"
    }[county];
}

module.exports = {
    parseLine: parseLine
};