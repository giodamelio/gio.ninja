var rc = require("rc");

// Get our configuration
module.exports = rc("gio.ninja", {
    // Default port
    port: 3141,

    // Default host
    host: "localhost"
});

