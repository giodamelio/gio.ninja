var express = require("express");
var vhost = require("vhost");
var keen = require("keen.io");

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

// Pick domain
var base;
if (process.env.NODE_ENV == "production") {
    base = "gio.ninja";
} else {
    base = "localhost";
}

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
});

// Ip address info
app.use(vhost("ip." + base, require("./modules/ip")));

// Wikipedia summery
app.use(vhost("wiki." + base, require("./modules/wiki")));

// RPG Dice
app.use(vhost("rpg." + base, require("./modules/rpg")));

// Stats
app.use(vhost("stats." + base, require("./modules/stats")));

// List of modules
app.use(vhost("list." + base, require("./modules/list")));
app.use(function(req, res, next) {
    req.keenioIgnore = true;
    if (process.env.NODE_ENV == "production") {
        res.redirect("http://list." + base);
    } else {
        res.redirect("http://list." + base + ":3141");
    }
});

console.log("App started on port", process.env.PORT || 3141);
app.listen(process.env.PORT || 3141);

