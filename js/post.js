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

        databaseAccess.getUserById(req.body.email, (userdata) => {
            if (userdata === {}) {
                console.log("Reported IP" + req.ip);
                res.sendStatus(403);
            }
            if (req.body.email.trim() === userdata.Email) {
                if (databaseAccess.hash(req.body.pass.trim()) === userdata.PasswordHash) {
                    res.cookie('data', cookieFunc(userdata), {
                        maxAge: 900000,
                        httpOnly: true
                    });
                    console.log('cookie created successfully');
                    res.redirect("./index.html");

                }
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
            const err = new Error('Not authorized')
            err.name = 'NotAuthorizedError'
            return cb(err);
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
            } else if (err.name === "NotAuthorizedError") {
                res.status(413).send({ error: { message: err.message } }).end();
            } else {
                res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
            }
            return;
        }

        const imageData = req.body;
        imageData["srcPath"] = path.join(process.cwd(), './uploads/', req.files[0].filename);

        databaseAccess.addImage(imageData, (status) => {
            if (status === 200) {
                res.sendStatus(200);
            } else if (status === 1) {
                res.sendStatus(101);
            } else {
                res.sendStatus(404);
            }
        });
    });
});


const upload = multer();
app.post('/addCollection', upload.none(), (req, res) => {
    databaseAccess.addCollection(req.body, (status) => {
        if (status === 200) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });
});

app.post('/addArtist', upload.none(), (req, res) => {
    if (typeof req.body.name === "string") {
        databaseAccess.addArtist(req.body.name, (status) => {
            try {
                if (status === 200) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
            } catch (e) {

            }
        });
    }
});

app.post('/addEvent', upload.none(), (req, res) => {
    if (!CookieVerifier.verifyCookieAdmin(req.cookies.data)) {
        res.sendStatus(401);
        return;
    }

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    if (startDate <= endDate && parseInt(req.body.maxTickets) > 0 && req.body.collections) {
        req.body.startDate = startDate.toISOString();
        req.body.endDate = endDate.toISOString();
        databaseAccess.addEvent(req.body, (status) => {
            if (status === 200) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    }
});

// Register api request
app.post("/register", bodyParser.json(), (req, res, next) => {
    if (req.body.email != undefined) {
        databaseAccess.addUser(req.body, (status) => {
            if (status === 200) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    }
});

app.post("/deleteUser", upload.none(), (req, res) => {
    if (CookieVerifier.verifyCookieAdmin(req.cookies.data) && typeof parseInt(req.body.id) === "number") {
        databaseAccess.deleteUser(parseInt(req.body.id), (status) => {
            if (status === 200) {
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(401);
    }
});

app.post("/reserveEvent", upload.none(), (req, res) => {
    eventReservation(req, (isReserved) => {
        if(!isReserved) {
            databaseAccess.addTicket(req.body.EventId, CookieVerifier.getUserId(req.cookies.data), (status) => {
                if (status === 200) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(401);
                }
            });
        }
    });
});

app.post("/cancelEvent", upload.none(), (req, res) => {
    eventReservation(req, (isReserved) => {
        if(isReserved) {
            databaseAccess.cancelTicket(req.body.EventId, CookieVerifier.getUserId(req.cookies.data), (status) => {
                if (status === 200) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(401);
                }
            });
        }
    });
});

function eventReservation(req, callback) {
    if (CookieVerifier.verifyCookieLogin(req.cookies.data) && typeof parseInt(req.body.EventId) === "number") {
        // check if event has ended
        databaseAccess.getEventStatusById(req.body.EventId, (eventStatus) => {
            if (eventStatus) {
                // Check if user already have ticket for that event;
                databaseAccess.getIfUserHasTicketForEvent(req.body.EventId, CookieVerifier.getUserId(req.cookies.data), (isReserved) => {
                    callback(isReserved);
                });
            } else {
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(401);
    }
}


module.exports = app;