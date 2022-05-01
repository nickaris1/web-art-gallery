const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");


const app = express();
const port = 5500
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.static('./'));
app.use(express.static('./src'));


//Login api request
app.post("/login", (req, res, next) => {
    console.log("--login", req.body);
    res.sendStatus(200);
});

//Login api request
app.post("/register", (req, res, next) => {
    console.log("--login", req.body);
    res.sendStatus(200);
});

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, './src/index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});