const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const CookieVerifier = require("./verify.js");
const path = require("path");
const process = require('process');
const databaseAccess = require('./databaseAccess');

const app = express();

//Login api request
app.post("/login", (req, res, next) => {
    const cookie = req.cookies.data; // get data cookie
    if (cookie === undefined && typeof req.body.email === "string" && typeof req.body.email === "string") {
        const cookieFunc = function (userdata) {
            const str_json = JSON.stringify(userdata);
            return Buffer.from(str_json).toString('base64');
        }

        databaseAccess.getUser(req.body.email, (userdata) => {
            if (userdata === {}) {
                console.log("Reported IP" + req.ip);
                res.sendStatus(403);
            }
            if (req.body.email.trim() === userdata.Email && databaseAccess.hash(req.body.pass.trim()) === userdata.PasswordHash) {
                res.cookie('data', cookieFunc(userdata), {
                    maxAge: 900000,
                    httpOnly: true
                });
                console.log('cookie created successfully');
                res.redirect("./index.html");
            } else {
                res.sendStatus(403);
                // res.redirect("./index.html");
            }
        });
    } else {
        next();
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), './uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
    }
});

const single_upload = multer({
    storage,
    // limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (CookieVerifier.verifyCookieAdmin(req.cookies.data)) {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                const err = new Error('Only .png, .jpg and .jpeg format allowed!')
                err.name = 'ExtensionError'
                return cb(err);
            }
        } else {
            res.sendStatus(401);
        }
    },
}).array('file', 1);

app.post('/upload', (req, res) => {
    single_upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
            return;
        } else if (err) {
            // An unknown error occurred when uploading.
            if (err.name == 'ExtensionError') {
                res.status(413).send({ error: { message: err.message } }).end();
            } else {
                res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
            }
            return;
        }

        // Everything went fine.
        // show file `req.files`
        // show body `req.body`
        res.status(200).end('Your files uploaded.');
    })
});


const upload = multer();
app.post('/addCollection', upload.none(), (req, res) => {

    console.log("add: " + req.body);
    res.redirect("/dashboard.html");
});

// Register api request
app.post("/register", bodyParser.json(), (req, res, next) => {
    if (req.body.email != undefined) {
        databaseAccess.addUser(req.body, (ret) => {
            if (ret === "Exists") {
                res.sendStatus(403);
            } else {
                res.sendStatus(200);

            }
        });
    }
});



module.exports = app;