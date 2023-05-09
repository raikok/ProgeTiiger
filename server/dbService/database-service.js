const regionService = require('../regionService/region-service.js');

// Postgres client setup
const keys = require("./keys.js");
const { Pool } = require("pg");
const DatabaseInitService = require("./database-init.service");
const DatabaseGetterService = require("./database-getter.service");
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

let databaseInitService;
let databaseGetterService;

const prepareServices = () => {
    const DatabaseInitService = require("./database-init.service");
    databaseInitService = new DatabaseInitService(pgClient);

    const DatabaseGetterService = require("./database-getter.service");
    databaseGetterService = new DatabaseGetterService(pgClient);

    return databaseInitService.prepareTables();
}

const addDevice = (id, name, amount) => {
    databaseInitService.addDevice(id, name, amount);
}

const addSpending = (id, list) => {
    databaseInitService.addSpending(id, list);
}

const addSchool = (id, name, grade) => {
    databaseInitService.addSchool(id, name, grade);
}

const addDeviceSchoolBind = (deviceId, schoolId) => {
    databaseInitService.addDeviceSchoolBind(deviceId, schoolId);
}

const addCounty = (id, name, MKOOD) => {
    databaseInitService.addCounty(id, name, MKOOD);
}

const addSchoolCountyBind = (schoolId, countyId) => {
    databaseInitService.addSchoolCountyBind(schoolId, countyId);
}

const addTag = (id, name) => {
    databaseInitService.addTag(id, name);
}

const addDeviceTagBind = (deviceId, tagId) => {
    databaseInitService.addDeviceTagBind(deviceId, tagId);
}

const getSchools = async () => {
    return await databaseGetterService.getSchools();
}

const getSpendingOfCounties = async () => {
    return await databaseGetterService.getSpendingOfCounties();
}

/*async function createValue(value) {
    await pgClient.query("INSERT INTO values(number) VALUES($1)", [value]);
}*/

module.exports = {
    prepareServices: prepareServices,
    addDevice: addDevice,
    addSchool: addSchool,
    addSpending: addSpending,
    addCounty: addCounty,
    addTag: addTag,
    addDeviceSchoolBind: addDeviceSchoolBind,
    addSchoolCountyBind: addSchoolCountyBind,
    addDeviceTagBind: addDeviceTagBind,
    getSchools: getSchools,
    getSpendingOfCounties: getSpendingOfCounties,
    pgClient: pgClient
};