var express = require("express");
var request = require("request");
var swig = require("swig");

var utils = require("../../utils");

var app = express();

// Stop swig from escaping data
swig.setDefaults({
    autoescape: false
});

// Wiki
var getWiki = function(req, res) {
    request({
        method: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=" + req.params.query
    }, function(error, response, body) {
        var data = JSON.parse(body).query.pages;
        data = data[Object.keys(data)[0]];
        res.format({
            "text/plain": function() {
                // Get rid of the html tags
                data.extract = data.extract.replace(/<(?:.|\n)*?>/gm, "");
                res.send(data.extract);
            },
            "text/html": function() {
                swig.renderFile(__dirname + "/wiki.html", data, function(error, html) {
                    res.send(html);
                });
            },
            "application/json": function() {
                res.json(data);
            }
        });
    });
};
app.get("/:query", getWiki);
app.get("/:query/json", utils.forceAccept("application/json"), getWiki);
app.get("/:query/txt", utils.forceAccept("text/plain"), getWiki);

module.exports = app;
module.exports.properties = {
    name: ["wiki"],
    url: "wiki.gio.ninja/$1",
    description: "Quickly get first paragraph of a wikipedia article",
    args: {
        "$1": "Search Term"
    }
};

