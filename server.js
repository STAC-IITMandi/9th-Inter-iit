var http = require('http');
var fs = require('fs');
const express = require('express');
const { spawn } = require('child_process');
const app = express();

const PORT = 8080;


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    var plot_id;
    const python = spawn('python3', ['./scripts/plot.py']);
    python.stdout.on('data', function(data) {
        plot_id = data.toString();
        console.log(`Retreiving stdout output of plot.py ${plot_id}`);
        console.log(JSON.stringify(plot_id.replace(/\n/g, '')));
        res.render('index', {
            fid: plot_id.replace(/\n/g, '')
        });
    });
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
    });
});

app.get('/plot.js', function(req, res) {
    fs.readFile("./plot.js", 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/coordinates', function(req, res) {
    fs.readFile("./scripts/data/coordinates.json", 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/coordinates_info', function(req, res) {
    fs.readFile("./scripts/data/coordinates_info.json", 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/astrosat_publications', function(req, res) {
    fs.readFile("./scripts/data/Astrosat_Pubs.json", 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/astrosat', function(req, res) {
    fs.readFile("./scripts/data/Astrosat.json", 'utf8', function(err, data) {
        res.end(data);
    });
});

app.listen(PORT, () => console.log(`App is live at http://127.0.0.1:${PORT}`));