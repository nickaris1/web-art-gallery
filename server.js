global.LOGGERLEVEL = "debug" || process.argv[2];
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require("path");
const sqlite3 = require("sqlite3");
const CookieVerifier = require("./js/verify.js");
const databaseAccess = require("./js/databaseAccess");


const app = express();
const port = 5500;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// app.use(session({secret: "dGhpc2lzbXlzZWNyZXRrZXl1ZnVjayE9"}));

const restrictAccess = require("./js/restrictAccess");
app.use("/", restrictAccess);

const gets = require("./js/get.js");
app.use("/", gets);


const posts = require("./js/post.js");
app.use("/", posts);


app.use(function (req, res, next) {
    next();
});

app.use(express.static('./'));
app.use(express.static('./src'));


const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);

    global.db = new sqlite3.Database("./db/database.db", sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.log("Error opening db");
            exit(0);
        }
    });
});

server.on('close', () => {
    console.log('Closing ...');
    global.db.close((err) => {
        console.log("Unable to close db: " + err);
    });
});

process.on('SIGINT', () => {
    server.close(() => { process.exit(0); });
});