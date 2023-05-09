// Express Application setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const jsonService = require('./jsonService/json-parse-service.js');
const databaseService = require('./dbService/database-service.js');
const ApiService = require("./api-service/api-service");
let initDone = 0;

initDone += databaseService.prepareServices();

const readPython = () => {
    try {
        const spawn = require('child_process').spawn;
        const pythonProcess = spawn('python3', ['./_python/spreadsheet_analyser.py']); // docker compose
        //const pythonProcess = spawn('python', ['./_python/spreadsheet_analyser.py']); // npm run start

        result = '';
        pythonProcess.stdout.on('data', async (data) => {
            try {
                //console.log(data.toString());
                if (data.toString()) {
                    result += data.toString();
                }
            } catch (e) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.error("[LOG - ERROR] " + e);
            }
        });

        pythonProcess.on('close', () => {
            const res = JSON.parse(result);
            if (res) {
                jsonService.parseLine(res);
                initDone += 1;
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('[LOG - ERROR]: ' + data.toString());
        });
    } catch (e) {
        console.error('[LOG - ERROR] ' + e);
    }
}
readPython();

if (initDone) {
    new ApiService(app);
}