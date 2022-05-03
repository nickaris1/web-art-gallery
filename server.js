const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const CookieVerifier = require("./verify.js");

const app = express();
const port = 5500;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// app.use(session({secret: "dGhpc2lzbXlzZWNyZXRrZXl1ZnVjayE9"}));


app.use(function (req, res, next) {
    const cookie = req.cookies.data;
    if (cookie === undefined) {

    } else {
        const decode = Buffer.from(cookie, 'base64').toString('utf-8');
        console.log(JSON.parse(decode));
    }
    next(); // <-- important!
});

//Login api request
app.post("/login", (req, res, next) => {
    console.log("--login", req.body);

    const cookie = req.cookies.data; // get data cookie

    if (cookie === undefined) {
        const cookieFunc = function (adminValue) {
            let obj = {
                email: req.body.email,
                pass: req.body.pass,
                admin: adminValue
            };
            const str_json = JSON.stringify(obj);
            return Buffer.from(str_json).toString('base64');
        }

        if (req.body.email === "admin@admin.admin" && req.body.pass === "admin") {

            res.cookie('data', cookieFunc(true), {
                maxAge: 900000,
                httpOnly: true
            });
            console.log('cookie created successfully');
            res.redirect("./index.html");
        } else if (req.body.email === "user@user.user" && req.body.pass === "user") {

            res.cookie('data', cookieFunc(false), {
                maxAge: 900000,
                httpOnly: true
            });
            console.log('cookie created successfully');
            res.redirect("./index.html");
        } else {
            res.sendStatus(403);
            // res.redirect("./index.html");
        }
    } else {
        next();
    }
});

app.post("/upload", (res, req, next) => {
    const cookie = req.cookies.data; // get data cookie
    const valid = CookieVerifier.verifyCookieAdmin(cookie);
    if (valid === true) {

    }
    res.sendStatus(401);
});

app.get("/login.html", (req, res, next) => {
    const cookie = req.cookies.data; // get data cookie

    if (cookie === undefined) {
        next();
    } else {
        res.redirect("./index.html");
    }
});

// Register api request
app.post("/register", (req, res, next) => {
    console.log("--login", req.body);
    res.sendStatus(200);
});

app.get("/verify", (req, res) => {
    const cookie = req.cookies.data; // get data cookie
    if (cookie === undefined) { // not logged in
        res.sendStatus(401);
        // next();
    } else {
        const data = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
        if (data.admin === true) {
            res.sendStatus(202);
        } else {
            res.sendStatus(200);
        }
    }
});

app.get("/dashboard.html", (req, res, next) => {
    const cookie = req.cookies.data;
    if (cookie != undefined) {
        const data = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
        if (data.admin === true) {
            res.sendFile(path.join(__dirname, "/src/dashboard.html"));
            return;
        }
    }
    res.sendStatus(401);
});

app.get("/logout.html", (req, res, next) => {
    res.clearCookie("data");
    res.redirect("./index.html");
});

app.get("/server.js", (req, res) => {
    res.sendStatus(401);
});

app.get("/verify.js", (req, res) => {
    res.sendStatus(401);
});

app.use(express.static('./'));
app.use(express.static('./src'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});