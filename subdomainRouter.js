var _ = require("lodash");

// Route by subdomain
module.exports = function() {
    // Get the router and list of subdomains
    var subdomains = [];
    var router;
    if (arguments.length <= 1) {
        // You need at least one subdomain
        throw new Error("You need at least one subdomain and one router");
    } else {
        // Loop through the arguments and add them to the subdomains
        for (var i = 0; i < arguments.length - 1; i++) {
            if (typeof arguments[i] == "string") {
                subdomains.push(arguments[i]);
            } else {
                subdomains = subdomains.concat(arguments[i]);
            }
        }
        // The last argument is the router
        router = arguments[arguments.length - 1];
    }
    
    // Check to see if any of the subdomains match
    // If the do, send request to the router
    return function(req, res, next) {
        if(_.intersection(req.subdomains, subdomains).length > 0) {
            router(req, res, next);
        } else {
            next();
        }
    };
};

