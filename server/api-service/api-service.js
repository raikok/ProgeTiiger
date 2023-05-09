const mapperService = require('../dtos/mapper-service');
const { getSchools, getSpendingOfCounties } = require("../dbService/database-service");
const { getAgeStatistics } = require("../statisticsService/statistics-service");

module.exports = class ApiService {
    listner;

    constructor(app) {
        this.listner = app;
        void this.createListners();
    }

    async createListners() {
        this.listner.get("/", async (req, res) => {
        });

        this.listner.get("/values/all", async(req, res) => {
            await this.getFunction(getSchools, res);
        });

        this.listner.get("/values/spending", async(req, res) => {
            await this.getFunction(getSpendingOfCounties, res);
        });

        this.listner.get("/values/statistics", async(req, res) => {
            try {
                const statistics = await getAgeStatistics();

                //await this.getFunction(getAgeStatistics, res);
                await this.sendResults(mapperService.mapData(statistics[0], statistics[1]), res);
            } catch (e) {
                res.status(400);
                res.send(e);
                console.error('[LOG - ERROR] ' + e.toString());
            }
        });

        this.listner.post("/values", async(req, res) => {
            if (!req.body.value) res.send({ working: false });

            //databaseService.createValue(req.body.value);

            res.send({ working: true });
        });

        this.listner.listen(5000, (err) => {
            if (err) console.error('[LOG - ERROR]' + err.toString());
            console.info('[LOG - INFO] REST Listners created');
        });
    }

    async getFunction(func, res) {
        try {
            const result = await func();
            await this.sendResults(result, res);
        } catch (e) {
            res.status(400);
            res.send(e);
            console.error('[LOG - ERROR] ' + e.toString());
        }
    }

    async sendResults(result, res) {
        try {
            res.status(200);
            if (result && result.rows) {
                res.send(result.rows);
            } else if (result) {
                res.send(result);
            } else {
                res.status(404);
                res.send();
            }
        } catch (e) {
            res.status(400);
            res.send(e);
            console.error('[LOG - ERROR] ' + e.toString());
        }
    }
}

