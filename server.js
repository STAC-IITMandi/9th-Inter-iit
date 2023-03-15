const fs = require('fs');
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const process = require('process');
const app = express();
const PORT = 8000;
const URL = `http://127.0.0.1:${PORT}`;
var data_dir = "data";

path.join(__dirname, '/data/Dataset.json');
path.join(__dirname, '/data/Astrosat_Pubs.json');
path.join(__dirname, '/data/Astrosat.json');
path.join(__dirname, '/data/BtoC.json');
path.join(__dirname, 'index.html');
path.join(__dirname, 'script.js');

// var standard_input = process.stdin;
// standard_input.setEncoding('utf-8');
// console.log("Specify data folder for json files or press enter for default: ");
// standard_input.on('data', function(data) {
//     if (data != "\n") {
//         data_dir = data.replace(/\n*$/, "");
//         console.log("Sourcing json files from ", data_dir, " directory");
//     }

//     app.listen(PORT, () => console.log(`App is live at ${URL}`));

// });

var data_dir = "./data";

app.listen(PORT, () => console.log(`App is live at ${URL}`));

const Dataset = JSON.parse(fs.readFileSync(path.join(__dirname, data_dir, "Dataset.json"), 'utf8'));
let Publications = (JSON.parse(fs.readFileSync(path.join(__dirname, data_dir, "Astrosat_Pubs.json"), 'utf8')));
Publications = Publications.publications;
const B2C = JSON.parse(fs.readFileSync(path.join(__dirname, data_dir, "BtoC.json"), 'utf8'));

let astro = [],
    not_astro = [];

// extracting Astrosat observed as "astro" and not observed as "not_astro" data separately.
for (let obj of Dataset) {
    if (obj["Astrosat_obs"] === "Yes") {
        astro.push(obj);
    } else {
        not_astro.push(obj);
    }
}

// rendering index.html
app.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', function(err, data) {
        res.end(data);
    });
});

// rendering script.js
app.get('/script.js', function(req, res) {
    fs.readFile(path.join(__dirname, "script.js"), 'utf8', function(err, data) {
        res.end(data);
    });
});

// rendering /dataset api
app.get('/dataset', function(req, res) {
    if (Object.keys(req.query).length !== 0) {
        // console.log('received trace and index');
        let { traceIndex, pointIndex } = req.query;
        // console.log(req.query);
        traceIndex = parseInt(traceIndex);
        pointIndex = parseInt(pointIndex);
        // console.log("trace", traceIndex, "pointIndex", pointIndex);
        if (traceIndex === 0) {
            let to_send = { source_data: astro[pointIndex], publications: [] };
            fetch(URL + '/b2c' + '?index=' + `${pointIndex}`)
                .then(response => response.json())
                .then((data) => {
                    if (data.flag === true) {
                        const indexes_ = data.indexes;
                        // console.log(`indexes ${indexes_}`);
                        for (let i in indexes_) {
                            to_send.publications.push(Publications[i]);
                        }
                    }
                    // console.log(to_send);
                    res.json(to_send);
                });
        } else if (traceIndex === 1) {
            res.json({ source_data: not_astro[pointIndex] });
        } else {
            console.log("Invalid trace");
        }
    } else {
        // console.log(`sent all data`);
        res.json({ "astro": astro, "not_astro": not_astro });
    }
});

function search_in_C(index) {
    // console.log(index);
    const source_name = astro[index]["Source Name"];
    // console.log(source_name);
    if (source_name in B2C) {
        return B2C[source_name];
    } else {
        return false;
    }
}

app.get('/b2c', function(req, res) {
    // console.log("b2c api",req.query);
    if (Object.keys(req.query).length !== 0) {
        if (req.query.index !== undefined) {
            const search = search_in_C(parseInt(req.query.index));
            // console.log(`search, ${search}`);
            if (search !== false) {
                // console.log(`found`);
                res.json({ flag: true, indexes: search });
            } else {
                // console.log(`not found`);
                res.json({ flag: false });
            }
        } else {
            console.log('b2c received invalid req');
        }
    } else {
        console.log('b2c received empty req');
    }
});
