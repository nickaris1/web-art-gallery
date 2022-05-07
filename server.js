const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require("path");
const CookieVerifier = require("./js/verify.js");

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

let posts = require("./js/post.js");
app.use("/", posts);

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

app.get("/server.js", (req, res) => {
    res.sendStatus(401);
});

app.get("/verify.js", (req, res) => {
    res.sendStatus(401);
});

app.get("/js/*", (req, res) => {
    res.sendStatus(401);
});

app.use(express.static('./'));
app.use(express.static('./src'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});