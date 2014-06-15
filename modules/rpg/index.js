var express = require("express");
var request = require("request");
var droll = require("droll");

var utils = require("../../utils");

var app = express();

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
app.get("/:query", rollDice);
app.get("/:query/json", utils.forceAccept("application/json"), rollDice);
app.get("/:query/txt", utils.forceAccept("text/plain"), rollDice);

module.exports = app;
module.exports.properties = {
    name: ["rpg", "dice"],
    url: "rpg.gio.ninja/$1",
    description: "Simple dice roll. Accepts <a href='http://en.wikipedia.org/wiki/Dice_notation'>standard dice notation</a>",
    args: {
        "$1": "Dice Configuration"
    }
};

