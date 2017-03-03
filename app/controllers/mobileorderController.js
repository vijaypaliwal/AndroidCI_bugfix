'use strict';
app.controller('mobileorderController', ['$scope', 'localStorageService', 'authService', '$location', 'log', '$cordovaKeyboard', function ($scope, localStorageService, authService, $location, log, $cordovaKeyboard) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.slide = 0;
    $scope.Totalslides = 0;
    $scope.isallowdrag = true;

    $scope.LocationsLoaded = false;

    $scope.Isbuttonshow = false;

    $scope.loadingbutton = false;


    $scope.mainObjectToSend = [];

    function init() {
        $scope.GetMyinventoryColumns();

        $scope.$apply();
    }
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.allowdrag = function () {
        ShowSuccess("Updated");
         
        $scope.isallowdrag = true;
        $scope.$apply();
    }


    $scope.disallowdrag = function () {
        ShowSuccess("Updated");
         
        $scope.isallowdrag = false;
        $scope.$apply();
    }


    var counter = 0;

    $scope.saveColumnsNew = function () {


        // $scope.LocationsLoaded = false;

        counter = 1;
        for (var i = 0; i < $scope.MyInventorycolumns.length; i++) {
            if ($scope.MyInventorycolumns[i].mobileorder != 0) {
                $scope.MyInventorycolumns[i].mobileorder = i + 1;

            }

        }


        $scope.$apply();

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'SaveMyInventoryColumn',
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Columns": $scope.MyInventorycolumns }),
              success: function (response) {
                  counter = 0;
                  $scope.LocationsLoaded = true;
                  $scope.loadingbutton = false
                  if (response.SaveMyInventoryColumnResult.Success == true) {
                      $scope.GetMyinventoryColumns();

                  }
                  else {
                      $scope.ShowErrorMessage("Updating my inventory columns", 1, 1, response.SaveMyInventoryColumnResult.Message)

                  }
                  
                  $scope.$apply();
              },
              error: function (err) {
                  counter = 0;
                  $scope.ShowErrorMessage("Updating my inventory columns", 2, 1, err.statusText);

              }
          });
    };
    $scope.$on('$locationChangeStart', function (event) {

        if (counter == 0) {

            $scope.saveColumnsNew();
        }


    });


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


    function SortByOrder(a, b) {
        var aName = a.mobileorder;
        var bName = b.mobileorder;
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }


    $scope.GetMyinventoryColumns = function () {

        $scope.LocationsLoaded = false;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetMyInventoryColumns',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
              success: function (response) {

                  if (response.GetMyInventoryColumnsResult.Success == true) {
                 
                  $scope.MyInventorycolumns = [];

                  var _myinventorycols = response.GetMyInventoryColumnsResult.Payload;
                  for (var i = 0; i <_myinventorycols.length; i++) {
                      if (_myinventorycols[i].ColumnName != "HasConversion" && _myinventorycols[i].ColumnName != "ActionQty")
                      {
                          $scope.MyInventorycolumns.push(_myinventorycols[i]);
                      }
                  }
                  $scope.LocationsLoaded = true;
                  $scope.Isbuttonshow = true;
                  $scope.MyInventorycolumns.sort(SortByOrder);

                  var _data = $scope.MyInventorycolumns;

                  $scope.MyInventorycolumns = [];
                  for (var i = 0; i < _data.length; i++) {
                      if (_data[i].mobileorder != 0 )
                      {
                          $scope.MyInventorycolumns.push(_data[i]);
                      }
                  }

                  for (var i = 0; i < _data.length; i++) {
                      if (_data[i].mobileorder == 0) {
                          $scope.MyInventorycolumns.push(_data[i]);
                      }
                  }
                  $scope.$apply();

                  }
                  else {
                      $scope.ShowErrorMessage("Getting My inventory columns", 1, 1, response.GetMyInventoryColumnsResult.Message)

                  }
              },
              error: function (err) {
                  $scope.ShowErrorMessage("Getting Myinventory columns", 2, 1, err.statusText);

                  $scope.LocationsLoaded = true;
                  $(".save-btn").hide();
                  $scope.errorbox(err);
                  $scope.$apply();

              }
          });

    }


    $scope.sortableOptions = {
        start: function (evt, ui) {
            $(this).attr("style", "cursor:move")

       
        },
        items: "tr",
        update: function (e, ui) {
        },
        placeholder: "alert alert-info",
        cancel: ".unsortable",
        stop: function (e, ui) {


        }
    };

    $scope.offmobileorder = function ()
    {

    }



    $scope.AlreadyTaken = function (ColID, order) {
        for (var i = 0; i < $scope.MyInventorycolumns.length; i++) {
            if ($scope.MyInventorycolumns[i].mobileorder == order) {
                return true;
                break;
            }
        }

        return false;
    }

    $scope.ClearMobileOrder = function () {
        for (var i = 0; i < $scope.MyInventorycolumns.length; i++) {
            if ($scope.MyInventorycolumns[i].Required != true) {
                $scope.MyInventorycolumns[i].mobileorder = 0;
            }
        }
        $scope.$apply();
    }



    $scope.saveColumns = function () {

        $(".fa-check").addClass("fa-spin");

       // $scope.LocationsLoaded = false;

        $scope.loadingbutton = true;

        for (var i = 0; i < $scope.MyInventorycolumns.length; i++) {
            if ($scope.MyInventorycolumns[i].mobileorder != 0) {
                $scope.MyInventorycolumns[i].mobileorder = i + 1;

            }

        }

        console.log($scope.MyInventorycolumns);
         
        $scope.$apply();

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'SaveMyInventoryColumn',
              contentType: 'application/json; charset=utf-8',
               dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Columns": $scope.MyInventorycolumns }),
              success: function (response) {

                  if (response.SaveMyInventoryColumnResult.Success == true) {
                 
                  $scope.LocationsLoaded = true;
                  $scope.loadingbutton = false
                  ShowSuccess("Updated");
                  $(".fa-check").removeClass("fa-spin");
                  $scope.GetMyinventoryColumns();
                  }
                  else {
                      $scope.ShowErrorMessage("Updating Myinventory columns", 1, 1, response.SaveMyInventoryColumnResult.Message)

                  }
                  $scope.$apply();
              },
              error: function (err)
              {
                  console.log(err);
                  $scope.LocationsLoaded = true;
                  $(".fa-check").removeClass("fa-spin");
                  $scope.loadingbutton = false;
                  $scope.$apply();
                  $scope.ShowErrorMessage("Updating Myinventory columns", 2, 1, err.statusText);

              }
          });
    };


    init();

}]);