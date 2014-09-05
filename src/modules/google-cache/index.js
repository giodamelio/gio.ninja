var Module = require("../../module");

module.exports = new Module({
    name: "google-cache",
    description: "Get Google's cached version of a page",
    version: "0.1.0",
    vhosts: ["google-cache", "gc"],
    url: "/%s",
    args: ["Url"]
}, [
    {
        method: "GET",
        path: "/{url*}",
        handler: function(request, reply) {
            reply.redirect("http://www.google.com/search?q=cache:" + request.params.url);
        }
    }
]);

