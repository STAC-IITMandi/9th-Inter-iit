const fs = require('fs');
const express = require('express')
const path = require('path');
const app = express();

path.join(__dirname, '/data/Dataset.json');
path.join(__dirname, '/data/Astrosat_Pubs.json');
path.join(__dirname, '/data/Astrosat.json');
path.join(__dirname, 'index.html');
path.join(__dirname, 'script.js');

const PORT = 8080;
const Dataset = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "Dataset.json"), 'utf8'));
// const Publications = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "Astrosat_Pubs.json"), 'utf8'));
// const Astrosat_Data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "Astrosat.json"), 'utf8'));

let astro = [],
    not_astro = [];

// extracting Astrosat observed as "astro" and not observed as "not_astro" data separately.
for (let obj of Dataset) {
    if (obj["Astrosat_obs"] == "Yes") {
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
        // console.log(`sent all data`);
        res.json({ "astro": astro, "not_astro": not_astro });
    }
});

app.get('/astrosat_publications', function(req, res) {
    fs.readFile(path.join(__dirname, './data/Astrosat_Pubs.json'), 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/astrosat', function(req, res) {
    fs.readFile(path.join(__dirname, './data/Astrosat.json'), 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/b2c', function(req, res) {
    fs.readFile(path.join(__dirname, './data/BtoC.json'), 'utf8', function(err, data) {
        res.end(data);
    });
});

app.listen(PORT, () => console.log(`App is live at http://127.0.0.1:${PORT}`));