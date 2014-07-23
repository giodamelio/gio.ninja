var fs = require("fs");
var path = require("path");

var express = require("express");
var moment = require("moment");

var utils = require("../../utils");

var router = module.exports = express.Router();

// Timer
var getTimer = function(req, res) {
    res.format({
        "text/plain": function() {
            var endTime = moment()
                .add(req.params.unit, req.params.increment)
                .toDate();
            res.send(endTime + "\n");
        },
        "text/html": function() {
            fs.createReadStream(__dirname + "/timer.html").pipe(res);
        },
        "application/json": function() {
            var endTime = moment()
                .add(req.params.unit, req.params.increment)
                .toJSON();
            res.json({
                endTime: endTime
            });
        }
    });
};
router.get("/:increment/:unit", getTimer);
router.get("/:increment/:unit/json", utils.forceAccept("application/json"), getTimer);
router.get("/:increment/:unit/txt", utils.forceAccept("text/plain"), getTimer);

// Serve alarm sound
router.use(express.static(path.join(__dirname,"/public")));

