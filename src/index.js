var path = require("path");
var fs = require("fs");
var util = require("util");

var hapi = require("hapi");
var swig = require("swig");
var bluebird = require("bluebird");

var config = require("./config");

// If we are developing turn off swigs cache
if (process.env.NODE_ENV == "development") {
    swig.setDefaults({ cache: false });
}

// Swig filter to render url with inputs
var renderModuleUrl = function(module) {
    return util.format.apply(null,
            [module.url].concat(module.args.map(function(arg) {
                return util.format("<input class=\"arg\" placeholder=\"%s\">", arg);
            })
    ));
};
renderModuleUrl.safe = true;
swig.setFilter("renderModuleUrl", renderModuleUrl);

// Swig filter to give every element of an array but the first
swig.setFilter("allButFirst", function(input) {
    return input.slice(1);
});

// Create our server
var server = new hapi.Server("localhost", config.port);

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
        server.route({
            method: "GET",
            path: "/",
            vhost: config.host,
            handler: function(request, reply) {
                swig.renderFile(path.resolve(__dirname, "index.html"), {
                    modules: modules.map(function(module) {
                        return module.register.attributes;
                    }),
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
    .then(function() {
        server.start(function() {
            console.log("Server running at:", server.info.uri);
        });
    })

    // Catch errors
    .catch(function(error) {
        console.log(error);
    });


