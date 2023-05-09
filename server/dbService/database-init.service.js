const regionService = require("../regionService/region-service.js");

module.exports = class DatabaseInitService {
    databaseConnection;

    constructor(databaseConnection) {
        this.databaseConnection = databaseConnection;
    }

    prepareTables() {
        // Reset table
        this.databaseConnection.query('set enable_parallel_hash=off').then(() => {
            this.databaseConnection.query("DROP SCHEMA public CASCADE").then(() => {
                this.databaseConnection.query("CREATE SCHEMA public AUTHORIZATION postgres").then(() => {
                    this.databaseConnection.query("GRANT ALL ON SCHEMA public TO postgres").then(() => {
                        this.databaseConnection.query("GRANT ALL ON SCHEMA public TO public").then(() => {
                            this.databaseConnection.query("COMMENT ON SCHEMA public IS 'standard public schema'").then(() => {
                                this.createDevices().then(() => {
                                    this.createSchools().then(() => {
                                        this.createDevicesSchoolsBind().then(() => {
                                            this.createSpending().then(() => {
                                                this.createCounty().then(() => {
                                                    this.createSchoolCountyBind().then(() => {
                                                        this.createTags().then(() => {
                                                            this.createDevicesTagsBind().then(() => {
                                                                this.databaseConnection.query('set enable_parallel_hash=on');
                                                            });
                                                        });
                                                    });
                                                });
                                            })
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        return 1;
    }

    // Creating tables methods
    // Devices table
    async createDevices() {
        let query = "CREATE TABLE IF NOT EXISTS seadmed (seadme_id INT, seadme_nimi VARCHAR(150), seadmete_arv INT)";
        console.info("[LOG - INFO] query: " + query);
        return this.databaseConnection.query(query);
    }

    async createSchools() {
        // Schools table
        let query = "CREATE TABLE IF NOT EXISTS koolid (kooli_id INT, kooli_nimi VARCHAR(2000), kooli_aste VARCHAR(500), lat VARCHAR(50), long VARCHAR(50))";
        console.info("[LOG - INFO] query: " + query);
        return this.databaseConnection.query(query);
    }

    async createDevicesSchoolsBind() {
        // Devices Schools Bridge table
        let query = "CREATE TABLE IF NOT EXISTS seadmed_koolid (seadme_id INT, kooli_id INT)";
        console.info("[LOG - INFO] query: " + query);
        return this.databaseConnection.query(query);
    }

    async createSpending() {
        // Spending table
        let query = "CREATE TABLE IF NOT EXISTS spending (kooli_id INT, y2014 FLOAT, y2015 FLOAT, y2016 FLOAT, y2017 FLOAT, y2018 FLOAT, y2019 FLOAT, y2020 FLOAT, y2021 FLOAT)";
        console.info("[LOG - INFO] query: " + query);
        return this.databaseConnection.query(query);
    }

    async createCounty() {
        // County table
        let query = "CREATE TABLE IF NOT EXISTS maakonnad (maakonna_id INT, maakonna_nimi VARCHAR(60), MKOOD VARCHAR(8))";
        console.info("[LOG - INFO] query: " + query);
        return this.databaseConnection.query(query);
    }

    async createSchoolCountyBind() {
        // School County Bridge table
        let query = "CREATE TABLE IF NOT EXISTS koolid_maakonnad (kooli_id INT UNIQUE, maakonna_id INT)";
        console.info("[LOG - INFO] query: " + query);
        return this.databaseConnection.query(query);
    }

    async createTags() {
        // Tags table
        let query = "CREATE TABLE IF NOT EXISTS marksonad (marksona_id INT, marksona_nimi VARCHAR(50))";
        console.info("[LOG - INFO] query: " + query);
        return this.databaseConnection.query(query);
    }

    async createDevicesTagsBind() {
        // Device Tags Bridge table
        let query = "CREATE TABLE IF NOT EXISTS seadmed_marksonad (seadme_id INT, marksona_id INT)";
        console.info("[LOG - INFO] query: " + query);
        return this.databaseConnection.query(query);
    }


    // Adding items

    async addDevice(id, name, amount) {
        const query = "INSERT INTO seadmed(seadme_id, seadme_nimi, seadmete_arv) VALUES($1, $2, $3)";
        const query2 = `INSERT INTO seadmed(${id}, ${name}, ${amount})`;
        //console.log(query2);
        await this.databaseConnection.query(query, [id, name, amount]);
    }

    async addSchool(id, name, grade) {
        const coordinates = await regionService.getItemCoordinates(name);
        const query = "INSERT INTO koolid(kooli_id, kooli_nimi, kooli_aste, lat, long) VALUES($1, $2, $3, $4, $5)";
        const query2 = `INSERT INTO koolid(${id}, ${name}, ${coordinates[0]}, ${coordinates[1]})`;
        //console.log(query2);
        await this.databaseConnection.query(query, [id, name, grade, coordinates[0], coordinates[1]]);
    }

    async addDeviceSchoolBind(deviceId, schoolId) {
        const query = "INSERT INTO seadmed_koolid(seadme_id, kooli_id) VALUES($1, $2)";
        const query2 = `INSERT INTO seadmed_koolid(${deviceId}, ${schoolId})`;
        //console.log(query2);
        await this.databaseConnection.query(query, [deviceId, schoolId]);
    }

    async addSpending(id, list) {
        const query = "INSERT INTO spending(kooli_id, y2014, y2015, y2016, y2017, y2018, y2019, y2020, y2021) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)";
        //console.log(query1);
        list.unshift(id);
        await this.databaseConnection.query(query, list);
    }

    async addCounty(id, name, MKOOD) {
        const query = "INSERT INTO maakonnad(maakonna_id, maakonna_nimi, MKOOD) VALUES($1, $2, $3)";
        const query2 = `INSERT INTO maakonnad(${id}, ${name}, ${MKOOD})`;
        //console.log(query2);
        await this.databaseConnection.query(query, [id, name, MKOOD]);
    }

    async addSchoolCountyBind(schoolId, countyId) {
        const query = "INSERT INTO koolid_maakonnad(kooli_id, maakonna_id) VALUES($1, $2) ON CONFLICT (kooli_id) DO NOTHING";
        const query2 = `INSERT INTO koolid_maakonnad(${schoolId}, ${countyId})`;
        //console.log(query2);
        await this.databaseConnection.query(query, [schoolId, countyId]);
    }

    async addTag(id, name) {
        const query = "INSERT INTO marksonad(marksona_id, marksona_nimi) VALUES($1, $2)";
        const query2 = `INSERT INTO marksonad(${id}, ${name})`;
        //console.log(query2);
        await this.databaseConnection.query(query, [id, name]);
    }

    async addDeviceTagBind(deviceId, tagId) {
        const query = "INSERT INTO seadmed_marksonad(seadme_id, marksona_id) VALUES($1, $2)";
        const query2 = `INSERT INTO seadmed_marksonad(${deviceId}, ${tagId})`;
        //console.log(query2);
        await this.databaseConnection.query(query, [deviceId, tagId]);
    }
}