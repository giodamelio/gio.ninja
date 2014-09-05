var path = require("path");

var swig = require("swig");
var droll = require("droll");

var Module = require("../../module");

module.exports = new Module({
    name: "rpg",
    description: "Simple dice roll. Accepts standard dice notation",
    version: "0.1.0",
    vhosts: ["rpg", "dice"],
    url: "/%s",
    args: ["Dice Notation"]
}, [
    {
        method: "GET",
        path: "/{dice}",
        handler: function(request, reply) {
            var roll = droll.roll(request.params.dice);
            console.log(roll);
            swig.renderFile(path.resolve(__dirname, "index.html"), roll, function(err, output) {
                reply(output);
            });
        }
    }
]);

