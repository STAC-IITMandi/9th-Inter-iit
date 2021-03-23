const fs = require('fs');
const express = require('express')
const path = require('path');
const process = require('process');
const app = express();
const spawn = require('child_process');
// const { spawnSync } = require('node:child_process');

path.join(__dirname, 'data/Dataset.json');
path.join(__dirname, 'data/Astrosat_Pubs.json');
path.join(__dirname, 'data/Astrosat.json');
path.join(__dirname, 'index.html');
path.join(__dirname, 'script.js');
path.join(__dirname, 'cat_json.py');
path.join(__dirname, 'cat_functions.py');

const PORT = 8080;

const arg = process.argv[2];
if (arg) {
    // python3
    const python = spawn.spawnSync('python3', ['cat_json.py', arg])
    var err = python.stderr.toString().trim();
    if (err) {
        console.log(err, "Trying again..");
        // windows uses python instead of python3
        const python2 = spawn.spawnSync('python', ['cat_json.py', arg])
        var error_text = python2.stderr.toString().trim();
        throw new Error(error_text);
    }
    console.log("Generating json files from ", arg, " directory");
}

const Dataset = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "Dataset.json"), 'utf8'));
const Publications = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "Astrosat_Pubs.json"), 'utf8'));
const Astrosat_Data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "Astrosat.json"), 'utf8'));

let astro = [],
    not_astro = [];

for (let obj of Dataset.objects) {
    if (obj["Astrosat_obs"] == "Yes") {
        astro.push(obj);
    } else {
        not_astro.push(obj);
    }
}

app.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/script.js', function(req, res) {
    fs.readFile(path.join(__dirname, "script.js"), 'utf8', function(err, data) {
        res.end(data);
    });
});

//  apis
app.get('/dataset', function(req, res) {
    if (Object.keys(req.query).length !== 0) {
        console.log('received trace and index');
        let { trace, point } = req.query;
        trace = parseInt(trace);
        point = parseInt(point);
        if (trace === 0) {
            res.json(astro[point]);
        } else if (trace === 1) {
            res.json(not_astro[point]);
        } else {
            throw "Invalid trace";
        }
    } else {
        console.log(`sent all data`);
        res.json({ "astro": astro, "not_astro": not_astro });
    }
});

app.get('/astrosat_publications', function(req, res) {

});

app.get('/astrosat', function(req, res) {

});

app.listen(PORT, () => console.log(`App is live at http://127.0.0.1:${PORT}`));