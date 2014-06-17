var app = angular.module("list", ["ngSanitize"]);

app.controller("main", function($scope, $http) {
    $scope.modules = [];
    $http.get("/list.json")
        .success(function(data) {
            $scope.modules = data;

        });

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

app.directive("module", function($location) {
    return {
        restrict: "E",
        scope: {
            data: "=data",
            host: "=host"
        },
        link: function(scope, element) {
            var el = "<code>" + scope.data.name + "." + scope.host + scope.data.url + "</code>";

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

                    // Get base host
                    window.location.href = "http://" + scope.data.name + "." + scope.host + url;
                }
            });

            // Replace the url
            element.replaceWith(el);
        }
    };
});

