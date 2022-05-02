const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require("path");
const alert = require("alert");


const app = express();
const port = 5500
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// set a cookie
app.use(function (req, res, next) {
    // check if client sent cookie
    const cookie = req.cookies.data;
    if (cookie === undefined) {
        
    } else {
        const decode = Buffer.from(cookie, 'base64').toString('utf-8')
        console.log(JSON.parse(decode));
    } 
    next(); // <-- important!
  });

//Login api request
app.post("/login", (req, res, next) => {
    console.log("--login", req.body);

    const cookie = req.cookies.data; // get data cookie

    if (cookie === undefined) {
        if (req.body.email === "admin@admin.admin" && req.body.pass === "admin") {
            let obj = {
                email: req.body.email, 
                pass: req.body.pass,
                admin: true
            };
            const str_json = JSON.stringify(obj);
            const encode = Buffer.from(str_json).toString('base64')
            res.cookie('data', encode, { 
                                    maxAge: 900000, 
                                    httpOnly: false // exploit 
                                });
            console.log('cookie created successfully');
            res.redirect("./index.html");
        } else {
            res.send(402);
        }
    } else {
        next();
    }


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

app.get("/logout.html", (req, res, next) => {
    res.clearCookie("data");
    res.redirect("./index.html");
});

app.get("/server.js", (req, res, next) => {
    res.sendStatus(401);
});

app.use(express.static('./'));
app.use(express.static('./src'));


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});