const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const CookieVerifier = require("./verify.js");
const path = require("path");
const process = require('process');
const databaseAccess = require('./databaseAccess');

const app = express();




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
        res.sendFile(path.join(process.cwd(), "/src/dashboard.html"));
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

app.get("/getUsers", (req, res) => {
    if (CookieVerifier.verifyCookieAdmin(req.cookies.data)) {
        databaseAccess.getUsers((rows) => {
            res.status(200).send(JSON.stringify(rows));
        });
    }
});

app.get("/getCollection", (req, res) => {
    databaseAccess.getCollections((rows) => {
        res.status(200).send(JSON.stringify(rows));
    });
});


module.exports = app;