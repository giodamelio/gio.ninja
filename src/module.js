module.exports = function(attributes, routes) {
    // Add our routes to the server
    this.register = function(plugin, options, next) {
        // Loop through the selected servers and add the routes
        plugin.servers.forEach(function(server) {
            // Loop through the routes and add the vhost option
            routes.map(function(route) {
                route.vhost = attributes.vhosts.map(function(vhost) {
                     return vhost + "." + server.info.host;
                });
            });

            // Add the routes
            server.route(routes);
        });
        next();
    };

    // Add our attributes
    this.register.attributes = attributes;
};

