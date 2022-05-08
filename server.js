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

let posts = require("./js/post.js");
app.use("/", posts);


app.use(function (req, res, next) {
    // const cookie = req.cookies.data;
    // if (cookie === undefined) {

    // } else {
    //     const decode = Buffer.from(cookie, 'base64').toString('utf-8');
    //     console.log(JSON.parse(decode));
    // }
    next(); // <-- important!
});

app.get("/login.html", (req, res, next) => {
    if (!CookieVerifier.verifyCookieLogin(req.cookies.data)) {
        next();
    } else {
        res.redirect("./index.html");
    }
});

app.get("/verify", (req, res, next) => {
    if (CookieVerifier.verifyCookieLogin(req.cookies.data)) {
        if (CookieVerifier.verifyCookieAdmin(req.cookies.data)) {
            res.sendStatus(202);
            return;
        } else {
            res.sendStatus(200);
            return;
        }
    }
    res.sendStatus(401);
});

app.get("/dashboard.html", (req, res, next) => {
    if (CookieVerifier.verifyCookieAdmin(req.cookies.data)) {
        res.sendFile(path.join(__dirname, "/src/dashboard.html"));
        return;
    }
    res.sendStatus(401);
});

app.get("/logout.html", (req, res, next) => {
    res.clearCookie("data");
    res.redirect("./index.html");
});


app.get("/getArtist", (req, res) => {
    databaseAccess.getArtists((rows) => {
        res.status(200).send(JSON.stringify(rows));
    });
});

app.get("/getCollection", (req, res) => {
    databaseAccess.getCollection((rows) => {
        res.status(200).send(JSON.stringify(rows));
    });
});

const restrictAccess = require("./js/restrictAccess");
app.use("/", restrictAccess);

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