 'use strict';
app.controller('reportmenuController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
 

    $scope.mainObjectToSend = [];

    $scope.currentinvloaded = false;

    $scope.loadcounter1 = false;
    $scope.loadcounter2 = false;
    $scope.loadcounter3 = false;
    $scope.loadcounter4 = false;
    $scope.loadcounter5 = false;


    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars');
    });


    $scope.Openbottommenu = function () {

        if ($("body").hasClass("modal-open")) {
            $("#bottommenumodal").modal('hide');

            $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars');


        }
        else {
            $("#bottommenumodal").modal('show');
            $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');
        }
    }



    $scope.GoTo = function (url) {

        $location.path(url);
    }

    $scope.GetInventoryViews = function () {

        $scope.loadcounter1 = false;

        $scope.currentinvloaded = false;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllViews',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, Type: 1 }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response)
              {

                  if (response.GetAllViewsResult.Success == true) {
                      $scope.InventoryViews = response.GetAllViewsResult.Payload;
                      $scope.loadcounter1 = true;
                      $scope.$apply();

                  }
                  else {
                      $scope.ShowErrorMessage("Inventory reports counter", 1, 1, response.GetAllViewsResult.Message)

                  }
            
              },
              error: function (err) {
                  $scope.currentinvloaded = true;
                  $scope.ShowErrorMessage("Inventory  reports counter", 2, 1, err.statusText);


              }
          });

    }

    $scope.GetActivityViews = function () {

        $scope.loadcounter2 = false;

        $scope.currentinvloaded = false;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllViews',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, Type: 3 }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response) {

                  if (response.GetAllViewsResult.Success == true) {

                      $scope.ActivityViews = response.GetAllViewsResult.Payload;
                      $scope.loadcounter2 = true;
                      $scope.$apply();

                  }
                  else {
                      $scope.ShowErrorMessage("Activity Views counter", 1, 1, response.GetAllViewsResult.Message)

                  }

              },
              error: function (err) {
                  $scope.currentinvloaded = true;
                  $scope.ShowErrorMessage("Activity  reports counter", 2, 1, err.statusText);
                  $scope.$apply();

              }
          });

    }


    $scope.GetItemViews = function () {

        $scope.currentitemloaded = false;
        $scope.loadcounter3= false;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllViews',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, Type: 4 }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response) {

                  if (response.GetAllViewsResult.Success == true) {

                

                      $scope.ItemViews = response.GetAllViewsResult.Payload;
                      $scope.currentitemloaded = true;
                      $scope.loadcounter3 = true;
                      $scope.$apply();

                  }
                  else {
                      $scope.ShowErrorMessage("Activity Views counter", 1, 1, response.GetAllViewsResult.Message)

                  }

              },
              error: function (err) {
                  $scope.currentitemloaded = true;
                  $scope.ShowErrorMessage("Item  reports counter", 2, 1, err.statusText);
                  $scope.$apply();

              }
          });

    }

    $scope.GetsummaryViews = function () {

        $scope.currentsummaryloaded = false;
        $scope.loadcounter6 = false;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllViews',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, Type: 2 }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response) {

                  if (response.GetAllViewsResult.Success == true) {



                      $scope.SummaryViews = response.GetAllViewsResult.Payload;
                      $scope.currentsummaryloaded = true;
                      $scope.loadcounter6 = true;
                      $scope.$apply();

                  }
                  else {
                      $scope.ShowErrorMessage("Activity Views counter", 1, 1, response.GetAllViewsResult.Message)

                  }

              },
              error: function (err) {
                  $scope.currentitemloaded = true;
                  $scope.ShowErrorMessage("Item  reports counter", 2, 1, err.statusText);
                  $scope.$apply();

              }
          });

    }


    $scope.GetGlobalRestockViews=function()
    {
        $scope.currentitemloaded = false;
        $scope.loadcounter4 = false;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllViews',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, Type:5 }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response) {

                  if (response.GetAllViewsResult.Success == true) {



                      $scope.GlobalViews = response.GetAllViewsResult.Payload;
                      $scope.currentitemloaded = true;
                      $scope.loadcounter4 = true;
                      $scope.$apply();

                  }
                  else {
                      $scope.ShowErrorMessage("Global reports counter", 1, 1, response.GetAllViewsResult.Message)

                  }

              },
              error: function (err) {
                  $scope.currentitemloaded = true;
                  $scope.ShowErrorMessage("Global reports counter", 2, 1, err.statusText);
                  $scope.$apply();

              }
          });

    }
    $scope.GetLocalRestockViews = function () {
        $scope.currentitemloaded = false;
        $scope.loadcounter5 = false;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllViews',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, Type: 6 }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response) {

                  if (response.GetAllViewsResult.Success == true) {



                      $scope.LocalViews = response.GetAllViewsResult.Payload;
                      $scope.currentitemloaded = true;
                      $scope.loadcounter5 = true;
                      $scope.$apply();

                  }
                  else {
                      $scope.ShowErrorMessage("Local reports counter", 1, 1, response.GetAllViewsResult.Message)

                  }

              },
              error: function (err) {
                  $scope.currentitemloaded = true;
                  $scope.ShowErrorMessage("Local reports counter", 2, 1, err.statusText);
                  $scope.$apply();

              }
          });
    }
    function init() {
       


        $scope.GetInventoryViews()

        $scope.GetActivityViews();
        $scope.GetItemViews();
        $scope.GetGlobalRestockViews();
        $scope.GetLocalRestockViews();
        $scope.GetsummaryViews();

        $scope.getactivepermission();

        $scope.$apply();
    }
    init()

}]);