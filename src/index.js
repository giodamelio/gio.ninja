var util = require("util");

var hapi = require("hapi");

var server = new hapi.Server("localhost", 3141);

server.route({
    method: "GET",
    path: "/",
    vhost: ["hello." + server.info.host],
    handler: function (request, reply) {
        reply("Hello Hello");
    }
});

server.route({
    method: "GET",
    path: "/",
    vhost: ["test." + server.info.host],
    handler: function (request, reply) {
        reply("Hello Test");
    }
});

server.start(function () {
    console.log("Server running at:", server.info.uri);
});

