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
        // Parse the body
        body = JSON.parse(body);

        // Get info from current version
        var currentInfo = body.versions[body["dist-tags"].latest];

        res.format({
            "text/plain": function() {
                res.send(
                    currentInfo.name + " v" + currentInfo.version + "\n" +
                    (currentInfo.homepage || currentInfo.repository.url || "") + "\n"
                );
            },
            "text/html": function() {
                res.redirect(
                    currentInfo.homepage ||
                    currentInfo.repository.url ||
                    "https://www.npmjs.org/package/" + req.params.packageName
                );
            },
            "application/json": function() {
                res.json(body);
            }
        });
    });
};
router.get("/:packageName", getNpm);
router.get("/:packageName/json", utils.forceAccept("application/json"), getNpm);
router.get("/:packageName/txt", utils.forceAccept("text/plain"), getNpm);

