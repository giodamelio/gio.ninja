var fs = require("fs");
var path = require("path");

var express = require("express");

var utils = require("../utils");

var router = module.exports = express.Router();

// Loop through the modules and get their info
var MODULE_LIST = [];
var files = fs.readdirSync(path.resolve(__dirname, "../modules"));
for (var i in files) {
    var info = require(path.resolve(__dirname, "../modules", files[i]) + "/info.json");
    MODULE_LIST.push(info);
}

// Sort the modules
MODULE_LIST = MODULE_LIST.sort(function(a, b) {
    if (a.name[0] > b.name[0]) return 1;
    else if (a.name[0] < b.name[0]) return -1;
    else return 0;
});

// Module List
var getList = function(req, res) {
    var spaces = function(st) {
        var ln = 30 - st.length;
        var spaces = "";
        for (var i = 0; i < ln; i++) {
            spaces += " ";
        }
        return spaces;
    };
    res.format({
        "text/plain": function() {
            var text = "";
            for (var i in MODULE_LIST) {
                var module = MODULE_LIST[i];
                text += module.url + spaces(module.url) + module.description + "\n";
                if (module.args) {
                    for (var key in module.args) {
                        text += "    " + key + ": " + module.args[key] + "\n";
                    }
                }
            }
            res.send(text);
        },
        "text/html": function() {
            fs.createReadStream(__dirname + "/list.html").pipe(res);
        },
        "application/json": function() {
            res.json(MODULE_LIST);
        }
    });
};
router.get("/", getList);
router.get("/json", utils.forceAccept("application/json"), getList);
router.get("/txt", utils.forceAccept("text/plain"), getList);

// My js
router.get("/main.js", function(req, res) {
    req.keenioIgnore = true;
    res.type("text/javascript");
    fs.createReadStream(__dirname + "/main.js").pipe(res);
});

router.get("/list.json", function(req, res) {
    req.keenioIgnore = true;
    res.json(MODULE_LIST);
});

