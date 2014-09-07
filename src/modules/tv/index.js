var path = require("path");

var swig = require("swig");
var Request = require("request");
var async = require("async");

var config = require("../../config");
var Module = require("../../module");

module.exports = new Module({
    name: "tv",
    description: "Get episode information for a TV series",
    version: "0.1.0",
    vhosts: ["tv"],
    url: "/%s",
    args: ["Show Name"]
}, [
    {
        method: "GET",
        path: "/{show_name}",
        handler: function(request, reply) {
            // Check to see if we have an api key
            if (!((config||{}).tv||{}).api_key) {
                reply("No api key");
                return;
            }

            // Search the show
            Request({
                method: "GET",
                url: "http://api.trakt.tv/search/shows.json/" + config.tv.api_key,
                qs: {
                    query: encodeURIComponent(request.params.show_name),
                    seasons: true
                }
            }, function(error, response, body) {
                // Check to see if there is an error
                if (error) {
                    console.error(error);
                    return reply(error);
                }

                // Parse the body
                var shows = JSON.parse(body);

                // If the input is exactly the same as a show name,
                // show episode info for that show, otherwise show
                // search results
                var matches = shows.filter(function(show) {
                    return request.params.show_name.toLowerCase() === show.title.toLowerCase();
                });

                if (matches.length === 1) {
                    // Show episode info for one show

                    // Get seasons list
                    Request({
                        method: "GET",
                        url: "http://api.trakt.tv/show/seasons.json/" + config.tv.api_key + "/" + matches[0].tvdb_id
                    }, function(error, response, body) {
                        if (error) {
                            console.error(error);
                            return reply(error).code(500);
                        }
                        
                        // Parse body
                        var seasons = JSON.parse(body);

                        // Get episode lists for each season
                        var seasonNums = seasons.map(function(season) {
                            return season.season;
                        }).sort();
                        async.map(seasonNums, function(item, cb) {
                            Request({
                                method: "GET",
                                url: "http://api.trakt.tv/show/season.json/" + config.tv.api_key + "/" + matches[0].tvdb_id + "/" + item
                            }, function(error, response, body) {
                                if (error) {
                                    return cb(error);
                                }
                                cb(null, JSON.parse(body));
                            });
                        }, function(error, seasons) {
                            if (error) {
                                console.error(error);
                                return reply(error);
                            }
                            swig.renderFile(path.resolve(__dirname, "show.html"), {
                                show: matches[0],
                                seasons: seasons
                            }, function(error, output) {
                                reply(output);
                            });
                        });
                    });
                } else {
                    // Show search results
                    swig.renderFile(path.resolve(__dirname, "search.html"), {
                        host: config.host,
                        orignalName: request.params.show_name,
                        searchResults: shows
                    }, function(error, output) {
                        reply(output);
                    });
                }
            });
        }
    }
]);

