var http = require('http');
var fs = require('fs');
const express = require('express');
const app = express();

const PORT = 8080;

app.get("/", (req, res) => {
    fs.readFile('index.html', 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/script.js', function(req, res) {
    fs.readFile("script.js", 'utf8', function(err, data) {
        res.end(data);
    });
});

//  apis
app.get('/dataset', function(req, res) {
    fs.readFile("./data/Dataset.json", 'utf8', function(err, data) {
        if (err) throw err;
        if (req.query.glat && req.query.glon) {
            all_objects = JSON.parse(data);
            var lat = parseFloat(req.query.glat);
            var lon = parseFloat(req.query.glon);
            // console.log(lat, lon);
            all_objects.objects.forEach(function(obj) {
                if (parseFloat(obj.GLAT) == lat && parseFloat(obj.GLON) - 180 + 180.0 == lon) {
                    // console.log(obj);
                    res.json(obj);
                }
            });
        } else {
            res.end(data);
        }
    });
});

app.get('/astrosat_publications', function(req, res) {
    fs.readFile("./data/Astrosat_Pubs.json", 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/astrosat', function(req, res) {
    fs.readFile("./data/Astrosat.json", 'utf8', function(err, data) {
        res.end(data);
    });
});

app.listen(PORT, () => console.log(`App is live at http://127.0.0.1:${PORT}`));