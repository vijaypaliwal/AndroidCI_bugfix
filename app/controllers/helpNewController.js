'use strict';

app.controller('helpNewController', ['$scope', '$location', 'authService', 'ngAuthSettings', 'log', function ($scope, $location, authService, ngAuthSettings, log) {


    $(".modal").modal("hide");

 
    $(".modal-backdrop").remove();
    $(".modal-backdrop").hide();
    $("body").removeClass("modal-open");

}]);
