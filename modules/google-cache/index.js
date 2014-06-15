var express = require("express");

var utils = require("../../utils");

var app = express();

// Google cache
var getCache = function(req, res) {
    var base = "http://www.google.com/search?q=cache:";
    res.format({
        "text/plain": function() {
            res.send(base + req.params.query);
        },
        "text/html": function() {
            res.redirect(base + req.params.query);
        },
        "application/json": function() {
            res.json({
                url: base + req.params.query
            });
        }
    });
};
app.get("/:query", getCache);
app.get("/:query/json", utils.forceAccept("application/json"), getCache);
app.get("/:query/txt", utils.forceAccept("text/plain"), getCache);

module.exports = app;
module.exports.properties = {
    name: ["gc", "google-cache"],
    url: "gc.gio.ninja/$1",
    description: "Google Cache Version of a page",
    args: {
        "$1": "Url"
    }
};

