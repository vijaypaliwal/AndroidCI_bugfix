'use strict';
app.controller('inventoryController', ['$scope', '$location', 'authService', 'localStorageService', 'log', '$compile', '$cordovaKeyboard', function ($scope, $location, authService, localStorageService, log, $compile, $cordovaKeyboard) {
  
    $scope.orders = [];
    $scope.MyinventoryFields = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.SecurityToken = "";
    $scope.StatusList = [];
    $scope.UOMSearching = false;
    $scope.CurrentActiveField = "";
    $scope.CurrentActiveFieldType = "";
    $scope.CurrentActiveFieldDatatype = "";
    $scope.Totalslides = 0;
    $scope.CurrentCount = 0;
    $scope.IsFormDataloaded = false;
    $scope.Isopendiv = true;
    $scope.InventoryObject = {
        IsFullPermission: true, AutoID: false, PID: 0, ItemID: "", Description: "", Quantity: "", Uom: "units", UomID: 0, Location: "In Stock", lZone: "", LocationID: 0, UniqueTag: "", Cost: 0,
        UpdateDate: "/Date(1320825600000-0800)/", Status: "", ItemGroup: "", UniqueDate: null, UnitDate2: null, UnitNumber1: "", UnitNumber2: "", UnitTag2: "",
        UnitTag3: "", CustomPartData: [], CustomTxnData: []
    };

    $scope.IsItemLibrary = true;
    $scope.IsLocationLibrary = true;
    $scope.IsUOMLibrary = true;
    $scope.IsStatusLibrary = true;

    $scope.IsItemChose = false;

    $scope.IsItemGroupChose = false;
    

    $scope.changelocation = function () {

        $scope.InventoryObject.LocationID = 0;

        var element = $("#Location");
        var myTag = $('option:selected', element).attr('mytag');

        if (myTag != undefined && myTag != null) {
            $scope.InventoryObject.lZone = myTag;
        }
        else {
            $scope.InventoryObject.lZone = "";
        }


    }


    $scope.SetIsOpen=function(_bool)
    {
        $scope.Isopendiv = _bool;
        CheckScopeBeforeApply();

    }

    $("body").on("click", function (e) {

        if ($(e.target).hasClass('modal-backdrop')) {

            $('#infomodal').removeClass('bounceInRight');

            $('#infomodal').addClass('bounceOutRight');

            setTimeout(function () {

                $('#infomodal').removeClass('bounceOutRight');
                
                $('#infomodal').addClass('bounceInRight');

                $('#infomodal').modal('hide');
              
            },500)
        }
    });

    $scope.CommonArray = ['Image', 'iUnitNumber1', 'iUnitNumber2', 'iUniqueDate', 'iUnitDate2', 'iUnitTag3', 'iUnitTag2', 'iReqValue', 'pPart', 'pDescription', 'iQty', 'lLoc', 'lZone', 'iStatusValue', 'uomUOM', 'pCountFrq', 'iCostPerUnit'];

    $scope.LocationList = [{ LocationName: "dhdd", LocationZone: "", LocationID: 678325 },
                           { LocationName: "Here", LocationZone: "", LocationID: 678323 },
                           { LocationName: "in store", LocationZone: "", LocationID: 678030 },
                           { LocationName: "New gallon location", LocationZone: "", LocationID: 678363 },
                           { LocationName: "New loc", LocationZone: "", LocationID: 678542 },
                           { LocationName: "Random", LocationZone: "", LocationID: 678370 },
                           { LocationName: "Stock", LocationZone: "", LocationID: 678361 },
                           { LocationName: "there", LocationZone: "", LocationID: 663546 },
                           { LocationName: "Trade", LocationZone: "", LocationID: 678546 },
                           { LocationName: "BLC1009", LocationZone: "", LocationID: 123 }];
    $scope.UOMList = [];
    $scope.ItemList = [];
    $scope.ImageList = [];

    $scope.Quantity = "N/A";
    $scope.ItemName = "N/A";
    $scope.Description = "N/A";
    $scope.Location = "N/A";
    $scope.Status = "N/A";
    $scope.UOM = "N/A";
    $scope.scanfieldID = "pPartForm";
    $scope.UnitDataList = [];
    $scope.CustomItemDataList = [];
    $scope.CustomActivityDataList = [];
    $scope.laststepindex = 0;
    _CurrentUrl = "Inventory";
    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply()
    }
    var _colid = "";

    $scope.SearchItemValue = "";
    $scope.ItemSearching = "";
    $scope.SearchList = [];
    $scope.SearchLocationValue = "";
    $scope.LocationSearching = "";
    $scope.LocationSearchList = [];

    $scope.isnoitemmsg = false;
    $scope.isnolocationmsg = false;
    $scope.isnouommsg = false;
    $scope.slide = 1000;
    $scope.CreateType = 0;
    $scope.CreateNewLabel = "";
    var FileName = "";
    var StreamData = "";

    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    Date.prototype.toMSJSON = function () {
        this.setHours(this.getHours() - this.getTimezoneOffset() / 60);
        var date = '/Date(' + this.getTime() + ')/'; //CHANGED LINE
        return date;
    };

    if (deviceType == 'iPhone') {
        $(".iosbtn").show()
        $(".androidbtn").hide()
    }
    else {
        $(".androidbtn").show()
        $(".iosbtn").hide()
    }



    $scope.CheckInCommonArray = function (Column) {
        for (var i = 0; i < $scope.CommonArray.length ; i++) {
            if ($scope.CommonArray[i] == Column) {
                return true;
            }
        }
        return false;
    }

    $scope.CreateNew = function (Type) {
        $scope.CreateType = Type;
        $("#createnewlabel").modal('show');
    }

    $scope.GoToNext = function () {
        mySwiper.swipeNext();
    }


    $scope.GetCustomColumn=function(ColumnMap)
    {
        var _obj = {};
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ColumnMap) {
                return $scope.CustomItemDataList[i];
            }
           
        }
        return _obj;

    }


    $('#myModal2').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });


    $scope.OpenmenuModal = function () {

        if ($("body").hasClass("modal-open")) {
            $("#myModal2").modal('hide');

            $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')


        }
        else {
            $("#myModal2").modal('show');
            $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');
        }
    }


    $scope.checkDuplicate = function (type) {
        if (type == 1) {
            for (var i = 0; i < $scope.LocationList.length; i++) {
                if ($scope.LocationList[i].LocationName == $scope.CreateNewLabel) {
                    return false;
                }
            }
        }

        if (type == 2) {
            for (var i = 0; i < $scope.UOMList.length; i++) {
                if ($scope.UOMList[i].UnitOfMeasureName == $scope.CreateNewLabel) {
                    return false;
                }
            }

        }


        if (type == 3) {
            for (var i = 0; i < $scope.StatusList.length; i++) {
                if ($scope.StatusList[i].StatusValue == $scope.CreateNewLabel) {
                    return false;
                }
            }

        }

        return true;
    }


    $scope.savestatus = function (Statusvalue) {

        var _StatusValue = $.trim(Statusvalue);

        if (_StatusValue != "") {

            $scope.StatusToCreate = Statusvalue;
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.SecurityToken = authData.token;
            }
            $scope.IsProcessing = true;
            var datatosend = { "StatusId": 0, "StatusValue": $scope.StatusToCreate };


            $.ajax({
                url: serviceBase + "CreateEditStatus",
                type: 'POST',
                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "_StatusVM": datatosend }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {

                    $scope.IsProcessing = false;

                    if (result.CreateEditStatusResult.Success == true) {

                        if (result.CreateEditStatusResult.Payload == 1) {
                            if ($scope.mode == 2) {
                                ShowSuccess("Added");

                            }




                        }

                        if (result.CreateEditStatusResult.Payload == 0) {

                            log.warning("Already exist");
                            $scope.$apply();
                        }
                    }
                    else {
                        $scope.ShowErrorMessage("Updating status", 3, 1, result.CreateEditStatusResult.Message)

                    }

                },
                error: function (err) {
                    $scope.IsProcessing = false;
                    $scope.ShowErrorMessage("Updating Status", 2, 1, err.statusText);


                },
                complete: function () {
                    $scope.IsProcessing = false;
                }

            });

            $scope.$apply();

        }

    }

    $scope.SaveLabel = function (Type) {
        if ($scope.checkDuplicate(Type)) {


            if (Type == 1) {
                var _locationobj = { LocationID: 0, LocationZone: "", LocationName: $scope.CreateNewLabel };
                $scope.LocationSearchList.push(_locationobj);
                $scope.LocationList.push(_locationobj);
                $scope.InventoryObject.Location = $scope.CreateNewLabel;

            }

            if (Type == 2) {
                var _uomobj = { UnitOfMeasureName: $scope.CreateNewLabel, UnitOfMeasureID: 0 };
                $scope.UOMList.push(_uomobj);
                $scope.InventoryObject.Uom = $scope.CreateNewLabel;
            }


            if (Type == 3) {
                var _statusobj = { StatusValue: $scope.CreateNewLabel };
                $scope.StatusList.push(_statusobj);
                $scope.InventoryObject.Status = $scope.CreateNewLabel;
                $scope.savestatus($scope.InventoryObject.Status);
            }
            $scope.CreateNewLabel = "";
            CheckScopeBeforeApply();
            $("#createnewlabel").modal('hide');
        }
        else {
            log.error("This value already exist.");
        }
    }
    $scope.viewall = function () {

        $("#infomodal").modal('show');

    }

    $scope.leavepage = function() {

    }


    $scope.GetLastValueCustom = function (id, Type) {



        var field = "Inv_" + id;
        var _fieldid = "";

        switch (Type) {
            case 1:
                _fieldid = "#CustomItem_" + id;
                break;
            case 2:
                _fieldid = "#CustomActivity_" + id;
                break;
            default:

        }

        var _value = "";
        var _toCheckValue = localStorageService.get(field);
        if (_toCheckValue != null && _toCheckValue != undefined) {
            _value = _toCheckValue;


            $(_fieldid).val(_value);
            $(_fieldid).trigger('change');
        }
        else {

            $(_fieldid).val(_value);
            $(_fieldid).trigger('change');

        }


    }
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    //var rString = randomString(10, '0123456789');
    $scope.GetLastValue = function (field, id) {




        var _value = "";
        var _toCheckValue = localStorageService.get(field);




        if (_toCheckValue != null && _toCheckValue != undefined) {
            _value = _toCheckValue;

            if (id == "#UOM") {
                $scope.InventoryObject.Uom = _value;
                $scope.$apply();

                $(id).trigger('change');


            }
            else if (id == "#Location") {
                $scope.InventoryObject.Location = _value;
            }
            else if (id == "#Status") {
                $(id).val(_value);
                $scope.InventoryObject.Status = _value;
            }
            else {
                $(id).val(_value);

                $(id).trigger('change');
            }
        }
        else {

            $(id).val(_value);
            $(id).trigger('change');

        }
        CheckScopeBeforeApply()

    }

    $scope.GetAllLastValue=function()
    {
        $scope.GetLastValue('Inv_ItemID', '#ItemName');
        $scope.GetLastValue('Inv_Description', '#pDescriptionForm');
        $scope.GetLastValue('Inv_lZone', '#lZone');
        $scope.GetLastValue('Inv_ItemGroup', '#itemgroup');
        $scope.GetLastValue('Inv_Status', '#Status');
        $scope.GetLastValue('Inv_Location', '#Location');
        $scope.GetLastValue('Inv_Uom', '#UOM');
        $scope.GetLastValue('Inv_Cost', '#Costperunit');
        $scope.GetLastValue('Inv_UniqueTag', '#UniqueTag');
        $scope.GetLastValue('Inv_UnitTag2', '#UnitTag2');
        $scope.GetLastValue('Inv_UnitTag3', '#UnitTag3');
        $scope.GetLastValue('Inv_UniqueDate', '#UniqueDate');
        $scope.GetLastValue('Inv_UnitDate2', '#UnitDate2');
        $scope.GetLastValue('Inv_UnitNumber1', '#UnitNumber1');
        $scope.GetLastValue('Inv_UnitNumber2', '#UnitNumber2');
        if ($scope.CustomItemDataList.length > 0) {

            for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
                var obj = $scope.CustomItemDataList[i];
                $scope.GetLastValueCustom(obj.cfdID, 1);
            }
        }

        if ($scope.CustomActivityDataList.length > 0) {

            for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
                var obj = $scope.CustomActivityDataList[i];
                $scope.GetLastValueCustom(obj.cfdID, 2);
            }
        }
    }
    $scope.$watch('InventoryObject', function () {



        var _TempObj = $scope.InventoryObject;

        $.each(_TempObj, function (datakey, datavalue) {


            switch (datakey) {
                case "ItemName":
                    $scope.ItemName = datavalue != null && datavalue != undefined && datavalue != "" ? datavalue : "N/A";
                    break;
                case "Description":
                    $scope.Description = datavalue != null && datavalue != undefined && datavalue != "" ? datavalue : "N/A";
                    break;
                case "Status":
                    $scope.Status = datavalue != null && datavalue != undefined && datavalue != "" ? datavalue : "N/A";
                    break;
                case "Quantity":

                    $scope.Quantity = datavalue != null && datavalue != undefined && datavalue != "" ? datavalue : "N/A";
                    break;
                case "UOM":
                    $scope.UOM = datavalue != null && datavalue != undefined && datavalue != "" ? $scope.GetUOMfromArray(datavalue) : "N/A";
                    break;
                case "Location":
                    $scope.Location = datavalue != null && datavalue != undefined && datavalue != "" ? $scope.GetLocaTextfromArray(datavalue) : "N/A";
                    break;
                default:

            }

        });



    }, true);


    $scope.fillitem = function () {

        $scope.InventoryObject.ItemID = $scope.SearchItemValue;
        $("#itemlistmodal").modal('hide');
        CheckScopeBeforeApply()

    }

    $scope.filllocation = function () {

        $scope.InventoryObject.Location = $scope.SearchLocationValue;
        $("#locationlistmodal").modal('hide');
        CheckScopeBeforeApply()

    }

    $scope.filluom = function () {

        $scope.InventoryObject.Uom = $scope.SearchUOMValue;
        $("#uomlistmodal").modal('hide');
        CheckScopeBeforeApply()

    }

    $scope.Itemgrouplistmodal = function () {


        $("#itemlistmodal").modal('hide');
        $("#Itemgrouplistmodal").modal('show');

        $scope.ItemgroupSearchlist = $scope.Itemgrouplist;
        CheckScopeBeforeApply();

        $('html,body').animate({ scrollTop: 0 }, 800);


    }



    $scope.SetItemData = function (obj) {

        $scope.InventoryObject.ItemID = obj.ItemID;

        $scope.InventoryObject.Description = obj.ItemDescription;

        $scope.InventoryObject.Location = obj.DefaultLocation;

        $scope.InventoryObject.LocationID = obj.DefaultLocationID;

        $scope.InventoryObject.UomID = obj.DefaultUomID;
        $scope.InventoryObject.Uom = obj.DefaultUom;

        $scope.InventoryObject.lZone = obj.DefaultLocationGroup;
        $scope.InventoryObject.ItemGroup = obj.ItemGroup;

        $scope.IsItemChose = true;


        if ($scope.InventoryObject.CustomPartData.length > 0 && obj.CustomData.length > 0) {

            for (var i = 0; i < $scope.InventoryObject.CustomPartData.length; i++) {
                for (var j = 0; j < obj.CustomData.length; j++) {
                    if (obj.CustomData[j].cfdID == $scope.InventoryObject.CustomPartData[i].CfdID) {
                        $scope.InventoryObject.CustomPartData[i].Value = obj.CustomData[j].CustomFieldValue;
                    }
                }

            }
        }


        $("#itemlistmodal").modal('hide');

        $("#locationlistmodal").modal('hide');
        $("#uomlistmodal").modal('hide');
        CheckScopeBeforeApply();
    }

    $scope.SetItemGroup = function (obj) {

        $scope.InventoryObject.ItemGroup = "";
        $scope.InventoryObject.ItemGroup = obj.pcfCountFrq;
        $("#itemlistmodal").modal('hide');

        $("#locationlistmodal").modal('hide');
        $("#uomlistmodal").modal('hide');
        $("#Itemgrouplistmodal").modal('hide')
        $scope.IsItemGroupChose = true;
        CheckScopeBeforeApply()
    }
    $scope.onChangeUOMData = function () {
        $scope.InventoryObject.UomID = 0;
        CheckScopeBeforeApply();

    }

    $scope.LocationSetItemData = function (obj) {

        $scope.InventoryObject.Location = obj.LocationName;

        $scope.InventoryObject.LocationID = obj.LocationID;

        $("#itemlistmodal").modal('hide');

        $("#locationlistmodal").modal('hide');
        $("#uomlistmodal").modal('hide');
        CheckScopeBeforeApply()
    }



    $scope.UOMSetItemData = function (obj) {

        $scope.InventoryObject.Uom = obj.UnitOfMeasureName;


        $("#itemlistmodal").modal('hide');

        $("#locationlistmodal").modal('hide');
        $("#uomlistmodal").modal('hide');
        CheckScopeBeforeApply()
    }


    $scope.OnChangeUOMFunction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }


        if ($.trim($scope.SearchUOMValue) != "") {

            $scope.UOMSearching = true;

            $.ajax({

                type: "POST",
                url: serviceBase + "SearchUOMAutoComplete",
                contentType: 'application/json; charset=utf-8',

                dataType: 'json',

                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, SearchValue: $scope.SearchUOMValue }),
                error: function (err, textStatus, errorThrown) {
                    $scope.UOMSearching = false;
                    if (err.readyState == 0 || err.status == 0) {

                    }
                    else {


                        if (textStatus != "timeout") {


                            $scope.ShowErrorMessage("Unit of measure search", 2, 1, err.statusText);
                        }
                    }
                },

                success: function (data) {

                    if (data.SearchUOMAutoCompleteResult.Success == true) {

                        if (data.SearchUOMAutoCompleteResult != null && data.SearchUOMAutoCompleteResult.Payload != null) {
                            $scope.UOMSearching = false;
                            $scope.UOMSearchList = data.SearchUOMAutoCompleteResult.Payload;


                            if ($scope.UOMSearchList.length == 0)
                                $scope.isnouommsg = true
                            else
                                $scope.isnouommsg = false

                            CheckScopeBeforeApply()

                        }
                    }
                    else {
                        $scope.ShowErrorMessage("Unit of measure search", 1, 1, data.SearchUOMAutoCompleteResult.Message)


                    }



                }
            });
        }
        else {
            $scope.UOMSearchList = [];
            $scope.isnouommsg = true
            CheckScopeBeforeApply();
        }
    }

    $scope.TrimValue = function (value) {
        return $.trim(value);
    }

    $scope.OnChangeItemNameFunction = function () {



        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        if ($.trim($scope.SearchItemValue) != "") {
            $scope.ItemSearching = true;
            $.ajax({

                type: "POST",
                url: serviceBase + "SearchItems",
                contentType: 'application/json; charset=utf-8',

                dataType: 'json',

                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, SearchValue: $scope.SearchItemValue }),
                error: function (err, textStatus, errorThrown) {
                    $scope.ItemSearching = false;
                    if (err.readyState == 0 || err.status == 0) {

                    }
                    else {
                        if (textStatus != "timeout") {


                            $scope.ShowErrorMessage("Search Items", 2, 1, err.statusText);
                        }
                    }

                },

                success: function (data) {
                    if (data.SearchItemsResult.Success == true) {
                        if (data.SearchItemsResult != null && data.SearchItemsResult.Payload != null) {
                            $scope.ItemSearching = false;
                            $scope.SearchList = data.SearchItemsResult.Payload;

                            if ($scope.SearchList.length == 0)
                                $scope.isnoitemmsg = true;
                            else
                                $scope.isnoitemmsg = false;


                            CheckScopeBeforeApply()

                        }
                    }
                    else {
                        $scope.ShowErrorMessage("Search Items", 1, 1, data.SearchItemsResult.Message)

                    }

                }
            });
        }
        else {
            $scope.SearchList = [];
            $scope.isnoitemmsg = true;

            CheckScopeBeforeApply();
        }
    }




    $scope.OnChangeLocationNameFunction = function () {



        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        if ($.trim($scope.SearchLocationValue) != "") {

            //$scope.LocationSearching = true;
            //$.ajax({

            //    type: "POST",
            //    url: serviceBase + "SearchLocationAutoComplete",
            //    contentType: 'application/json; charset=utf-8',

            //    dataType: 'json',

            //    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, SearchValue: $scope.SearchLocationValue }),
            //    error: function () {

            //        $scope.LocationSearching = false;
            //        log.error('There is a problem with the service!');
            //    },

            //    success: function (data) {
            //         
            //        if (data.SearchLocationAutoCompleteResult != null && data.SearchLocationAutoCompleteResult.Payload != null) {
            //            $scope.LocationSearching = false;
            //            $scope.LocationSearchList = data.SearchLocationAutoCompleteResult.Payload;


            //            if ($scope.LocationSearchList.length == 0)
            //                $scope.isnolocationmsg = true
            //            else
            //                $scope.isnolocationmsg = false

            //            CheckScopeBeforeApply()

            //        }



            //    }
            //});
        }
        else {
            $scope.LocationSearchList = [];
            $scope.isnolocationmsg = true
            CheckScopeBeforeApply()
        }
    }





    $scope.GetLocalStoargeVarID = function (id) {
        return "Inv_" + id;
    }

    $scope.GetCustomItemDivID = function (id) {
        return "#CustomItem_" + id;
    }


    $scope.GetCustomActivityDivID = function (id) {
        return "#CustomItem_" + id;
    }




    $scope.IsRequired = function (id, type) {
        var _CustomFieldArray = [];
        switch (type) {
            case 1:
                _CustomFieldArray = $scope.CustomItemDataList;
                break;
            case 2:
                _CustomFieldArray = $scope.CustomActivityDataList;
                break;

            default:

        }


        for (var i = 0; i < _CustomFieldArray.length; i++) {
            if (_CustomFieldArray[i].cfdIsRequired == true && _CustomFieldArray[i].cfdID == id) {
                return true;
            }
        }

        return false;

    }
    $scope.CheckRequiredField = function () {

        if ($scope.InventoryObject.Location == "" || $scope.InventoryObject.Uom == "") {
            return true;

        }

        return false;
    }

    $scope.CheckCustomRequiredFields = function () {


        for (var i = 0; i < $scope.InventoryObject.CustomPartData.length; i++) {

            if ($scope.IsRequired($scope.InventoryObject.CustomPartData[i].CfdID, 1) == true && $scope.InventoryObject.CustomPartData[i].Value == "") {
                return true;
            }

        }
        for (var i = 0; i < $scope.InventoryObject.CustomTxnData.length; i++) {
            if ($scope.IsActiveTransactionField($scope.InventoryObject.CustomTxnData[i].CfdID) == true && $scope.IsRequired($scope.InventoryObject.CustomTxnData[i].CfdID, 2) == true && $scope.InventoryObject.CustomTxnData[i].Value == "") {
                return true;
            }
        }

        return false;
    }


    $scope.resetObject = function () {
        $scope.InventoryObject = {
            IsFullPermission: true, AutoID: false, PID: 0, ItemID: "", Description: "", Quantity: "", Uom: "units", UomID: 0, Location: "In Stock", lZone: "", LocationID: 0, UniqueTag: "", Cost: 0,
            UpdateDate: "/Date(1320825600000-0800)/", Status: "", ItemGroup: "", UniqueDate: null, UnitDate2: null, UnitNumber1: "", UnitNumber2: "", UnitTag2: "",
            UnitTag3: "", CustomPartData: [], CustomTxnData: []
        };
        $scope.ImageList = [];

        // $("#defaultimg").remove();

        //if ($scope.IsAvailableMyInventoryColumn('Image') == true) {

        //    $('#list321').html('<img id="defaultimg" ng-click="getstep(9,\&#39;Image\&#39;)" style="height:80px; width:80px; border:1px solid #ccc;" src="img/default.png" alt="Alternate Text">');
        //}
        //else {
        //    $('#list321').html('<img id="defaultimg" style="height:80px; width:80px; border:1px solid #ccc;" src="img/na.jpg" alt="Alternate Text">');

        //}

        //$('#list123').html('');
        CheckScopeBeforeApply();
    }

    $scope.addinventory = function () {
        if ($scope.IsItemChose == true) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

       


        $('#addinventories').addClass("disabled");
        $('#addinventories').find(".fa").addClass("fa-spin");


        var _TempObj = $scope.InventoryObject;

        var ImageData = $("#list123").find("img").attr("src");
        $.each(_TempObj, function (datakey, datavalue) {

            if (datakey != "CustomPartData" && datakey != "CustomTxnData") {
                if (datakey == "ItemID" && _TempObj.AutoID == true) {


                    datakey = "Inv_" + datakey;
                    localStorageService.set(datakey, "");

                }
                else {
                    datakey = "Inv_" + datakey;
                    localStorageService.set(datakey, "");
                    localStorageService.set(datakey, datavalue);
                }

            }

            else {
                if (datavalue.length > 0) {
                    for (var i = 0; i < datavalue.length; i++) {

                        datakey = "Inv_" + datavalue[i].CfdID;
                        localStorageService.set(datakey, "");
                        localStorageService.set(datakey, datavalue[i].Value);

                    }

                }
            }
        });


        if ($.trim($scope.InventoryObject.ItemID) == "") {
            $scope.InventoryObject.AutoID = true;
            $scope.InventoryObject.ItemID = "Automated";
        }
        if ($scope.InventoryObject.UnitNumber1 == "") {
            $scope.InventoryObject.UnitNumber1 = null;
        }
        if ($scope.InventoryObject.UnitNumber2 == "") {
            $scope.InventoryObject.UnitNumber2 = null;
        }
        $scope.InventoryObject.Quantity = $scope.InventoryObject.Quantity == "" ? 0 : $scope.InventoryObject.Quantity;
        var _updateDateval = $scope.InventoryObject.UniqueDate;

        if (_updateDateval != null && _updateDateval != "") {
            var wcfDateStr123 = null;
            var dsplit1 = _updateDateval.split("-");

            var d122 = new Date(dsplit1[0], dsplit1[1] - 1, dsplit1[2]);

            var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), 0, 0, 0, 0))

            d122.setDate(d122.getDate() + _genVar);
            var d1123 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), 0, 0, 0, 0))
            wcfDateStr123 = d122.toMSJSON();

            $scope.InventoryObject.UniqueDate = wcfDateStr123;
        }
        else {
            $scope.InventoryObject.UniqueDate = null;
        }



        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();




        var _updatedate = new Date(year, month, day);
        if (_genVar == 0) {

            _updatedate.setDate(_updatedate.getDate() + 1);
        }
        else {

            _updatedate.setDate(_updatedate.getDate());
        }
        var _d1122 = new Date(Date.UTC(_updatedate.getFullYear(), _updatedate.getMonth() - 1, _updatedate.getDate(), 0, 0, 0, 0))

        var wcfDateStrUpd = _d1122.toMSJSON();


        var _updateDateval1 = $scope.InventoryObject.UnitDate2;

        $scope.InventoryObject.UpdateDate = wcfDateStrUpd;

        if (_updateDateval1 != null && _updateDateval1 != "") {

            var wcfDateStr1234 = null;
            var dsplit12 = _updateDateval1.split("-");

            var d1222 = new Date(dsplit12[0], dsplit12[1] - 1, dsplit12[2]);

            d1222.setDate(d1222.getDate() + _genVar);
            var d1122 = new Date(Date.UTC(d1222.getFullYear(), d1222.getMonth(), d1222.getDate(), 0, 0, 0, 0))

            wcfDateStr1234 = d1222.toMSJSON();

            $scope.InventoryObject.UnitDate2 = wcfDateStr1234;




        }
        else {
            $scope.InventoryObject.UnitDate2 = null;
        }
        var _sum = 0;

      
        var _toSendImages =[]
        _toSendImages= angular.copy($scope.ImageList);

      

        for (var i = 0; i < _toSendImages.length; i++) {

            if (_toSendImages[i].bytestring != null && _toSendImages[i].bytestring != undefined) {
                _toSendImages[i].bytestring = removePaddingCharacters(_toSendImages[i].bytestring);
                if (_toSendImages[i].size != null && _toSendImages[i].size != undefined)
                {
                    _sum = _sum + parseFloat(_toSendImages[i].size);
                }

              
            }

        }

        //  log.success("Total Image after" + _toSendImages.length)

        if (_sum > 5000000) {
            log.warning("You are trying to upload more than one image, it may take some time to upload, please be patient.")
        }


        ShowWaitingInv();
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'AddInventoryData',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
             
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Data": $scope.InventoryObject, "ImageList": _toSendImages }),
              // data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Data": $scope.InventoryObject }),
              success: function (response) {
                  if (response.AddInventoryDataResult.Success == true) {

                      //  log.success("New Inventory Added Successfully.")

                      ShowSuccess("Saved");

                      if (_toSendImages.length > 0)
                      {
                          var _tempArray = []
                          _tempArray = _toSendImages;


                          // log.info("Image upload started it will continue in backend you can do other work.")
                          //  $scope.UploadImage(response.AddInventoryDataResult.Payload, _tempArray);
                      }
                      ImageListAndroid = [];

                      // $scope.resetObject();

                      $scope.movetolist();
                      // $location.path('/inventory');

                      CheckScopeBeforeApply()
                  }
                  else {
                      $scope.ShowErrorMessage("New Inventory", 3, 1, response.AddInventoryDataResult.Message)


                  }
                  HideWaitingInv();

                  $('#addinventories').removeClass("disabled");
                  $('#addinventories').find(".fa").removeClass("fa-spin");
              },
              fail: function (jqXHR, textStatus, errorThrown) {
                  console.log("jqxhr");
                  console.log(jqXHR);
              },
              error: function (err, textStatus, errorThrown) {
                  if (err.readyState == 0 || err.status == 0) {

                  }
                  else {
                      if (textStatus != "timeout") {

                          HideWaitingInv();

                          $scope.ShowErrorMessage("New Inventory", 2, 1, err.statusText);

                          $scope.Inventoryerrorbox(errorThrown);


                      }
                  }
                  $('#addinventories').removeClass("disabled");
                  $('#addinventories').find(".fa").removeClass("fa-spin");

              }
          });


        }
        else {
            log.error("Please select an item from available items list, you are not authorized to create new item.")
        }
    }

    $scope.Inventoryerrorbox = function (error) {

        $("#Inventoryerror").modal('show');
        $("#errortext").html(error)

    }

    $scope.MylogOut = function () {

        $("#modalerror").modal('hide');
        $("#Inventoryerror").modal('hide');
        $location.path('/login');
    }


    function ConverttoMsJsonDate(_DateValue) {

        var _date = angular.copy(_DateValue);

        var dsplit1 = _date.split("/");
        var now = new Date(dsplit1[2], dsplit1[0] - 1, dsplit1[1]);

        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);

        var today = now.getFullYear() + "-" + (month) + "-" + (day);

        return today;
    }
    $scope.CheckCustomFields = function (Type) {
        var _returnVar = false;
        switch (Type) {
            case 1:

                for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
                    if ($scope.IsAvailableMyInventoryColumn($scope.CustomItemDataList[i].ColumnMap) == true) {
                        _returnVar = true;
                        break;
                    }
                    else {
                        _returnVar = false;
                    }
                }

                return _returnVar;
                break;
            case 2:
                for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {

                    if ($scope.IsActiveTransactionField($scope.CustomActivityDataList[i].cfdID) == true) {
                        _returnVar = true;
                        break;
                    }
                    else {
                        _returnVar = false;
                    }
                }

                return _returnVar;
                break;
            default:

        }
        return _returnVar;
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

    $scope.GetItemColumn = function (columnMap) {
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == columnMap) {
                return $scope.CustomItemDataList[i];

            }
        }
    }

    $scope.itemlist = function () {

        $("#locationlistmodal").modal('hide');

        $("#itemlistmodal").modal('show');

        $scope.SearchList = [];
        $scope.SearchItemValue = "";
        $scope.isnoitemmsg = false
        $('html,body').animate({ scrollTop: 0 }, 800);

    }

    $scope.UOMlist = function () {

        $("#itemlistmodal").modal('hide');
        $("#locationlistmodal").modal('hide');
        $("#uomlistmodal").modal('show');
        $scope.UOMSearchList = [];
        $scope.SearchUOMValue = "";
        $scope.isnoUOMmsg = false
        $('html,body').animate({ scrollTop: 0 }, 800);


    }

    $scope.locationlist = function () {

        $("#itemlistmodal").modal('hide');
        $("#locationlistmodal").modal('show');

        $scope.LocationSearchList = angular.copy($scope.LocationList);
        CheckScopeBeforeApply();
        $scope.SearchLocationValue = "";
        $scope.isnolocationmsg = false
        $('html,body').animate({ scrollTop: 0 }, 800);


    }





    $scope.GetAllData = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllData',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ConsidermobileOrder": true }),
              success: function (response) {

                  if (response.GetAllDataResult.Success == true) {



                       

                      var _TempArray = response.GetAllDataResult.Payload;

                      // MY inventory column region
                      var _TempArrayMyInventory = response.GetAllDataResult.Payload[0].MyInventoryColumns;
                      var _tempData=[];
                      for (var i = 0; i < _TempArrayMyInventory.length; i++) {
                          var _ColName = _TempArrayMyInventory[i].ColumnName.split("#");
                          _TempArrayMyInventory[i].ColumnName = _ColName[0];
                          _tempData.push(_TempArrayMyInventory[i]);
                      }

                      CheckScopeBeforeApply()


                      // Custom Item Field 
                      $scope.CustomItemDataList = response.GetAllDataResult.Payload[0].CustomItemField;
                      CheckScopeBeforeApply();

                      for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
                          var _defaultValue = angular.copy($scope.CustomItemDataList[i].cfdDefaultValue);
                          if ($scope.CustomItemDataList[i].cfdDataType == "datetime") {
                              if (_defaultValue != null && _defaultValue != "") {
                                  $scope.CustomItemDataList[i].cfdDefaultValue = ConverttoMsJsonDate(_defaultValue);
                              }
                          }
                          else if ($scope.CustomItemDataList[i].cfdDataType == "currency" || $scope.CustomItemDataList[i].cfdDataType == "number") {
                              if (_defaultValue != null && _defaultValue != "") {
                                  var _myDefault = parseFloat(_defaultValue);
                                  if (!isNaN(_myDefault)) {
                                      $scope.CustomItemDataList[i].cfdDefaultValue = _myDefault;

                                  }
                              }
                          }
                         // $scope.InventoryObject.CustomPartData.push({ CfdID: $scope.CustomItemDataList[i].cfdID, Value: $scope.CustomItemDataList[i].cfdDefaultValue, DataType: $scope.CustomItemDataList[i].cfdDataType });
                      }
                      CheckScopeBeforeApply();


                      for (var i = 0; i < _tempData.length; i++) {

                          var _obj = {
                              cfdName: "",
                              cfdID: 0,
                              cfdDataType: "",
                              cfdComboValues: [],
                              CfValue: "",
                              ColumnName: _tempData[i].ColumnName,
                              RowID: _tempData[i].RowID,
                              ColumnLabel: _tempData[i].ColumnLabel,
                              Show: _tempData[i].Show,
                              Sort: _tempData[i].Sort,
                              mobileorder: _tempData[i].mobileorder,
                              Required: _tempData[i].Required
                          }

                          var _CustomObj = $scope.GetCustomColumn(_tempData[i].ColumnName);

                          if (_CustomObj != undefined && _CustomObj != {})
                          {
                              _obj.cfdName = _CustomObj.cfdName;
                              _obj.cfdID = _CustomObj.cfdID;
                              _obj.cfdDataType = _CustomObj.cfdDataType;
                              _obj.cfdComboValues = _CustomObj.cfdComboValues;
                              _obj.CfValue = _CustomObj.CfValue;


                              $scope.InventoryObject.CustomPartData.push({ CfdID: _CustomObj.cfdID, Value: _CustomObj.cfdDefaultValue, DataType: _CustomObj.cfdDataType });
                          }

                          $scope.MyinventoryFields.push(_obj);
                      }

                         
                          // Custom Activity Field 

                       

                          $scope.CustomActivityDataList = response.GetAllDataResult.Payload[0].CustomActivityField;
                          CheckScopeBeforeApply()

                          for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {

                              var _defaultValue = angular.copy($scope.CustomActivityDataList[i].cfdDefaultValue);
                              if ($scope.CustomActivityDataList[i].cfdDataType == "datetime") {
                                  if (_defaultValue != null && _defaultValue != "") {
                                      $scope.CustomActivityDataList[i].cfdDefaultValue = ConverttoMsJsonDate(_defaultValue);
                                  }
                              }
                              else if ($scope.CustomActivityDataList[i].cfdDataType == "currency" || $scope.CustomActivityDataList[i].cfdDataType == "number") {
                                  if (_defaultValue != null && _defaultValue != "") {
                                      var _myDefault = parseFloat(_defaultValue);
                                      if (!isNaN(_myDefault)) {
                                          $scope.CustomActivityDataList[i].cfdDefaultValue = _myDefault;

                                      }
                                  }
                              }
                              $scope.InventoryObject.CustomTxnData.push({ CfdID: $scope.CustomActivityDataList[i].cfdID, Value: $scope.CustomActivityDataList[i].cfdDefaultValue, DataType: $scope.CustomActivityDataList[i].cfdDataType });
                          }
                          CheckScopeBeforeApply()
                          // Unit Of Measure
                          $scope.UOMList = response.GetAllDataResult.Payload[0].UnitOfMeasure;
                          CheckScopeBeforeApply()
                          // Status
                          $scope.StatusList = response.GetAllDataResult.Payload[0].Status;
                          CheckScopeBeforeApply();
                          $scope.getuom();
                          $scope.getlocation();

                          $scope.getItemgroup();

                          AfterLoadedData();
                      }
                  else {
                      $scope.ShowErrorMessage("Get All look ups", 1, 1, response.GetAllDataResult.Message)

                  }

              },
              error: function (err, textStatus, errorThrown) {
                  if (err.readyState == 0 || err.status == 0) {

                  }
                  else {
                      if (textStatus != "timeout") {
                          $scope.ShowErrorMessage("Getting look ups", 2, 1, err.statusText);
                      }
                  }


              }
          });
    }
    $scope.getItemgroup = function () {

        $scope.ItemgroupLoaded = false;


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetItemGroup',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   $scope.ItemgroupLoaded = true;


                   if (response.GetItemGroupResult.Success == true) {



                       $scope.Itemgrouplist = response.GetItemGroupResult.Payload;


                       $scope.ItemgroupSearchlist = angular.copy($scope.Itemgrouplist);

                   }
                   else {
                       $scope.ShowErrorMessage("Get Item group", 1, 1, response.GetItemGroupResult.Message)

                   }
                   $scope.$apply();
               },
               error: function (err) {
                   $scope.ItemgroupLoaded = true;
                   $scope.ShowErrorMessage("Get Item group", 2, 1, err.statusText);

               }
           });

    }

    $scope.GetMyinventoryColumns = function () {


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
                
                      var _TempArray = response.GetMyInventoryColumnsResult.Payload;

                      for (var i = 0; i < _TempArray.length; i++) {
                          var _ColName = _TempArray[i].ColumnName.split("#");
                          _TempArray[i].ColumnName = _ColName[0];
                          if (_TempArray[i].Show == "True") {
                              $scope.MyinventoryFields.push(_TempArray[i]);
                          }
                      }
                      CheckScopeBeforeApply()
                  }
                  else {
                      $scope.ShowErrorMessage("My inventory Columns", 1, 1, response.GetMyInventoryColumnsResult.Message)

                  }

              },
              error: function (err, textStatus, errorThrown) {
                  if (err.readyState == 0 || err.status == 0) {

                  }
                  else {
                      if (textStatus != "timeout") {
                          console.log(err);
                          $scope.ShowErrorMessage("My inventory Columns", 2, 1, err.statusText);
                      }
                  }


              }
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
                   if (response.LoginResult.Success == true) {
                       $scope.StatusList = response.GetStatusResult.Payload;
                       CheckScopeBeforeApply()
                   }
                   else {
                       $scope.ShowErrorMessage("Getting Status", 1, 1, response.GetStatusResult.Message)

                   }
       
               },
               error: function (err, textStatus, errorThrown) {
                   if (err.readyState == 0 || err.status == 0) {

                   }
                   else {
                       if (textStatus != "timeout") {
                           $scope.ShowErrorMessage("Getting Status", 2, 1, err.statusText);
                       }
                   }

               }
           });

    }




    $scope.HighLightTerm = function (term, Text) {
        if ($.trim(term) != "") {

            var src_str = Text;
            var term = term;
            term = term.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
            var pattern = new RegExp("(" + term + ")", "gi");

            src_str = src_str.replace(pattern, "<mark>$1</mark>");
            src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</mark>$2<mark>$4");

            return src_str;
        }
        else {
            return Text;
        }
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
                       $scope.ShowErrorMessage("Getting UOMs", 1, 1, response.GetUnitsOfMeasureResult.Message)

                   }
                
               },
               error: function (err, textStatus, errorThrown) {
                   if (err.readyState == 0 || err.status == 0) {

                   }
                   else {
                       if (textStatus != "timeout") {
                           $scope.ShowErrorMessage("Getting UOMs", 2, 1, err.statusText);
                       }
                   }

               }
           });

    }

    $scope.getlocation = function () {
        $scope.LocationList = [];
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetLocations',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   if (response.GetLocationsResult.Success == true) {
                       $scope.LocationList = response.GetLocationsResult.Payload;
                       $scope.LocationSearchList = angular.copy($scope.LocationList);

                       $scope.UpdateLocationAndUOMList();
                       CheckScopeBeforeApply()
                   }

                   else {
                       $scope.ShowErrorMessage("Getting locations", 1, 1, response.GetLocationsResult.Message)

                   }

                   
               },
               error: function (err, textStatus, errorThrown) {
                   if (err.readyState == 0 || err.status == 0) {

                   }
                   else {
                       if (textStatus != "timeout") {


                           console.log(err);
                           $scope.ShowErrorMessage("Getting locations", 2, 1, err.statusText);
                       }
                   }


               }
           });

    }

    $scope.getitems = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetItems',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {

                   $scope.ItemList = response.GetItemsResult.Payload;
                   CheckScopeBeforeApply()
               },
               error: function (err, textStatus, errorThrown) {
                   if (err.readyState == 0 || err.status == 0) {

                   }
                   else {
                       if (textStatus != "timeout") {
                           log.error(err.statusText);
                       }
                   }
               }
           });

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
    $scope.IsActiveTransactionField = function (cfdid) {


        $scope.CurrentOperation = "Increase";
        for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
            if ($scope.CustomActivityDataList[i].cfdCustomFieldType == "Inventory" && $scope.CustomActivityDataList[i].cfdID == cfdid) {
                switch ($scope.CurrentOperation) {
                    case "Increase":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnAdd) {

                            return true;
                        }
                        break;
                    case "Decrease":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnSubtract) {
                            return true;
                        }
                        break;
                    case "Move":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnMove) {
                            return true;
                        }
                        break;
                    case "Apply":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnApply) {
                            return true;
                        }
                        break;
                    case "Update":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnStatus) {
                            return true;
                        }
                        break;
                    case "Convert":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnConvert) {
                            return true;
                        }
                        break;

                    default:
                        return true;
                        break;

                }
            }
        }
    }
    $scope.GetCustomDataField = function (Type) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }




        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetCustomFieldsData',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Type": Type }),
               success: function (response) {

                   if (response.LoginResult.Success == true) {
                  
                    


                       if (Type == 0) {
                           $scope.CustomItemDataList = response.GetCustomFieldsDataResult.Payload;

                           for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
                               $scope.InventoryObject.CustomPartData.push({ CfdID: $scope.CustomItemDataList[i].cfdID, Value: $scope.CustomItemDataList[i].cfdDefaultValue, DataType: $scope.CustomItemDataList[i].cfdDataType });
                           }

                       }
                       else if (Type == 1) {
                           $scope.CustomActivityDataList = response.GetCustomFieldsDataResult.Payload;


                           for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
                               $scope.InventoryObject.CustomTxnData.push({ CfdID: $scope.CustomActivityDataList[i].cfdID, Value: $scope.CustomActivityDataList[i].cfdDefaultValue, DataType: $scope.CustomActivityDataList[i].cfdDataType });
                           }

                           //  setTimeout(function () { $scope.swiperfunction(); }, 2000);


                           CheckScopeBeforeApply()


                       }

                       CheckScopeBeforeApply()
                   }
                   else {
                       $scope.ShowErrorMessage("Custom Field's data", 1, 1, response.GetCustomFieldsDataResult.Message)

                   }
               },
               error: function (err, textStatus, errorThrown) {
                   if (err.readyState == 0 || err.status == 0) {

                   }
                   else {
                       if (textStatus != "timeout") {
                           $scope.ShowErrorMessage("Custom Field's data", 2, 1, err.statusText);
                       }
                   }

                   //$scope.InventoryObject.Location = 678030;
               }
           });
    }

    $scope.OpenBox = function () {

        $("#myModalforlist").modal("show");
        // $scope.capturePhoto();
        //  $("#files").trigger("click");
    }

    $scope.triggerFileClick = function () {
        $("#files").trigger("click");
        $("#myModalforlist").modal("hide");
    }


    $scope.OpenBoxAndroid = function () {
        $("#myModalforlist").modal("show");
    }



    $("#files").on('change', function (event) {
        $scope.handleFileSelect(event);
    });


    $scope.RemoveFromImageList = function (ID) {
        for (var i = 0; i < $scope.ImageList.length; i++) {
            if ($scope.ImageList[i].ImageID == ID) {
                $scope.ImageList.splice(i, 1);
                break;
            }
        }

    }

    $scope.handleFileSelect = function (evt) {

         
        var files = evt.target.files;
        FileName = "";
        StreamData = "";
        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {

                var id = randomString(5, '0123456789');
                _ImgObj.ImageID = id;

                var crossicon = '<a class="btn btn-danger removeImage" altid="' + id + '" onclick="removeImage(' + id + ')"><i class="fa fa-times"></i></a>';
                var compilehtml = $compile(crossicon)($scope);


                return function (e) {
                    // Render thumbnail.
                    FileName = theFile.name;
                    StreamData = e.target.result;
                    _ImgObj.FileName = FileName;
                    _ImgObj.bytestring = e.target.result;
                    _ImgObj.Size = theFile.size;


                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }

        setTimeout(function () {

            $scope.ImageList.push(_ImgObj);
            CheckScopeBeforeApply();


            $(".iteminfo").trigger("click;");

        }, 100);

    }

    $scope.onPhotoDataSuccessNew = function (imageData) {
        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }

        imageData = "data:image/jpeg;base64," + imageData;

        var id = randomStringNew(5, '0123456789');
        _ImgObj.ImageID = id;

        $(".viewimage").show();
        $("#myModalforlist").modal("hide");


        _ImgObj.FileName = "IphoneCapture";
        _ImgObj.bytestring = imageData;
        $scope.ImageList.push(_ImgObj);
        CheckScopeBeforeApply();

        // log.success("Images captured length"+$scope.ImageList.length);

    }

    $scope.onFail = function (message) {

        log.error('Failed because: ' + message);
    }
    $scope.capturePhotoNew = function () {
        navigator.camera.getPicture($scope.onPhotoDataSuccessNew, $scope.onFail, {
            quality: 50,
            targetWidth: 120,
            targeHeight: 120,
            correctOrientation: true,
            destinationType: destinationType.DATA_URL,
            saveToPhotoAlbum: true,
        });
    }

    $scope.viewimages = function () {
        $("#imagemodal").modal('show');
    }


    function removeImage(_this) {

        $("#" + _this).each(function () {

            $(this).parent("span").remove();
        });

        for (var i = 0; i < $scope.ImageList.length; i++) {
            if ($scope.ImageList[i].ImageID == _this) {
                $scope.ImageList.splice(i, 1);
                break;
            }
        }


        if ($scope.ImageList.length == 0) {
            $("#imagemodal").modal('hide');

            $(".viewimage").hide();

        }


        removeImage(_this)

    }

    function init() {
        $("#slide-out-left").hide();
        $scope.GetAllData();

        $scope.IsItemLibrary = $scope.checkpermission('URL:Manage/Item');
        if ($scope.IsItemLibrary == true && $scope.IsActiveItemLibrary == true) {

            $scope.IsItemChose = true;
        }
        else {
            $scope.IsItemChose = false;
        }

        $scope.IsItemGroupLibrary = $scope.checkpermission('URL:Manage/ItemGroup');
        if ($scope.IsItemGroupLibrary == true && $scope.IsActiveItemGroupLibrary == true) {

            $scope.IsItemGroupChose = true;
        }
        else {
            $scope.IsItemGroupChose = false;
        }

        $scope.IsLocationLibrary = $scope.checkpermission('URL:Manage/Location');
        $scope.IsUOMLibrary = $scope.checkpermission('URL:Manage/UnitOfMeasure');
        $scope.IsStatusLibrary = $scope.checkpermission('URL:Manage/Status');
        CheckScopeBeforeApply();


    }



    function ConvertDatetoDate(_stringDate) {
        var today = new Date(_stringDate);
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        today = yyyy + '-' + mm + '-' + dd;

        return today;
    }

    init();
    $scope.GetValueFromArrray = function (ItemNumber) {
        if ($.trim(ItemNumber) != "") {

            for (var i = 0; i < $scope.ItemList.length; i++) {
                if ($scope.ItemList[i].ItemNumber == ItemNumber) {
                    return $scope.ItemList[i].ItemID;
                }

            }
        }
        return "";
    }
    $scope.GetLocaValuefromArray = function (Location) {
        if ($.trim(Location) != "") {

            for (var i = 0; i < $scope.LocationList.length; i++) {
                if ($scope.LocationList[i].LocationName == Location) {
                    return $scope.LocationList[i].LocationID;
                }

            }
        }
        return "";

    }







    $scope.GetLocaTextfromArray = function (Location) {
        if ($.trim(Location) != "") {

            for (var i = 0; i < $scope.LocationList.length; i++) {
                if ($scope.LocationList[i].LocationID == Location) {
                    return $scope.LocationList[i].LocationName;
                }

            }
        }
        return "";

    }


    $scope.GetUOMfromArray = function (UOMID) {
        if ($.trim(UOMID) != "") {

            for (var i = 0; i < $scope.UOMList.length; i++) {
                if ($scope.UOMList[i].UnitOfMeasureID == UOMID) {
                    return $scope.UOMList[i].UnitOfMeasureName;
                }

            }
        }
        return "";
    }


    $scope.ScanNewsearch = function () {



        $scope.SearchItemValue = "";
        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan(function (result) {

            $scope.SearchItemValue = result.text;

            CheckScopeBeforeApply()

            setTimeout(function () {
                $scope.OnChangeItemNameFunction();
                CheckScopeBeforeApply()
            }, 500);

            vibrate()




        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.ScanLocationsearch = function () {
        $scope.SearchLocationValue = "";
        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan(function (result) {

            $scope.SearchLocationValue = result.text;

            CheckScopeBeforeApply()

            setTimeout(function () {
                $scope.OnChangeLocationNameFunction();
                CheckScopeBeforeApply()
            }, 100);

            vibrate()


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.ScanUOMsearch = function () {
        $scope.SearchLocationValue = "";
        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan(function (result) {

            $scope.SearchUOMValue = result.text;

            CheckScopeBeforeApply()

            setTimeout(function () {
                $scope.OnChangeUOMFunction();
                CheckScopeBeforeApply()
            }, 100);

            vibrate()


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.IsinavailableInventoryField = function (field) {
        var _FieldArray = ["iReqValue", "iUnitTag2", "iUnitTag3", "iUniqueDate", "iUnitDate2", "iUnitNumber1", "iUnitNumber2", "pDescription", "pPart", "lLoc", "uomUOM", "iQty", "iStatusValue", "pCountFrq", "lZone"]



        for (var i = 0; i < _FieldArray.length; i++) {
            if (_FieldArray[i] == field) {
                return true;
            }
        }
        return false;
    }

    function GetFieldType(fieldName) {
        switch (fieldName) {



            case "iUniqueDate":
            case "iUnitDate2":
                return 3;
                break;
            case "iQty":
            case "iUnitNumber1":
            case "iUnitNumber2":
                return 1;
                break;
            default:
                return 4;
                break;
        }
    }
    $scope.ScanNew = function () {


        var _id = "#";


        var ControlID = $scope.CurrentActiveField;
        var _IsActiveScan = true;
        switch (ControlID) {
            case "iStatusValue":
                _IsActiveScan = $scope.IsActiveStatusLibrary && $scope.IsStatusLibrary;
                
               
                
                break;
            case "lLoc":
                _IsActiveScan = $scope.IsActiveLocationLibrary && $scope.IsLocationLibrary;
                break;
            case "uomUOM":
                _IsActiveScan = $scope.IsActiveUOMLibrary && $scope.IsUOMLibrary;
                    break;
            case "pCountFrq":
                _IsActiveScan = $scope.IsActiveItemGroupLibrary && $scope.IsItemGroupLibrary;
                break;
            default:
                _IsActiveScan = true;

        }

        if (_IsActiveScan == true) {

            var scanner = cordova.plugins.barcodeScanner;

            scanner.scan(function (result) {

                var resultvalue = result.text;
                var _fieldType = GetFieldType(ControlID);
                if (_fieldType != 4) {

                    resultvalue = $scope.Validation(resultvalue, _fieldType) == true ? resultvalue : "";
                }
                if (resultvalue != "") {
                    switch (ControlID) {
                        case "pPart":
                            _id = "#ItemName";


                            $scope.InventoryObject.ItemID = resultvalue;


                            break;
                        case "lLoc":
                            _id = "#Location";
                            $scope.InventoryObject.Location = resultvalue;
                            break;
                        case "uomUOM":
                            _id = "#UOM";
                            $scope.InventoryObject.Uom = resultvalue;
                            break;
                        case "iQty":
                            _id = "#iQty";
                            $scope.InventoryObject.Quantity = resultvalue;
                            break;
                        case "iStatusValue":
                            $scope.InventoryObject.iStatusValue = resultvalue;
                            break;
                        case "pDescription":
                            _id = "#pDescriptionForm";
                            $scope.InventoryObject.Description = resultvalue;
                            break;
                        case "iReqValue":
                            _id = "#UniqueTag";
                            $scope.InventoryObject.UniqueTag = resultvalue;
                            break;
                        case "iUnitTag2":
                            _id = "#UnitTag2";
                            $scope.InventoryObject.UnitTag2 = resultvalue;
                            break;
                        case "iUnitTag3":
                            _id = "#UnitTag3";
                            $scope.InventoryObject.UnitTag3 = resultvalue;
                            break;
                        case "iUniqueDate":
                            _id = "#UniqueDate";
                            resultvalue = ConvertDatetoDate(resultvalue);
                            $scope.InventoryObject.UniqueDate = resultvalue;
                            break;
                        case "iUnitDate2":
                            _id = "#UnitDate2";
                            resultvalue = ConvertDatetoDate(resultvalue);
                            $scope.InventoryObject.UnitDate2 = resultvalue;
                            break;
                        case "iUnitNumber1":
                            _id = "#UnitNumber1";
                            $scope.InventoryObject.UnitNumber1 = resultvalue;
                            break;
                        case "iUnitNumber2":
                            _id = "#UnitNumber2";
                            $scope.InventoryObject.UnitNumber2 = resultvalue;
                            break;
                        case "pCountFrq":
                            _id = "#itemgroup";
                            $scope.InventoryObject.ItemGroup = resultvalue;
                            break;
                        case "lZone":
                            _id = "#lZone";
                            $scope.InventoryObject.lZone = resultvalue;
                            break;
                        default:

                    }



                    $(_id).val(resultvalue);

                    if (deviceType == 'iPhone') {

                        mySwiper.swipeNext();
                    }
                    else {
                        $(".arrow-right").trigger("click");
                    }



                    CheckScopeBeforeApply();


                }

                else {

                    $scope.ShowScanError(_fieldType);
                }



                vibrate();



            }, function (error) {
                log.error("Scanning failed: ", error);
            });
        }
        else {
            $scope.locked();
        }
    }
    $scope.ShowScanError = function (type) {
        switch (type) {
            case 1:
                log.error("Scanned value is not proper number value.");
                break;
            case 2:
                log.error("Scanned value is not proper boolean value.");
                break;
            case 3:
                log.error("Scanned value is not proper date value.");
                break;
            default:
                break;

        }
    }
    $scope.GetCustomDataType = function (Type) {
        switch (Type) {
            case "string":
                return 4;
                break;
            case "date":
            case "datetime":
                return 3;
                break;
            case "checkbox":
                return 2;
                break;
            case "number":
            case "money":
            case "decimal":
            case "currency":
                return 1;
                break;
            default:
                return 4;
                break;



        }
    }
    $scope.ScanNewCustom = function () {

        var _id = "#" + _colid;

        var _colarray = _colid.split("_");
        var ControlID = $scope.CurrentActiveField;
        var scanner = cordova.plugins.barcodeScanner;


        scanner.scan(function (result) {


            var resultvalue = result.text;

            var _fieldType = $scope.GetCustomDataType($scope.CurrentActiveFieldDatatype);
            if (_fieldType != 4) {

                resultvalue = $scope.Validation(resultvalue, _fieldType) == true ? resultvalue : "";
            }

            if (resultvalue != "") {


                var _Arraytoupdate = [];
                var _Type = _colarray[0];
                if (_Type != null && _Type != undefined && _Type != "") {

                    if ($scope.CurrentActiveFieldDatatype != null && $scope.CurrentActiveFieldDatatype != undefined) {

                        if ($scope.CurrentActiveFieldDatatype == "date" || $scope.CurrentActiveFieldDatatype == "datetime") {
                            resultvalue = ConvertDatetoDate(resultvalue);
                        }

                    }
                    if (_Type == "CustomItem") {


                        for (var i = 0; i < $scope.InventoryObject.CustomPartData.length; i++) {

                            if ($scope.InventoryObject.CustomPartData[i].CfdID == _colarray[1]) {
                                $scope.InventoryObject.CustomPartData[i].Value = resultvalue;
                                break;

                            }

                        }
                    }
                    else if (_Type == "CustomActivity") {


                        for (var i = 0; i < $scope.InventoryObject.CustomTxnData.length; i++) {

                            if ($scope.InventoryObject.CustomTxnData[i].CfdID == _colarray[1]) {
                                $scope.InventoryObject.CustomTxnData[i].Value = resultvalue;
                                break;

                            }

                        }
                    }
                }



                $(_id).val(resultvalue);

                mySwiper.swipeNext();

                CheckScopeBeforeApply();


            }

            else {

                $scope.ShowScanError(_fieldType);
            }


            vibrate()



        }, function (error) {
            log.error("Scanning failed: ", error);
        });

    }
    function removePaddingCharacters(bytes) {
        bytes = bytes.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");

        return bytes;
    }
    //$scope.UploadImage = function (txnID,ImageList) {

    //    var authData = localStorageService.get('authorizationData');
    //    if (authData) {
    //        $scope.SecurityToken = authData.token;
    //    }


    //        $.ajax
    //          ({
    //              type: "POST",
    //              url: serviceBase + 'UploadImage',
    //              contentType: 'application/json; charset=utf-8',
    //              dataType: 'text json',
    //              async: true,
    //              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ImageList": ImageList, "txnID": txnID }),
    //              success: function (response) {

    //                  if (response.UploadImageResult.Success == true)
    //                  {

    //                  log.success("Image has been uploaded success fully for last inventory record.");


    //                  CheckScopeBeforeApply()
    //                  }
    //else {

    //                          $scope.ShowErrorMessage("Upload image", 1, 1, response.UploadImageResult.Message)
    //}

    //              },
    //              error: function (err, textStatus, errorThrown) {
    //                  if (err.readyState == 0 || err.status == 0) {

    //                  }
    //                  else {
    //                      if (textStatus != "timeout") {
    //                          log.error(err.statusText);
    //                      }
    //                  }
    //              }
    //          });
        
    //}

    $scope.UpDownValue = function (value, IsUp) {
        if ($.trim($scope.InventoryObject.Quantity) == "") {

            $scope.InventoryObject.Quantity = 0;

        }

        switch (value) {
            case "Quantity":
                if (!IsUp) {
                    if ($scope.InventoryObject.Quantity > 0) {

                        $scope.InventoryObject.Quantity = $scope.InventoryObject.Quantity + (IsUp ? 1 : -1);
                    }
                }
                else if (IsUp) {
                    $scope.InventoryObject.Quantity = $scope.InventoryObject.Quantity + (IsUp ? 1 : -1);
                }
                break;
            default:

        }

        vibrate();
        playBeep();
    }


    $scope.movetoback = function () {


        bootbox.confirm("Are you sure to exit ?", function (result) {
            if (result) {

                $location.path('/FindItems');

                CheckScopeBeforeApply()

            }
        });

    }

    var mySwiper;


   

    $scope.changeNav = function () {

        if (deviceType != "Android" && deviceType != "null") {

            $("#myform .swiper-slide-active input:first").focus();
            $("#myform .swiper-slide-active select:first").focus();
            $("#myform .swiper-slide-active input:first").not("input[type='file']").trigger("click");
            $("#myform .swiper-slide-active input:first").not("input[type='file']").trigger("keypress");
        }
        else
        {
            //SoftKeyboard.hide();


            $cordovaKeyboard.close();

            if ($scope.CurrentActiveField != "Image") {

                if ($("#myform .swiper-slide-active select").length > 0 || $("#myform .swiper-slide-active input[type = 'checkbox']").length > 0) {

                }
                else {

                    if ($("#myform .swiper-slide-active input").length > 0) {
                        $("#myform .swiper-slide-active input:first").focus();
                        //  SoftKeyboard.show();
                        $cordovaKeyboard.show();
                       
                    }
                }
            }
            //
        }
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    $scope.slidenumber = function (slidenumber) {

        switch (slidenumber) {
            case 0:
                $scope.scanfieldID = "pPartForm"
                break;
            case 1:
                $scope.scanfieldID = "pDescriptionForm"
                break;
            case 2:
                $scope.scanfieldID = "forquantity";
                break;
            case 3:
                $scope.scanfieldID = "Location"
                break;
            case 4:
                $scope.scanfieldID = "";
                break;
            case 5:

                $scope.scanfieldID = "";
            case 6:
                $scope.scanfieldID = "";
                break;
            case 7:
                $scope.scanfieldID = "";
                break;
            case 8:
                $scope.scanfieldID = "";
                break;

            case 9:
                $scope.scanfieldID = "laststep";
                break;
            default:
                $scope.scanfieldID = "";
                break;

        }

        CheckScopeBeforeApply()
    }


    $scope.getstep = function (currentstep, ColumnName) {


        if (ColumnName != "" && ColumnName != null) {
            $(".myCols").each(function () {

                if ($(this).attr("data-column") == ColumnName) {
                    mySwiper.swipeTo($(this).index(), 1000, false);

                    $scope.slide = $(this).index();
                    $scope.CurrentCount = $(this).index();
                    $scope.CurrentActiveField = ColumnName;
                    CheckScopeBeforeApply();
                    return false;
                }

            });
        }
        else {
            mySwiper.swipeTo(currentstep);

        }

        $("#infomodal").modal('hide');

    }


    $scope.getstepCustom = function (Type, ColumnName) {
         
        if (ColumnName != "" && ColumnName != null) {

            if (Type == 1) {
                $(".CustomItemCols").each(function () {

                    if ($(this).attr("data-column") == ColumnName) {
                        mySwiper.swipeTo($(this).index(), 1000, false);

                        $scope.slide = $(this).index();
                        $scope.CurrentCount = $(this).index();
                        $scope.CurrentActiveField = ColumnName;
                        $scope.CurrentActiveFieldType = "Inventory";
                        CheckScopeBeforeApply();
                        return false;
                    }

                });

            }
            else if (Type == 2) {
                $(".CustomActivityCols").each(function () {

                    if ($(this).attr("data-column") == ColumnName) {
                        mySwiper.swipeTo($(this).index(), 1000, false);

                        $scope.slide = $(this).index();
                        $scope.CurrentCount = $(this).index();
                        $scope.CurrentActiveField = ColumnName;
                        $scope.CurrentActiveFieldType = "Activity";
                        CheckScopeBeforeApply();
                        return false;
                    }

                });

            }

        }
        else {
            mySwiper.swipeTo(0);

        }

        $("#infomodal").modal('hide');

    }


    $scope.$on('ngRepeatFinished', function () {


    });

    $scope.$on('ngRepeatFinished1', function () {



    });
    $scope.$on('ngRepeatFinished2', function () {



    });

    $scope.$on('ngRepeatFinished3', function () {


    });

    $scope.SetDefaultObjects = function () {

        $scope.InventoryObject.Uom = $scope.IsAvailableMyInventoryColumn('uomUOM') == false ? "units" : $scope.InventoryObject.Uom;
        $scope.InventoryObject.Location = $scope.IsAvailableMyInventoryColumn('lLoc') == false ? "In stock" : $scope.InventoryObject.Location;
        $scope.InventoryObject.Quantity = $scope.IsAvailableMyInventoryColumn('iQty') == false ? 1 : $scope.InventoryObject.Quantity;

        //$scope.UOMList
        //$scope.StatusList

        $scope.$apply();
    }


    $scope.UpdateLocationAndUOMList = function () {
        var _defaultUOM = { UnitOfMeasureID: "", UnitOfMeasureName: "units" };


        var _defaultLocation = { LocationName: "In Stock", LocationZone: "", LocationID: "" };
        if ($scope.UOMList.length > 0) {
            var _isAvailableUOM = false;
            for (var i = 0; i < $scope.UOMList.length; i++) {
                if ($.trim($scope.UOMList[i].UnitOfMeasureName) != "" && $scope.UOMList[i].UnitOfMeasureName.toLowerCase() == "units") {
                    _isAvailableUOM = true;
                    break;
                }
            }

            if (_isAvailableUOM == false) {
                $scope.UOMList.push(_defaultUOM);
                console.log($scope.UOMList);
            }

        }
        else {
            $scope.UOMList.push(_defaultUOM);
        }

        $scope.InventoryObject.Uom = "units";



        if ($scope.LocationList.length > 0) {
            var _isAvailableLocation = false;
            for (var i = 0; i < $scope.LocationList.length; i++) {
                if ($.trim($scope.LocationList[i].LocationName) != "" && $scope.LocationList[i].LocationName.toLowerCase() == "in stock") {

                    var myTag = $scope.LocationList[i].LocationZone;
                    if (myTag != undefined && myTag != null) {
                        $scope.InventoryObject.lZone = myTag;
                    }
                    else {
                        $scope.InventoryObject.lZone = "";
                    }
                    _isAvailableLocation = true;
                    break;
                }
            }

            if (_isAvailableLocation == false) {
                $scope.LocationList.push(_defaultLocation);
                console.log($scope.LocationList);
            }

        }
        else {
            $scope.LocationList.push(_defaultLocation);
        }

        $scope.InventoryObject.Location = "In Stock";

    }

    $scope.CheckSelectedValues = function (firstValue, secondValue) {
        if (firstValue != undefined && firstValue != null && firstValue != "") {
            firstValue = firstValue.toLowerCase();
        }

        if (secondValue != undefined && secondValue != null && secondValue != "") {
            secondValue = secondValue.toLowerCase();
        }

        if (firstValue == secondValue) {
            return true;
        }

        return false;
    }

    function AfterLoadedData() {
        $('.probeProbe').bootstrapSwitch('state', true);
        $(".iosbtn").show();
        $(".androidbtn").hide();
        //if (deviceType == 'iPhone') {
        //    $(".iosbtn").show()

        //}
        //else {
        //    $(".androidbtn").show()
        //    $(".iosbtn").hide()
        //}

        $(".swiper-container").show();


        $(".spinner").hide();
        setTimeout(function () {

            mySwiper = new Swiper('.swiper-container', {
                initialSlide: 0,
                speed: 500,
                effect: 'flip',

                allowSwipeToPrev: false,


                onSlideChangeEnd: function (swiperHere) {

                    $(".bknext").removeClass("darkblue");

                    setTimeout(function () {
                        $(".bknext").addClass("darkblue");
                    }, 300)


                    $scope.slide = swiperHere.activeIndex;
                    $scope.CurrentCount = swiperHere.activeIndex;
                    $scope.Totalslides = swiperHere.slides.length - 1;
                    var _colName = $(".swiper-slide-active").attr("data-column");
                    var _colType = $(".swiper-slide-active").attr("data-type");
                    _colid = $(".swiper-slide-active").attr("data-id");
                    var _fieldType = $(".swiper-slide-active").attr("field-type");

                    $scope.CurrentActiveField = _colName != undefined && _colName != "" ? _colName : "";
                    $scope.CurrentActiveFieldDatatype = _colType;
                    $scope.CurrentActiveFieldType = _fieldType == "activity" ? "Activity" : "Inventory";
                    CheckScopeBeforeApply();


                    var swiperPage = swiperHere.activeSlide();

                    $scope.slidenumber(swiperHere.activeIndex);


                    if (swiperHere.activeIndex != 3 && swiperHere.activeIndex != 6) {

                        $scope.changeNav();

                    }

                    else {

                        $cordovaKeyboard.close()

                        //  SoftKeyboard.hide();

                    }

                }

            });

         


            setTimeout(function () {
                var _TempcolName = $(".swiper-slide-active").attr("data-column");
                $scope.CurrentActiveField = _TempcolName != undefined && _TempcolName != "" ? _TempcolName : "";
                $scope.Totalslides = mySwiper.slides.length - 1;
                $scope.IsFormDataloaded = true;
                $scope.CurrentActiveFieldType = "Inventory";
                $("#files").on('change', function (event) {
                    $scope.handleFileSelect(event);
                });



                CheckScopeBeforeApply();
            }, 10)

            $scope.SetDefaultObjects();
            $scope.laststepindex = mySwiper.slides.length;
        }, 10)
    }

    function onConfirmInv(buttonIndex) {



        if (buttonIndex == 1 || buttonIndex == "1") {

            $location.path('/mainmenu');
            vibrate()
            CheckScopeBeforeApply();
        }
        else {

        }
    }


    $scope.confirmmove = function () {



        $("#modal3").modal('hide');
        $location.path('/FindItems');
        $(".Addbtn").show()
        vibrate()
        CheckScopeBeforeApply();

    }

    $scope.notmove = function () {
        //window.location.reload();
        $scope.resetObject();
        $scope.getstep(0);

        $("#modal3").modal('hide');

        $(".Addbtn").show()
    }






    function showConfirmInventory() {
        navigator.notification.confirm(
            'Are you sure you want to leave this page ?', // message
             onConfirmInv,            // callback to invoke with index of button pressed
            'Are you sure',           // title
            ['Yes', 'No']         // buttonLabels
        );
    }


    $scope.movetolist = function () {

        $(".Addbtn").hide()

        $("#modal3").modal('show');
    }




    $('.arrow-left').on('click', function (e) {
        e.preventDefault()

        if ($scope.slide == 0 || $scope.slide == 1000) {
            // showConfirmInventory();

        }
        else {
            mySwiper.swipePrev();

        }


    })
    $('.arrow-right').on('click', function (e) {

        e.preventDefault()
        mySwiper.swipeNext()
        CheckScopeBeforeApply();
    })



    $scope.onPhotoURISuccessNew = function (imageData) {
        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }

        imageData = "data:image/jpeg;base64," + imageData;

        var id = randomStringNew(5, '0123456789');
        _ImgObj.ImageID = id;

        $(".viewimage").show();
        $("#myModalforlist").modal("hide");


        _ImgObj.FileName = "IphoneLibrary";
        _ImgObj.bytestring = imageData;
        $scope.ImageList.push(_ImgObj);
        CheckScopeBeforeApply();

    }

    $scope.getPhoto = function (source) {
        // Retrieve image file location from specified source
        navigator.camera.getPicture($scope.onPhotoURISuccessNew, $scope.onFail, {
            quality: 50,
            destinationType: destinationType.DATA_URL,
            correctOrientation: true,
            sourceType: pictureSource.PHOTOLIBRARY
        });
    }

    $scope.$watch("InventoryObject.AutoID", function () {
        if ($scope.InventoryObject.AutoID) {
            $scope.InventoryObject.ItemID = "Automated";
            $scope.InventoryObject.PID = 0;
        }
        else {
            $scope.InventoryObject.ItemID = "";
            $scope.InventoryObject.PID = 0;
        }
        CheckScopeBeforeApply()

    });





}]);


app.directive('selectpicker', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ctrl) {

            element.select2();


            var refreshSelect = function () {

                element.trigger('change');
            };


            scope.$watch(attrs.ngModel, refreshSelect);


        }
    };
});

app.directive('endRepeat', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {

                scope.$emit('ngRepeatFinished');
            }
        }
    }
}]);
app.directive('endRepeat1', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {

                scope.$emit('ngRepeatFinished1');
            }
        }
    }
}]);
app.directive('endRepeat2', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {

                scope.$emit('ngRepeatFinished2');
            }
        }
    }
}]);
app.directive('endRepeat3', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {

                scope.$emit('ngRepeatFinished3');
            }
        }
    }
}]);


app.directive('bootstrapSwitch', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel) {
                    var _id = element[0].id;


                    element.bootstrapSwitch({
                        onText: _id == 'AutoID' ? 'Auto' : 'On',
                        offText: _id == 'AutoID' ? 'Manual' : 'Off'
                    });
                    element.on('switchChange.bootstrapSwitch', function (event, state) {
                        if (ngModel) {
                            scope.$apply(function () {
                                ngModel.$setViewValue(state);
                            });
                        }
                    });

                    scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                        if (newValue) {
                            element.bootstrapSwitch('state', true, true);
                        } else {
                            element.bootstrapSwitch('state', false, true);
                        }
                    });
                }
            };
        }
]);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {


            var key = event.which || event.keyCode || 0;


            if (event.which === 13) {



                scope.$apply(function () {

                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

