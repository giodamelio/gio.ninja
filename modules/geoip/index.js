var express = require("express");
var request = require("request");
var swig = require("swig");

var utils = require("../../utils");

var router = module.exports = express.Router();

// GeoIP info
var getGeoIp = function(req, res) {
    var ip = req.headers["x-forwarded-for"] || req.ip;
    request({
        method: "GET",
        url: "http://www.telize.com/geoip/" + ip
    }, function(error, response, body) {
        var data = JSON.parse(body);
        res.format({
            "text/plain": function() {
                res.send(
                    "Location: " + data.city + ", " + data.region_code + " " + data.country_code3 + "\n" +
                    "Timezone: " + data.timezone + "\n" +
                    "ISP: " + data.isp + "\n" +
                    "Lat: " + data.latitude + " Lon: " + data.longitude + "\n"
                );
            },
            "text/html": function() {
                swig.renderFile(__dirname + "/geoIp.html", data, function(error, html) {
                    res.send(html);
                });
            },
            "application/json": function() {
                res.json(data);
            }
        });
    });
};
router.get("/geoip", getGeoIp);
router.get("/geoip/json", utils.forceAccept("application/json"), getGeoIp);
router.get("/geoip/txt", utils.forceAccept("text/plain"), getGeoIp);

