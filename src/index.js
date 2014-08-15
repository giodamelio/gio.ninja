var util = require("util");

var hapi = require("hapi");

var server = new hapi.Server("localhost", 3141);

server.pack.register([
    require("./modules/timer")
], function (error) {
    if (error) console.log(error);
    server.start(function() {
        console.log("Server running at:", server.info.uri);
    });
});

