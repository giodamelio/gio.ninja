var express = require("express");
var vhost = require("vhost");
var ua = require("universal-analytics");

var app = express();

// Setup google analytics
app.use(ua.middleware(process.env.GOOGLE_ANALYTICS_ID, {cookieName: "_ga"}));

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


app.listen(process.env.PORT || 3141);

