fs = require('fs');
axios = require('axios');

const fileName = './regionService/savedItems.txt';
const kood = '&key=';
const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

queryFromAPI = (name) => {
    //if (name.includes('Riisipere')) return ['59.103451', '24.312514'];
    if (name && name !== '') {
        name = name
            .replace(/ü/g, 'u')
            .replace(/Ü/g, 'u')
            .replace(/ö/g, 'o')
            .replace(/Ö/g, 'o')
            .replace(/õ/g, 'o')
            .replace(/Õ/g, 'o')
            .replace(/ä/g, 'a')
            .replace(/Ä/g, 'A')
            .replace(/š/g, 's')
            .replace(/ž/g, 'z')
            .replace(' ', '+')
            .replace(/ /g, '+')
            .replace(/%20/g, '+')
            .replace(/\./g, '')
        console.warn('[LOG - WARN] Query out to Google: ' + (url + name + kood));
        if (name && name !== '') {
            return axios
            .get(url + name + kood)
            .then(res => {
                if (res.data.results.length > 0) {
                    return [res.data.results[0].geometry.location.lat, res.data.results[0].geometry.location.lng];
                } else {
                    return [null, null];
                }
            })
            .catch(error => {
                console.log(error);
                fs.writeFile('./regionService/error.txt', error.toString(), (err, result) => {
                    if(err) console.log('error', err);
                });
            });
        } else {
            return [null, null];
        }
    } else {
        return [null, null];
    }
}

getItemCoordinates = (name) => {
    const data = fs.readFileSync(fileName, 'utf8');

    if (data) {
        for (line of data.split('\n')) {
            const lineSplit = line.split(';');
            if (lineSplit[0].replace('\r', '') === name && lineSplit.length === 3) {
                return [lineSplit[1], lineSplit[2].replace('\r', '')];
            }
        } return writeSchoolToFile(name);
    }
}

const writeSchoolToFile = async (school) => {
    const coordinates = await queryFromAPI(school);
    writeCoordinatesToFile(school, coordinates[0], coordinates[1]);
    return coordinates;
}

const writeCoordinatesToFile = (school, lat, long) => {
    fs.appendFile(fileName, (school + ';' + lat + ';' + long + "\n"), (err, result) => {
        if(err) console.log('error', err);
    });
}

module.exports = {
    getItemCoordinates: getItemCoordinates,
};