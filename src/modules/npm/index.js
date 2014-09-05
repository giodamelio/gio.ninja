var Request = require("request");
var Module = require("../../module");

module.exports = new Module({
    name: "npm",
    description: "Redirect you to an npm project's homepage",
    version: "0.1.0",
    vhosts: ["npm"],
    url: "/%s",
    args: ["Package Name"]
}, [
    {
        method: "GET",
        path: "/{packageName}",
        handler: function(request, reply) {
            var npmBaseUrl = "https://skimdb.npmjs.com/registry/";
            Request(npmBaseUrl + request.params.packageName, function(err, response, body) {
                // Got error
                if (err) {
                    console.log(err);
                    reply(error);
                }

                if (response.statusCode === 200) {
                    // Everthing is good
                    // Parse the body
                    body = JSON.parse(body);

                    // Get the current version
                    var currentInfo = body.versions[body["dist-tags"].latest];
                    // Redirect to the homepage
                    reply.redirect(
                        currentInfo.homepage ||
                        currentInfo.repository.url ||
                        "https://www.npmjs.org/package/" + request.params.packageName
                    );
                } else if (response.statusCode === 404) {
                    reply("Package \"" + request.params.packageName + "\"does not exist");
                } else {
                    reply("Error: " + response.statusCode + "\n" + body);
                }
            });
        }
    }
]);

