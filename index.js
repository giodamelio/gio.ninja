var fs = require("fs");
var path = require("path");

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
            subdomain: req.subdomain,
            path: req.path,
            "content-type": contentType,
            ip: req.headers["x-forwarded-for"] || req.ip
        }, function(error) {
            if (error) console.log(error);
        });
    });
    next();
});

// Loop through the modules and get their info
var MODULE_LIST = [];
var files = fs.readdirSync("modules");
for (var i in files) {
    var info = require("./modules/" + files[i] + "/info.json");
    MODULE_LIST.push(info);
}

// Loop through the modules and add their routes
for (var i in MODULE_LIST) {
    app.use(subdomainRouter(
                MODULE_LIST[i].name, 
                MODULE_LIST[i].alias,
                require("./modules/" + MODULE_LIST[i].name)
    ));
}

// Homepage
app.use("/", require("./list")(MODULE_LIST));

console.log("App started on port", process.env.PORT || 3141);
app.listen(process.env.PORT || 3141);

