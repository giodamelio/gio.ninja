var path = require("path");

var Module = require("../../module");

module.exports = new Module({
    name: "timer",
    description: "Simple count down timer",
    version: "0.1.0",
    vhosts: ["timer", "t"],
    url: "/$1/$2/",
    args: {
        "$1": "Increment",
        "$2": "Unit"
    }
}, [
    {
        method: "GET",
        path: "/{increment}/{unit}",
        handler: {
            file: path.resolve(__dirname, "static/index.html")
        }
    }
]);

