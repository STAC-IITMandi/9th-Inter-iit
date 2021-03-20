var http = require('http');
var fs = require('fs');
const express = require('express');
const app = express();    

const PORT = 8080;

app.get('/coordinates', function (req, res) {
    fs.readFile( "./scripts/data/coordinates.json", 'utf8', function (err, data) {
        res.end(data);
    });
});

app.get('/coordinates_info', function (req, res) {
    fs.readFile( "./scripts/data/coordinates_info.json", 'utf8', function (err, data) {
        res.end(data);
    });
});

app.get('/astrosat_publications', function (req, res) {
    fs.readFile( "./scripts/data/Astrosat_Pubs.json", 'utf8', function (err, data) {
        res.end(data);
    });
});

app.get('/astrosat', function (req, res) {
    fs.readFile( "./scripts/data/Astrosat.json", 'utf8', function (err, data) {
        res.end(data);
    });
});

app.get('/', function(request, response){
    // response.sendFile('./templates/index.html');
    response.sendFile('index.html', { root: __dirname + '/templates' });
});

// app.listen(PORT, () => console.log(`App is live`) );
app.listen(PORT, () => console.log(`App is live at http://127.0.0.1:${PORT}`));
