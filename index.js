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

// Setup keen.io
var keenio = keen.configure({
    projectId: process.env.KEEN_IO_ID,
    writeKey: process.env.KEEN_IO_WRITE_KEY
});
app.use(function(req, res, next) {
    req.on("end", function() {
        // Ignore favicon requests
        if (req.path == "/favicon.ico") return;
        
        // Get content type
        var contentType;
        if (res._headers["content-type"]) {
            contentType = res._headers["content-type"].split(";")[0];
        } else {
            contentType = "text/html";
        }
    
        // Send event to keen.io
        keenio.addEvent("pageview", {
            subdomain: req.vhost,
            path: req.path,
            "content-type": contentType,
            ip: req.headers["x-forwarded-for"]
        }, function(error) {
            if (error) console.log(error);
        });
    });
    next();
});

// Pick domain
var base;
if (process.env.NODE_ENV == "production") {
    base = "gio.ninja";
} else {
    base = "localhost";
}

// Ip address info
app.use(vhost("ip." + base, require("./modules/ip")));

// Wikipedia summery
app.use(vhost("wiki." + base, require("./modules/wiki")));


app.get("/", function(req, res){
    res.send("Hello World");
});

console.log("App started on port", process.env.PORT || 3141);
app.listen(process.env.PORT || 3141);

