Module = require("../../module");

module.exports = new Module({
    name: "timer",
    version: "0.1.0",
    vhosts: ["timer", "t"]
}, [
    {
        method: "GET",
        path: "/",
        handler: function(request, reply) {
            reply("Hello World");
        }
    }
]);

