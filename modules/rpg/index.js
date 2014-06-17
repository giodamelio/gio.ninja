var express = require("express");
var droll = require("droll");

var utils = require("../../utils");

var router = module.exports = express.Router();

// Wiki
var rollDice = function(req, res) {
    var roll = droll.roll(req.params.query);
    res.format({
        "text/plain": function() {
            res.send(roll.total.toString());
        },
        "text/html": function() {
            var text = "";
            for (var i in roll.rolls) {
                text = text + roll.rolls[i].toString() + " + ";
            }
            res.send("<code>" + text.slice(0, -2) + "= " + roll.total + "</code>");
        },
        "application/json": function() {
            res.json({
                roll: roll
            });
        }
    });
};
router.get("/:query", rollDice);
router.get("/:query/json", utils.forceAccept("application/json"), rollDice);
router.get("/:query/txt", utils.forceAccept("text/plain"), rollDice);

