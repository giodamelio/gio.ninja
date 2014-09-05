var path = require("path");

var Module = require("../../module");

module.exports = new Module({
    name: "timer",
    description: "Count down timer",
    version: "0.1.0",
    vhosts: ["timer", "t"],
    url: "/%s/%s",
    args: [
        "Increment",
        "Unit"
    ]
}, [
    {
        method: "GET",
        path: "/{increment}/{unit}",
        handler: {
            file: path.resolve(__dirname, "static/index.html")
        }
    }
]);

