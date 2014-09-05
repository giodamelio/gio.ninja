var path = require("path");

var swig = require("swig");

var Module = require("../../module");

module.exports = new Module({
    name: "ip",
    description: "Get your public IP",
    version: "0.1.0",
    vhosts: ["ip"],
    url: "/"
}, [
    {
        method: "GET",
        path: "/",
        handler: function(request, reply) {
            swig.renderFile(path.resolve(__dirname, "index.html"), {
                ip: request.headers["x-forwarded-for"] || request.info.remoteAddress
            }, function(err, output) {
                reply(output);
            });
        }
    }
]);

