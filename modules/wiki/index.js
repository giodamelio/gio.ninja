var express = require("express");
var request = require("request");
var swig = require("swig");

var utils = require("../../utils");

var app = express();

// Stop swig from escaping data
swig.setDefaults({
    autoescape: false
});

// Google analytics
app.use(utils.ga);

// IP address
var getWiki = function(req, res) {
    request({
        method: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=" + req.params.query
    }, function(error, response, body) {
        var data = JSON.parse(body).query.pages;
        data = data[Object.keys(data)[0]];
        res.format({
            "text": function() {
                // Get rid of the html tags
                data.extract = data.extract.replace(/<(?:.|\n)*?>/gm, "");
                res.send(data.extract);
            },
            "html": function() {
                swig.renderFile(__dirname + "/wiki.html", data, function(error, html) {
                    res.send(html);
                });
            },
            "json": function() {
                res.json(data);
            }
        });
    });
};
app.get("/:query", getWiki);
app.get("/:query/json", utils.forceAccept("application/json"), getWiki);
app.get("/:query/txt", utils.forceAccept("text/plain"), getWiki);

module.exports = app;

