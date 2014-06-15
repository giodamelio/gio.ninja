var fs = require("fs");

var express = require("express");

var utils = require("../../utils");

var app = express();

// Get module properties
var MODULE_LIST = [];
var files = fs.readdirSync (__dirname + "/..");
for (var i in files) {
    if (files[i] == "list") continue;
    var properties = require("../" + files[i]).properties;
    MODULE_LIST = MODULE_LIST.concat(properties);
}
MODULE_LIST = MODULE_LIST.concat({
    name: ["list"],
    url: "list.gio.ninja/",
    description: "This list"
});
MODULE_LIST = MODULE_LIST.sort();

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
app.get("/", getList);
app.get("/json", utils.forceAccept("application/json"), getList);
app.get("/txt", utils.forceAccept("text/plain"), getList);

// My js
app.get("/main.js", function(req, res) {
    res.type("script/javascript");
    fs.createReadStream(__dirname + "/main.js").pipe(res);
});

app.get("/list.json", function(req, res) {
    res.json(MODULE_LIST);
});

module.exports = app;

