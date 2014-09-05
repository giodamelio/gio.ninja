var path = require("path");

var swig = require("swig");
var Request = require("request");

var Module = require("../../module");

module.exports = new Module({
    name: "geoip",
    description: "Get your location based on your IP",
    version: "0.1.0",
    vhosts: ["geoip"],
    url: "/"
}, [
    {
        method: "GET",
        path: "/",
        handler: function(request, reply) {
            // Get the clients ip
            var ip = request.headers["x-forwarded-for"] || request.info.remoteAddress;

            // Get location of ip
            Request({
                method: "GET",
                url: "http://www.telize.com/geoip/" + ip
            }, function(error, response, body) {
                swig.renderFile(path.resolve(__dirname, "index.html"), {
                    code: response.statusCode,
                    data: JSON.parse(body)
                }, function(err, output) {
                    reply(output);
                });
            });
        }
    }
]);

