const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");
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


const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

const upload = multer({
    dest: path.join(__dirname, "uploads/")
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './uploads/'))
    },
    filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
    }
});
const multi_upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).array('file', 2);

app.post('/upload', (req, res) => {
    multi_upload(req, res, function (err) {
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
// app.post(
//     "/upload",
//     upload.single("file" /* name attribute of <file> element in your form */),
//     (req, res) => {
//       const tempPath = req.file.path;
//       const targetPath = path.join(__dirname, "./uploads/image.png");
  
//       if (path.extname(req.file.originalname).toLowerCase() === ".png") {
//         fs.rename(tempPath, targetPath, err => {
//           if (err) {
//               console.log("error");
//               return handleError(err, res);
//           }
//           res
//             .status(200)
//             .contentType("text/plain")
//             .end("File uploaded!");
//         });
//       } else {
//         fs.unlink(tempPath, err => {
//           if (err) return handleError(err, res);
  
//           res
//             .status(403)
//             .contentType("text/plain")
//             .end("Only .png files are allowed!");
//         });
//       }
//     }
//   );

app.get("/login.html", (req, res, next) => {
    if (!CookieVerifier.verifyCookieLogin(req.cookies.data)) {
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

app.use(express.static('./'));
app.use(express.static('./src'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});