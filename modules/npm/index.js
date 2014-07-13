var fs = require("fs");

var express = require("express");

var utils = require("../../utils");

var router = module.exports = express.Router();

// Npm
var getNpm = function(req, res) {
    res.format({
        "text/plain": function() {
            res.send("");
        },
        "text/html": function() {
            res.send("");
        },
        "application/json": function() {
            res.json({});
        }
    });
};
router.get("/:packageName", getNpm);
router.get("/:packageName/json", utils.forceAccept("application/json"), getNpm);
router.get("/:packageName/txt", utils.forceAccept("text/plain"), getNpm);

