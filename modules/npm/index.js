var fs = require("fs");

var express = require("express");
var request = require("request");

var utils = require("../../utils");

var router = module.exports = express.Router();

// Npm
var getNpm = function(req, res) {
    // Get npm info
    var npmBaseUrl = "https://skimdb.npmjs.com/registry/";
    request(npmBaseUrl + req.params.packageName, function(err, response, body) {
        res.format({
            "text/plain": function() {
                res.send("");
            },
            "text/html": function() {
                res.send("");
            },
            "application/json": function() {
                res.json(JSON.parse(body));
            }
        });
    });
};
router.get("/:packageName", getNpm);
router.get("/:packageName/json", utils.forceAccept("application/json"), getNpm);
router.get("/:packageName/txt", utils.forceAccept("text/plain"), getNpm);

