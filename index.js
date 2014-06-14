var express = require("express");
var vhost = require("vhost");

var app = express();

// Pick domain
var base;
if (process.env.NODE_ENV == "production") {
    base = "gio.ninja";
} else {
    base = "localhost";
}

// Ip address info
app.use(vhost("ip." + base, require("./modules/ip")));

app.get("/", function(req, res){
    res.send("Hello World");
});


app.listen(process.env.PORT || 3141);

