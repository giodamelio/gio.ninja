var fs = require("fs");

var express = require("express");

var utils = require("../../utils");

var app = express();

// Module List
app.get("/", function(req, res) {
    fs.createReadStream(__dirname + "/list.html").pipe(res);
});

// My js
app.get("/main.js", function(req, res) {
    res.type("script/javascript");
    fs.createReadStream(__dirname + "/main.js").pipe(res);
});

module.exports = app;

