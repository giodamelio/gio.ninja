var express = require("express");
var app = express();

app.get("/", function(req, res) {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    res.send(200, ip);
});

app.get("/.json", function(req, res) {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    res.json(200, {
        ip: ip
    });
});

module.exports = app;

