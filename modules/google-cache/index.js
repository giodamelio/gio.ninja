var express = require("express");

var utils = require("../../utils");

var router = module.exports = express.Router();

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
router.get("/:query", getCache);
router.get("/:query/json", utils.forceAccept("application/json"), getCache);
router.get("/:query/txt", utils.forceAccept("text/plain"), getCache);

