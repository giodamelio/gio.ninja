var express = require("express");
var request = require("request");
var swig = require("swig");

var app = express();

// Get ip address
app.use(function(req, res, next) {
    req.IP = req.headers["x-forwarded-for"];
    next();
});

// Force the accept header to a certin value
var forceAccept = function(mimeType) {
    return function(req, res, next) {
        req.headers.accept = mimeType;
        next();
    };
};

// IP address
var getIp = function(req, res) {
    res.format({
        "text": function() {
            res.send(req.IP);
        },
        "html": function() {
            res.send(swig.renderFile(__dirname + "/ip.html", { ip: req.IP }));
        },
        "json": function() {
            res.json({
                ip: req.IP
            });
        }
    });
};
app.get("/", getIp);
app.get("/json", forceAccept("application/json"), getIp);
app.get("/txt", forceAccept("text/plain"), getIp);

// GeoIP info
var getGeoIp = function(req, res) {
    request({
        method: "GET",
        url: "http://www.telize.com/geoip/" + req.IP
    }, function(error, response, body) {
        var data = JSON.parse(body);
        res.format({
            "text": function() {
                res.send(
                    "Location: " + data.city + ", " + data.region_code + " " + data.country_code3 + "\n" +
                    "Timezone: " + data.timezone + "\n" +
                    "ISP: " + data.isp + "\n" +
                    "Lat: " + data.latitude + " Lon: " + data.longitude + "\n"
                );
            },
            "html": function() {
                swig.renderFile(__dirname + "/geoIp.html", data, function(error, html) {
                    res.send(html);
                });
            },
            "json": function() {
                res.json(data);
            }
        });
    });
};
app.get("/geoip", getGeoIp);
app.get("/geoip/json", forceAccept("application/json"), getGeoIp);
app.get("/geoip/txt", forceAccept("text/plain"), getGeoIp);

module.exports = app;

