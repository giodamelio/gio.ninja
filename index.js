var express = require("express");
var keen = require("keen.io");

var subdomainRouter = require("./subdomainRouter");

var app = express();

// Disable cache
// Content is small and we always want the newest data
app.use(function(req, res, next) {
  req.headers["if-none-match"] = "no-match-for-this";
  next();
});

// Ignore favicon requests
app.use(function(req, res, next) {
    if (req.path == "/favicon.ico") {
        res.send(404);
    } else {
        next();
    }
});

/*
// Setup keen.io
var keenio = keen.configure({
    projectId: process.env.KEEN_IO_ID,
    writeKey: process.env.KEEN_IO_WRITE_KEY
});
app.use(function(req, res, next) {
    req.on("end", function() {
        if (req.keenioIgnore) return;

        // Get content type
        var contentType;
        if (res._headers["content-type"]) {
            contentType = res._headers["content-type"].split(";")[0];
        } else {
            contentType = "text/html";
        }

        // Send event to keen.io
        keenio.addEvent("pageview", {
            subdomain: req.vhost.hostname.split("." + base)[0],
            path: req.path,
            "content-type": contentType,
            ip: req.headers["x-forwarded-for"] || req.ip
        }, function(error) {
            if (error) console.log(error);
        });
    });
    next();
});*/

// Ip echo
app.use(subdomainRouter("ip", require("./modules/ip")));

// GeoIp data
app.use(subdomainRouter("geoip", require("./modules/geoip")));

// Wikipedia summery
app.use(subdomainRouter("wiki", require("./modules/wiki")));

// RPG Dice
app.use(subdomainRouter("rpg", require("./modules/rpg")));

// Google Cache
app.use(subdomainRouter("gc", require("./modules/google-cache")));

// Stats
app.use(subdomainRouter("stats", require("./modules/stats")));

// Homepage
app.use("/", require("./list"));

console.log("App started on port", process.env.PORT || 3141);
app.listen(process.env.PORT || 3141);

