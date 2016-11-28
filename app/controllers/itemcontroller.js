'use strict';
app.controller('itemController', ['$scope', 'ordersService', 'localStorageService', function ($scope, ordersService, localStorageService) {

    $scope.orders = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.SecurityToken = "";
    $scope.ItemObject = { ItemID: 0, ItemNumber: "", ItemDescription: "", ItemGroup: "", ItemNote: "", DefaultLocation: "", DefaultUOM: "", TargetLevel: 0, ReorderLevel: 0, DefaultCost: 0, DefaultUOMID: 0, DefaultLocationID: 0, CustomData: [] };
    $scope.CustomItemFields = [];
    $scope.UOMList = [];
   
    $scope.GetCustomFields = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }


        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/GetCustomItemFields',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   var _customFields = response.GetCustomItemFieldsResult.Payload;

                   if (_customFields.length > 0) {

                       alert("Custom fields loaded successfully.");

                       $scope.CustomItemFields = _customFields;
                       $scope.ItemObject.CustomData = $scope.CustomItemFields;
                       $scope.$apply();

                   }
                   else {
                       alert("Can't get any data");
                   }
                   $scope.$apply();





               },
               error: function (err) {

                   alert("error");
                   $scope.$apply();
               }
           });
    }
    $scope.GetCustomFields();

    $scope.additem = function ()
    {
       
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $("#btnadditem").addClass("disabled");
        $("#btnadditem").find(".fa").addClass("fa-spin");

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/CreateItem',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "NewItem": $scope.ItemObject }),
               success: function (response) {
                   $("#btnadditem").removeClass("disabled");
                   $("#btnadditem").find(".fa").removeClass("fa-spin");

                   alert("item successfully added in.");
              

                   var _Item = response.CreateItemResult.Payload;

                   if (_Item != null && _Item!=undefined) {

                       alert("item successfully added .");

                   }
                   else {
                       alert(response.CreateItemResult.Message);
                   }

                   $scope.ItemObject = { ItemID: 0, ItemNumber: "", ItemDescription: "", ItemGroup: "", ItemNote: "", DefaultLocation: "", DefaultUOM: "", TargetLevel: 0, ReorderLevel: 0, DefaultCost: 0, DefaultUOMID: 0, DefaultLocationID: 0, CustomData: [] };
                   $scope.$apply();





               },
               error: function (err) {
                   $("#btnadditem").removeClass("disabled");
                   $("#btnadditem").find(".fa").removeClass("fa-spin");

                   alert(response.CreateItemResult.Message);
                   $scope.ItemObject = { ItemID: 0, ItemNumber: "", ItemDescription: "", ItemGroup: "", ItemNote: "", DefaultLocation: "", DefaultUOM: "", TargetLevel: 0, ReorderLevel: 0, DefaultCost: 0, DefaultUOMID: 0, DefaultLocationID: 0, CustomData: [] };
                   $scope.$apply();

               }
           });
    }

    $scope.getuom = function ()
    {
       

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/GetUnitsOfMeasure',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {

                   alert(err.Message);

               }
           });

    }

  
}]);