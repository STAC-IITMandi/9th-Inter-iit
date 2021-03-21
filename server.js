var http = require('http');
var fs = require('fs');
const express = require('express');
const app = express();

const PORT = 8080;


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
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