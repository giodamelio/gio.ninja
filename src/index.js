var path = require("path");

var hapi = require("hapi");

var server = new hapi.Server("localhost", 3141);

// Serve the favicon
server.route({
    method: "GET",
    path: "/favicon.ico",
    handler: {
        file: path.resolve(__dirname, "../favicon.ico")
    }
});

server.pack.register([
    require("./modules/timer")
], function (error) {
    if (error) console.log(error);
    server.start(function() {
        console.log("Server running at:", server.info.uri);
    });
});

