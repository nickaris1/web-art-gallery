const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
const port = 5500

app.use(express.static('./'));
app.use(express.static('./src'));

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});