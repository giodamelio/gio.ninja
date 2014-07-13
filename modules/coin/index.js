var fs = require("fs");

var express = require("express");
var request = require("request");

var utils = require("../../utils");

var router = module.exports = express.Router();

// Coin
var getCoin = function(req, res) {
    // Flip the coin
    var flip = Math.floor(Math.random() * 2);

    res.format({
        "text/plain": function() {
            res.send(flip === 0 ? "heads": "tails");
        },
        "text/html": function() {
            res.send(flip === 0 ? 
                "<h1>heads</h1><img src='/heads.jpg'>":
                "<h1>tails</h1><img src='/tails.jpg'>");
        },
        "application/json": function() {
            res.json({
                flip: flip === 0 ? "heads": "tails"
            });
        }
    });
};
router.get("/", getCoin);
router.get("/json", utils.forceAccept("application/json"), getCoin);
router.get("/txt", utils.forceAccept("text/plain"), getCoin);

// Serve our images
router.use(express.static(__dirname + "/public"));

