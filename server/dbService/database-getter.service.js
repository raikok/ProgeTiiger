const mapperService = require('../dtos/mapper-service');


module.exports = class DatabaseGetterService {
    databaseConnection;

    constructor(databaseConnection) {
        this.databaseConnection = databaseConnection;
    }

    getSchools() {
        return this.databaseConnection.query("SELECT * FROM koolid as k JOIN spending s ON k.kooli_id = s.kooli_id").then((res) => {
            return mapperService.mapSchools(res);
        });
    }

    getSpendingOfCounties() {
        const query = 'SELECT m.maakonna_nimi, ' +
            'SUM(y2014) as "2014_SUM", SUM(y2015) as "2015_SUM", SUM(y2016) as "2016_SUM", SUM(y2017) as "2017_SUM", ' +
            'SUM(y2018) as "2018_SUM", SUM(y2019) as "2019_SUM", SUM(y2020) as "2020_SUM", SUM(y2021) as "2021_SUM" ' +
            'FROM koolid as k ' +
            'JOIN koolid_maakonnad as km ON k.kooli_id = km.kooli_id ' +
            'JOIN maakonnad m ON km.maakonna_id = m.maakonna_id ' +
            'JOIN spending s ON k.kooli_id = s.kooli_id ' +
            'WHERE m.maakonna_nimi IS NOT NULL ' +
            'GROUP BY m.maakonna_nimi;';
        return this.databaseConnection.query(query).then((res) => {
            return mapperService.mapSchools(res);
        });
    }
}