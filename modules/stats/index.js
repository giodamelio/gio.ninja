var express = require("express");
var swig = require("swig");

var utils = require("../../utils");

var router = module.exports = express.Router();

// Stop swig from caching data
swig.setDefaults({
    cache: false
});

var data = {
    projectId: process.env.KEEN_IO_ID,
    readKey: process.env.KEEN_IO_READ_KEY
};

// Stats
var getStats = function(req, res) {
    res.format({
        "text/plain": function() {
            res.send("");
        },
        "text/html": function() {
            swig.renderFile(__dirname + "/stats.html", data, function(error, html) {
                res.send(html);
            });
        },
        "application/json": function() {
            res.json({});
        }
    });
};
router.get("/", getStats);
router.get("/json", utils.forceAccept("application/json"), getStats);
router.get("/txt", utils.forceAccept("text/plain"), getStats);

