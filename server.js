var express = require('express');
var app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

var server = app.listen(PORT, function() {
    console.log(`App is live at http://127.0.0.1:${PORT}`);
});