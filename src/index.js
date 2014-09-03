var path = require("path");
var fs = require("fs");

var hapi = require("hapi");
var swig = require("swig");
var bluebird = require("bluebird");

// If we are developing turn off swigs cache
if (process.env.NODE_ENV == "development") {
    swig.setDefaults({ cache: false });
}

// Create our server
var server = new hapi.Server("localhost", 3141);

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

    // Serve the homepage
    .then(function(modules) {
        console.log(modules[0].register.attributes, server.info);
        server.route({
            method: "GET",
            path: "/",
            vhost: server.info.host,
            handler: function(request, reply) {
                swig.renderFile(path.resolve(__dirname, "index.html"), {
                    modules: modules,
                    info: server.info
                }, function(err, output) {
                    if (err) console.log(err);
                    reply(output);
                });
            }
        });
    })

    // Serve the favicon
    .then(function() {
        server.route({
            method: "GET",
            path: "/favicon.ico",
            handler: {
                file: path.resolve(__dirname, "../favicon.ico")
            }
        });
    })

    // Serve shared static files
    .then(function() {
        server.route({
            method: "GET",
            path: "/static/{params*}",
            handler: {
                directory: {
                    path: path.resolve(__dirname, "../shared_static/")
                }
            }
        });
    })

    // Start the server
    .then(function(modules) {
        server.start(function() {
            console.log("Server running at:", server.info.uri);
        });
    });


