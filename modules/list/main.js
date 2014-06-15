var app = angular.module("list", []);

app.controller("main", function($scope) {
    $scope.modules = [
        {
            name: ["list"],
            url: "list.gio.ninja/",
            description: "This list"
        },
        {
            name: ["wiki"],
            url: "wiki.gio.ninja/$1",
            description: "Quickly get first paragraph of a wikipedia article",
            args: {
                "$1": "Search Term"
            }
        },
        {
            name: ["ip"],
            url: "ip.gio.ninja/",
            description: "Echo your ip address",
        },
        {
            name: ["geoip"],
            url: "ip.gio.ninja/geoip",
            description: "Echo geoip data"
        }
    ];

    // Filter the modules
    $scope.searchInput = "";
    $scope.search = function(module) {
        // Show all the modules the search box is empty
        if ($scope.searchInput === "") return true;

        return module.name.some(function(name) {
            return name.indexOf($scope.searchInput) != -1;
        });
    };
});

app.directive("module", function() {
    return {
        restrict: "E",
        scope: {
            data: "=data"
        },
        link: function(scope, element) {
            var el = "<code>" + scope.data.url + "</code>";

            // Replace args with text boxes
            if (scope.data.args) {
                for (var key in scope.data.args) {
                    el = el.replace(key, 
                        "<input placeholder=\"" + scope.data.args[key] + "\">"
                    );
                }
            }
            
            // Make it an jqLite object
            el = angular.element(el);

            // Handle enter
            var url = scope.data.url;
            el.find("input").on("keyup", function(event) {
                if (event.which === 13) {
                    var inputs = el.find("input");
                    for (var i = 0; i < inputs.length; i++) {
                        url = url.replace("$" + (i + 1).toString(), inputs[i].value);
                    }
                    window.location.href = "http://" + url;
                }
            });

            // Replace the url
            element.replaceWith(el);
        }
    };
});

