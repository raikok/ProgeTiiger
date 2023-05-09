fs = require('fs');
axios = require('axios');

const fileName = './statisticsService/savedItems.txt';
const fileName2 = './statisticsService/savedItems2.txt';
const url = 'https://andmed.stat.ee/api/v1/et/stat/HT18';
const url2 = 'https://andmed.stat.ee/api/v1/et/stat/HT043';
const body = {
    "query": [
        {
            "code": "Aasta",
            "selection": {
                "filter": "item",
                "values": [
                    "2014",
                    "2015",
                    "2016",
                    "2017",
                    "2018",
                    "2019",
                    "2020",
                    "2021"
                ]
            }
        },
        {
            "code": "Maakond",
            "selection": {
                "filter": "item",
                "values": [
                    "37",
                    "39",
                    "44",
                    "49",
                    "51",
                    "57",
                    "59",
                    "65",
                    "67",
                    "70",
                    "74",
                    "78",
                    "82",
                    "84",
                    "86"
                ]
            }
        },
        {
            "code": "Klass",
            "selection": {
                "filter": "item",
                "values": [
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "13",
                    "14",
                    "15"
                ]
            }
        },
        {
            "code": "Õppekeel",
            "selection": {
                "filter": "item",
                "values": [
                    "1"
                ]
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
};
const body2 = {
    "query": [
        {
            "code": "Aasta",
            "selection": {
                "filter": "item",
                "values": [
                    "2014",
                    "2015",
                    "2016",
                    "2017",
                    "2018",
                    "2019",
                    "2020",
                    "2021"
                ]
            }
        },
        {
            "code": "Maakond",
            "selection": {
                "filter": "item",
                "values": [
                    "37",
                    "39",
                    "44",
                    "49",
                    "51",
                    "57",
                    "59",
                    "65",
                    "67",
                    "70",
                    "74",
                    "78",
                    "82",
                    "84",
                    "86"
                ]
            }
        },
        {
            "code": "Sugu",
            "selection": {
                "filter": "item",
                "values": [
                    "1"
                ]
            }
        },
        {
            "code": "Vanus",
            "selection": {
                "filter": "item",
                "values": [
                    "000"
                ]
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
};

queryFromAPI = (url, body) => {
    console.info('[LOG - INFO] Query out to Stat.ee: ' + url);
    return axios
    .post(encodeURI(url), body)
    .then(res => {
        const result = JSON.stringify(res.data);
        if (result && result.length > 1) {
            console.log(result);
            return res.data;
        } else {
            return '';
        }
    })
    .catch(error => {
        console.error('[LOG - ERROR] ' + error);
        fs.writeFile('./statisticsService/error.txt', error.toString(), (err, result) => {
            if(err) console.log('error', err);
        });
    });
}

const writeDataToFile = (statistics, fileName) => {
    statistics = JSON.stringify(statistics);
    if (statistics && statistics.length > 1) {
        fs.writeFile(fileName, statistics, (err, result) => {
            if(err) console.log('error', err);
        });
    }
}

const queryAndWriteAndReturn = async () => {
    const res = await queryFromAPI(url, body);
    const res2 = await queryFromAPI(url2, body2);
    writeDataToFile(res, fileName);
    writeDataToFile(res2, fileName2);
    return [JSON.stringify(res), JSON.stringify(res2)];
}

getAgeStatistics = () => {
    const data = fs.readFileSync(fileName, 'utf8');
    const data2 = fs.readFileSync(fileName2, 'utf8');

    return data && data2 && data.length > 1 && data2.length > 1 ? [data, data2] : queryAndWriteAndReturn();
}

module.exports = {
    getAgeStatistics: getAgeStatistics,
};