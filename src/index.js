var path = require("path");
var fs = require("fs");

var hapi = require("hapi");
var bluebird = require("bluebird");

var server = new hapi.Server("localhost", 3141);

// Serve the favicon
server.route({
    method: "GET",
    path: "/favicon.ico",
    handler: {
        file: path.resolve(__dirname, "../favicon.ico")
    }
});

// Serve the modules
bluebird.all(fs.readdirSync(path.resolve(__dirname, "modules"))
    .map(function(moduleName) {
        return new bluebird(function(resolve, reject) {
            var module = require(path.resolve(__dirname, "modules", moduleName));
            server.pack.register(module, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(module);
                }
            });
        });
    }))

    // Start the server
    .then(function(modules) {
        server.start(function() {
            console.log("Server running at:", server.info.uri);
        });
    });


