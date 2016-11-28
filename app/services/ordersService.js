'use strict';
app.factory('ordersService', ['$http', 'ngAuthSettings', 'localStorageService', function ($http, ngAuthSettings, localStorageService) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var ordersServiceFactory = {};
    var Statuses = ["For Production", "Damaged", "On Order", "Sold", "Reserved"];

    var UOM = ["box/es", "carton/s", "cup/s", "dozen", "ea.", "gallon/s", "lbs.", "pc(s)"];

    var Locations = ["Bin 100", "In Stock", "New location", "Refridgerator one", "Refridgerator two", "Pantry, Rack 1, Shelf 1-L", "Pantry, Rack 1, Shelf 1-M", "Storage Room A"];
    var _getOrders = function () {

        return $http.get(serviceBase + 'api/orders').then(function (results) {
            return results;
        });
    };


    function GetRandomData(Type) {
        switch (Type) {
            case 1:
                return Statuses[Math.floor(Math.random() * Statuses.length)];
                break;
            case 2:
                return UOM[Math.floor(Math.random() * UOM.length)];
                break;
            case 3:
                return Locations[Math.floor(Math.random() * Locations.length)];
                break;
            default:
                return "";

        }

    }

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function makedescription() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 55; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    var _getScannedValue = function () {
        alert("Into scanning function");
        var _resultValue = "";
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan(function (result) {
            alert("After return result");
            _resultValue = result.text;

        }, function (error) {
            alert("Scanning failed: ", error);
        });

        return _resultValue;
    }

    var _PopulateInventoryItems = function () {
    
        var _Data = localStorageService.get("InventoryData");
        var _RandomArray = [];
        if (_Data == null || _Data == undefined || _Data.length == 0) {

            for (var i = 0; i < 5; i++) {

                var InvObject = {
                    InventoryID: i, CurrentQuantity: i + 2, AvgCostPerUnit: i + 50, Uncontrolled: "True", UniqueTag: "UniqueTag" + i,
                    ItemID: i, ItemNumber: makeid(), ItemDescription: makedescription(), UomID: i, UOM: GetRandomData(2), LocationID: i, Location: GetRandomData(3),
                    LocationZone: "", LastTransactionID: i, StatusValue: GetRandomData(1), LastQuantityChange: 0, LastDateChange: "",
                    CustomData: [], ImagePath: ""
                };

                _RandomArray.push(InvObject);
            }

            localStorageService.set("InventoryData", _RandomArray);

        }
        else {
            _RandomArray = _Data;
        }

        return _RandomArray;
    }

    var _AddInventory = function (object, ImageData) {

        var _Data = _PopulateInventoryItems();


        var InvObject = {
            InventoryID: Math.floor(Math.random() * 7), CurrentQuantity: object.Quantity, AvgCostPerUnit: object.Cost, Uncontrolled: "True", UniqueTag: object.UniqueTag,
            ItemID: Math.floor(Math.random() * 7), ItemNumber: object.ItemID, ItemDescription: object.Description, UomID: object.UomID, UOM: object.Uom, LocationID: object.LocationID, Location: object.Location,
            LocationZone: object.lZone, LastTransactionID: 465, StatusValue: object.Status, LastQuantityChange: 0, LastDateChange: "",
            CustomData: [], ImagePath: ImageData == null || ImageData == "" || ImageData == undefined ? "" : ImageData
        };

        _Data.unshift(InvObject);
        localStorageService.set("InventoryData", []);
        localStorageService.set("InventoryData", _Data);

        return true;

    }

    var _UpdateInventory = function (object) {
        var _Data = localStorageService.get("InventoryData");

        for (var i = 0; i < _Data.length; i++) {
            if (_Data[i].InventoryID == object.InventoryID) {
                _Data[i].ImagePath = object.ImagePath;
            }

        }
        localStorageService.set("InventoryData", []);
        localStorageService.set("InventoryData", _Data);


    }

    ordersServiceFactory.getOrders = _getOrders;
    ordersServiceFactory.getScannedValue = _getScannedValue;
    ordersServiceFactory.PopulateInventoryItems = _PopulateInventoryItems;
    ordersServiceFactory.AddInventory = _AddInventory;
    ordersServiceFactory.UpdateInventory = _UpdateInventory;
    return ordersServiceFactory;

}]);