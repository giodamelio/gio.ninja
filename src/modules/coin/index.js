var Module = require("../../module");

module.exports = new Module({
    name: "coin",
    description: "Coin flip",
    version: "0.1.0",
    vhosts: ["coin", "flip"],
    url: "/"
}, [
    {
        method: "GET",
        path: "/",
        handler: function(request, reply) {
            if (Math.random() > 0.5) {
                reply("tails");
            } else {
                reply("heads");
            }
        }
    }
]);

