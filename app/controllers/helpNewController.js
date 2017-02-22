'use strict';

app.controller('helpController', ['$scope', '$location', 'authService', 'ngAuthSettings', 'log', function ($scope, $location, authService, ngAuthSettings, log) {

    _CurrentUrl = "MainMenu";

    $(".modal").modal("hide");
 
    $(".modal-backdrop").remove();
    $(".modal-backdrop").hide();
    $("body").removeClass("modal-open");

}]);
