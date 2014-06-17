var express = require("express");
var request = require("request");
var swig = require("swig");

var utils = require("../../utils");

var router = module.exports = express.Router();

// IP address
var getIp = function(req, res) {
    var ip = req.headers["x-forwarded-for"] || req.ip;
    res.format({
        "text/plain": function() {
            res.send(ip);
        },
        "text/html": function() {
            res.send(swig.renderFile(__dirname + "/ip.html", { ip: ip }));
        },
        "application/json": function() {
            res.json({
                ip: ip
            });
        }
    });
};
router.get("/", getIp);
router.get("/json", utils.forceAccept("application/json"), getIp);
router.get("/txt", utils.forceAccept("text/plain"), getIp);

