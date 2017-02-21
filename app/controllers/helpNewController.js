'use strict';

app.controller('helpController', ['$scope', '$location', 'authService', 'ngAuthSettings', 'log', function ($scope, $location, authService, ngAuthSettings, log) {

    _CurrentUrl = "MainMenu";
 
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

}]);
