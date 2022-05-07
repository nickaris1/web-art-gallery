const express = require("express");
const app = express();

filelist = [
    "/.git/*",
    "/.gitignore", 
    "/*.json", 
    "/node_modules/*", 
    "/.vscode/*", 
    "/js/*", 
    "/server.js",
    "/db/*"
];

filelist.forEach(element => {
    app.get(element, (req, res) => {
        res.sendStatus(401);
    });
});


module.exports = app;