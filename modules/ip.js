var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.send(200, req.headers["x-forwarded-for"] || req.connection.remoteAddress);
});

module.exports = app;

