

'use strict';
app.controller('FindItemsController', ['$scope', 'localStorageService', 'authService', '$location', 'log', '$cordovaKeyboard', function ($scope, localStorageService, authService, $location, log, $cordovaKeyboard) {

    $scope.InventoryItems = [];
    $scope.SecurityToken = "";
    $scope.InvObject = {
        InventoryID: 0, CurrentQuantity: "", AvgCostPerUnit: "", Uncontrolled: "", UniqueTag: "",
        ItemID: "", ItemNumber: "", ItemDescription: 0, UomID: 0, UOM: 0, LocationID: 0, Location: 0,
        LocationZone: "", LastTransactionID: 0, StatusValue: "", LastQuantityChange: 0, LastDateChange: "",
        CustomData: []
    };
    $scope.Animationtime = 5000;
    var _CanAct = 'True';
    var _CartObjLimit = 25;
    $scope.Cart = [];
    $scope.mainObjectToSend = [];
    $scope._Currentobj = {};
    var _IsOpenModal = false;

    var _currentPage = 1;
    var _sortColumn = "iLastITID";
    var _sortDir = "DESC";
    $scope._areImagesShown = true;
    $scope._HasImages = false;
    //var _areZeroRecordsShown = true;
    var _currentPage = 0;
    var _PageSize = 30;
    var _PreviousPageSize = 50;
    var _IsFilterOn = 0;
    var _IsClearFilter = 0;
    var _IsClearSorting = 0;
    var _IsActuallySorting = 0;
    var _IsActuallySearching = 0;
    var _IsSetSelectedIfAny = 0;
    var SelectedCartItemIds = [];
    var _IsFilterCartItems = 0;
    $scope.UnitDataList = [];
    $scope.CurrentActiveClass = "";
    $scope.MyinventoryFields = [];
    $scope.MyinventoryFieldsNames = [];
    var _IsLazyLoading = 0;
    var _TotalRecordsCurrent = 0;
    var _IsLazyLoadingUnderProgress = 0;
    $scope._areZeroRecordsShown = false;
    $scope.IsDateColumnOn = false;
    $scope.SelectedZeroRecordIDs = [];
    $scope.myinventoryColumnLoaded = false;
    var _isExceededLimit = false;
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $scope.CurrentImgID = "";
    $scope.SearchFromData = "All"
    $scope.SearchFromText = "Search";
    $scope.SearchValue = "";
    $scope.StatusList = [];
    $scope.UnitDataList = [];
    $scope.loadingblock = false;

 
    $scope.ActiveUnitDataFields = [];

    $scope.dropDownValues = [];
    $scope.iReqValueFieldSpecialType = "";
    $scope.iUnitTag2FieldSpecialType = "";
    $scope.iUnitTag3FieldSpecialType = "";

    $scope.weeklist = [];

    $scope.CurrentYear = new Date().getFullYear();

    for (var i = 1; i <= 52; i++) {
        var x = leadZero(i);
        $scope.weeklist.push(x);
    }

    function leadZero(_something) {
        var _TempString = parseInt(_something);
        _something = _TempString.toString();
        if (parseInt(_something) < 10) return "0" + _something;
        return _something;//else    
    }



    $scope.UOMList = [];
    $scope.CurrentObj = {};
    $scope.SearchNumberValue = "";
    $scope.SearchDateValue = "";
    $scope.UOM = ["box/es", "carton/s", "cup/s", "dozen", "ea.", "gallon/s", "lbs.", "pc(s)"];

    $scope.Locations = ["Bin 100", "In Stock", "New location", "Refridgerator one", "Refridgerator two", "Pantry, Rack 1, Shelf 1-L", "Pantry, Rack 1, Shelf 1-M", "Storage Room A"];
    $scope.TotalRecords = 0;
    $scope.ActualTotalRecords = 0;
    function ResetInvObj() {
        $scope.InvObject = {
            InventoryID: 0, CurrentQuantity: "", AvgCostPerUnit: "", Uncontrolled: "", UniqueTag: "",
            ItemID: "", ItemNumber: "", ItemDescription: 0, UomID: 0, UOM: 0, LocationID: 0, Location: 0,
            LocationZone: "", LastTransactionID: 0, StatusValue: "", LastQuantityChange: 0, LastDateChange: "",
            CustomData: []
        };
    }

    _CurrentUrl = "FindItems";

    $scope.searchstring = "";

    $scope.isshowsearch = false;

    $scope.showsearch = function () {
        $scope.isshowsearch = true;
    }

    $scope.hidesearch = function () {
        $scope.isshowsearch = false;
    }


    $scope.CurrentActiveSearchType = 1;
    $scope.CurrentActiveSearchOperator = "img/filter/Contains.gif";
    $scope.CurrentActiveSearchField = "All";
    var pressTimer
    var _defaultUnitObj = {
        AccountID: 0,
        Active: false,
        BaseValue: 0,
        FieldComboValues: null,
        FieldDataType: "",
        FieldDefaultAMPM: null,
        FieldDefaultValue: "",
        FieldDescription: "test",
        FieldInputMask: null,
        FieldLabel: "",
        FieldName: "",
        FieldNumberDecimalPlaces: 0,
        FieldNumberMax: null,
        FieldNumberMin: null,
        FieldRadioValues: null,
        FieldSpecialType: 0,
        FieldTextMaxLength: 500,
        FieldTextMultiRow: false,
        FieldUse24Hours: false,
        IncrementBy: 1,
        IsSpecial: true,
        IsUnique: false,
        Prefix: "",
        Suffix: "",
        TagID: 0
    }
    $scope.getUnitObjByName = function (ColumnName) {
        for (var i = 0; i < $scope.UnitDataList.length; i++) {
            if ($scope.UnitDataList[i].FieldName == ColumnName) {
                return $scope.UnitDataList[i];
            }

        }
        return _defaultUnitObj;
    }
    $scope.GetActiveUnitDataField = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetActiveUnitDataFields',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {


                   if (response.GetActiveUnitDataFieldsResult.Success == true) {
                       $scope.UnitDataList = response.GetActiveUnitDataFieldsResult.Payload;



                       CheckScopeBeforeApply()
                   }
                   else {
                       $scope.ShowErrorMessage("Active unit data columns", 1, 1, response.GetActiveUnitDataFieldsResult.Message)

                   }

               },
               error: function (err, textStatus, errorThrown) {


                   if (err.readyState == 0 || err.status == 0) {

                   }
                   else {
                       if (textStatus != "timeout") {
                           //log.error(response.statusText);
                           $scope.ShowErrorMessage("Active unit data columns", 2, 1, err.statusText);
                       }
                   }

               }
           });
    }

    $scope.ShowOptionModal = function () {

    };



    $scope.SetCurrentObject = function (CurrentObj) {
        $scope._Currentobj = CurrentObj;
        CheckScopeBeforeApply();
        _IsOpenModal = true;
    }



    $scope.GoToDetailPage = function (obj) {

        localStorageService.set("unitdatafieldsobject", $scope.MyinventoryFieldsNames);
        localStorageService.set("CurrentDetailObject", obj);
        $location.path("/detail");
        console.log(localStorageService.get("CurrentDetailObject"));
    }


    $scope.handleFileSelect = function (evt) {

        var files = evt.target.files;

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {


                var id = theFile.lastModified;


                return function (e) {
                    // Render thumbnail.

                    $($scope.CurrentImgID).attr("src", e.target.result);

                    $scope.CurrentObj.ImagePath = e.target.result;
                    $scope.UpdateInventory();

                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }





    }

    $scope.UpdateInventory = function () {

        ordersService.UpdateInventory($scope.CurrentObj);
        $scope.CurrentObj = {};
        $scope.InventoryItems = [];
        CheckScopeBeforeApply();
        $scope.PopulateInventoryItems();
    }
    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }



    $scope.UploadImg = function (id, _obj) {

        $scope.CurrentImgID = "#Img_" + id;
        $scope.CurrentObj = _obj;
        $("#myfile").trigger("click");
    }
    $("#myfile").on('change', function (event) {

        $scope.handleFileSelect(event);
    });






    $scope.ClearFilter = function () {


        ClearFilterArray();
        $scope.SearchValue = "";
        $scope.SearchStatusValue = "";
        $scope.SearchUOMValue = "";
        _IsActuallySearching = 1;
        SelectedCartItemIds = [];
        _IsFilterCartItems = 0;
        $(".FilterCartItems").html("Filter Cart Records");
        $scope.SearchFromData = "All"
        $scope.SearchFromText = "Search";
        $(".norecords").hide();
        $("#MasterSearch").val('');
        $("#MasterSearchNumber").val('');
        $("#MasterSearchDate").val('');
        $("#MasterSearchStatus").val('');
        $("#MasterSearchUOM").val('');
        $("#btnMasterSearch").removeClass("bgm-red");
        if ($scope.CurrentActiveSearchType == 4) {
            $scope.CurrentActiveSearchType = 1;
            $scope.CurrentActiveSearchField = "All";
        }

        $("#MasterSearchStatus option:selected").removeAttr("selected");
        $("#MasterSearchUOM option:selected").removeAttr("selected");
        $scope.$apply();

        $scope.GetInventories();

    }


    $scope.filterrecords = function () {

        if (_IsFilterCartItems === 0) {



            _IsActuallySearching = 1;
            _IsFilterCartItems = 1;
            if ($scope.mainObjectToSend != null && $scope.mainObjectToSend.length > 0) {
                var x = 0;
                for (x = 0; x < $scope.mainObjectToSend.length; x++) {
                    SelectedCartItemIds.push($scope.mainObjectToSend[x].uId);
                }
            }
            $(".FilterCartItems").html("Clear Filter Cart Records");
        }
        else {
            _IsActuallySearching = 1;
            SelectedCartItemIds = [];
            _IsFilterCartItems = 0;
            $(".FilterCartItems").html("Filter Cart Records");
        }

        $scope.GetInventories();


    }

    $('#mylist').on('swipedown', function () {


        if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
            if ($(window).scrollTop() < 500) {
                //if (_PageSize < $scope.totalrecords)
                //  {

                $scope.loadingblock = true;

                _IsLazyLoadingUnderProgress = 1;
                // $scope.myinventoryColumnLoaded = false;
                CheckScopeBeforeApply();
                $scope.GetInventories();
                //  }
                //else {
                // log.info("You have already loaded all data.")
                //   }

            }
        }

    });



    setTimeout(function () {
        $(document)
.on('focus', 'input', function () {


    $('.topheader').css("position", "absolute");

    $('.topup').css("position", "absolute !important")



})
.on('blur', 'input', function () {

    $('.topheader').css("position", "fixed");
    $('.topup').css("position", "fixed !important")

});
    }, 500);




    $scope.SearchInventory = function () {
        var _Value = $.trim($('#MasterSearch').val());

        switch ($scope.CurrentActiveSearchType) {

            case 1:
            case 5:
            case 6:
            case 7:
                _Value = $.trim($('#MasterSearch').val());
                break;
            case 2:
                _Value = $.trim($('#MasterSearchNumber').val());
                break;
            case 3:
                _Value = $.trim($('#MasterSearchDate').val());
                break;
            case 4:

                if ($scope.CurrentActiveSearchField == "iStatusValue") {

                    _Value = $.trim($('#MasterSearchStatus').val());

                }
                else if ($scope.CurrentActiveSearchField == "uomUOM") {
                    _Value = $.trim($("#MasterSearchUOM").val());
                }
                break;
            
            default:
                _Value = $.trim($('#MasterSearch').val());
                break;
        }

        if (_Value !== "") {
            $scope.myinventoryColumnLoaded = false;
            CheckScopeBeforeApply();
            $scope.GetInventories();
        }
    }


    $scope.OpenmenuModal = function () {


        if ($("body").hasClass("modal-open")) {
            $("#myModal2").modal('hide');


            $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')

        }
        else {
            $("#myModal2").modal('show');
            $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');

        }


        if ($scope.ActualTotalRecords == 0) {


            $(".modal-backdrop").hide();

        }

    }


    $scope.Showhideimage = function (isshow) {
        $scope.myinventoryColumnLoaded = false;
        CheckScopeBeforeApply();

        $scope._areImagesShown = isshow;
        $scope._HasImages = isshow;

        localStorageService.set("ShowImageRecords", $scope._areImagesShown);

        $("#myModal2").modal('hide');

        CheckScopeBeforeApply();

        $scope.GetInventories();
    }





    $scope.showhidezerorecord = function (showzero) {


        $scope.myinventoryColumnLoaded = false;
        CheckScopeBeforeApply();


        localStorageService.set("ShowZeroRecords", showzero);
        $scope._areZeroRecordsShown = showzero;
        CheckScopeBeforeApply();
        $("#myModal2").modal('hide');
        $scope.GetInventories();

    }


    function getIncrementor(_Total) {
        if (_Total <= 100) {
            return 10;
        }
        else if (_Total > 100 && _Total < 500) {
            return 20;
        }
        else if (_Total > 500) {
            return 50;
        }
        else {
            return 10;
        }
    }
    $(window).scroll(function () {
        var _SearchValue = $.trim($("#MasterSearch").val());

        if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                if (_PageSize < $scope.totalrecords) {
                    _IsLazyLoadingUnderProgress = 1;
                    _PageSize = _TotalRecordsCurrent + getIncrementor($scope.totalrecords);
                    $scope.myinventoryColumnLoaded = false;
                    CheckScopeBeforeApply();
                    $scope.GetInventories();
                }
                else {
                    // log.info("You have already loaded all data.")
                }

            }
        }



    });



    function ClearFilterArray() {
        for (var i = 0; i < $scope.FilterArray.length; i++) {
            $scope.FilterArray[i].SearchValue = "";

        }
        CheckScopeBeforeApply();
    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };


    $scope.UpdateFilterData = function (Operator, Field) {
        for (var i = 0; i < $scope.FilterArray.length; i++) {
            if ($scope.FilterArray[i].ColumnName == Field) {
                $scope.FilterArray[i].FilterOperator = Operator;
                break;
            }

        }
        var path = "img/filter/";
        switch (Operator) {
            case "eq":
            case "in":
            case "num-eq":
            case "date-eq":
                $scope.CurrentActiveSearchOperator = path + "EqualTo.gif";
                break;
            case "date-before":
                $scope.CurrentActiveSearchOperator = path + "OnOrBefore.gif";
                break;
            case "cn":
                $scope.CurrentActiveSearchOperator = path + "Contains.gif";
                break;
            case "date-after":
                $scope.CurrentActiveSearchOperator = path + "OnOrAfter.gif";
                break;
            case "num-lte":
                $scope.CurrentActiveSearchOperator = path + "LessThanOrEqualTo.gif";
                break;
            case "num-gte":
                $scope.CurrentActiveSearchOperator = path + "GreaterThanOrEqualTo.gif";
                break;
            case "date-gte":
                $scope.CurrentActiveSearchOperator = path + "GreaterThanOrEqualTo.gif";
                break;
            case "ni":
                $scope.CurrentActiveSearchOperator = path + "NotEqualTo.gif";
                break;
        }

        CheckScopeBeforeApply();
    }

    function UpdateFilterArray(Field, Value) {

        for (var i = 0; i < $scope.FilterArray.length; i++) {
            if ($scope.FilterArray[i].ColumnName == Field) {


                if ($scope.FilterArray[i].FilterOperator == "in" || $scope.FilterArray[i].FilterOperator == "ni") {
                    if (Value != null && Value != undefined && Value != "") {

                        var mystring = "";
                        mystring = Value.join(",");
                        $scope.FilterArray[i].SearchValue = mystring;
                    }
                    else {
                        $scope.FilterArray[i].SearchValue = "";
                    }
                    break;
                }
                else {
                    $scope.FilterArray[i].SearchValue = Value;
                    break;
                }

            }

        }

        console.log("After updating data");
        console.log($scope.FilterArray);

        CheckScopeBeforeApply();
    }


    $scope.AlreadySelected = function (ID) {
        if ($scope.SelectedZeroRecordIDs.length > 0) {


            for (var i = 0; i < $scope.SelectedZeroRecordIDs.length; i++) {
                if ($scope.SelectedZeroRecordIDs[i] == ID) {
                    return true;
                }
            }
        }
        return false;
    }


    $scope.IsAvailableIntoMainObject = function (ID) {
        if ($scope.mainObjectToSend.length > 0) {


            for (var i = 0; i < $scope.mainObjectToSend.length; i++) {
                if ($scope.mainObjectToSend[i].uId == ID) {
                    return true;
                }
            }
        }


        return false;
    }
    $scope.CheckIntoMainObject = function () {
        if ($scope.SelectedZeroRecordIDs.length > 0) {


            for (var i = 0; i < $scope.SelectedZeroRecordIDs.length; i++) {
                if ($scope.IsAvailableIntoMainObject($scope.SelectedZeroRecordIDs[i]) == false) {
                    $scope.SelectedZeroRecordIDs.splice(i, 1);
                }
            }
        }

        CheckScopeBeforeApply();
    }


    $scope.$watch('mainObjectToSend', function () {

        if ($scope.mainObjectToSend.length > 0) {
            for (var i = 0; i < $scope.mainObjectToSend.length; i++) {
                if ($scope.mainObjectToSend[i].oquantity == 0 && $scope.AlreadySelected($scope.mainObjectToSend[i].uId) == false) {


                    $scope.SelectedZeroRecordIDs.push($scope.mainObjectToSend[i].uId);
                }

            }
        }

        $scope.CheckIntoMainObject();

        $scope.$apply();
    }, true);

    $scope.$watch('CurrentActiveSearchField', function () {
        switch ($scope.CurrentActiveSearchField) {
            case "lLoc":
            case "pPart":
            case "All":
            case "iReqValue":
            case "iUnitTag2":
            case "iUnitTag3":
                $scope.CurrentActiveSearchOperator = "img/filter/Contains.gif";
                break
            case "iUniqueDate":
            case "iUnitDate2":
            case "iUnitNumber1":
            case "iUnitNumber2":
            case "iStatusValue":

                $scope.CurrentActiveSearchOperator = "img/filter/EqualTo.gif";
                break;
            default:

        }


        $scope.$apply();
    }, true);
    function RemoveZeroRecordsFromLocal() {

        var i = $scope.mainObjectToSend.length
        while (i--) {
            if ($scope.mainObjectToSend[i].oquantity == 0) {

                $scope.mainObjectToSend.splice(i, 1);
            }
        }


        CheckScopeBeforeApply();

    }
    $scope.Clearzerorecords = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {
                $.ajax
                   ({
                       type: "POST",
                       url: serviceBase + 'ClearZeroRecords',
                       contentType: 'application/json; charset=utf-8',
                       dataType: 'json',
                       data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "InvIDs": $scope.SelectedZeroRecordIDs }),
                       success: function (response) {
                           if (response.ClearZeroRecordsResult.Success == true) {
                               ShowSuccess("Removed");
                               $scope.SelectedZeroRecordIDs = [];
                               RemoveZeroRecordsFromLocal();
                               $scope.GetInventories();
                               CheckScopeBeforeApply();
                           }
                           else {
                               $scope.ShowErrorMessage("Removing zero records", 1, 1, response.ClearZeroRecordsResult.Message);

                           }

                       },
                       error: function (err) {

                           $scope.errorbox(err);
                           $scope.ShowErrorMessage("Removing zero records", 2, 1, err.statusText);

                       }
                   });
            }
        });

        box.on("shown.bs.modal", function () {
            $(".mybootboxbody").html("This operation is going to remove all selected zero records. ");

        });
    }
    $scope.getstatus = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetStatus',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   if (response.GetStatusResult.Success == true) {
                       $scope.StatusList = response.GetStatusResult.Payload;
                       CheckScopeBeforeApply()
                   }
                   else {
                       $scope.ShowErrorMessage("status list", 1, 1, response.GetStatusResult.Message);

                   }

               },
               error: function (err) {

                   $scope.errorbox(err);
                   $scope.ShowErrorMessage("status list", 2, 1, err.statusText);

               }
           });

    }


    $scope.getuom = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetUnitsOfMeasure',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   if (response.GetUnitsOfMeasureResult.Success == true) {
                       $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;
                       CheckScopeBeforeApply()
                   }
                   else {
                       $scope.ShowErrorMessage("unit of measure list", 1, 1, response.GetUnitsOfMeasureResult.Message);
                   }


               },
               error: function (err) {
                   $scope.ShowErrorMessage("unit of measure list", 2, 1, err.statusText);


               }
           });

    }


    function getFieldSpecialType(columnName) {
       
        for (var i = 0; i < $scope.ActiveUnitDataFields.length; i++) {
            var Field = $scope.ActiveUnitDataFields[i]

            if (Field.FieldName == columnName) {               
                return Field.FieldSpecialType;                
            }           
        }
        return "";

    }

    function getDropDownValues(columnName, type)
    {

        debugger;
        for (var i = 0; i < $scope.ActiveUnitDataFields.length; i++) {
            var Field = $scope.ActiveUnitDataFields[i]

            if (Field.FieldName == columnName) {
                switch (type) {
                    case 2: {
                        var x = Field.FieldComboValues.split("\n");
                        return x;
                        break
                    }
                    case 3: {
                        var x = Field.FieldComboValues.split("\n");
                        return x;
                        break
                    }
                    case 12: {
                        var x = Field.FieldRadioValues.split("\r\n");
                        return x;
                        break
                    }

                }
            }
        }       

    }


    $scope.searchfunction = function (Byvalue) {

        debugger;
        console.log("===========================");
        console.log("$scope.MyinventoryFieldsNames");
        console.log($scope.MyinventoryFieldsNames);
        console.log("===========================");
             
        console.log("===========================");
        console.log("$scope.ActiveUnitDataFields");
        console.log($scope.ActiveUnitDataFields);
        console.log("===========================");




        ClearFilterArray();

        //switch ($scope.CurrentActiveSearchType) {
        //    case 1:
        //    case 5:
        //    case 6:
        //    case 7:
        //        $scope.SearchValue = $("#MasterSearch").val();
        //        break;
        //    case 2:
        //        $scope.SearchValue = $scope.SearchNumberValue;
        //        break;
        //    case 3:
        //        $scope.SearchValue = $scope.SearchDateValue;
        //        break;
        //    case 4:
        //        if ($scope.CurrentActiveSearchField == "iStatusValue") {
        //            $scope.SearchValue = $("#MasterSearchStatus").val();
        //        }
        //        else if ($scope.CurrentActiveSearchField == "uomUOM") {
        //            $scope.SearchValue = $("#MasterSearchUOM").val();
        //        }
        //        break;

        //    default:
        //        break;
        //}
        CheckScopeBeforeApply();
        switch (Byvalue) {
            case "iStatusValue":
                $scope.CurrentActiveSearchType = 4;
                $scope.SearchFromText = "Status";
                $('#MasterSearch').attr("placeholder", "Search by Status");
                $scope.CurrentActiveSearchField = "iStatusValue";

                break;

            case "uomUOM":
                $scope.CurrentActiveSearchType = 4;
                $scope.SearchFromText = "UOM";
                $('#MasterSearch').attr("placeholder", "Search by UOM");
                $scope.CurrentActiveSearchField = "uomUOM";

                break;

            case "lLoc":
                $scope.CurrentActiveSearchField = "lLoc";

                $scope.CurrentActiveSearchType = 1;
                $scope.SearchFromText = "Location";
                $('#MasterSearch').attr("placeholder", "Search by location");
                break;
            case "pPart":
                $scope.CurrentActiveSearchField = "pPart";

                $scope.CurrentActiveSearchType = 1;
                $scope.SearchFromText = "Items";
                $('#MasterSearch').attr("placeholder", "Search by item");
                break;
            case "All":
                $scope.CurrentActiveSearchField = "All";

                $scope.CurrentActiveSearchType = 1;
                $scope.SearchFromText = "All";
                $('#MasterSearch').attr("placeholder", "Type to search");
                break;
            case "iUnitDate2":
                $scope.CurrentActiveSearchField = "iUnitDate2";
                $scope.CurrentActiveSearchType = 3;
                var _label = $scope.GetUnitDataLabel('iUnitDate2');
                _label = _label != undefined && _label != "" ? _label : "";
                $('#MasterSearch').attr("placeholder", "Search by " + _label);
                $scope.SearchFromText = _label;
                break;
            case "iUniqueDate":
                $scope.CurrentActiveSearchField = "iUniqueDate";
                $scope.CurrentActiveSearchType = 3;
                var _label = $scope.GetUnitDataLabel('iUniqueDate');
                _label = _label != undefined && _label != "" ? _label : "";
                $('#MasterSearch').attr("placeholder", "Search by " + _label);
                $scope.SearchFromText = _label;
                break;
            case "iReqValue":
                $scope.CurrentActiveSearchField = "iReqValue";


                $scope.iReqValueFieldSpecialType = getFieldSpecialType("ReqValue");

                if ($scope.iReqValueFieldSpecialType != "")
                {
                    switch ($scope.iReqValueFieldSpecialType) {
                        case 2:
                            $scope.CurrentActiveSearchType = 7;
                            $scope.dropDownValues = getDropDownValues("ReqValue", 2);
                            break;
                        case 3:
                            $scope.CurrentActiveSearchType = 7;
                            $scope.dropDownValues = getDropDownValues("ReqValue", 3);
                            break;

                        case 12:
                            $scope.CurrentActiveSearchType = 7;
                            $scope.dropDownValues = getDropDownValues("ReqValue", 12);
                            break;

                        case 5:
                            $scope.CurrentActiveSearchType = 5;
                            break;

                        case 6:
                            $scope.CurrentActiveSearchType = 6;
                            break;

                        default: $scope.CurrentActiveSearchType = 1;

                    }
                }
                else
                {
                    $scope.CurrentActiveSearchType = 1;
                }             

                //$scope.CurrentActiveSearchType = 1;

                var _label = $scope.GetUnitDataLabel('iReqValue');
                _label = _label != undefined && _label != "" ? _label : "";
                $('#MasterSearch').attr("placeholder", "Search by " + _label);
                $scope.SearchFromText = _label;
                break;
            case "iUnitTag2":
                $scope.CurrentActiveSearchField = "iUnitTag2";

                $scope.iUnitTag2FieldSpecialType = getFieldSpecialType("UnitTag2");

                if ($scope.iUnitTag2FieldSpecialType != "") {
                    switch ($scope.iUnitTag2FieldSpecialType) {
                        case 2:
                            $scope.CurrentActiveSearchType = 7;
                            $scope.dropDownValues = getDropDownValues("UnitTag2", 2);
                            break;
                        case 3:
                            $scope.CurrentActiveSearchType = 7;
                            $scope.dropDownValues = getDropDownValues("UnitTag2", 3);
                            break;

                        case 12:
                            $scope.CurrentActiveSearchType = 7;
                            $scope.dropDownValues = getDropDownValues("UnitTag2", 12);
                            break;

                        case 5:
                            $scope.CurrentActiveSearchType = 5;
                            break;

                        case 6:
                            $scope.CurrentActiveSearchType = 6;
                            break;

                        default: $scope.CurrentActiveSearchType = 1;

                    }
                }
                else {
                    $scope.CurrentActiveSearchType = 1;
                }
                
                //$scope.CurrentActiveSearchType = 1;
                var _label = $scope.GetUnitDataLabel('iUnitTag2');
                _label = _label != undefined && _label != "" ? _label : "";
                $('#MasterSearch').attr("placeholder", "Search by " + _label);
                $scope.SearchFromText = _label;
                break;
            case "iUnitTag3":
                $scope.CurrentActiveSearchField = "iUnitTag3";

                $scope.iUnitTag3FieldSpecialType = getFieldSpecialType("UnitTag3");

                if ($scope.iUnitTag3FieldSpecialType != "") {
                    switch ($scope.iUnitTag3FieldSpecialType) {
                        case 2:
                            $scope.CurrentActiveSearchType = 7;
                            $scope.dropDownValues = getDropDownValues("UnitTag3", 2);
                            break;
                        case 3:
                            $scope.CurrentActiveSearchType = 7;
                            $scope.dropDownValues = getDropDownValues("UnitTag3", 3);
                            break;

                        case 12:
                            $scope.CurrentActiveSearchType = 7;
                            $scope.dropDownValues = getDropDownValues("UnitTag3", 12);
                            break;

                        case 5:
                            $scope.CurrentActiveSearchType = 5;
                            break;

                        case 6:
                            $scope.CurrentActiveSearchType = 6;
                            break;

                        default: $scope.CurrentActiveSearchType = 1;

                    }
                }
                else {
                    $scope.CurrentActiveSearchType = 1;
                }

                //$scope.CurrentActiveSearchType = 1;
                var _label = $scope.GetUnitDataLabel('iUnitTag3');
                _label = _label != undefined && _label != "" ? _label : "";
                $('#MasterSearch').attr("placeholder", "Search by " + _label);
                $scope.SearchFromText = _label;
                break;
            case "iUnitNumber1":
                $scope.CurrentActiveSearchField = "iUnitNumber1";
                $scope.CurrentActiveSearchType = 2;
                var _label = $scope.GetUnitDataLabel('iUnitNumber1');
                _label = _label != undefined && _label != "" ? _label : "";
                $('#MasterSearchNumber').attr("placeholder", "Search by " + _label);
                $scope.SearchFromText = _label;
                break;
            case "iUnitNumber2":
                $scope.CurrentActiveSearchField = "iUnitNumber2";
                $scope.CurrentActiveSearchType = 2;
                var _label = $scope.GetUnitDataLabel('iUnitNumber2');
                _label = _label != undefined && _label != "" ? _label : "";
                $('#MasterSearchNumber').attr("placeholder", "Search by " + _label);
                $scope.SearchFromText = _label;
                break
            default:
                break;
        }
        //console.log("Date value");
        //console.log($scope.SearchDateValue);
        //console.log("Number value");
        //console.log($scope.SearchNumberValue);
        //console.log("String value");
        //console.log($scope.SearchValue);
        //if ($.trim($scope.SearchValue) != "") {
        //    $scope.SearchFromData = Byvalue;
        //    var _tempArray = [];
        //    switch (Byvalue) {
        //        case "iStatusValue":
        //            $scope.SearchFromText = "Status";
        //            UpdateFilterArray("iStatusValue", $.trim($scope.SearchValue));
        //            $('#MasterSearch').attr("placeholder", "Search by Status");
        //            $scope.IsDateColumnOn = false;
        //            break
        //        case "lLoc":
        //            $scope.SearchFromText = "Location";
        //            UpdateFilterArray("lLoc", $.trim($scope.SearchValue));
        //            $('#MasterSearch').attr("placeholder", "Search by location");
        //            $scope.IsDateColumnOn = false;
        //            break
        //        case "pPart":
        //            $scope.SearchFromText = "Items";
        //            $('#MasterSearch').attr("placeholder", "Search by item");
        //            UpdateFilterArray("pPart", $.trim($scope.SearchValue));
        //            $scope.IsDateColumnOn = false;
        //            break
        //        case "All":
        //            $scope.SearchFromText = "All";
        //            $('#MasterSearch').attr("placeholder", "Type to search");
        //            $scope.IsDateColumnOn = false;
        //            break
        //        case "iReqValue":
        //            _label = _label != undefined && _label != "" ? _label : "";
        //            $('#MasterSearch').attr("placeholder", "Search by " + _label);
        //            $scope.SearchFromText = _label;
        //            UpdateFilterArray("iReqValue", $.trim($scope.SearchValue));
        //            $scope.IsDateColumnOn = false;
        //            break;
        //        case "iUnitDate2":
        //            var _label = $scope.GetUnitDataLabel('iUnitDate2');
        //            _label = _label != undefined && _label != "" ? _label : "";
        //            $('#MasterSearch').attr("placeholder", "Search by " + _label);
        //            $scope.SearchFromText = _label;
        //            $scope.IsDateColumnOn = true;
        //            UpdateFilterArray("iUnitDate2", $.trim($scope.SearchValue));
        //            break;
        //        case "iUniqueDate":
        //            var _label = $scope.GetUnitDataLabel('iUniqueDate');
        //            _label = _label != undefined && _label != "" ? _label : "";
        //            $('#MasterSearch').attr("placeholder", "Search by " + _label);
        //            $scope.SearchFromText = _label;
        //            $scope.IsDateColumnOn = true;
        //            UpdateFilterArray("iUniqueDate", $.trim($scope.SearchValue));
        //            break;

        //        case "iUnitTag2":

        //            var _label = $scope.GetUnitDataLabel('iUnitTag2');
        //            _label = _label != undefined && _label != "" ? _label : "";
        //            $('#MasterSearch').attr("placeholder", "Search by " + _label);
        //            $scope.SearchFromText = _label;
        //            $scope.IsDateColumnOn = false;
        //            UpdateFilterArray("iUnitTag2", $.trim($scope.SearchValue));
        //            break;
        //        case "iUnitTag3":
        //            var _label = $scope.GetUnitDataLabel('iUnitTag3');
        //            _label = _label != undefined && _label != "" ? _label : "";
        //            $('#MasterSearch').attr("placeholder", "Search by " + _label);
        //            $scope.SearchFromText = _label;
        //            $scope.IsDateColumnOn = false;
        //            UpdateFilterArray("iUnitTag3", $.trim($scope.SearchValue));
        //            break;
        //        case "iUnitNumber1":
        //            var _label = $scope.GetUnitDataLabel('iUnitNumber1');
        //            _label = _label != undefined && _label != "" ? _label : "";
        //            $('#MasterSearchNumber').attr("placeholder", "Search by " + _label);
        //            $scope.SearchFromText = _label;
        //            $scope.IsDateColumnOn = false;
        //            UpdateFilterArray("iUnitNumber1", $.trim($scope.SearchValue));
        //            break;
        //        case "iUnitNumber2":
        //            var _label = $scope.GetUnitDataLabel('iUnitNumber2');
        //            _label = _label != undefined && _label != "" ? _label : "";
        //            $('#MasterSearchNumber').attr("placeholder", "Search by " + _label);
        //            $scope.SearchFromText = _label;
        //            $scope.IsDateColumnOn = false;
        //            UpdateFilterArray("iUnitNumber2", $.trim($scope.SearchValue));
        //            break
        //        default:
        //            break;
        //    }
        //    $scope.PopulateInventoryItems();
        //}
    }
    $scope.FilterArray = [
        { ColumnName: 'pPart', FilterOperator: 'cn', SearchValue: $('#pPart-filter').val() },
        { ColumnName: 'pDescription', FilterOperator: 'cn', SearchValue: $('#pDescription-filter').val() },
        { ColumnName: 'iQty', FilterOperator: 'num-eq', SearchValue: $('#iQty-filter').val() },
        { ColumnName: 'uomUOM', FilterOperator: 'in', SearchValue: $('#uomUOM-filter').val() },
        { ColumnName: 'lLoc', FilterOperator: 'cn', SearchValue: $('#lLoc-filter').val() },
        { ColumnName: 'iStatusValue', FilterOperator: 'in', SearchValue: $('#iStatusValue-filter').val() },
        { ColumnName: 'iReqValue', FilterOperator: 'cn', SearchValue: $('#iReqValue-filter').val() },
        { ColumnName: 'pCountFrq', FilterOperator: 'cn', SearchValue: $('#pCountFrq-filter').val() },
        { ColumnName: 'lZone', FilterOperator: 'cn', SearchValue: $('#lZone-filter').val() },
        { ColumnName: 'iCostPerUnit', FilterOperator: 'num-eq', SearchValue: $('#iCostPerUnit-filter').val() },

        { ColumnName: 'iUniqueDate', FilterOperator: 'date-eq', SearchValue: $('#iUniqueDate-filter').val() },
        { ColumnName: 'iUnitDate2', FilterOperator: 'date-eq', SearchValue: $('#iUnitDate2-filter').val() },
        { ColumnName: 'iUnitNumber1', FilterOperator: 'num-eq', SearchValue: $('#iUnitNumber1-filter').val() },
        { ColumnName: 'iUnitNumber2', FilterOperator: 'num-eq', SearchValue: $('#iUnitNumber2-filter').val() },
        { ColumnName: 'iUnitTag2', FilterOperator: 'cn', SearchValue: $('#iUnitTag2-filter').val() },
        { ColumnName: 'iUnitTag3', FilterOperator: 'cn', SearchValue: $('#iUnitTag3-filter').val() },
        { ColumnName: 'string_1', FilterOperator: 'cn', SearchValue: $('#string_1-filter').val() },
        { ColumnName: 'string_2', FilterOperator: 'cn', SearchValue: $('#string_2-filter').val() },
        { ColumnName: 'string_3', FilterOperator: 'cn', SearchValue: $('#string_3-filter').val() },
        { ColumnName: 'string_4', FilterOperator: 'cn', SearchValue: $('#string_4-filter').val() },
        { ColumnName: 'string_5', FilterOperator: 'cn', SearchValue: $('#string_5-filter').val() },
        { ColumnName: 'string_6', FilterOperator: 'cn', SearchValue: $('#string_6-filter').val() },
        { ColumnName: 'string_7', FilterOperator: 'cn', SearchValue: $('#string_7-filter').val() },
        { ColumnName: 'string_8', FilterOperator: 'cn', SearchValue: $('#string_8-filter').val() },
        { ColumnName: 'string_9', FilterOperator: 'cn', SearchValue: $('#string_9-filter').val() },
        { ColumnName: 'string_10', FilterOperator: 'cn', SearchValue: $('#string_10-filter').val() },
        { ColumnName: 'string_11', FilterOperator: 'cn', SearchValue: $('#string_11-filter').val() },
        { ColumnName: 'string_12', FilterOperator: 'cn', SearchValue: $('#string_12-filter').val() },
        { ColumnName: 'string_13', FilterOperator: 'cn', SearchValue: $('#string_13-filter').val() },
        { ColumnName: 'string_14', FilterOperator: 'cn', SearchValue: $('#string_14-filter').val() },
        { ColumnName: 'string_15', FilterOperator: 'cn', SearchValue: $('#string_15-filter').val() },
        { ColumnName: 'string_16', FilterOperator: 'cn', SearchValue: $('#string_16-filter').val() },
        { ColumnName: 'string_17', FilterOperator: 'cn', SearchValue: $('#string_17-filter').val() },
        { ColumnName: 'string_18', FilterOperator: 'cn', SearchValue: $('#string_18-filter').val() },
        { ColumnName: 'string_19', FilterOperator: 'cn', SearchValue: $('#string_19-filter').val() },
        { ColumnName: 'string_20', FilterOperator: 'cn', SearchValue: $('#string_20-filter').val() },
        { ColumnName: 'string_21', FilterOperator: 'cn', SearchValue: $('#string_21-filter').val() },
        { ColumnName: 'string_22', FilterOperator: 'cn', SearchValue: $('#string_22-filter').val() },
        { ColumnName: 'string_23', FilterOperator: 'cn', SearchValue: $('#string_23-filter').val() },
        { ColumnName: 'string_24', FilterOperator: 'cn', SearchValue: $('#string_24-filter').val() },
        { ColumnName: 'number_1', FilterOperator: 'num-eq', SearchValue: $('#number_1-filter').val() },
        { ColumnName: 'number_2', FilterOperator: 'num-eq', SearchValue: $('#number_2-filter').val() },
        { ColumnName: 'number_3', FilterOperator: 'num-eq', SearchValue: $('#number_3-filter').val() },
        { ColumnName: 'number_4', FilterOperator: 'num-eq', SearchValue: $('#number_4-filter').val() },
        { ColumnName: 'number_5', FilterOperator: 'num-eq', SearchValue: $('#number_5-filter').val() },
        { ColumnName: 'number_6', FilterOperator: 'num-eq', SearchValue: $('#number_6-filter').val() },
        { ColumnName: 'number_7', FilterOperator: 'num-eq', SearchValue: $('#number_7-filter').val() },
        { ColumnName: 'number_8', FilterOperator: 'num-eq', SearchValue: $('#number_8-filter').val() },
        { ColumnName: 'number_9', FilterOperator: 'num-eq', SearchValue: $('#number_9-filter').val() },
        { ColumnName: 'number_10', FilterOperator: 'num-eq', SearchValue: $('#number_10-filter').val() },
        { ColumnName: 'number_11', FilterOperator: 'num-eq', SearchValue: $('#number_11-filter').val() },
        { ColumnName: 'number_12', FilterOperator: 'num-eq', SearchValue: $('#number_12-filter').val() },
        { ColumnName: 'date_1', FilterOperator: 'date-eq', SearchValue: $('#date_1-filter').val() },
        { ColumnName: 'date_2', FilterOperator: 'date-eq', SearchValue: $('#date_2-filter').val() },
        { ColumnName: 'date_3', FilterOperator: 'date-eq', SearchValue: $('#date_3-filter').val() },
        { ColumnName: 'date_4', FilterOperator: 'date-eq', SearchValue: $('#date_4-filter').val() },
        { ColumnName: 'date_5', FilterOperator: 'date-eq', SearchValue: $('#date_5-filter').val() },
        { ColumnName: 'date_6', FilterOperator: 'date-eq', SearchValue: $('#date_6-filter').val() },
        { ColumnName: 'bool_1', FilterOperator: 'bool', SearchValue: $('#bool_1-filter').val() },
        { ColumnName: 'bool_2', FilterOperator: 'bool', SearchValue: $('#bool_2-filter').val() },
        { ColumnName: 'bool_3', FilterOperator: 'bool', SearchValue: $('#bool_3-filter').val() },
        { ColumnName: 'bool_4', FilterOperator: 'bool', SearchValue: $('#bool_4-filter').val() },
        { ColumnName: 'bool_5', FilterOperator: 'bool', SearchValue: $('#bool_5-filter').val() },
        { ColumnName: 'bool_6', FilterOperator: 'bool', SearchValue: $('#bool_6-filter').val() }
    ];


    /// Get filters of inventory grid

    function GetFilters() {
        return $scope.FilterArray;
    }


    $scope.GetInventories = function () {


        if ($scope.loadingblock == false) {

            $scope.myinventoryColumnLoaded = false;

        }
        $("#arrow").hide();


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }




        switch ($scope.CurrentActiveSearchType) {
            case 1:
            case 5:
            case 6:
            case 7:
                $scope.SearchValue = $("#MasterSearch").val();
                $scope.IsDateColumnOn = false;
                break;
            case 2:
                $scope.SearchValue = $("#MasterSearchNumber").val();
                $scope.IsDateColumnOn = false;
                break;
            case 3:
                $scope.SearchValue = $("#MasterSearchDate").val();
                $scope.IsDateColumnOn = true;
                break;
            case 4:
                if ($scope.CurrentActiveSearchField == "iStatusValue") {
                    $scope.SearchValue = $("#MasterSearchStatus").val();
                }
                else if ($scope.CurrentActiveSearchField == "uomUOM") {
                    $scope.SearchValue = $("#MasterSearchUOM").val();
                }

                $scope.IsDateColumnOn = false;
                break;
            default:
                break;
        }
        if ($scope.SearchValue == undefined || $scope.SearchValue == null) {
            $scope.SearchValue = "";
        }

        UpdateFilterArray($scope.CurrentActiveSearchField, $scope.SearchValue);


        var _masterSearch = $scope.SearchFromData == "All" ? $scope.SearchValue : "";

        if ($scope.CurrentActiveSearchField == "iStatusValue" || $scope.CurrentActiveSearchField == "uomUOM") {
            _masterSearch = "";
        }


        $.ajax({
            type: "POST",
            url: serviceBase + 'GetInventories',
            data: JSON.stringify({ SecurityToken: $scope.SecurityToken, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: $scope.FilterArray, SelectedCartIDs: SelectedCartItemIds, masterSearch: _masterSearch, showImage: $scope._areImagesShown, showZeroRecords: $scope._areZeroRecordsShown, PageSize: _PageSize, IsDateColumnOn: $scope.IsDateColumnOn }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {

                if (result.GetInventoriesResult.Success == true) {

                    $(".searchtable").removeClass("disablepointer")



                    $scope._areImagesShown = result.GetInventoriesResult.Payload[0].AreImagesShown
                    $scope._areZeroRecordsShown = result.GetInventoriesResult.Payload[0].AreZeroRecords
                    $scope.InventoryItems = result.GetInventoriesResult.Payload[0].Data;

                    _TotalRecordsCurrent = result.GetInventoriesResult.Payload[0].Data.length;

                    $scope.currentrecord = _TotalRecordsCurrent;
                    $scope.totalrecords = result.GetInventoriesResult.Payload[0].TotalRercords;
                    $scope.ActualTotalRecords = result.GetInventoriesResult.Payload[0].ActualTotalRecords;

                    $(".paginationtext").show();

                    if (_TotalRecordsCurrent == 0) {
                        $(".norecords").show();
                        $(".bottomlink").hide();

                    }
                    else {
                        $(".norecords").hide();
                        $(".bottomlink").show();

                    }

                    if ($scope.ActualTotalRecords) {
                        $("#arrow").attr("style", "");

                        $("#arrow").hide();
                    } else {
                        $scope.OpenmenuModal();
                        $(".searchtable").addClass("disablepointer");
                        $("#arrow").attr("style", "");
                        $("#arrow").show();




                    }


                }
                else {

                    $scope.ShowErrorMessage("current inventories", 1, 1, result.GetInventoriesResult.Message)
                }

                $scope.myinventoryColumnLoaded = true;
                $cordovaKeyboard.disableScroll(false);

                $scope.loadingblock = false;

                CheckScopeBeforeApply();

            },
            error: function (req) {
                $(".paginationtext").show();
                //

                $scope.myinventoryColumnLoaded = true;
                $cordovaKeyboard.disableScroll(false);
                CheckScopeBeforeApply();
                $scope.ShowErrorMessage("current inventories", 2, 1, req.statusText);
            },
            complete: function () {
                _IsLazyLoadingUnderProgress = 0;
                $cordovaKeyboard.disableScroll(false);
                SetSelectedIfAny();
            }
        });
    }


   


    $scope.GetUnitDataColumns = function () {

        var authData = localStorageService.get('authorizationData');

        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({
            type: "POST",
            url: serviceBase + 'GetActiveUnitDataFields',
            data: JSON.stringify({ SecurityToken: $scope.SecurityToken }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                if (result.GetActiveUnitDataFieldsResult.Success == true) {

                    // MY inventory column region
                    var _TempArrayMyInventory = result.GetActiveUnitDataFieldsResult.Payload;

                    for (var i = 0; i < _TempArrayMyInventory.length; i++) {

                        $scope.ActiveUnitDataFields.push(_TempArrayMyInventory[i]);

                    }
                   

                    CheckScopeBeforeApply();
                }
                else {

                    $scope.ShowErrorMessage("unit data columns", 1, 1, result.GetUnitDataColumnsResult.Message);

                }
            },
            error: function (req) {
                $scope.ShowErrorMessage("unit data columns", 2, 1, req.statusText);
            },
            complete: function () {

            }
        });


        $.ajax({
            type: "POST",
            url: serviceBase + 'GetUnitDataColumns',
            data: JSON.stringify({ SecurityToken: $scope.SecurityToken }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                if (result.GetUnitDataColumnsResult.Success == true) {

                    // MY inventory column region
                    var _TempArrayMyInventory = result.GetUnitDataColumnsResult.Payload;

                    for (var i = 0; i < _TempArrayMyInventory.length; i++) {

                        $scope.MyinventoryFieldsNames.push(_TempArrayMyInventory[i]);

                    }
                   
                    CheckScopeBeforeApply();
                }
                else {

                    $scope.ShowErrorMessage("unit data columns", 1, 1, result.GetUnitDataColumnsResult.Message);

                }
            },
            error: function (req) {
                $scope.ShowErrorMessage("unit data columns", 2, 1, req.statusText);
            },
            complete: function () {

            }
        });    


    }
    $scope.GetMyinventoryColumns = function () {



        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }



        $.ajax({
            type: "POST",
            url: serviceBase + 'GetMyInventoryColumns',
            data: JSON.stringify({ SecurityToken: $scope.SecurityToken }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {


                if (result.GetMyInventoryColumnsResult.Success == true) {

                    // MY inventory column region
                    var _TempArrayMyInventory = result.GetMyInventoryColumnsResult.Payload;

                    for (var i = 0; i < _TempArrayMyInventory.length; i++) {
                        var _ColName = _TempArrayMyInventory[i].ColumnName.split("#");
                        _TempArrayMyInventory[i].ColumnName = _ColName[0];

                        if (_TempArrayMyInventory[i].mobileorder != 0) {
                            $scope.MyinventoryFields.push(_TempArrayMyInventory[i]);
                        }
                    }

                    CheckScopeBeforeApply();
                }
                else {
                    $scope.ShowErrorMessage("my inventory columns", 1, 1, result.GetMyInventoryColumnsResult.Message);


                }
            },
            error: function (req) {
                if (req.statusText != "timeout") {

                    $scope.ShowErrorMessage("my inventory columns", 2, 1, req.statusText);
                }


            },
            complete: function () {

            }
        });
    }

    $scope.IsAnyUnitDataFieldActive = function () {
        var _Array = ["iReqValue", "iUnitTag2", "iUnitTag3", "iUnitNumber1", "iUnitNumber2", "iUniqueDate", "iUnitDate2"]
        var _returnData = false;
        for (var i = 0; i < _Array.length; i++) {
            if ($scope.IsAvailableMyInventoryColumn(_Array[i]) == true) {
                _returnData = true;
                break;
            }

        }

        return _returnData;
    }


    $scope.TrimFirstThreeLetter = function (ColumnName) {
        var _defaultValue = "";
        var ColumnLabel = "";


        ColumnLabel = $scope.GetUnitDataLabel(ColumnName);
        ColumnLabel = ColumnLabel == undefined || ColumnLabel == null ? "" : ColumnLabel
        var _TrimmedValue = $.trim(ColumnLabel);
        var _toReturnvalue = "";
        switch (ColumnName) {
            case "iUnitNumber1":
                _defaultValue = "UN1";
                break;
            case "iUnitNumber2":
                _defaultValue = "UN2";
                break;
            case "iUniqueDate":
                _defaultValue = "UD1";
                break;
            case "iUnitDate2":
                _defaultValue = "UD2";
                break;
            case "iUnitTag3":
                _defaultValue = "US3";
                break;
            case "iUnitTag2":
                _defaultValue = "US2";
                break;
            case "iReqValue":
                _defaultValue = "US1";
                break;

            default:

        }

        if (ColumnLabel != null && ColumnLabel != undefined && _TrimmedValue != "") {
            if (ColumnLabel.length > 3) {
                _toReturnvalue = ColumnLabel.substr(0, 3);

            }
            else {
                _toReturnvalue = ColumnLabel;
            }
        }
        else {
            _toReturnvalue = _defaultValue;
        }

        return _toReturnvalue;
    }

    $scope.GetAvailableColumnLabel = function (ColumnName) {
        var i = 0;
        for (i = 0; i < $scope.MyinventoryFields.length; i++) {
            if ($scope.MyinventoryFields[i].ColumnName == ColumnName) {
                return $scope.MyinventoryFields[i].ColumnLabel;
            }
        }

        return "";
    }


    $scope.GetUnitDataLabel = function (ColumnName) {
        var i = 0;

        ColumnName = ColumnName.substr(1);
        for (i = 0; i < $scope.MyinventoryFieldsNames.length; i++) {
            if ($scope.MyinventoryFieldsNames[i].ColumnName == ColumnName) {
                return $scope.MyinventoryFieldsNames[i].ColumnLabel;
            }
        }

        return "";
    }

    $scope.IsAvailableMyInventoryColumn = function (ColumnName) {
        var i = 0;
        for (i = 0; i < $scope.MyinventoryFields.length; i++) {
            if ($scope.MyinventoryFields[i].ColumnName == ColumnName) {
                return true;
            }
        }

        return false;
    }
    $scope.PopulateInventoryItems = function () {

        $scope.GetMyinventoryColumns();
        $scope.getstatus();
        $scope.GetUnitDataColumns();
        $scope.GetInventories();
    }

    $scope._updateImg = function (src) {

        $scope.selectedImage = src;
        $("#myModal1").modal('show');
    }



    $scope.ScanItemSearch = function () {

        $scope.isSanned = false;

        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan(function (result) {
            $scope.SearchValue = result.text;

            CheckScopeBeforeApply();
            $scope.GetInventories();



        }, function (error) {
            console.log("Scanning failed: ", error);
        });
    }


    $("#MasterSearch").keyup(function (e) {
        var _Value = $.trim($('#MasterSearch').val());
        if (_Value !== "") {

            $('#btnMasterSearch').addClass('bgm-red')
        }
        else {
            $scope.PopulateInventoryItems();
            $('#btnMasterSearch').removeClass('bgm-red')
        }

    });



    $scope.AddToCart = function (obj, _isSelectAll) {

        if (_CanAct == 'True') {


            var originalID = "#actionQty_" + obj.iID;


            if ($(originalID).find(".fa-check").css("color") == "rgb(76, 175, 80)") {

                if (_isSelectAll != true) {

                    $(originalID).find(".fa-check").css("color", "transparent");

                    $(originalID).parent(".newlistitem").find(".img").css("opacity", "1")
                }


            }
            else {
                var _CartObjLimittemp = _isSelectAll == true ? _CartObjLimit : (_CartObjLimit - 1);
                if ($scope.mainObjectToSend.length <= _CartObjLimittemp) {
                    $(originalID).find(".fa-check").css("color", "#4CAF50");
                    $(originalID).parent(".newlistitem").find(".img").css("opacity", "0.4")
                }

            }

            addItemsToCart(obj, obj.iID, originalID, _isSelectAll);

        }
        else {
            return false;
        }

    }
    $scope.AddToCartSelectAll = function (obj) {

        if (_CanAct == 'True') {


            var originalID = "#actionQty_" + obj.iID;



            if ($(originalID).find(".fa-check").css("color") == "rgb(76, 175, 80)") {

                $(originalID).find(".fa-check").css("color", "transparent");

                $(originalID).parent(".newlistitem").find(".img").css("opacity", "1")


            }
            else {
                if ($scope.mainObjectToSend.length < _CartObjLimit) {
                    $(originalID).find(".fa-check").css("color", "#4CAF50");
                    $(originalID).parent(".newlistitem").find(".img").css("opacity", "0.4")
                }

            }

            addItemsToCart(obj, obj.iID, originalID);

        }
        else {
            return false;
        }

    }

    $scope.SelectAll = function () {


        for (var i = 0; i < $scope.InventoryItems.length; i++) {
            if (i > _CartObjLimit) {
                break;
            }
            else {
                if (i < _CartObjLimit) {
                    $scope.AddToCart($scope.InventoryItems[i], true);
                }

            }

        }

        $scope.OpentransactionModal();
    }
    var _tempCopy = [];
    function CheckInCart(id) {
        for (var i = 0; i < _tempCopy.length; i++) {
            if (_tempCopy[i].uId == id) {

                return true;
            }
            else {
                return false;
            }

        }
    }
    $scope.DeselectAll = function () {
        _tempCopy = angular.copy($scope.mainObjectToSend);
        $('#mylist .checkicon').each(function () {
            $(this).parent(".newlistitem").find(".img").css("opacity", "1")
            $(this).find(".fa-check").css("color", "transparent");
            var originalID = "#" + $(this).attr("id");
            var _invID = parseFloat($(this).attr("inv-id"));
            for (var i = 0; i < _tempCopy.length; i++) {
                if (_tempCopy[i].uId == _invID) {

                    $('.cartbtn').animate_from_to(originalID, {
                        pixels_per_second: $scope.Animationtime,
                        initial_css: {
                            'background': 'rgba(226, 208, 208,1)',
                            'border-radius': '100%'
                        }
                    });
                }
                else {
                }

            }



        });
        $scope.mainObjectToSend = [];
        localStorageService.set("ActivityCart", "");
        CheckScopeBeforeApply();

    }


    $('#mycartModal').on('hidden.bs.modal', function () {
        $(".cartcrossicon").hide();
        $(".cartcounter").show();


    });




    $('#myModal2').on('shown.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');

    });

    $('#myModal2').on('hidden.bs.modal', function () {

        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')

    });

    $('#mycartModal').on('shown.bs.modal', function () {
        $(".cartcrossicon").show();
        $(".cartcounter").hide();
    });
    $scope.OpentransactionModal = function () {





        if (_TotalRecordsCurrent != 0) {

            if ($("body").hasClass("modal-open")) {

                $(".transactionbody").removeClass('slideInUp');
                $(".transactionbody").addClass('slideOutDown');
                $(".cartcrossicon").hide();
                $(".cartcounter").show();
                setTimeout(function () { $("#mycartModal").modal('hide'); }, 1000);

            }
            else {

                $(".transactionbody").removeClass('slideOutDown');
                $(".transactionbody").addClass('slideInUp');
                $(".cartcrossicon").show();
                $(".cartcounter").hide();
                $("#mycartModal").modal('show');
            }

        }






    }
    function formatDate(date) {
        if (date != null && date != undefined && date != "") {

            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }
        else {
            return date;
        }
    }

    function ConverttoMsJsonDateTime(_DateValue) {


        var _date = angular.copy(_DateValue);

        var dsplit1 = _date.split("/");

        var _timeSplit = dsplit1[2].split(" ");

        var _timeString = _timeSplit[1].split(":");

        if (parseInt(_timeString[0]) >= 12) {
            _timeString[0] = (parseInt(_timeString[0]) - 12).toString();
        }

        var _ToMergeTime = "T" + (_timeSplit[2] == "AM" ? leadZero(_timeString[0]) : leadZero((12 + parseInt(_timeString[0]))).toString()) + ":" + leadZero(_timeString[1]);

        var now = new Date(_timeSplit[0], dsplit1[0] - 1, dsplit1[1]);

        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);

        var today = now.getFullYear() + "-" + (month) + "-" + (day);

        return today + _ToMergeTime;
    }

    function ConvertToTime(_timeValue) {


        debugger;

        if ($.trim(_timeValue) != "") {

            var _timeSplit = _timeValue.split(" ");
            var _timeString = _timeSplit[0].split(":");

            if (parseInt(_timeString[0]) >= 12) {
                _timeString[0] = (parseInt(_timeString[0]) - 12).toString();
            }

            var _ToMergeTime = (_timeSplit[1] == "AM" ? leadZero(_timeString[0]) : leadZero((12 + parseInt(_timeString[0]))).toString()) + ":" + leadZero(_timeString[1]);

            return _ToMergeTime;
        }

        return "";

    }

    function leadZero(_something) {
        var _TempString = parseInt(_something);
        _something = _TempString.toString();
        if (parseInt(_something) < 10) return "0" + _something;
        return _something;//else    
    }
    function ConvertToProperDate(value, Type) {
        if ($.trim(value) != "") {
            switch (Type) {
                case 1:

                    if ($scope.getUnitObjByName("UniqueDate").FieldSpecialType == 16) {
                        return ConverttoMsJsonDateTime(value);
                    }

                    else if ($scope.getUnitObjByName("UniqueDate").FieldSpecialType == 17) {
                        return ConvertToTime(value);
                    }
                    else {
                        return formatDate(value);
                    }

                    break;
                case 2:
                    if ($scope.getUnitObjByName("UnitDate2").FieldSpecialType == 16) {
                        return ConverttoMsJsonDateTime(value);
                    }

                    else if ($scope.getUnitObjByName("UnitDate2").FieldSpecialType == 17) {
                        return ConvertToTime(value);
                    }
                    else {
                        return formatDate(value);
                    }

                    break;
                default:

            }
        }
        return "";
    }
    function addItemsToCart(object, IdToSave, originalID, _isSelectAll) {

        var isItemExist = true;
        var TempValue = 0;
        var _zeroCount = 0;
        var _CartObjLimittemp = _isSelectAll == true ? _CartObjLimit : (_CartObjLimit - 1);
        var _count = 0;

        if ($(originalID).find(".fa-check").css("color") == "rgb(76, 175, 80)" && $scope.mainObjectToSend.length <= _CartObjLimittemp) {
            _isExceededLimit = false;
            $.each($scope.InventoryItems, function (i, v) {
                if (v.iID == IdToSave) {
                    isItemExist = true;
                    $.each($scope.mainObjectToSend, function (k, l) {

                        if (l.uId == IdToSave) {
                            isItemExist = false;
                        }
                    });

                    if (isItemExist == true) {



                        TempValue = 1;



                        if (_isSelectAll != true) {
                            setTimeout(function () {
                                $(originalID).animate_from_to('.cartbtn', {
                                    pixels_per_second: $scope.Animationtime,
                                    initial_css: {
                                        'background': 'rgba(18,142,206,0.5)',
                                        'border-radius': '100%'
                                    }
                                });
                            }, 0);

                        }
                        else {
                            setTimeout(function () {
                                $(originalID).animate_from_to('.cartbtn', {
                                    pixels_per_second: $scope.Animationtime,
                                    initial_css: {
                                        'background': 'rgba(18,142,206,0.5)',
                                        'border-radius': '100%'
                                    }
                                });
                            }, 0);


                        }





                        $scope.mainObjectToSend.push({
                            uId: v.iID,
                            pID: v.pID,
                            pPart: v.pPart,
                            iLID: v.iLID,
                            iUOMID: v.iUOMID,
                            iQty: TempValue,
                            oquantity: v.iQty,
                            uomUOM: v.uomUOM,
                            lLoc: v.lLoc,
                            iStatusValue: v.iStatusValue,
                            pDescription: v.pDescription,
                            Action: '',
                            // CurrentInvObj: v,
                            iUniqueDate_date: (v.iUniqueDate),
                            iUnitNumber2: v.iUnitNumber2,
                            iUnitNumber1: v.iUnitNumber1,
                            iUnitDate2_date: (v.iUnitDate2),
                            iUnitTag3: v.iUnitTag3,
                            iUnitTag2: v.iUnitTag2,
                            pCountFrq: v.pCountFrq,
                            lZone: v.lZone,
                            ImageThumbPath: v.ImageThumbPath,
                            ImageDisplayName: v.ImageDisplayName,
                            iReqValue: v.iReqValue,
                            iCostPerUnit: v.pDefaultCost,



                        });




                    }
                    else {
                        var k = 0;

                    }


                }
            });

        } else {

            if (_isSelectAll != true) {

                $scope.mainObjectToSend = $scope.mainObjectToSend.filter(function (el) {
                    return el.uId != IdToSave;

                });

                // $(".cartbtn").animate_from_to(originalID);

                $('.cartbtn').animate_from_to(originalID, {
                    pixels_per_second: $scope.Animationtime,
                    initial_css: {
                        'background': 'rgba(226, 208, 208,1)',
                        'border-radius': '100%'
                    }
                });
            }

            if ($scope.mainObjectToSend.length <= _CartObjLimittemp) {

            }
            else {

                if (_isExceededLimit == false) {

                    log.warning("You can only select 25 items at one time.");
                    _isExceededLimit = true;
                }


            }
        }



        $scope.CurrentActiveClass = "bounceIn";
        CheckScopeBeforeApply();

        ResetCurrentActiveClass();

    }




    function ResetCurrentActiveClass() {
        setTimeout(function () {

            $scope.CurrentActiveClass = "";
            CheckScopeBeforeApply();
        }, 500);
    }


    function SetSelectedIfAny() {

        for (var i = 0; i < $scope.mainObjectToSend.length; i++) {

            $scope.AddToCart(GetInventoryItem($scope.mainObjectToSend[i].uId), true);


        }


    }

    function GetInventoryItem(id) {
        for (var i = 0; i < $scope.InventoryItems.length; i++) {

            if ($scope.InventoryItems[i].iID == id) {
                return $scope.InventoryItems[i];

            }

        }
    }

    function init() {
        //   $cordovaKeyboard.disableScroll(false);
        var _myItemsList = localStorageService.get("ActivityCart");
        _myItemsList = _myItemsList != null && _myItemsList != undefined ? _myItemsList : [];
        if (_myItemsList.length > 0) {

            var j = 0;
            for (j = 0; j < _myItemsList.length; j++) {
                var v = _myItemsList[j].InventoryDataList;
                $scope.mainObjectToSend.push({
                    uId: v.uId,
                    pID: v.pID,
                    pPart: v.pPart,
                    iLID: v.iLID,
                    iUOMID: v.iUOMID,
                    iQty: v.iQty,
                    oquantity: v.oquantity,
                    uomUOM: v.uomUOM,
                    lLoc: v.lLoc,
                    iStatusValue: v.iStatusValue,
                    pDescription: v.pDescription,
                    Action: '',
                    iUniqueDate_date: (v.iUniqueDate),
                    iUnitNumber2: v.iUnitNumber2,
                    iUnitNumber1: v.iUnitNumber1,
                    iUnitDate2_date: (v.iUnitDate2),
                    iUnitTag3: v.iUnitTag3,
                    iUnitTag2: v.iUnitTag2,
                    pCountFrq: v.pCountFrq,
                    lZone: v.lZone,
                    ImageThumbPath: v.ImageThumbPath,
                    ImageDisplayName: v.ImageDisplayName,
                    iReqValue: v.iReqValue,
                    iCostPerUnit: v.pDefaultCost,

                });
            }

            CheckScopeBeforeApply();


        }
        setZeroData();
        SetImageData();
        $scope.PopulateInventoryItems();

        $scope.getuom();

        $scope.SendEmail();
        $scope.GetActiveUnitDataField();
        //SetSelectedIfAny();

    }

    $scope.SendEmail = function () {
        var _Latestsignup = localStorageService.get("LatestSignUp");

        if (_Latestsignup == "true") {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.SecurityToken = authData.token;
            }

            $.ajax
               ({
                   type: "POST",
                   url: serviceBase + 'SendEmail',
                   contentType: 'application/json; charset=utf-8',
                   dataType: 'json',
                   data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
                   success: function (response) {
                       if (response.SendEmailResult.Success == true) {
                           localStorageService.set("LatestSignUp", false);
                           CheckScopeBeforeApply()
                       }
                       else {
                           $scope.ShowErrorMessage("Sending Email", 1, 1, response.SendEmailResult.Message);

                       }

                   },
                   error: function (err) {

                       $scope.errorbox(err);
                       $scope.ShowErrorMessage("Sending Email", 2, 1, err.statusText);

                   }
               });

        }
    }

    function setZeroData() {
        var _Iszero = localStorageService.get("ShowZeroRecords");

        if (_Iszero != null && _Iszero != undefined) {
            $scope._areZeroRecordsShown = _Iszero;

        }
        else {
            $scope._areZeroRecordsShown = true;
        }
        CheckScopeBeforeApply();
    }

    function SetImageData() {


        var _IsImage = localStorageService.get("ShowImageRecords");

        if (_IsImage != null && _IsImage != undefined) {
            $scope._areImagesShown = _IsImage;

        }
        else {
            $scope._areImagesShown = true;
        }
        CheckScopeBeforeApply();
    }

    init();

    function GetFromlocalMyItemlist(ID) {
        var _myItemsList = localStorageService.get("ActivityCart");
        _myItemsList = _myItemsList != null && _myItemsList != undefined ? _myItemsList : [];
        if (_myItemsList.length > 0) {
            var j = 0;
            for (j = 0; j < _myItemsList.length; j++) {
                var v = _myItemsList[j].InventoryDataList;
                if (v.uId == ID) {
                    return _myItemsList[j];

                }
            }
        }

        return null;
    }
    function GetDataToSend(mainObjectToSend) {
        var _defaultQty = $scope.GetDefaultQty();
        if (mainObjectToSend.length > 0) {
            for (var i = 0; i < mainObjectToSend.length; i++) {
                var _ItemData = GetFromlocalMyItemlist(mainObjectToSend[i].uId)
                if (_ItemData == null) {

                    var _unitDate1 = ConvertToProperDate(mainObjectToSend[i].iUniqueDate_date, 1);
                    var _unitDate2 = ConvertToProperDate(mainObjectToSend[i].iUnitDate2_date, 2);

                    console.log("unit Date 1" + _unitDate1);
                    console.log("unit Date 2" + _unitDate2);
                    $scope.Cart.push({
                        InventoryID: mainObjectToSend[i].uId,
                        IsLineItemData: [],
                        iCostPerItem: mainObjectToSend[i].iCostPerUnit,
                        ItemID: mainObjectToSend[i].pPart,
                        ActionPerformed: $scope.selectedAction,
                        AdjustActionQuantity: "",
                        AdjustCalculation: "",
                        InventoryDataList: mainObjectToSend[i],
                        IncreaseDecreaseVMData: ({ ActionQuantity: _defaultQty }),
                        MoveTransactionData: ({ ActionQuantity: _defaultQty, StatusToUpdate: mainObjectToSend[i].iStatusValue, MoveToLocationText: "", MoveToLocation: "" }),
                        UpdateTransactionData: ({ ActionQuantity: _defaultQty, StatusToUpdate: mainObjectToSend[i].iStatusValue }),
                        ApplyTransactionData: ({ ActionQuantity: _defaultQty, UnitTag1: mainObjectToSend[i].iReqValue, UnitTag2: mainObjectToSend[i].iUnitTag2, UnitTag3: mainObjectToSend[i].iUnitTag3, UniqueDate: _unitDate1, UnitDate2: _unitDate2, UnitNumber1: mainObjectToSend[i].iUnitNumber1, UnitNumber2: mainObjectToSend[i].iUnitNumber2 }),
                        ConvertTransactionData: ({ ActionFromQuantity: _defaultQty, ActionToQuantity: _defaultQty, ToUOMID: 0, ToUOM: "" }),
                        MoveUpdateTagTransactionData: ({ ActionQuantity: _defaultQty, StatusToUpdate: mainObjectToSend[i].iStatusValue, MoveToLocationText: mainObjectToSend[i].lLoc, MoveToLocation: mainObjectToSend[i].iLID, UnitTag1: mainObjectToSend[i].iReqValue, UnitTag2: mainObjectToSend[i].iUnitTag2, UnitTag3: mainObjectToSend[i].iUnitTag3, UniqueDate: _unitDate1, UnitDate2: _unitDate2, UnitNumber1: mainObjectToSend[i].iUnitNumber1, UnitNumber2: mainObjectToSend[i].iUnitNumber2 }),
                    });

                    console.log($scope.Cart);
                }
                else {
                    $scope.Cart.push(_ItemData);
                }
            }

        }
        return $scope.Cart;
    }



    // Go to next page after select particular activity from list(Increase,decrease,move,convert,tag..)
    $scope.GoToNextMobile = function (selectedAction) {
        $scope.selectedAction = selectedAction;
        var _dataToSend = GetDataToSend($scope.mainObjectToSend);
        localStorageService.set("ActivityCart", "");
        localStorageService.set("ActivityCart", _dataToSend);
        console.log(_dataToSend);
        localStorageService.set("SelectedAction", "");
        localStorageService.set("SelectedAction", selectedAction);

        console.log(_dataToSend);

        $("#mycartModal").modal('hide');
        $location.path("/activity");

    }

    $('#MasterSearchStatus').multiselect();

}]);




app.directive('onLongPress', function ($timeout) {
    //Global variable, to cancel timer on touchend.
    var timer;
    var count = 0;
    return {
        restrict: 'A',
        link: function ($scope, $elm, $attrs) {
            $elm.bind('touchstart', function (evt) {
                // Locally scoped variable that will keep track of the long press
                $scope.longPress = true;

                // We'll set a timeout for 600 ms for a long press
                timer = $timeout(function () {
                    if ($scope.longPress) {
                        count++;
                        // If the touchend event hasn't fired,
                        // apply the function given in on the element's on-long-press attribute
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onLongPress)
                        });
                    }
                }, 600);

                timer;
            });

            $elm.bind('touchend', function (evt) {
                // Prevent the onLongPress event from firing
                $scope.longPress = false;

                // Prevent on quick presses, unwanted onLongPress selection.
                $timeout.cancel(timer);

                // If there is an on-touch-end function attached to this element, apply it
                if ($attrs.onTouchEnd) {

                    if (count < 1) {
                        count = 0;
                        //$scope.$apply(function () {
                        //    $scope.$eval($attrs.ngClick)
                        //});
                    }
                    else {
                        count = 0;
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onTouchEnd)
                        });
                    }






                }
            });



        }
    };
})



app.directive('multipleSelect', function () {

    return {

        scope: true,
        link: function (scope, element, attrs) {

            element.multiselect({

                // Replicate the native functionality on the elements so
                // that angular can handle the changes for us.
                onChange: function (optionElement, checked) {
                    optionElement.prop('selected', false);
                    if (checked) {
                        optionElement.prop('selected', true);
                    }
                    // scope.applyFilter();
                    element.change();
                }
            });

            // Watch for any changes to the length of our select element
            scope.$watch(function () {
                return element[0].length;
            }, function () {
                element.multiselect('rebuild');
            });

            // Watch for any changes from outside the directive and refresh


        }

    };
});


app.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                element[0].nextElementSibling.remove();
                element[0].style.display = "";
                var image = new Image();
                image.src = $(element).attr("src");
                image.onload = function () {

                    var _height = this.height;
                    var _Width = this.width;

                    if (_height < _Width) {
                        _Width = _height;
                    }

                    if (_Width < _height) {
                        _height = _Width;
                    }



                    $(element).css("height", _height + "px");
                    $(element).css("width", _Width + "px");
                };

            });
            element.bind('error', function () {
            });
        }
    };
});