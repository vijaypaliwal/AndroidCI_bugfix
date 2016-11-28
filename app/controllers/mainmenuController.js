'use strict';

app.controller('mainmenuController', ['$scope', '$location', 'authService', 'ngAuthSettings', 'log', function ($scope, $location, authService, ngAuthSettings, log) {

    _CurrentUrl = "MainMenu";

    $scope.inventorylist = [];

    $scope.inventory = {name:""}
 
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

   
    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });


    $scope.Openbottommenu = function () {

        if ($("body").hasClass("modal-open")) {
            $("#bottommenumodal").modal('hide');

            $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')


        }
        else {
            $("#bottommenumodal").modal('show');
            $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');
        }
    }
    $scope.saveinv = function () {
        debugger;
        var _name = angular.copy($scope.inventory);
        $scope.inventorylist.push(_name);
        $scope.$apply();

        $("#invmodal").modal("hide");
    }

    $scope.addinv = function () {

        $scope.inventory.name = "";
        $("#invmodal").modal("show");
    }
   

}]);
