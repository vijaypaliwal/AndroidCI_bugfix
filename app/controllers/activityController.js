'use strict';
app.controller('activityController', ['$scope', 'localStorageService', 'authService', '$location', 'log', '$cordovaKeyboard', function ($scope, localStorageService, authService, $location, log, $cordovaKeyboard) {


    $scope.onlyShowIncreaseAdjustActivity = false;
    $scope.onlyShowDecreaseAdjustActivity = false;


    $scope.CurrentCart = [];
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.CustomActivityDataList = [];
    $scope.CurrentOperation = "";
    $scope.AllowNegative = false;
    $scope.CanCost = true;
    $scope._IsLoading = true;
    $scope.totalLength = 0;
    $scope.MyinventoryFields = [];
    $scope.UOMList = [];
    $scope.IsSummary = false;
    $scope.CurrentStep = 0;
    $scope.IsProcessing = false;
    var _AllowNegative = 'False';
    $scope.IssueType = 0;
    $scope.CollapsClass = "";
    $scope.CollapsOpen = false;
    $scope.isLineItemColumnNames = [];
    $scope.IsQuantityUpdated = false;
    $scope.IsSingleMode = false;
    $scope.CustomAutoClear = false;
    $scope.CanIncrease = 'true';
    $scope.CanDecrease = 'true';
    $scope.CanConvert = 'true';
    $scope.CanMove = 'true';
    $scope.CanMoveTagUpdate = 'true';
    $scope.CanStatus = 'true';
    $scope.CanApply = 'true';
    $scope.CanCost = 'True';
    $scope.CanPUpdateStatus = 'true';
    $scope.AffectedItemIds = [];
    $scope.CurrentHref = "";
    $scope.ColumnList = [];
    $scope.CurrentCartBkup = [];
    $scope.UnitDataList = [];
    $scope.CreateType = 0;
    $scope.CanAutoClear = false;
    $scope.CurrentNewLabelIndex = -1;
    $scope.TempNewLabelIndex = -1;
    $scope.CurrentLocationIndex = -1;
    $scope.CreateNewLabel = "";
    $scope.LocationSearchList = [];
    $scope.LocationList = [];
    $scope.TempLocationID = -1;

    $scope.weeklist = [];
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
    $scope.CurrentYear = new Date().getFullYear();

    for (var i = 1; i <= 52; i++) {

        var x = leadZero(i);

        $scope.weeklist.push(x);
    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    var mySwiper;

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    $scope.OpenmenuModal = function () {

        if ($("body").hasClass("modal-open")) {
            $("#myModal2").modal('hide');
        }
        else {
            $("#myModal2").modal('show');
        }
    }

    $scope.CancelEdit = function () {
        $scope.IsEditMode = false;

        $scope.$apply();

    }
    $scope.CheckForUnitText = function (_type) {
        if (_type != 4 && _type != 5 && _type != 6) {
            return true;
        }
        return false;
    }

    $scope.GetWeekValue = function (year, week) {
        return year.toString() + "-W" + week.toString();
    }

    $scope.dropdownLabel = "";

    $scope.Addnew = function (ID, FieldType) {
        $scope.dropdownLabel = "";
        $scope.FieldType = FieldType;
        $scope.currentcfdID = ID;
        CheckScopeBeforeApply();


        $("#Adddropdownvalue").modal('show');

    }


    $scope.toggleitem = function (index) {
        if ($('.submenu-' + index).hasClass('CollapseData')) {
            $('.submenu-' + index).removeClass('CollapseData');
            $('.itemcount_' + index + ' .fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        } else {
            $('.submenu-' + index).addClass('CollapseData');
            $('.itemcount_' + index + ' .fa').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        }
    }



    $scope.SaveDropdownlabel = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({
            url: serviceBase + "UpdateCustomDropdown",
            type: 'POST',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "cfdID": $scope.currentcfdID, "Value": $scope.dropdownLabel }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {

                $('#' + $scope.FieldType + $scope.currentcfdID).append('<option value=' + $scope.dropdownLabel + ' selected="selected"> ' + $scope.dropdownLabel + '</option>');


                $('#' + $scope.FieldType + $scope.currentcfdID).val($scope.dropdownLabel);

                $("#Adddropdownvalue").modal('hide');


            },
            error: function (err) {

                alert("error");



            },
            complete: function () {


            }

        });

    }


    $scope.Accountlimit = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetAccountLimit',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {

                   $scope.objOverLimit = response.GetAccountLimitResult.Payload;                

               },
               error: function (err) {

                   alert("Error");

               }
           });
    }

    $scope.Accountlimit();


    $scope.CreateNewModal = function (Type, _index) {
        if (Type == 3) {
            if ($scope.objOverLimit.canAddLocation) {
                $scope.CreateType = Type;
                $scope.CurrentNewLabelIndex = _index;
                CheckScopeBeforeApply();
                $("#createnewlabel").modal('show');
            }
            else {
                $("#overLimitAlert").modal("show");
            }
        }
        else {
            $scope.CreateType = Type;
            $scope.CurrentNewLabelIndex = _index;
            CheckScopeBeforeApply();
            $("#createnewlabel").modal('show');
        }

    }



    $scope.checkDuplicate = function (type) {


        if (type == 1) {
            for (var i = 0; i < $scope.UOMList.length; i++) {
                if ($scope.UOMList[i].UnitOfMeasureName.toLowerCase() == $scope.CreateNewLabel.toLowerCase()) {
                    return false;
                }
            }
        }



        if (type == 2) {
            for (var i = 0; i < $scope.StatusList.length; i++) {
                if ($scope.StatusList[i].StatusValue.toLowerCase() == $scope.CreateNewLabel.toLowerCase()) {
                    return false;
                }
            }

        }

        return true;
    }

    $scope.getlocation = function () {
        $scope.LocationDataList = [];
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
                       $scope.LocationDataList = response.GetLocationsResult.Payload;
                       $scope.LocationSearchList = angular.copy($scope.LocationDataList);

                       $("#searchlocation").trigger("change");
                       $("#searchlocation").trigger("blur");
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


                           $scope.ShowErrorMessage("Getting locations", 2, 1, err.statusText);
                       }
                   }


               },

               complete: function () {
                   if ($scope.TempNewLabelIndex != -1 && $scope.TempLocationID != -1) {


                       if ($scope.CurrentOperation == "Move") {

                           $scope.CurrentCart[$scope.TempNewLabelIndex].MoveTransactionData.MoveToLocation = $scope.TempLocationID;
                       }
                       if ($scope.CurrentOperation == "MoveTagUpdate") {

                           $scope.CurrentCart[$scope.TempNewLabelIndex].MoveUpdateTagTransactionData.MoveToLocation = $scope.TempLocationID;
                       }
                       $scope.TempNewLabelIndex = -1;
                       $scope.TempLocationID = -1;
                   }

                   CheckScopeBeforeApply();

               }
           });

    }
    $scope.savestatus = function (Statusvalue) {

        var _StatusValue = $.trim(Statusvalue);

        if (_StatusValue != "") {

            $scope.StatusToCreate = Statusvalue;
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.SecurityToken = authData.token;
            }
            var datatosend = { "StatusId": 0, "StatusValue": $scope.StatusToCreate };


            $.ajax({
                url: serviceBase + "CreateEditStatus",
                type: 'POST',
                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "_StatusVM": datatosend }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {


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
                    $scope.ShowErrorMessage("Updating Status", 2, 1, err.statusText);


                },
                complete: function () {
                }

            });

            $scope.$apply();

        }

    }
    $scope.saveUOM = function (value, _index) {

        var _StatusValue = $.trim(value);
        var _UOM = { ID: 0, value: "" };

        if (_StatusValue != "") {



            $scope.UOMToCreate = value;
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.SecurityToken = authData.token;
            }

            var datatosend = { "UomID": 0, "UOM": $scope.UOMToCreate };


            $.ajax({
                url: serviceBase + "CreateEditUOM",
                type: 'POST',
                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "UOMModel": datatosend }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {


                    if (result.CreateEditUOMResult.Success == true) {

                        if (result.CreateEditUOMResult.Payload.ID == 1) {

                            _UOM.ID = result.CreateEditUOMResult.Payload.NewUOM;
                            _UOM.value = result.CreateEditUOMResult.Payload.OldUOM;

                            $scope.CurrentCart[_index].ConvertTransactionData.ToUOM = _UOM.value;
                            $scope.CurrentCart[_index].ConvertTransactionData.ToUOMID = _UOM.ID;
                            var _uomobj = { UnitOfMeasureName: _UOM.value, UnitOfMeasureID: _UOM.ID };
                            $scope.UOMList.push(_uomobj);
                            CheckScopeBeforeApply();
                        }



                        if (result.CreateEditUOMResult.Payload.ID == 0) {



                            var _headerText = result.CreateEditUOMResult.Payload.OldUOM + " into " + result.CreateEditUOMResult.Payload.NewUOM + " ?"
                            var _OldUOM = result.CreateEditUOMResult.Payload.OldUOM;
                            var _NewUOM = result.CreateEditUOMResult.Payload.NewUOM;
                            var box = bootbox.confirm(_headerText, function (result) {
                                if (result) {

                                    $.ajax({
                                        url: serviceBase + "MergeUOM",
                                        type: 'POST',
                                        data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "OldUOM": _OldUOM, "NewUOM": _NewUOM }),
                                        dataType: 'json',
                                        contentType: 'application/json',
                                        success: function (result) {

                                            if (result.MergeUOMResult.Success == true) {


                                            }
                                            else {
                                                $scope.ShowErrorMessage("Merging UOM", 1, 1, result.MergeUOMResult.Message)

                                            }

                                        },
                                        error: function (err) {
                                            $scope.ShowErrorMessage("Merging UOM", 2, 1, err.statusText);



                                        },
                                        complete: function () {
                                        }

                                    });
                                }
                            });

                            var _msg = "The new unit of measure name you have chosen is already in use.  If you like, you may merge all existing records at the unit of measure, " + _OldUOM + ", into the existing unit of measure called " + _NewUOM + ".<br /><br />If you proceed, all existing references to " + _OldUOM + " will be removed.  <strong>This may take up to a minute, and the action cannot be undone.</strong><br /><br /> Would you like to proceed?"

                            box.on("shown.bs.modal", function () {
                                $(".mybootboxbody").html(_msg);

                            });



                            CheckScopeBeforeApply();
                        }
                    }
                    else {
                        $scope.ShowErrorMessage("Updating UOM", 1, 1, result.CreateEditUOMResult.Message)

                    }
                },
                error: function (err) {
                    $scope.ShowErrorMessage("Updating UOM", 2, 1, err.statusText);



                },
                complete: function () {
                }
            });
        }

        return _UOM;
    }
    $scope.SaveLabel = function (Type) {

        $scope.Accountlimit();

        if (Type != 3) {

            if ($scope.checkDuplicate(Type)) {

                if (Type == 1) {

                    CheckScopeBeforeApply();
                    if ($scope.CurrentNewLabelIndex != -1) {
                        $scope.saveUOM($scope.CreateNewLabel, $scope.CurrentNewLabelIndex);

                    }
                }


                if (Type == 2) {
                    var _statusobj = { StatusValue: $scope.CreateNewLabel };
                    $scope.StatusList.push(_statusobj);
                    if ($scope.CurrentNewLabelIndex != -1) {
                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            $scope.CurrentCart[$scope.CurrentNewLabelIndex].MoveUpdateTagTransactionData.StatusToUpdate = $scope.CreateNewLabel;
                        }
                        if ($scope.CurrentOperation == "Update") {
                            $scope.CurrentCart[$scope.CurrentNewLabelIndex].UpdateTransactionData.StatusToUpdate = $scope.CreateNewLabel;
                        }
                    }

                    $scope.savestatus($scope.CreateNewLabel);
                }


                $scope.CreateNewLabel = "";
                $scope.CurrentNewLabelIndex = -1;
                CheckScopeBeforeApply();
                $("#createnewlabel").modal('hide');
            }
            else {
                log.error("This value already exist.");
            }
        }

        if (Type == 3) {
            $scope.TempNewLabelIndex = -1;
            if ($scope.CurrentNewLabelIndex != -1) {
                $scope.TempNewLabelIndex = $scope.CurrentNewLabelIndex;
            }

            $scope.savelocation($scope.CreateNewLabel);
            $scope.CreateNewLabel = "";
            $scope.CurrentNewLabelIndex = -1;
            CheckScopeBeforeApply();
            $("#createnewlabel").modal('hide');
        }

    }

    function TryParseInt(str, defaultValue) {
        var retValue = defaultValue;
        if (str !== null) {
            if (str.length > 0) {
                if (!isNaN(str)) {
                    retValue = parseInt(str);
                }
            }
        }
        return retValue;
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


    $scope.currtrentcustomauto = [];


    $scope.customautocomplete = function (ColumnName, id, inventoryid, fieldtype) {
        $("#customautolistmodal").modal('show');


        $scope.adjustid = id;

        if (inventoryid != 'empty') {
            id = id + '_' + inventoryid;
        }




        var _toAppend = fieldtype == "line" ? "LineItem_" : "CustomActivity_"







        $scope.activecustomfield = _toAppend + id;


        if (inventoryid == 'increase') {
            $scope.activecustomfield = 'CustomActivityIncrease_' + $scope.adjustid;
        }

        if (inventoryid == 'decrease') {
            $scope.activecustomfield = 'CustomActivityDecrease_' + $scope.adjustid;
        }



        for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
            if ($scope.CustomActivityDataList[i].ColumnMap == ColumnName) {
                $scope.currtrentcustomauto = $scope.CustomActivityDataList[i].cfdComboValues;
                break;
            }
        }



    }



    $scope.fillcustomvalue = function (value) {
        $("#" + $scope.activecustomfield).val(value);

        $("#" + $scope.activecustomfield).trigger("input");
        CheckScopeBeforeApply();
        $("#customautolistmodal").modal('hide');

    }

    $scope.currtrentcustomradiovalue = [];
    $scope.customradiolist = function (ColumnName, id, inventoryid, fieldtype) {

         
        if (inventoryid != 'empty') {
            id = id + '_' + inventoryid;
        }


        $scope.activeradiofield = "CustomActivity_" + id;

        for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
            if ($scope.CustomActivityDataList[i].ColumnMap == ColumnName) {
                $scope.currtrentcustomradiovalue = $scope.CustomActivityDataList[i].cfdRadioValues;
                break;
            }
        }


        $("#customradiotextmodal").modal("show");
    }

    $scope.fillcurrentradiovalue = function (value) {

        $scope.selectedradiovalue = value;



    }

    $scope.fillvaluetoradio = function () {

        $("#" + $scope.activeradiofield).val($scope.selectedradiovalue);

        $("#" + $scope.activeradiofield).trigger("input");

        $("#customradiotextmodal").modal("hide");

    }
    $scope.ScanLineItem = function (Type, Id, index, inventoryID) {
        var _typeString = "";
        switch (Type) {
            case 1:
                _typeString = '#LineItem_';
                break;
            case 2:
                _typeString = '#CustomActivity_';
                break;
            case 3:
                _typeString = '#CustomActivityIncrease_';
                break;
            case 4:
                _typeString = '#CustomActivityDecrease_';
                break;

        }
        var _ID = _typeString + Id.toString();
        var scanner = cordova.plugins.barcodeScanner;
        scanner.scan(function (result) {

            var _dataType = $(_ID).attr("custom-data-type");
            var _value = result.text;

            if (_dataType != null && _dataType != undefined) {
                if (_dataType == "date" || _dataType == "datetime") {
                    _value = ConvertDatetoDate(_value);
                }

                if (_dataType == "number" || _dataType == "money" || _dataType == "currency") {
                    _value = TryParseInt(_value, -9890);
                    _value = _value == -9890 ? "" : _value;
                }
            }

            $(_ID).val(_value);
            //   $(_ID).trigger("input");
            switch (Type) {
                case 1:
                    for (var i = 0; i < $scope.CurrentCart.length; i++) {
                        if ($scope.CurrentCart[i].InventoryID == inventoryID) {
                            $scope.CurrentCart[i].IsLineItemData[index].CfValue = _value;
                            break;
                        }
                    }
                    break;
                case 2:
                    break;
                default:

            }

            $scope.$apply();


        }, function (error) {
            log.error("Scanning failed: ", error);
        });

    }
    $scope.UpdateAutoClear = function (autoclearvalue) {

        $scope.CustomAutoClear = autoclearvalue;
        localStorageService.set('CustomAutoClear', $scope.CustomAutoClear);
    }

    $scope.ScanTagItem = function (Type, Id, index, inventoryID) {
        var _typeString = "";

        switch (Type) {
            case "iReqValue":
                _typeString = "#unittext1_" + Id.toString();
                break;
            case "iUnitTag2":
                _typeString = "#unittext2_" + Id.toString();
                break;
            case "iUnitTag3":
                _typeString = "#unittext3_" + Id.toString();
                break;
            case "iUnitTag4":
                _typeString = "#unittext4_" + Id.toString();
                break;
            case "iUnitTag5":
                _typeString = "#unittext5_" + Id.toString();
                break;
            case "iUnitTag6":
                _typeString = "#unittext6_" + Id.toString();
                break;
            case "iUnitTag7":
                _typeString = "#unittext7_" + Id.toString();
                break;
            case "iUnitTag8":
                _typeString = "#unittext8_" + Id.toString();
                break;
            case "iUnitNumber1":
                _typeString = "#unitnumbertext1_" + Id.toString();
                break;
            case "iUnitNumber2":
                _typeString = "#unitnumbertext2_" + Id.toString();
                break;
            case "iUnitNumber3":
                _typeString = "#unitnumbertext3_" + Id.toString();
                break;
            case "iUnitNumber4":
                _typeString = "#unitnumbertext4_" + Id.toString();
                break;

            default:

        }
        var _ID = _typeString;
        var scanner = cordova.plugins.barcodeScanner;
        scanner.scan(function (result) {

            var _dataType = $(_ID).attr("data-type");
            var _value = result.text;

            if (_dataType != null && _dataType != undefined) {
                if (_dataType == "date" || _dataType == "datetime") {
                    _value = ConvertDatetoDate(_value);
                }

                if (_dataType == "number" || _dataType == "money" || _dataType == "currency") {
                    _value = TryParseInt(_value, -9890);
                    _value = _value == -9890 ? "" : _value;
                }
            }
            $(_ID).val(_value);
            // $(_ID).trigger("input");

            for (var i = 0; i < $scope.CurrentCart.length; i++) {
                if ($scope.CurrentCart[i].InventoryID == inventoryID) {
                    switch (Type) {
                        case "iReqValue":


                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitTag1 = _value;
                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitTag1 = _value;


                            }

                            break;
                        case "iUnitTag2":

                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitTag2 = _value;

                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitTag2 = _value;


                            }
                            break;
                        case "iUnitTag3":
                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitTag3 = _value;


                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitTag3 = _value;



                            }
                            break;
                        case "iUnitTag4":
                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitTag4 = _value;


                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitTag4 = _value;



                            }
                            break;
                        case "iUnitTag5":
                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitTag5 = _value;


                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitTag5 = _value;



                            }
                            break;
                        case "iUnitTag6":
                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitTag6 = _value;


                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitTag6 = _value;



                            }
                            break;
                        case "iUnitTag7":
                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitTag7 = _value;


                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitTag7 = _value;



                            }
                            break;
                        case "iUnitTag8":
                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitTag8 = _value;


                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitTag8 = _value;



                            }
                            break;
                        case "iUnitNumber1":
                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitNumber1 = _value;



                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitNumber1 = _value;




                            }
                            break;
                        case "iUnitNumber2":
                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitNumber2 = _value;




                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitNumber2 = _value;





                            }
                            break;
                        case "iUnitNumber3":
                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitNumber3 = _value;




                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitNumber3 = _value;





                            }
                            break;
                        case "iUnitNumber4":
                            if ($scope.CurrentOperation == "MoveTagUpdate") {
                                $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitNumber4 = _value;




                            }
                            if ($scope.CurrentOperation == "Apply") {
                                $scope.CurrentCart[i].ApplyTransactionData.UnitNumber4 = _value;





                            }
                            break;

                        default:

                    }
                    break;
                }
            }

            $(".uniqueunitData").first().trigger("blur");
            var $inputs = $(".uniqueunitData");
            $inputs.trigger('blur');


            $scope.$apply();


        }, function (error) {
            log.error("Scanning failed: ", error);
        });

    }
    $scope.selecteditemlist = function () {

        $("#selecteditemlistmodal").modal('show');
    }


    $scope.cartitem = function () {
        $(".cartitemmenu").addClass("active")
        $(".relateddatamenu").removeClass("active")

        $("#home").show()

        $("#menu1").hide()


    }



    //#region Check unit data area
    $scope.CheckIsAllowDuplicate = function (ColumnName) {
        for (var i = 0; i < $scope.UnitDataList.length; i++) {
            if ($scope.UnitDataList[i].FieldName == ColumnName) {
                return $scope.UnitDataList[i].IsUnique;
            }

        }
        return false;
    }


    $scope.CheckUnitDataFieldValueAll = function (ColumnName, IsAllowDuplicate) {
        if (IsAllowDuplicate == true) {

            var value = "";
            var _Count = 1;
            var defaultValueOfColumn = "";
            switch (ColumnName) {
                case "iReqValue":
                case "ReqValue":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {

                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitTag1;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitTag1;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {


                                if (CheckUnitDataDuplicate(ColumnName, value) == false) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag1;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitTag1;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }


                    }


                    break;
                case "iUnitTag2":
                case "UnitTag2":
                    $scope.UnitDataTag2 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {

                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitTag2;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitTag2;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag2;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitTag2;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }
                    }


                    break;
                case "iUnitTag3":
                case "UnitTag3":
                    $scope.UnitDataTag3 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitTag3;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitTag3;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag3;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitTag3;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }
                    }



                    break;
                case "iUnitTag4":
                case "UnitTag4":
                    $scope.UnitDataTag4 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitTag4;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitTag4;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag4;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitTag4;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }
                    }



                    break;
                case "iUnitTag5":
                case "UnitTag5":
                    $scope.UnitDataTag5 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitTag5;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitTag5;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag5;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitTag5;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }
                    }



                    break;
                case "iUnitTag6":
                case "UnitTag6":
                    $scope.UnitDataTag6 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitTag6;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitTag6;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag6;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitTag6;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }
                    }



                    break;
                case "iUnitTag7":
                case "UnitTag7":
                    $scope.UnitDataTag7 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitTag7;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitTag7;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag7;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitTag7;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }
                    }



                    break;
                case "iUnitTag8":
                case "UnitTag8":
                    $scope.UnitDataTag8 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitTag8;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitTag8;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag8;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitTag8;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }
                    }



                    break;
                case "iUnitNumber1":
                case "UnitNumber1":
                    $scope.UnitDataNumber1 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {

                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitNumber1;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitNumber1;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                    }



                    break;
                case "iUnitNumber2":
                case "UnitNumber2":
                    $scope.UnitDataNumber2 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {

                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitNumber2;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitNumber2;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }
                    }



                    break;
                case "iUnitNumber3":
                case "UnitNumber3":
                    $scope.UnitDataNumber3 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {

                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitNumber3;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitNumber3;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }
                    }



                    break;
                case "iUnitNumber4":
                case "UnitNumber4":
                    $scope.UnitDataNumber4 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {

                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitNumber4;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitNumber4;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }
                    }



                    break;
                case "iUnitDate4":
                case "UnitDate4":
                    $scope.UnitDataDate4 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {



                        if ($scope.CurrentOperation == "Apply") {


                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitDate4;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitDate4;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {

                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate4;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitDate4;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }


                    }


                    break;
                case "iUnitDate3":
                case "UnitDate3":
                    $scope.UnitDataDate3 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {



                        if ($scope.CurrentOperation == "Apply") {


                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitDate3;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitDate3;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {

                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate3;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitDate3;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }


                    }


                    break;
                case "iUnitDate2":
                case "UnitDate2":
                    $scope.UnitDataDate2 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {



                        if ($scope.CurrentOperation == "Apply") {


                            value = $scope.CurrentCart[k].ApplyTransactionData.UnitDate2;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UnitDate2;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {

                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate2;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].MoveUpdateTagTransactionData.UnitDate2;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }
                        }


                    }


                    break;
                case "iUniqueDate":
                case "UniqueDate":
                    $scope.UnitDataDate1 = value;

                    for (k = 0; k < $scope.CurrentCart.length; k++) {

                        if ($scope.CurrentOperation == "Apply") {
                            value = $scope.CurrentCart[k].ApplyTransactionData.UniqueDate;
                            defaultValueOfColumn = $scope.CurrentCartBkup[k].ApplyTransactionData.UniqueDate;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                        if ($scope.CurrentOperation == "MoveTagUpdate") {

                            value = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UniqueDate;
                            defaultValueOfColumn = $scope.GroupCopy[k].MoveUpdateTagTransactionData.UniqueDate;

                            if ($.trim(value) != "" && $.trim(value) != $.trim(defaultValueOfColumn)) {

                                if (!CheckUnitDataDuplicate(ColumnName, value)) {
                                    _Count = _Count * 0;
                                }
                                else {
                                    _Count = _Count * 1;
                                }
                            }
                            else {
                                _Count = _Count * 1;
                            }

                        }

                    }


                    break;
            }
        }


        if (_Count == 0) {
            return false;
        }
        else {
            return true;
        }


    }


    $scope.CheckUnitDataFieldValue = function (ColumnName, IsAllowDuplicate, index) {
        if (IsAllowDuplicate == true) {

            var value = "";
            var oldValue = "";

            switch (ColumnName) {
                case "iReqValue":
                case "ReqValue":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitTag1;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitTag1;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitTag1;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitTag1;

                    }


                    break;
                case "iUnitTag2":
                case "UnitTag2":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitTag2;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitTag2;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitTag2;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitTag2;

                    }

                    break;
                case "iUnitTag3":
                case "UnitTag3":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitTag3;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitTag3;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitTag3;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitTag3;

                    }



                    break;
                case "iUnitTag4":
                case "UnitTag4":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitTag4;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitTag4;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitTag4;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitTag4;

                    }



                    break;
                case "iUnitTag5":
                case "UnitTag5":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitTag5;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitTag5;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitTag5;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitTag5;

                    }



                    break;
                case "iUnitTag6":
                case "UnitTag6":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitTag6;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitTag6;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitTag6;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitTag6;

                    }



                    break;
                case "iUnitTag7":
                case "UnitTag7":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitTag7;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitTag7;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitTag7;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitTag7;

                    }



                    break;
                case "iUnitTag8":
                case "UnitTag8":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitTag8;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitTag8;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitTag8;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitTag8;

                    }



                    break;
                case "iUnitNumber1":
                case "UnitNumber1":

                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitNumber1;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitNumber1;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitNumber1;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitNumber1;

                    }

                    break;
                case "iUnitNumber2":
                case "UnitNumber2":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitNumber2;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitNumber2;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitNumber2;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitNumber2;

                    }


                    break;
                case "iUnitNumber3":
                case "UnitNumber3":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitNumber3;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitNumber3;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitNumber3;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitNumber3;

                    }


                    break;
                case "iUnitNumber4":
                case "UnitNumber4":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitNumber4;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitNumber4;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitNumber4;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitNumber4;

                    }


                    break;
                case "iUnitDate2":
                case "UnitDate2":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitDate2;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitDate2;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitDate2;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitDate2;

                    }

                    break;
                case "iUnitDate4":
                case "UnitDate4":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitDate4;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitDate4;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitDate4;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitDate4;

                    }

                    break;
                case "iUnitDate3":
                case "UnitDate3":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UnitDate3;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UnitDate3;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UnitDate3;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UnitDate3;

                    }

                    break;
                case "iUniqueDate":
                case "UniqueDate":
                    if ($scope.CurrentOperation == "Apply") {
                        value = $scope.CurrentCart[index].ApplyTransactionData.UniqueDate;
                        oldValue = $scope.CurrentCartBkup[index].ApplyTransactionData.UniqueDate;

                    }
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        value = $scope.CurrentCart[index].MoveUpdateTagTransactionData.UniqueDate;
                        oldValue = $scope.CurrentCartBkup[index].MoveUpdateTagTransactionData.UniqueDate;

                    }


                    break;
            }
        }

        if ($.trim(value) != "" && value != oldValue) {
            var _returnVar = CheckUnitDataDuplicate(ColumnName, value);

            return _returnVar;
        }
        else {
            return true;
        }

    }
    $scope.GetUnitDataFieldByName = function (Name) {
        for (var i = 0; i < $scope.UnitDataList.length; i++) {
            if ($scope.UnitDataList[i].FieldName == Name) {
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
                       console.log("======================================");
                       console.log($scope.UnitDataList);
                       console.log("========================================");
                       for (var i = 0; i < $scope.UnitDataList.length; i++) {
                           var _ComboValues = angular.copy($.trim($scope.UnitDataList[i].FieldComboValues));
                           var _RadioValues = angular.copy($.trim($scope.UnitDataList[i].FieldRadioValues));
                           if (_ComboValues != "") {
                               $scope.UnitDataList[i].FieldComboValues = _ComboValues.split("\n");
                           }

                           if (_RadioValues != "") {
                               $scope.UnitDataList[i].FieldRadioValues = _RadioValues.split("\r\n");
                           }

                       }

                       CheckScopeBeforeApply();
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

    function CheckUnitDataDuplicate(ColumnName, value) {
        var _returnVar = true;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax({
            url: serviceBase + 'CheckDuplicateUnitData',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ColumnName": ColumnName, "Value": value }),
            async: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'text json',
            success: function (result) {
                if (result.CheckDuplicateUnitDataResult.Success == true) {
                    if (result.CheckDuplicateUnitDataResult.Payload == 1) {
                        _returnVar = false;

                    }
                    else {
                        _returnVar = true;
                    }



                } else {
                    log.error(result.ex);
                }
            },
            error: function (req, status, error) {
                log.error(error);
            }
        });

        return _returnVar;
    }

    //#endregion check unit data



    $scope.relateddata = function () {
        $(".relateddatamenu").addClass("active")
        $(".cartitemmenu").removeClass("active")

        $("#home").hide()

        $("#menu1").show()
    }






    function getuom() {


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

                   }
                   else {
                       $scope.ShowErrorMessage("Getting UOM list", 1, 1, response.GetUnitsOfMeasureResult.Message)

                   }
                   CheckScopeBeforeApply()
               },
               error: function (err) {

                   $scope.ShowErrorMessage("Getting UOM list", 2, 1, err.statusText);


               }
           });

    }

    $scope.OpenSummary = function () {

        $scope.IsSummary = true;
        CheckScopeBeforeApply();
    }

    $scope.CloseSummary = function () {

        $scope.IsSummary = false;
        CheckScopeBeforeApply();
    }
    $scope.FillCost = function (cost, Id) {
        if ($.trim(cost) != "") {
            var k = 0;
            for (k = 0; k < $scope.CurrentCart.length; k++) {

                $scope.CurrentCart[k].iCostPerItem = cost;
            }


            $("#mybuttonCost_" + Id).addClass("movepin")

            ShowSuccessActivity('Updated', $scope._CurrentAction);

            CheckScopeBeforeApply();
        }
        else {
            toastr.error("Please fill some value");
        }
    }
    $scope.FillQuantity = function (value, id, type) {

        $scope.ActionQuantityValue = value;

        var k = 0;
        switch (type) {
            case 1:
                if ($scope.ActionQuantityValue != "" && $scope.ActionQuantityValue != undefined) {

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.ActionQuantityValue;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.ActionQuantityValue;
                    }

                    $("#mybutton_" + id).addClass("movepin")

                    ShowSuccessActivity('Updated', $scope._CurrentAction);

                    //  $scope.NextClickNew(2);
                    //  $scope.CurrentActiveObject = $scope.CurrentCart[0];
                    CheckScopeBeforeApply();
                }
                else {
                    toastr.error("Please input some valid value");
                }
                break;
            case 2:

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentCart[k].InventoryDataList.oquantity > 0) {

                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                    }
                    else {
                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = 0;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = 0;
                    }
                }

                $("#mybutton_" + id).addClass("movepin")

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                CheckScopeBeforeApply();;

                break;

            default:

        }


    };
    $scope.FillQuantityNew = function (value, id, type) {

        $scope.ActionQuantityValue = value;

        var k = 0;
        switch (type) {
            case 1:
                if ($scope.ActionQuantityValue != "" && $scope.ActionQuantityValue != undefined) {

                    for (k = 0; k < $scope.CurrentCart.length; k++) {

                        $scope.CurrentCart[k].AdjustCalculation = "";
                        if ($scope.CurrentOperation == "Adjust") {
                            if ($scope.ActionQuantityValue > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                value = $scope.ActionQuantityValue - $scope.CurrentCart[k].InventoryDataList.oquantity;
                                $scope.CurrentCart[k].AdjustCalculation += $scope.CurrentCart[k].InventoryDataList.oquantity.toString() + " + " + value.toString() + "=" + $scope.ActionQuantityValue.toString();
                            }
                            else if ($scope.ActionQuantityValue < $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                value = $scope.CurrentCart[k].InventoryDataList.oquantity - $scope.ActionQuantityValue;
                                $scope.CurrentCart[k].AdjustCalculation += $scope.CurrentCart[k].InventoryDataList.oquantity.toString() + " - " + value.toString() + "=" + $scope.ActionQuantityValue.toString();

                            }
                            else {
                                value = 0;
                                $scope.CurrentCart[k].AdjustCalculation += $scope.CurrentCart[k].InventoryDataList.oquantity.toString() + " + " + value.toString() + "=" + $scope.ActionQuantityValue.toString();
                            }

                            $scope.IsQuantityUpdated = true;

                            $scope.CurrentCart[k].AdjustActionQuantity = value;
                            $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.ActionQuantityValue;

                            $scope.CurrentCart[k].ActionPerformed = ($scope.ActionQuantityValue == $scope.CurrentCart[k].InventoryDataList.oquantity || $scope.ActionQuantityValue > $scope.CurrentCart[k].InventoryDataList.oquantity) ? "1" : "-1";

                            $scope.checkToShowAdjustActivity();
                        }

                        else {


                            $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.ActionQuantityValue;
                            $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.ActionQuantityValue;
                        }
                    }

                    $("#mybutton_" + id).addClass("movepin");
                    ShowSuccessActivity('Updated', $scope._CurrentAction);

                    CheckScopeBeforeApply();
                }
                else {
                    toastr.error("Please input some valid value");
                }
                break;
            case 2:

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentCart[k].InventoryDataList.oquantity > 0) {

                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                    }
                    else {
                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = 0;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = 0;
                    }
                }

                $("#mybutton_" + id).addClass("movepin");

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                CheckScopeBeforeApply();;

                break;

            default:

        }


    };

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


                   }
                   else {
                       $scope.ShowErrorMessage("Getting Status list", 1, 1, response.GetStatusResult.Message)

                   }

                   CheckScopeBeforeApply()
               },
               error: function (err) {


                   $scope.ShowErrorMessage("Getting Status list", 2, 1, err.statusText)

               }
           });

    }

    $scope.LeavePage = function () {
        $('#myModal').modal('show');
    }

    $scope.CartFunction = function (type) {
        switch (type) {
            case 1:
                localStorageService.set("ActivityCart", $scope.CurrentCart);
                break;
            case 2:
                localStorageService.set("ActivityCart", "");
                localStorageService.set("SelectedAction", "");
                break;

            default:

        }

        if ($scope.CurrentHref != "") {
            if ($scope.CurrentHref.indexOf("#") > -1) {
                $scope.CurrentHref = $scope.CurrentHref.replace('#', '');

            }
            else {

            }
            $location.path($scope.CurrentHref);
        }
        else {
            $location.path('/FindItems');
        }

    }

    $("#headerrow a").not(".dropdown-toggle").not(".logout").click(function () {
        if ($scope.CurrentCart.length > 0) {
            $scope.CurrentHref = $(this).attr("href");
            $("#keepCart").attr("href", $scope.CurrentHref);
            CheckScopeBeforeApply();
            $scope.LeavePage();
            return false;
        }
        else {
            return true;
        }


    });






    $scope.locationlist = function (inventoryid, locationid, locationtext) {


        $(".activitycontent").hide();

        $scope.currentinventoryid = inventoryid
        $scope.currentlocationid = locationid

        $("#locationlistmodal").show();
        $scope.isnolocationmsg = false
        $('html,body').animate({ scrollTop: 0 }, 800);

    }




    $scope.OnChangeLocationNameFunction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope.SearchLocationValue = $.trim($scope.SearchLocationValue);
        if ($.trim($scope.SearchLocationValue) != "") {

            $scope.LocationSearching = true;
            $.ajax({

                type: "POST",
                url: serviceBase + "SearchLocationAutoComplete",
                contentType: 'application/json; charset=utf-8',

                dataType: 'json',

                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, SearchValue: $scope.SearchLocationValue }),
                error: function () {

                    $scope.LocationSearching = false;
                    $scope.ShowErrorMessage("Searching location", 2, 1, err.statusText);

                },

                success: function (data) {

                    if (data.SearchLocationAutoCompleteResult.Success == true) {


                        if (data.SearchLocationAutoCompleteResult != null && data.SearchLocationAutoCompleteResult.Payload != null) {
                            $scope.LocationSearching = false;
                            $scope.LocationSearchList = data.SearchLocationAutoCompleteResult.Payload;


                            if ($scope.LocationSearchList.length == 0)
                                $scope.isnolocationmsg = true
                            else
                                $scope.isnolocationmsg = false


                        }
                    }
                    else {
                        $scope.ShowErrorMessage("Searching location", 1, 1, data.SearchLocationAutoCompleteResult.Message)

                    }

                    CheckScopeBeforeApply();

                }
            });
        }
        else {
            $scope.LocationSearching = false;
            $scope.isnolocationmsg = true;
            $scope.LocationSearchList = [];
            CheckScopeBeforeApply();
        }



    }


    $scope.IncreaseDecreaseValue = function (Type, IsConvert2) {

        switch ($scope.CurrentOperation) {
            case "Increase":
            case "Decrease":
            case "Update":
            case "Apply":
            case "Adjust":
                $scope.CurrentCart[0].IncreaseDecreaseVMData.ActionQuantity = parseInt($scope.CurrentCart[0].IncreaseDecreaseVMData.ActionQuantity);
                $scope.CurrentCart[0].IncreaseDecreaseVMData.ActionQuantity = isNaN($scope.CurrentCart[0].IncreaseDecreaseVMData.ActionQuantity) ? 0 : $scope.CurrentCart[0].IncreaseDecreaseVMData.ActionQuantity;
                if (Type == 1) {
                    $scope.CurrentCart[0].IncreaseDecreaseVMData.ActionQuantity = $scope.CurrentCart[0].IncreaseDecreaseVMData.ActionQuantity + 1;

                }
                else if (Type == 2) {
                    if ($scope.CurrentCart[0].IncreaseDecreaseVMData.ActionQuantity > 0) {

                        $scope.CurrentCart[0].IncreaseDecreaseVMData.ActionQuantity = $scope.CurrentCart[0].IncreaseDecreaseVMData.ActionQuantity - 1;
                    }
                }

                break;
            case "Move":
                $scope.CurrentCart[0].MoveTransactionData.ActionQuantity = parseInt($scope.CurrentCart[0].MoveTransactionData.ActionQuantity);
                $scope.CurrentCart[0].MoveTransactionData.ActionQuantity = isNaN($scope.CurrentCart[0].MoveTransactionData.ActionQuantity) ? 0 : $scope.CurrentCart[0].MoveTransactionData.ActionQuantity;
                if (Type == 1) {
                    $scope.CurrentCart[0].MoveTransactionData.ActionQuantity = $scope.CurrentCart[0].MoveTransactionData.ActionQuantity + 1;


                }
                else if (Type == 2) {
                    if ($scope.CurrentCart[0].MoveTransactionData.ActionQuantity > 0) {
                        $scope.CurrentCart[0].MoveTransactionData.ActionQuantity = $scope.CurrentCart[0].MoveTransactionData.ActionQuantity - 1;
                    }

                }
                break;
            case "Convert":
                $scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity = parseInt($scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity);
                $scope.CurrentCart[0].ConvertTransactionData.ActionToQuantity = parseInt($scope.CurrentCart[0].ConvertTransactionData.ActionToQuantity);

                $scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity = isNaN($scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity) ? 0 : $scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity;
                $scope.CurrentCart[0].ConvertTransactionData.ActionToQuantity = isNaN($scope.CurrentCart[0].ConvertTransactionData.ActionToQuantity) ? 0 : $scope.CurrentCart[0].ConvertTransactionData.ActionToQuantity;
                if (Type == 1) {
                    if (IsConvert2 == 0) {
                        $scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity = $scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity + 1;

                    }
                    else if (IsConvert2 == 1) {
                        $scope.CurrentCart[0].ConvertTransactionData.ActionToQuantity = $scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity + 1;
                    }


                }
                else if (Type == 2) {
                    if (IsConvert2 == 0) {
                        $scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity = $scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity - 1;
                    }

                    else if (IsConvert2 == 1) {
                        if ($scope.CurrentCart[0].ConvertTransactionData.ActionToQuantity > 0) {
                            $scope.CurrentCart[0].ConvertTransactionData.ActionToQuantity = $scope.CurrentCart[0].ConvertTransactionData.ActionFromQuantity - 1;
                        }
                    }
                }
                break;

        }


        CheckScopeBeforeApply();
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

    $scope.LocationSetItemData = function (obj) {



        var k = 0;

        for (k = 0; k < $scope.CurrentCart.length; k++) {
            if ($scope.CurrentCart[k].InventoryDataList.uId == $scope.currentinventoryid) {
                if ($scope.CurrentOperation == "Move") {

                    if ($scope.CurrentCart[k].InventoryDataList.iLID !== obj.LocationID) {

                        $scope.CurrentCart[k].MoveTransactionData.MoveToLocationText = obj.LocationName;
                        $scope.CurrentCart[k].MoveTransactionData.MoveToLocation = obj.LocationID;
                        break;
                    }
                    else {
                        $scope.CurrentCart[k].MoveTransactionData.MoveToLocationText = "";
                        $scope.CurrentCart[k].MoveTransactionData.MoveToLocation = "";
                        log.error("Please select other location, you can't move item to same location.")
                        break;
                    }
                }
                else {

                    $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocationText = obj.LocationName;
                    $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocation = obj.LocationID;
                    break;
                }
            }

        }


        CheckScopeBeforeApply();;


        $(".activitycontent").show();

        $("#locationlistmodal").hide();
        CheckScopeBeforeApply()
    }
    $scope.GetLocationByID = function (LID) {
        if ($scope.LocationDataList.length > 0) {
            var _idData = parseInt(LID);
            for (var i = 0; i < $scope.LocationDataList.length; i++) {
                if ($scope.LocationDataList[i].LocationID == _idData) {
                    return $scope.LocationDataList[i].LocationName;
                }
            }
        }
    }

    $scope.hidelocationmodal = function () {

        $(".activitycontent").show();

        $("#locationlistmodal").hide();
        CheckScopeBeforeApply()
    }


    $scope.FillUOMLineItems = function (value, myid, uom) {
        $scope.ToUOMID = value;
        if ($scope.ToUOMID != 0) {
            var k = 0;
            for (k = 0; k < $scope.CurrentCart.length; k++) {
                $scope.CurrentCart[k].ConvertTransactionData.ToUOMID = $scope.ToUOMID;
                $scope.CurrentCart[k].ConvertTransactionData.ToUOM = uom;

            }

            ShowSuccessActivity('Updated', $scope._CurrentAction);

            $("#uom_" + myid).addClass("movepin");
            CheckScopeBeforeApply();
            $scope.CurrentLineItemIndex = -1;
            $scope.CurrentInventoryId = -1;
        }

        else {
            toastr.error("Please select some value.");
        }
    }

    $scope.FillQuantityConvert = function (value, myid, type) {
        var k = 0;
        $scope.ActionQuantityValueConvert = value;
        $scope.ActionQuantityOptionConvert = type;

        switch ($scope.ActionQuantityOptionConvert) {
            case 1:
                if ($scope.ActionQuantityValueConvert != "" && $scope.ActionQuantityValueConvert != undefined) {

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity = $scope.ActionQuantityValueConvert;

                    }
                    ShowSuccessActivity('Updated', $scope._CurrentAction);

                    $("#convertqty_" + myid).addClass("movepin")
                }
                else {
                    toastr.error("Please input some valid value");
                }
                break;
            case 2:
                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;

                }
                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#convertqty_" + myid).addClass("movepin")

                break;

            default:

        }

    };


    $scope.GetProperIndex = function (Type) {
        var _index = 0;


        switch (Type) {
            case 1:
                if ($scope.IsSingleMode == false) {
                    _index = 1;
                }
                else {
                    _index = $scope.CurrentCart.length;
                }

                break;
            case 2:
                if ($scope.IsSingleMode == false) {
                    _index = 2;
                }
                else {
                    _index = $scope.CurrentCart.length + 1;
                }
                break;

            default:

        }

        return _index;
    }

    $scope.changeMode = function () {
        $scope.IsSingleMode = !$scope.IsSingleMode;


        var i = 0;
        //if ($scope.IsSingleMode == false) {
        //    if ($scope.CurrentCart != null && $scope.CurrentCart.length > 0) {
        //        for (i = 0; i < $scope.CurrentCart.length; i++) {
        //            $scope.CurrentCart[i].IncreaseDecreaseVMData = angular.copy($scope.CurrentCart[0].IncreaseDecreaseVMData);
        //            $scope.CurrentCart[i].MoveTransactionData = angular.copy($scope.CurrentCart[0].MoveTransactionData);
        //            $scope.CurrentCart[i].UpdateTransactionData = angular.copy($scope.CurrentCart[0].UpdateTransactionData);
        //            $scope.CurrentCart[i].ApplyTransactionData = angular.copy($scope.CurrentCart[0].ApplyTransactionData);
        //            $scope.CurrentCart[i].ConvertTransactionData = angular.copy($scope.CurrentCart[0].ConvertTransactionData);
        //            $scope.CurrentCart[i].IsLineItemData = angular.copy($scope.CurrentCart[0].IsLineItemData);
        //        }
        //    }

        //}
        setTimeout(function () {
            InitializeSwiper();

            $scope.GoToStep(0, 2);
            $(".panel-title").click(function () {

                if ($("#collapseTwo").hasClass("in")) {
                    $(this).find("a").css("color", "inherit");
                    $scope.CollapsClass = "";
                    $scope.CollapsOpen = false;
                }
                else {

                    $(this).find("a").css("color", "white");
                    $scope.CollapsClass = $scope.CurrentHeaderClass;
                    $scope.CollapsOpen = true;


                }

                CheckScopeBeforeApply();

            });

        }, 0);
        $scope.$apply();

        setTimeout(function () { $('.itUpdateDate').val(today) }, 1000);

        setTimeout(function () {




            $(".weekPicker,.monthPicker").each(function () {
                var _val = $(this).attr("selectvalue");
                $(this).val(_val);
                $(this).trigger("change");
            });

        }, 2000);

        setTimeout(function () {
            $('.FormDateType').each(function () {
                if ($.trim($(this).val()) != "") {
                    $(this).val(today)

                }
            });
        }, 1000);
    }
    $scope.FillQuantityToConvert = function (value, myid, Type) {
        $scope.ActionQuantityValueToConvert = value;
        var k = 0;
        $scope.ActionQuantityOptionToConvert = Type;
        switch ($scope.ActionQuantityOptionToConvert) {
            case 1:
                if ($scope.ActionQuantityValueToConvert != "" && $scope.ActionQuantityValueToConvert != undefined) {

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity = $scope.ActionQuantityValueToConvert;
                    }
                    ShowSuccessActivity('Updated', $scope._CurrentAction);

                    $("#convertqty2_" + myid).addClass("movepin")
                }
                else {
                    toastr.error("Please input some valid value");
                }
                break;
            case 2:
                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                }
                $("#convertqty2_" + myid).addClass("movepin")
                break;
            case 3:
                if ($scope.ActionQuantityValueToConvert != "" && $scope.ActionQuantityValueToConvert != undefined) {
                    if ($scope.ActionQuantityValueToConvert != 0) {
                        for (k = 0; k < $scope.CurrentCart.length; k++) {

                            $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity * $scope.ActionQuantityValueToConvert;
                        }

                        ShowSuccessActivity('Updated', $scope._CurrentAction);

                        $("#convertqty2_" + myid).addClass("movepin")
                    }
                    else {
                        toastr.error("Zero value is not allowed,please fill some different value as multiplier")
                    }
                }
                else {
                    toastr.error("Please input some valid value");
                }
                break;
            case 4:
                if ($scope.ActionQuantityValueToConvert != "" && $scope.ActionQuantityValueToConvert != undefined) {
                    if ($scope.ActionQuantityValueToConvert != 0) {
                        for (k = 0; k < $scope.CurrentCart.length; k++) {
                            var _tempValue = parseInt($scope.CurrentCart[k].InventoryDataList.oquantity / $scope.ActionQuantityValueToConvert);
                            $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity = _tempValue;
                        }

                        ShowSuccessActivity('Updated', $scope._CurrentAction);

                        $("#convertqty2_" + myid).addClass("movepin")
                    }
                    else {
                        toastr.error("Zero value is not allowed, please fill some different value as dividend")
                    }
                }
                else {
                    toastr.error("Please input some valid value");
                }
                break;
            default:

        }

    };


    $scope.Scanitem = function () {



        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan(function (result) {

            $scope.CurrentInventory.pPart = result.text;

            $scope.$apply();


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.Scandescription = function () {



        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan(function (result) {

            $scope.CurrentInventory.pDescription = result.text;

            $scope.$apply();


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    init();
    $scope.Unitautocomplete = function (ControlID, ID, FieldName) {

        var _unitData = $scope.GetUnitDataFieldByName(FieldName)
        $scope.UnitAutoComboValues = _unitData.FieldComboValues;
        $scope.ActiveUnitAutoCompleteField = ControlID + ID.toString();


        $("#Unitautolistmodal").modal("show");
    }


    $scope.fillUnitAutoCompleteValue = function (value) {
        $("#" + $scope.ActiveUnitAutoCompleteField).val(value);

        $("#" + $scope.ActiveUnitAutoCompleteField).trigger("input");
        CheckScopeBeforeApply();
        $("#Unitautolistmodal").modal('hide');

    }



    $scope.Unitradiolist = function (ControlID, ID, FieldName) {

        var _unitData = $scope.GetUnitDataFieldByName(FieldName)
        $scope.UnitRadioValues = _unitData.FieldRadioValues;
        $scope.ActiveUnitRadioField = ControlID + ID.toString();


        $("#Unitradiotextmodal").modal("show");
    }


    $scope.fillUnitradiovalue = function (value) {
        $scope.selectedUnitradiovalue = value;
    }


    $scope.fillUnitvaluetoradio = function () {

        $("#" + $scope.ActiveUnitRadioField).val($scope.selectedUnitradiovalue);

        $("#" + $scope.ActiveUnitRadioField).trigger("input");

        $("#Unitradiotextmodal").modal("hide");

    }

    $scope.UpDownValueUnit = function (text, value, IsUp) {


        var _ID;
        _ID = "#" + text + value;
        var _inputvalue = $(_ID).val();
        var _Max = $(_ID).attr("max");
        var _Min = $(_ID).attr("min");
        _inputvalue = TryParseInt(_inputvalue, 0);
        _Max = TryParseInt(_Max, -100);
        _Min = TryParseInt(_Min, -100);
        if (IsUp && _Max != -100 && _inputvalue == _Max) {
            log.error("Exceeding maximum value " + _Max + ", Please fill lesser value than maximum value");
        }

        else if (!IsUp && _Min != -100 && _inputvalue == _Min) {
            log.error("Beneath the  minimum value " + _Min + ", Please fill greater value than minimum value");

        }
        else {

            _inputvalue = _inputvalue + (IsUp ? 1 : -1);

            $(_ID).val(_inputvalue);


            $(_ID).trigger("change");
        }

        playtouch(IsUp);

    }
    function UpdateCartWithCustomFields() {
        var k = 0;
        var j = 0;
        var _TempArray = [];
        for (k = 0; k < $scope.CustomActivityDataList.length; k++) {
            if ($scope.CustomActivityDataList[k].cfdCustomFieldType.toLowerCase() == "inventory" && $scope.CustomActivityDataList[k].isLineItem == "True") {
                _TempArray.push($scope.CustomActivityDataList[k]);
                $scope.isLineItemColumnNames.push($scope.CustomActivityDataList[k].cfdName)
            }





        }
        if ($scope.CurrentCart.length > 0) {
            var i = 0;
            for (i = 0; i < $scope.CurrentCart.length; i++) {

                for (j = 0; j < _TempArray.length; j++) {
                    $scope.CurrentCart[i].IsLineItemData.push({
                        cfdIsRequired: _TempArray[j].cfdIsRequired, cfdName: _TempArray[j].cfdName,
                        cfdID: _TempArray[j].cfdID,
                        InventoryID: $scope.CurrentCart[i].InventoryID,
                        cfdCustomFieldType: _TempArray[j].cfdCustomFieldType,
                        ColumnMap: _TempArray[j].ColumnMap,
                        cfdDataType: _TempArray[j].cfdDataType,
                        CfValue: _TempArray[j].cfdDefaultValue != null && $.trim(_TempArray[j].cfdDefaultValue) != "" ? _TempArray[j].cfdDefaultValue : "",
                        cfdComboValues: _TempArray[j].cfdComboValues == null ? [] : _TempArray[j].cfdComboValues,
                        cfdprefixsuffixtype: _TempArray[j].cfdprefixsuffixtype == null ? "" : _TempArray[j].cfdprefixsuffixtype,
                        cfdPrefix: _TempArray[j].cfdPrefix == null ? "" : _TempArray[j].cfdPrefix,
                        cfdSuffix: _TempArray[j].cfdSuffix == null ? "" : _TempArray[j].cfdSuffix,
                        cfdIsIncremental: _TempArray[j].cfdIsIncremental,
                        cfdBaseValue: _TempArray[j].cfdBaseValue == null ? 0 : _TempArray[j].cfdBaseValue,
                        cfdIncrementby: _TempArray[j].cfdIncrementby == null ? 0 : _TempArray[j].cfdIncrementby,
                        cfdIsAutoComplete: _TempArray[j].cfdIsAutoComplete == null ? "" : _TempArray[j].cfdIsAutoComplete,
                        cfdInputMask: _TempArray[j].cfdInputMask == "text" ? "NA" : _TempArray[j].cfdInputMask,
                        MaximumValue: _TempArray[j].cfdIsIncremental == true ? _TempArray[j].MaximumValue : null,
                        CombineValue: _TempArray[j].CombineValue,
                        cfdSpecialType: _TempArray[j].cfdSpecialType == null ? "" : _TempArray[j].cfdSpecialType,
                        cfdRadioValues: _TempArray[j].cfdRadioValues == null ? "" : _TempArray[j].cfdRadioValues,
                        cfdTruelabel: _TempArray[j].cfdTruelabel,
                        cfdFalselabel: _TempArray[j].cfdFalselabel,
                        cfdUse24Hours: _TempArray[j].cfdUse24Hours,
                        cfdMax: _TempArray[j].MaximumValue == null ? null : _TempArray[j].MaximumValue,
                        cfdMin: _TempArray[j].MinimumValue == null ? null : _TempArray[j].MinimumValue,
                    });
                }

            }

            console.log("Current Cart333");
            console.log($scope.CurrentCart);
        }

        CheckScopeBeforeApply();

        AssignFirstObject();
    }
    function IsAvailableMyInventoryColumn(ColumnName) {
        var i = 0;
        for (i = 0; i < $scope.MyinventoryFields.length; i++) {
            if ($scope.MyinventoryFields[i].ColumnName == ColumnName) {
                return true;
            }
        }

        return false;
    }
    function GetMyInventoryColumns() {
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

                      // MY inventory column region
                      var _TempArrayMyInventory = response.GetMyInventoryColumnsResult.Payload;

                      for (var i = 0; i < _TempArrayMyInventory.length; i++) {
                          var _ColName = _TempArrayMyInventory[i].ColumnName.split("#");
                          _TempArrayMyInventory[i].ColumnName = _ColName[0];
                          if (_TempArrayMyInventory[i].mobileorder != 0) {
                              $scope.MyinventoryFields.push(_TempArrayMyInventory[i]);
                          }
                      }

                  }
                  else {
                      $scope.ShowErrorMessage("Getting myinventory columns", 1, 1, response.GetMyInventoryColumnsResult.Message)

                  }
                  CheckScopeBeforeApply();

                  setTimeout(function () {
                      SetPermisssions();

                  }, 500);


              },
              error: function (err) {
                  console.log(err);
                  $scope.ShowErrorMessage("Getting myinventory columns", 2, 1, err.statusText);



              }
          });
    }

    function IsAnyUnitDataFieldActive() {
        return IsAvailableMyInventoryColumn('iReqValue') || IsAvailableMyInventoryColumn('iUniqueDate') || IsAvailableMyInventoryColumn('iUnitDate2') || IsAvailableMyInventoryColumn('iUnitDate3') || IsAvailableMyInventoryColumn('iUnitDate4') || IsAvailableMyInventoryColumn('iUnitNumber1') || IsAvailableMyInventoryColumn('iUnitNumber2') || IsAvailableMyInventoryColumn('iUnitNumber3') || IsAvailableMyInventoryColumn('iUnitNumber4') || IsAvailableMyInventoryColumn('iUnitTag2') || IsAvailableMyInventoryColumn('iUnitTag3') || IsAvailableMyInventoryColumn('iUnitTag4') || IsAvailableMyInventoryColumn('iUnitTag5') || IsAvailableMyInventoryColumn('iUnitTag6') || IsAvailableMyInventoryColumn('iUnitTag7') || IsAvailableMyInventoryColumn('iUnitTag8');
    }
    function SetPermisssions() {

        $scope.CanIncrease = IsAvailableMyInventoryColumn('iQty') && $scope.checkpermission('ACTION:CanAddInventory') ? 'True' : 'False';
        $scope.CanDecrease = IsAvailableMyInventoryColumn('iQty') && $scope.checkpermission('ACTION:CanSubtractInventory') ? 'True' : 'False';
        $scope.CanConvert = IsAvailableMyInventoryColumn('uomUOM') && $scope.checkpermission('ACTION:CanConvertInventory') ? 'True' : 'False';
        $scope.CanMove = IsAvailableMyInventoryColumn('lLoc') && $scope.checkpermission('ACTION:CanMoveInventory') ? 'True' : 'False';
        $scope.CanStatus = IsAvailableMyInventoryColumn('iStatusValue') && $scope.checkpermission('ACTION:CanStatusInventory') ? 'True' : 'False';
        $scope.CanMoveTagUpdate = (IsAvailableMyInventoryColumn('lLoc') || IsAvailableMyInventoryColumn('iStatusValue') || IsAnyUnitDataFieldActive()) && $scope.checkpermission('ACTION:CanMoveTagUpdate') && $scope.checkpermission('ACTION:CanStatusInventory') == true && $scope.checkpermission('ACTION:CanMoveInventory') == true && $scope.checkpermission('ACTION:UniqueTag') == true ? 'True' : 'False';
        $scope.CanApply = (IsAnyUnitDataFieldActive()) && $scope.checkpermission('ACTION:UniqueTag') ? 'True' : 'False';



        CheckScopeBeforeApply();
    }
    function AssignFirstObject() {
        if ($scope.CurrentCart.length > 0) {
            $scope._IsLoading = false;
            setTimeout(function () {
                InitializeSwiper();

            }, 0);
        }
        CheckScopeBeforeApply();
        $(".form-control").first().focus();

        setTimeout(function() {
            $('.changebtn').hide();
        }, 3000)

        setTimeout(function () {
            $('.changebtn').hide();
        }, 2000)

        setTimeout(function () {
            $('.changebtn').hide();
        }, 1000)

        setTimeout(function () {
            $('.changebtn').hide();
        }, 4000)

        $('.changebtn').hide();
        $("input[type='number']").trigger("change");

        if ($scope.CurrentCart.length < 12) {

            $(".itemlink").hide();

            $(".itemcontent").removeClass("CollapseData");

        

            
        }

        else {

            $(".itemlink").show();

            $(".itemcontent").addClass("CollapseData");
        }




    }

  


    function GetCustomDataField(Type) {
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
                   if (response.GetCustomFieldsDataResult.Success == true) {


                     
                       $scope.CustomActivityDataList = response.GetCustomFieldsDataResult.Payload;



                       for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {



                           if ($.trim($scope.CustomActivityDataList[i].cfdComboValues) != '') {
                               $scope.CustomActivityDataList[i].cfdComboValues = $scope.CustomActivityDataList[i].cfdComboValues.filter(function (e) { return e });
                           }


                           var _defaultValue = angular.copy($scope.CustomActivityDataList[i].cfdDefaultValue);



                           if ($scope.CustomActivityDataList[i].cfdDataType == "datetime") {
                               if (_defaultValue != null && _defaultValue != "") {

                                   if ($scope.CustomActivityDataList[i].cfdSpecialType == 2) {
                                       $scope.CustomActivityDataList[i].cfdDefaultValue = ConverttoMsJsonDateTime(_defaultValue);
                                   }
                                   else if ($scope.CustomActivityDataList[i].cfdSpecialType == 3) {
                                       $scope.CustomActivityDataList[i].cfdDefaultValue = ConvertToTime(_defaultValue);
                                   }
                                   else {

                                       $scope.CustomActivityDataList[i].cfdDefaultValue = formatDate(_defaultValue);
                                   }
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
                           else if ($scope.CustomActivityDataList[i].cfdDataType == "checkbox") {
                               var _value = angular.copy($scope.CustomActivityDataList[i].cfdDefaultValue);
                               $scope.CustomActivityDataList[i].cfdDefaultValue = (_value == "true" || _value === "True");
                           }
                           var _CustomObj = angular.copy($scope.CustomActivityDataList[i]);
                           if ($.trim(_CustomObj.cfdprefixsuffixtype) != "") {

                               var _value = _CustomObj.CombineValue;

                               $scope.CustomActivityDataList[i].cfdDefaultValue = _value;
                           }

                           $scope.CustomActivityDataList[i].CfValue = angular.copy($scope.CustomActivityDataList[i].cfdDefaultValue);


                       }


                       CheckScopeBeforeApply();
                       UpdateCartWithCustomFields();
                   }
                   else {
                       $scope.ShowErrorMessage("Getting custom data", 1, 1, response.GetCustomFieldsDataResult.Message)

                   }
                   CheckScopeBeforeApply();
               },
               error: function (response) {
                   $scope.ShowErrorMessage("Getting custom data", 2, 1, err.statusText);

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



                          if (_TempArray[i].ColumnName == "pPart") {
                              $scope.realItemname = _TempArray[i].ColumnLabel;

                          }

                          if (_TempArray[i].ColumnName == "pDescription") {
                              $scope.realDescname = _TempArray[i].ColumnLabel;

                          }

                          if (_TempArray[i].ColumnName == "iStatusValue") {
                              $scope.statusLabel = _TempArray[i].ColumnLabel;
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

    $scope.GetMyinventoryColumns()


    function playtouch(noicetype) {
        if (window.plugins && window.plugins.NativeAudio) {



            if (noicetype == true || noicetype == "true") {
                window.plugins.NativeAudio.play('click');
            }

            else {
                window.plugins.NativeAudio.play('dclick');
            }




            // Play


            // Stop multichannel clip after 60 seconds
            //window.setTimeout(function () {


            //    window.plugins.NativeAudio.unload('click');

            //}, 1000 * 60);
        }

    }

    $scope.UpDownValue = function (value, IsUp, Type) {

        switch (value) {
            case "Quantity":

                break;
            default:
                var _name;
                var _ID;

                if (Type == 3) {


                    _ID = "#LineItem_" + value;
                }
                else {


                    _ID = "#CustomActivity_" + value;
                }

                var _inputvalue = $(_ID).val();
                var _Max = $(_ID).attr("max");
                var _Min = $(_ID).attr("min");
                _inputvalue = TryParseInt(_inputvalue, 0);
                _Max = TryParseInt(_Max, -100);
                _Min = TryParseInt(_Min, -100);
                if (IsUp && _Max != -100 && _inputvalue == _Max) {
                    log.error("Exceeding maximum value " + _Max + ", Please fill lesser value than maximum value");
                }

                else if (!IsUp && _Min != -100 && _inputvalue == _Min) {
                    log.error("Beneath the  minimum value " + _Min + ", Please fill greater value than minimum value");

                }
                else {

                    _inputvalue = _inputvalue + (IsUp ? 1 : -1);

                    $(_ID).val(_inputvalue);


                    $(_ID).trigger("change");
                }

        }

        playtouch(IsUp);

    }

    $scope.IsActiveTransactionField = function (cfdid) {




        for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
            if ($scope.CustomActivityDataList[i].cfdCustomFieldType.toLowerCase() == "inventory" && $scope.CustomActivityDataList[i].cfdID == cfdid) {
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

                    case "MoveTagUpdate":

                        //   alert("NTU");
                        // 

                        $scope.CustomActivityDataList[i].cfdIncludeOnMoveTagUpdate = true;

                        if ($scope.CustomActivityDataList[i].cfdIncludeOnMoveTagUpdate) {

                            //   alert("Is having");

                            //     

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

    function init() {

       

        $scope.CurrentCart = localStorageService.get("ActivityCart");


        console.log("test");
        console.log($scope.CurrentCart);

       

        var _CurrentAction = localStorageService.get("SelectedAction");
        _CurrentAction = _CurrentAction != null && _CurrentAction != undefined ? parseInt(_CurrentAction) : 4548;
        var _autoClear = localStorageService.get('CustomAutoClear');

        $scope.CustomAutoClear = _autoClear == "true" || _autoClear == true ? true : false;

        var _autoClear1 = localStorageService.get('AutoClear');

        $scope.CanAutoClear = _autoClear1 == "true" || _autoClear1 == true ? true : false;
        $scope._CurrentAction = _CurrentAction;
        GetActionType(_CurrentAction);


        $scope.totalLength = $scope.IsSingleMode == true ? $scope.CurrentCart.length + 2 : 3;

        GetMyInventoryColumns();

        GetCustomDataField(1);
        getuom();
        $scope.getstatus()

   
        $scope.GetActiveUnitDataField();

        $scope.getlocation();
        if (localStorageService.get('AllowNegativeQuantity') != null && localStorageService.get('AllowNegativeQuantity') != undefined) {
            var _temp = localStorageService.get('AllowNegativeQuantity');
            if (_temp == 'true' || _temp == true) {
                $scope.AllowNegative = true;
                _AllowNegative = 'True';
            }
            else {
                $scope.AllowNegative = false;
                _AllowNegative = 'False';
            }
        }
        else {
            $scope.AllowNegative = false;
            _AllowNegative = 'False';
        }
        for (var i = 0; i < $scope.CurrentCart.length; i++) {
            $scope.CurrentCart[i].MoveUpdateTagTransactionData.UniqueDate = angular.copy($scope.CurrentCart[i].ApplyTransactionData.UniqueDate);
            $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitDate2 = angular.copy($scope.CurrentCart[i].ApplyTransactionData.UnitDate2);
            $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitDate3 = angular.copy($scope.CurrentCart[i].ApplyTransactionData.UnitDate3);
            $scope.CurrentCart[i].MoveUpdateTagTransactionData.UnitDate4 = angular.copy($scope.CurrentCart[i].ApplyTransactionData.UnitDate4);

            if ($scope.CurrentCart[i].iCostPerItem==0) {
                $scope.CurrentCart[i].iCostPerItem = null;
            }

        }

        $scope.CurrentCartBkup = angular.copy($scope.CurrentCart);
        CheckScopeBeforeApply();
        console.log("Activity Data");
        console.log($scope.CurrentCart)
        setTimeout(function () {

            $(".weekPicker,.monthPicker").each(function () {
                var _val = $(this).attr("selectvalue");
                $(this).val(_val);
                $(this).trigger("change");
            });

        }, 2000);

    }

    $scope.Operate = function (type) {
        $scope._CurrentAction = type;
        GetActionType(type);
        $scope.totalLength = $scope.IsSingleMode == true ? $scope.CurrentCart.length + 2 : 3;

        if ($scope.CurrentCart.length > 0) {

            for (var k = 0; k < $scope.CurrentCart.length; k++) {
                $scope.CurrentCart[k].ActionPerformed = -1;
            }
        }
        
        $scope.$apply();

        setTimeout(function () {
            $(".form-control").first().focus();
            $('.changebtn').hide();
            $("input[type='number']").trigger("change");
        }, 500);

    }



    $scope.showallmenu = function () {

        $("#mycartModal").modal('toggle');

    }


    function GetActionType(Action) {
        switch (Action) {
            case -1:
                $scope.CurrentClass = "bgm-decrease";
                $scope.CurrentHeaderClass = "bgm-decrease";
                $scope.CurrentOperation = "Decrease";
                $scope.CurrentIcon = "fa-arrow-down";
                $scope.CurrentHeaderText = "Take these items out of inventory.";
                UpdateStatusBar(Action);

                break;
            case 0:
                $scope.CurrentClass = "bgm-move";
                $scope.CurrentHeaderClass = "bgm-move";
                $scope.CurrentOperation = "Move";
                $scope.CurrentIcon = "fa-arrow-right";
                $scope.CurrentHeaderText = "Move these items to a different location.";
                UpdateStatusBar(Action);
                break;
            case 1:
                $scope.CurrentClass = "bgm-increase"
                $scope.CurrentHeaderClass = "bgm-increase";
                $scope.CurrentOperation = "Increase";
                $scope.CurrentIcon = "fa-arrow-up";
                $scope.CurrentHeaderText = "Put these items in inventory.";
                UpdateStatusBar(Action);
                break;
            case 2:
                $scope.CurrentClass = "bgm-convert"
                $scope.CurrentHeaderClass = "bgm-convert";
                $scope.CurrentOperation = "Convert";
                $scope.CurrentIcon = "fa-sitemap";
                $scope.CurrentHeaderText = "Convert the units of measure for these items.";

                UpdateStatusBar(Action);

                break;
            case 3:
                $scope.CurrentClass = "bgm-purple"
                $scope.CurrentHeaderClass = "bgm-purple";
                $scope.CurrentOperation = "Update";
                $scope.CurrentIcon = "fa-history fa-flip-horizontal";
                $scope.CurrentHeaderText = "Update the status of these items.";

                UpdateStatusBar(Action);
                break;
            case 4:
                $scope.CurrentClass = "bgm-apply"
                $scope.CurrentHeaderClass = "bgm-apply";
                $scope.CurrentOperation = "Apply";
                $scope.CurrentIcon = "fa-tag";
                $scope.CurrentHeaderText = "Tag these items with information.";

                UpdateStatusBar(Action);
                break;

            case 5:
                $scope.CurrentClass = "bgm-MoveTagUpdate"
                $scope.CurrentHeaderClass = "bgm-MoveTagUpdate";
                $scope.CurrentOperation = "MoveTagUpdate";
                $scope.CurrentIcon = "fa-list-ul";
                $scope.CurrentHeaderText = "Move,Tag,Update these items with information.";

                UpdateStatusBar(Action);
                break;

            case 12:

                $scope.CurrentOperation = "Adjust";


                $scope.CurrentClass = "bgm-orange";
                $scope.CurrentHeaderClass = "bgm-orange";

                $scope.CurrentIcon = "fa-arrows-v";
                $scope.CurrentHeaderText = "Adjust the quantity of these items.";
                UpdateStatusBar(Action);
                break;
            default:
                $scope.CurrentOperation = "";
                UpdateStatusBar(55);
                break;


        }

        CheckScopeBeforeApply();
    }


    function InitializeSwiper() {

        mySwiper = new Swiper('.swiper-container', {
            //Your options here:
            initialSlide: 0,
            speed: 500,
            effect: 'flip',

            allowSwipeToPrev: false,


            onSlideChangeEnd: function (swiperHere) {

                $('html,body').animate({ scrollTop: 0 }, 800);
                $scope.CurrentStep = swiperHere.activeIndex;

                $scope.totalLength = $scope.IsSingleMode == true ? $scope.CurrentCart.length + 2 : 3;

                CheckScopeBeforeApply();
                $scope.changeNav();


            }




        });
    }

    function GetTypeByIndex() {
        var _type = "";
        $(".swiper-slide").each(function () {

            if ($(this).hasClass("swiper-slide-active")) {
                _type = $(this).attr("data-type") != null && $(this).attr("data-type") != undefined ? $(this).attr("data-type") : "";

                console.log(_type);
            }

        });

        return _type;

    }


    $scope.GoToStep = function (Index, _step) {


        $('html,body').animate({ scrollTop: 0 }, 800);


        var type = GetTypeByIndex();




        _step = _step == null || _step == undefined ? 1 : _step;
        switch (_step) {
            case 1:
                if (!$scope.ValidateObjectVMStop(Index, type)) {

                    $(".swiper-slide").each(function () {

                        if ($(this).attr("data-index") == Index) {
                            mySwiper.swipeTo($(this).index(), 1000, false);

                            setTimeout(function () {
                                $scope.CurrentStep = Index;
                                CheckScopeBeforeApply();
                            }, 0);



                            return false;
                        }

                    });
                }
                else {
                    $scope.ShowErrorMessage($scope.IssueType)
                }
                break;
            case 2:
                $(".swiper-slide").each(function () {

                    if ($(this).attr("data-index") == Index) {
                        mySwiper.swipeTo($(this).index(), 1000, false);

                        setTimeout(function () {
                            $scope.CurrentStep = Index;
                            CheckScopeBeforeApply();
                        }, 0);

                        return false;
                    }

                });
                break;
            default:

                if (!$scope.ValidateObjectVMStop(Index, type)) {

                    $(".swiper-slide").each(function () {

                        if ($(this).attr("data-index") == Index) {
                            mySwiper.swipeTo($(this).index(), 1000, false);

                            setTimeout(function () {
                                $scope.CurrentStep = Index;
                                CheckScopeBeforeApply();
                            }, 0);

                            return false;
                        }

                    });
                }
                else {
                    $scope.ShowErrorMessage($scope.IssueType)
                }

                break;

        }



    }
    $scope.TrimValue = function (value) {        

        if (value != null && value != undefined) {
            return $.trim(value);
        }
        else {
            return "";
        }

    }
    $scope.UpdateQty = function (Qty, Index) {        

        debugger;

        $scope.ActionQuantityValue = Qty;
        var value = 0;
        $scope.CurrentCart[Index].AdjustCalculation = "";
        if ($scope.CurrentOperation == "Adjust") {           

           
            if ($.trim($scope.ActionQuantityValue) != "" && $.trim($scope.ActionQuantityValue) != null && $.trim($scope.ActionQuantityValue) != undefined) {

                if ($scope.ActionQuantityValue > $scope.CurrentCart[Index].InventoryDataList.oquantity) {
                    value = $scope.ActionQuantityValue - $scope.CurrentCart[Index].InventoryDataList.oquantity;
                    $scope.CurrentCart[Index].AdjustCalculation += $scope.CurrentCart[Index].InventoryDataList.oquantity.toString() + " + " + value.toString() + "=" + $scope.ActionQuantityValue.toString();

                    

                }
                else if ($scope.ActionQuantityValue < $scope.CurrentCart[Index].InventoryDataList.oquantity) {
                    value = $scope.CurrentCart[Index].InventoryDataList.oquantity - $scope.ActionQuantityValue;
                    $scope.CurrentCart[Index].AdjustCalculation += $scope.CurrentCart[Index].InventoryDataList.oquantity.toString() + " - " + value.toString() + "=" + $scope.ActionQuantityValue.toString();

                   

                }
                else {
                    value = 0;
                    $scope.CurrentCart[Index].AdjustCalculation += $scope.CurrentCart[Index].InventoryDataList.oquantity.toString() + " + " + value.toString() + "=" + $scope.ActionQuantityValue.toString();

                    
                   
                }

                $scope.CurrentCart[Index].AdjustActionQuantity = value;

                
                $scope.IsQuantityUpdated = true;

                $scope.CurrentCart[Index].ActionPerformed = ($scope.ActionQuantityValue > $scope.CurrentCart[Index].InventoryDataList.oquantity || $scope.ActionQuantityValue == $scope.CurrentCart[Index].InventoryDataList.oquantity) ? "1" : "-1";

                $scope.checkToShowAdjustActivity();

            }
        }

    }

    //Updates of Adjust activity work 7/19/2018
    $scope.checkToShowAdjustActivity = function ()
    {
         
        $scope.onlyShowIncreaseAdjustActivity = false;
        $scope.onlyShowDecreaseAdjustActivity = false;
        var showIncrease = [];
        var showDecrease = [];
        var showBothIncreaseDecrease = [];

        for (var x = 0; x < $scope.CurrentCart.length; x++) {
            if ($scope.CurrentCart[x].ActionPerformed == "1") {
               
                showIncrease.push("1");
            }
            if ($scope.CurrentCart[x].ActionPerformed == "-1") {
                
                showDecrease.push("1");
            }
            if ($scope.CurrentCart[x].AdjustActionQuantity === 0) {

                showBothIncreaseDecrease.push("1");
            }
        }

        if (showIncrease.length > 0 && showBothIncreaseDecrease.length == 0)
        {           
            $scope.onlyShowIncreaseAdjustActivity = true;
        }

        if (showDecrease.length > 0 && showBothIncreaseDecrease.length == 0) {
           
            $scope.onlyShowDecreaseAdjustActivity = true;
        }

        if (showBothIncreaseDecrease.length > 0) {           
            $scope.onlyShowIncreaseAdjustActivity = true;
            $scope.onlyShowDecreaseAdjustActivity = true;
        }

    }


    $scope.UpdateQtyAll = function (Qty, _Index) {

        $scope.ActionQuantityValue = Qty;
        var value = 0;
        $scope.CurrentCart[_Index].AdjustCalculation = "";
        if ($scope.CurrentOperation == "Adjust") {


            if ($scope.ActionQuantityValue != "" && $scope.ActionQuantityValue != null && $scope.ActionQuantityValue != undefined) {

                for (var Index = 0; Index < $scope.CurrentCart.length; Index++) {
                    $scope.CurrentCart[Index].AdjustCalculation = "";
                    if ($scope.ActionQuantityValue > $scope.CurrentCart[Index].InventoryDataList.oquantity) {
                        value = $scope.ActionQuantityValue - $scope.CurrentCart[Index].InventoryDataList.oquantity;
                        $scope.CurrentCart[Index].AdjustCalculation += $scope.CurrentCart[Index].InventoryDataList.oquantity.toString() + " + " + value.toString() + "=" + $scope.ActionQuantityValue.toString();
                    }
                    else if ($scope.ActionQuantityValue < $scope.CurrentCart[Index].InventoryDataList.oquantity) {
                        value = $scope.CurrentCart[Index].InventoryDataList.oquantity - $scope.ActionQuantityValue;
                        $scope.CurrentCart[Index].AdjustCalculation += $scope.CurrentCart[Index].InventoryDataList.oquantity.toString() + " - " + value.toString() + "=" + $scope.ActionQuantityValue.toString();
                    }
                    else {
                        value = 0;
                        $scope.CurrentCart[Index].AdjustCalculation += $scope.CurrentCart[Index].InventoryDataList.oquantity.toString() + " + " + value.toString() + "=" + $scope.ActionQuantityValue.toString();
                    }

                    $scope.CurrentCart[Index].AdjustActionQuantity = value;

                    $scope.IsQuantityUpdated = true;

                    $scope.CurrentCart[Index].ActionPerformed = ($scope.ActionQuantityValue > $scope.CurrentCart[Index].InventoryDataList.oquantity || $scope.ActionQuantityValue == $scope.CurrentCart[Index].InventoryDataList.oquantity) ? "1" : "-1";
                }
                CheckScopeBeforeApply();
            }
        }

    }


    $scope.CheckOnAdjust = function (cfdid, IsIncrease) {
        var _data = true;
        var _CurrentCustomColumns = angular.copy($scope.CustomActivityDataList);
        for (var i = 0; i < _CurrentCustomColumns.length; i++) {
            if (_CurrentCustomColumns[i].cfdCustomFieldType.toLowerCase() == "inventory" && _CurrentCustomColumns[i].cfdID == cfdid) {
                switch ($scope.CurrentOperation) {
                    case "Increase":
                    case "Decrease":
                    case "Move":
                    case "Apply":
                    case "Update":
                    case "Convert":
                        return true;
                        break;
                    case "Adjust":
                        var _value = true;
                        if (IsIncrease == 1) {
                            _value = _CurrentCustomColumns[i].cfdIncludeOnAdd && _data;

                        }
                        else if (IsIncrease == -1) {
                            _value = _CurrentCustomColumns[i].cfdIncludeOnSubtract && _data;

                        }

                        return _value;
                        break;

                    default:
                        return true;
                        break;

                }
            }
        }

    }

    function BuildCustomArrayData() {
        var _array = [];
         
        // process all custom fields that are NOT checkboxes
        $.each($('.customActivityData input[cfd-id]:not(":checkbox"):not(":hidden"), .customActivityData select[cfd-id]:not(":hidden"), .customActivityData  textarea[cfd-id]:not(":hidden")'), function () {

      

            var _u3prefix = $(this).attr("data-prefix");
            var _u3suffix = $(this).attr("data-suffix");
            var _u3original = $(this).val();
            var _value = "";
            if ($.trim(_u3prefix) != "" || $.trim(_u3suffix) != "") {
                if ($.trim(_u3original) != "") {
                    _value = _u3prefix + _u3original + _u3suffix;
                }
                else {
                    _value = "";
                }
            }
            else {
                _value = $(this).val();
            }
            _array.push({ "CfdID": $(this).attr('cfd-id'), "Value": _value, "DataType": $(this).attr('custom-data-type') });
        });

        // process the checkboxes by getting the Boolean string for whether they are currently checked
        $.each($('.customActivityData input:checkbox[cfd-id]'), function () {
            var _dataVal = $(this).is(':checked').toString();
            _dataVal = _dataVal.substr(0, 1).toUpperCase() + _dataVal.substr(1).toLowerCase();

            _array.push({ "CfdID": $(this).attr('cfd-id'), "Value": _dataVal, "DataType": $(this).attr('custom-data-type') });
        });
        return _array;
    }

    function BuildCustomArrayDataSelector(selector) {

         
        var _array = [];
        // process all custom fields that are NOT checkboxes
        //ETJ - add selector in front of select and textarea
        $.each($(selector + ' input[cfd-id]:not(":checkbox"):not(":hidden"), ' + selector + ' select[cfd-id], ' + selector + ' textarea[cfd-id]:not(":hidden")'), function () {

            var _u3prefix = $(this).attr("data-prefix");
            var _u3suffix = $(this).attr("data-suffix");
            var _u3original = $(this).val();
            var _value = "";
            if ($.trim(_u3prefix) != "" || $.trim(_u3suffix) != "") {
                if ($.trim(_u3original) != "") {              
                    _value = _u3prefix + _u3original + _u3suffix;
                }
                else {              
                    _value = "";
                }
            }
            else {
                _value = $(this).val();
            }
            _array.push({ "CfdID": $(this).attr('cfd-id'), "Value": _value, "DataType": $(this).attr('custom-data-type') });
        });

        // process the checkboxes by getting the Boolean string for whether they are currently checked

        $.each($(selector + ' input:checkbox'), function () {

            var _dataVal = $(this).is(':checked').toString();
            _dataVal = _dataVal.substr(0, 1).toUpperCase() + _dataVal.substr(1).toLowerCase();
            var _cfdid = $(this).attr('cfd-id');
            var _cfdatatype = $(this).attr('custom-data-type');

            if (_cfdid != undefined && _cfdatatype != undefined) {
                _array.push({ "CfdID": _cfdid, "Value": _dataVal, "DataType": _cfdatatype });

            }
        });


        return _array;
    }

    $scope.FillQuantity = function (value, id, type) {
        $scope.ActionQuantityValue = value;

        var k = 0;
        switch (type) {
            case 1:
                if ($scope.ActionQuantityValue != "" && $scope.ActionQuantityValue != undefined) {

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.ActionQuantityValue;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.ActionQuantityValue;
                    }

                    $("#mybutton_" + id).addClass("movepin")
                    ShowSuccessActivity('Updated', $scope._CurrentAction);
                    $(".WholeNumbersOnly").trigger('change');
                    CheckScopeBeforeApply();
                }
                else {
                    log.error("Please input some valid value");
                }
                break;
            case 2:

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentCart[k].InventoryDataList.oquantity > 0) {

                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                    }
                    else {
                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = 0;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = 0;
                    }
                }
                ShowSuccessActivity('Updated', $scope._CurrentAction);
                $(".WholeNumbersOnly").trigger('change');
                $("#mybutton_" + id).addClass("movepin")

                CheckScopeBeforeApply();;

                break;

            default:

        }
    };


    $scope.FillQuantityMove = function (value, id, type) {


        var k = 0;

        $scope.ActionQuantityValueMove = value;



        switch (type) {
            case 1:
                if ($scope.ActionQuantityValueMove != "" && $scope.ActionQuantityValueMove != undefined) {

                    for (k = 0; k < $scope.CurrentCart.length; k++) {

                        if ($scope.CurrentOperation == "MoveTagUpdate") {
                            $scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity = $scope.ActionQuantityValueMove;
                        }
                        if ($scope.CurrentOperation == "Move") {
                            $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.ActionQuantityValueMove;

                        }

                    }
                    $("#movebutton_" + id).addClass("movepin");

                    ShowSuccessActivity('Updated', $scope._CurrentAction);
                    CheckScopeBeforeApply();;

                }
                else {
                    toastr.error("Please input some valid value");
                }

                break;
            case 2:

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                    }
                    if ($scope.CurrentOperation == "Move") {
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;

                    }
                }

                $("#movebutton_" + id).addClass("movepin");
                ShowSuccessActivity('Updated', $scope._CurrentAction);

                CheckScopeBeforeApply();;

                break;

            default:

        }




    };

    $scope.savelocation = function (value) {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var datatosend = { "LocationID": 0, "LocationName": value, "LocationZone": "", "LocationDescription": "" };

        $scope.IsProcessing = true;

        $.ajax({
            url: serviceBase + "CreateEditLocation",
            type: 'POST',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "_Location": datatosend }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {
                $scope.IsProcessing = false;

                if (result.CreateEditLocationResult.Success == true) {

                    if (result.CreateEditLocationResult.Payload.ID == 1) {


                        $scope.getlocation();

                        $scope.TempLocationID = result.CreateEditLocationResult.Payload.NewLocationID;


                    }

                    if (result.CreateEditLocationResult.Payload.ID == 0) {

                        log.warning("Already exist");
                    }


                }
                else {
                    $scope.ShowErrorMessage("Updating location", 1, 1, result.CreateEditLocationResult.Message)

                }

            },
            error: function (err) {
                $scope.ShowErrorMessage("Updating location", 2, 1, err.statusText);



            },
            complete: function () {
            }

        });



    }
    $scope.filllocationAutoComplete = function () {


        $scope.savelocation($scope.SearchLocationValue);
        //var k = 0;
        //for (k = 0; k < $scope.CurrentCart.length; k++) {

        //    if ($scope.CurrentOperation == "MoveTagUpdate" && $scope.CurrentCart[k].InventoryID == $scope.currentinventoryid) {
        //        $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocationText = $scope.SearchLocationValue;
        //        $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocation = 0;
        //        break;
        //    }

        //    if ($scope.CurrentOperation == "Move" && $scope.CurrentCart[k].InventoryID == $scope.currentinventoryid) {
        //        $scope.CurrentCart[k].MoveTransactionData.MoveToLocationText = $scope.SearchLocationValue;
        //        $scope.CurrentCart[k].MoveTransactionData.MoveToLocation = 0;
        //        break;
        //    }


        //}
        //$("#locationlistmodal").hide();
        // $(".activitycontent").show();
        CheckScopeBeforeApply()

    }

    $scope.FillLocation = function (value, text, id) {

        var _canupdate = true;
        if ($scope.IsActiveLocationLibrary == false && ($scope.ToLocID == 0 || $scope.ToLocID == "")) {
            _canupdate = false;
        }

        if (_canupdate == true) {
            $scope.ToLocID = value;

            var k = 0;
            for (k = 0; k < $scope.CurrentCart.length; k++) {

                if ($scope.CurrentOperation == "MoveTagUpdate") {
                    $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocation = $scope.ToLocID;
                    $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocationText = text;
                }

                if ($scope.CurrentOperation == "Move") {
                    $scope.CurrentCart[k].MoveTransactionData.MoveToLocation = $scope.ToLocID;
                    $scope.CurrentCart[k].MoveTransactionData.MoveToLocationText = text;
                }


            }
            ShowSuccessActivity('Updated', $scope._CurrentAction);

            CheckScopeBeforeApply();;


            $("#location_" + id).addClass("movepin")
        }

        else {
            log.error("Please select some value.");
        }

    }
    $scope.CheckUOMValues = function (firstValue, secondValue) {
        if (firstValue != undefined && firstValue != null && firstValue != "") {
            firstValue = firstValue;
        }

        if (secondValue != undefined && secondValue != null && secondValue != "") {
            secondValue = secondValue;
        }

        if (firstValue == secondValue) {

            return true;
        }

        return false;
    }
    $scope.CheckStatusValues = function (firstValue, secondValue) {
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
    $scope.FillStatusLineItems = function (value, myid) {



        $scope.StatusToUpdate = value == null ? "" : value;
        $scope.StatusToUpdate = $scope.StatusToUpdate == 0 ? "" : $scope.StatusToUpdate;

        var k = 0;
        for (k = 0; k < $scope.CurrentCart.length; k++) {
            $scope.CurrentCart[k].UpdateTransactionData.StatusToUpdate = $scope.StatusToUpdate;

        }

        CheckScopeBeforeApply();;
        $scope.CurrentLineItemIndex = -1;
        $scope.CurrentInventoryId = -1;

        $("#status_" + myid).addClass("movepin")
        ShowSuccessActivity('Updated', $scope._CurrentAction);

    }

    $scope.FillStatusLineItems2 = function (value, id) {

        $scope.StatusToUpdateLoc = value == null ? "" : value;
        $scope.StatusToUpdateLoc = $scope.StatusToUpdateLoc == 0 ? "" : $scope.StatusToUpdateLoc;

        var k = 0;
        for (k = 0; k < $scope.CurrentCart.length; k++) {

            if ($scope.CurrentOperation == "MoveTagUpdate") {
                $scope.CurrentCart[k].MoveUpdateTagTransactionData.StatusToUpdate = $scope.StatusToUpdateLoc;

            }

            if ($scope.CurrentOperation == "Move") {
                $scope.CurrentCart[k].MoveTransactionData.StatusToUpdate = $scope.StatusToUpdateLoc;

            }


        }
        ShowSuccessActivity('Updated', $scope._CurrentAction);

        CheckScopeBeforeApply();;

        $scope.CurrentLineItemIndex = -1;
        $scope.CurrentInventoryId = -1;

        $("#LineItems2_" + id).addClass("movepin")


    }

    $scope.FillUnitData = function (FieldName, value, myid) {
        var k = 0;
        value = value == null || value == undefined ? "" : value;
        switch (FieldName) {
            case "iReqValue":
                $scope.UnitDataTag1 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag1 = $scope.UnitDataTag1;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag1 = $scope.UnitDataTag1;


                    }


                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unittag1_" + myid).addClass("movepin")

                break;
            case "iUnitTag2":
                $scope.UnitDataTag2 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag2 = $scope.UnitDataTag2;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag2 = $scope.UnitDataTag2;


                    }

                }
                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unittag2_" + myid).addClass("movepin")


                break;
            case "iUnitTag3":
                $scope.UnitDataTag3 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {


                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag3 = $scope.UnitDataTag3;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag3 = $scope.UnitDataTag3;


                    }

                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unittag3_" + myid).addClass("movepin")


                break;
            case "iUnitTag4":
                $scope.UnitDataTag4 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {


                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag4 = $scope.UnitDataTag4;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag4 = $scope.UnitDataTag4;


                    }

                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unittag4_" + myid).addClass("movepin")


                break;
            case "iUnitTag5":
                $scope.UnitDataTag5 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {


                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag5 = $scope.UnitDataTag5;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag5 = $scope.UnitDataTag5;


                    }

                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unittag5_" + myid).addClass("movepin")


                break;
            case "iUnitTag6":
                $scope.UnitDataTag6 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {


                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag6 = $scope.UnitDataTag6;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag6 = $scope.UnitDataTag6;


                    }

                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unittag6_" + myid).addClass("movepin")


                break;
            case "iUnitTag7":
                $scope.UnitDataTag7 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {


                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag7 = $scope.UnitDataTag7;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag7 = $scope.UnitDataTag7;


                    }

                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unittag7_" + myid).addClass("movepin")


                break;
            case "iUnitTag8":
                $scope.UnitDataTag8 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {


                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag8 = $scope.UnitDataTag8;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag8 = $scope.UnitDataTag8;


                    }

                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unittag8_" + myid).addClass("movepin")


                break;
            case "iUnitNumber1":
                $scope.UnitDataNumber1 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1 = $scope.UnitDataNumber1;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 = $scope.UnitDataNumber1;


                    }

                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unitnumber1_" + myid).addClass("movepin")

                break;
            case "iUnitNumber2":
                $scope.UnitDataNumber2 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2 = $scope.UnitDataNumber2;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 = $scope.UnitDataNumber2;


                    }


                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unitnumber2_" + myid).addClass("movepin")

                break;
            case "iUnitNumber3":
                $scope.UnitDataNumber3 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3 = $scope.UnitDataNumber3;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3 = $scope.UnitDataNumber3;


                    }


                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unitnumber3_" + myid).addClass("movepin")

                break;
            case "iUnitNumber4":
                $scope.UnitDataNumber4 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4 = $scope.UnitDataNumber4;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4 = $scope.UnitDataNumber4;


                    }


                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unitnumber4_" + myid).addClass("movepin")

                break;
            case "iUnitDate4":
                $scope.UnitDataDate4 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate4 = $scope.UnitDataDate4;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitDate4 = $scope.UnitDataDate4;


                    }


                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unitdate4_" + myid).addClass("movepin")

                break;
            case "iUnitDate3":
                $scope.UnitDataDate3 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate3 = $scope.UnitDataDate3;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitDate3 = $scope.UnitDataDate3;


                    }


                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unitdate3_" + myid).addClass("movepin")

                break;
            case "iUnitDate2":
                $scope.UnitDataDate2 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate2 = $scope.UnitDataDate2;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitDate2 = $scope.UnitDataDate2;


                    }


                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unitdate2_" + myid).addClass("movepin")

                break;
            case "iUniqueDate":
                $scope.UnitDataDate1 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UniqueDate = $scope.UnitDataDate1;
                    }

                    if ($scope.CurrentOperation == "Apply") {
                        $scope.CurrentCart[k].ApplyTransactionData.UniqueDate = $scope.UnitDataDate1;


                    }

                }

                ShowSuccessActivity('Updated', $scope._CurrentAction);

                $("#unitdate_" + myid).addClass("movepin")

                break;
            default:

        }

        $(".uniqueunitData").first().trigger("blur");
        var $inputs = $(".uniqueunitData");
        $inputs.trigger('blur');
    }

    $scope.GetColumnLabel = function (ColumnID) {
        var j = 0;

        var ColumnLabel = ColumnID;
        for (j = 0; j < $scope.MyinventoryFields.length; j++) {
            if ($scope.MyinventoryFields[j].ColumnName == ColumnID) {
                ColumnLabel = $scope.MyinventoryFields[j].ColumnLabel
                break;
            }

        }
        return ColumnLabel;

    }

    Date.prototype.toMSJSON = function () {
        this.setHours(this.getHours() - this.getTimezoneOffset() / 60);
        var date = '/Date(' + this.getTime() + ')/'; //CHANGED LINE
        return date;
    };

    Date.prototype.toMSJSONTime = function () {
        this.setHours(this.getHours());
        var date = '/Date(' + this.getTime() + ')/'; //CHANGED LINE
        return date;
    };

    function TryParseFloat(str, defaultValue) {
        var retValue = defaultValue;
        if (str !== null) {
            if (str.length > 0) {
                if (!isNaN(str)) {
                    retValue = parseFloat(str);
                }
            }
        }
        return retValue;
    }
    function GetProperUnitValue(_val, _Prefix, _Suffix) {

        if ($.trim(_val) != "") {


            _Prefix = $.trim(_Prefix) != "" ? _Prefix : "";
            _Suffix = $.trim(_Suffix) != "" ? _Suffix : "";
            _val = _val.replace(_Prefix, "");
            _val = _val.replace(_Suffix, "");

            return TryParseFloat(_val,"0");
        }
        return -1;

    }
    function BuildMultipleData() {


        var dt = new Date();
        var dt1 = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate() - 1, 0, 0, 0, 0));
        var wcfDateStr = dt1.toMSJSON();
        var wcfDateStr123 = dt1.toMSJSON();

        var _updateDateval = $("#itUpdateDate").val();

        var dsplit1 = _updateDateval.split("-");

        var d122 = new Date(dsplit1[0], dsplit1[1] - 1, dsplit1[2]);
        d122.setDate(d122.getDate() + _genVar);
        //d122.setHours(d122.getHours() - d122.getTimezoneOffset() / 60);
        var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), 0, 0, 0, 0))

        wcfDateStr123 = d122.toMSJSON();

        debugger;



        var wcfDateStr1 = null;
        var wcfDateStr2 = null;
        var wcfDateStr3 = null;
        var wcfDateStr4 = null;

        var wcfDateStr1New = null;
        var wcfDateStr2New = null;
        var wcfDateStr3New = null;
        var wcfDateStr4New = null;

        var k = 0;
        var _i = 0;
        var _myData = [];

        var _MyObjdata = {
            InvID: 0,
            Transaction: {
                itAID: 0,
                itAction: $scope._CurrentAction,
                itBatchID: 0,
                itCostPerUnit: 0,
                itID: 0,
                itInvID: 0,
                itLID: 0,
                itPID: 0,
                itParentTransID: 0,
                itQtyChange: 0,
                itReqValue: "",
                itSourceID: 1,
                itStatusValue: "",
                itUpdateDate: wcfDateStr123,
                itUOMID: 0,
                itUncontrolled: 0,
                itUniqueDate: wcfDateStr,
                itUnitDate2: wcfDateStr,
                itUnitDate3: wcfDateStr,
                itUnitDate4: wcfDateStr,
                itUnitNumber1: 0,
                itUnitNumber2: 0,
                itUnitNumber3: 0,
                itUnitNumber4: 0,
                itUnitTag2: "",
                itUnitTag3: "",
                itUnitTag4: "",
                itUnitTag5: "",
                itUnitTag6: "",
                itUnitTag7: "",
                itUnitTag8: "",
                incrementedValue: 0,
                incrementedValue2: 0,
                incrementedValue3: 0,
                incrementedValue4: 0,
                incrementedValue5: 0,
                incrementedValue6: 0,
                incrementedValue7: 0,
                incrementedValue8: 0,
            },
            Targets: {
                ToLocationID: 0,
                ToUomID: 0,
                ToConvertedQuantity: 0,
                ToStatus: "",
                ToLocation: "",
                ToUom: ""
            },
            CustomData: BuildCustomArrayData()
        };


        var _MyObjdata1 = {
            InvID: 0,
            Transaction: {
                itAID: 0,
                itAction: $scope._CurrentAction,
                itBatchID: 0,
                itCostPerUnit: 0,
                itID: 0,
                itInvID: 0,
                itLID: 0,
                itPID: 0,
                itParentTransID: 0,
                itQtyChange: 0,
                itReqValue: "",
                itSourceID: 1,
                itStatusValue: "",
                itUpdateDate: wcfDateStr123,
                itUOMID: 0,
                itUncontrolled: 0,
                itUniqueDate: wcfDateStr,
                itUnitDate2: wcfDateStr,
                itUnitDate3: wcfDateStr,
                itUnitDate4: wcfDateStr,
                itUnitNumber1: 0,
                itUnitNumber2: 0,
                itUnitNumber3: 0,
                itUnitNumber4: 0,
                itUnitTag2: "",
                itUnitTag3: "",
                itUnitTag4: "",
                itUnitTag5: "",
                itUnitTag6: "",
                itUnitTag7: "",
                itUnitTag8: "",
                incrementedValue: 0,
                incrementedValue2: 0,
                incrementedValue3: 0,
                incrementedValue4: 0,
                incrementedValue5: 0,
                incrementedValue6: 0,
                incrementedValue7: 0,
                incrementedValue8: 0

            },
            Targets: {
                ToLocationID: 0,
                ToUomID: 0,
                ToConvertedQuantity: 0,
                ToStatus: "",
                ToLocation: "",
                ToUom: ""
            },
            CustomData: BuildCustomArrayDataSelector("#transactionForm1")
        };

        var _MyObjdata2 = {
            InvID: 0,
            Transaction: {
                itAID: 0,
                itAction: $scope._CurrentAction,
                itBatchID: 0,
                itCostPerUnit: 0,
                itID: 0,
                itInvID: 0,
                itLID: 0,
                itPID: 0,
                itParentTransID: 0,
                itQtyChange: 0,
                itReqValue: "",
                itSourceID: 1,
                itStatusValue: "",
                itUpdateDate: wcfDateStr123,
                itUOMID: 0,
                itUncontrolled: 0,
                itUniqueDate: wcfDateStr,
                itUnitDate2: wcfDateStr,
                itUnitDate3: wcfDateStr,
                itUnitDate4: wcfDateStr,
                itUnitNumber1: 0,
                itUnitNumber2: 0,
                itUnitNumber3: 0,
                itUnitNumber4: 0,
                itUnitTag2: "",
                itUnitTag3: "",
                itUnitTag4: "",
                itUnitTag5: "",
                itUnitTag6: "",
                itUnitTag7: "",
                itUnitTag8: "",
            },
            Targets: {
                ToLocationID: 0,
                ToUomID: 0,
                ToConvertedQuantity: 0,
                ToStatus: "",
                ToLocation: "",
                ToUom: ""

            },
            CustomData: BuildCustomArrayDataSelector("#transactionForm2")
        };

        for (_i = 0; _i < $scope.CurrentCart.length; _i++) {

            debugger;

            _MyObjdata = {
                InvID: 0,
                Transaction: {
                    itAID: 0,
                    itAction: $scope._CurrentAction,
                    itBatchID: 0,
                    itCostPerUnit: 0,
                    itID: 0,
                    itInvID: 0,
                    itLID: 0,
                    itPID: 0,
                    itParentTransID: 0,
                    itQtyChange: 0,
                    itReqValue: "",
                    itSourceID: 1,
                    itStatusValue: "",
                    itUpdateDate: wcfDateStr123,
                    itUOMID: 0,
                    itUncontrolled: 0,
                    itUniqueDate: wcfDateStr,
                    itUnitDate2: wcfDateStr,
                    itUnitDate3: wcfDateStr,
                    itUnitDate4: wcfDateStr,
                    itUnitNumber1: 0,
                    itUnitNumber2: 0,
                    itUnitNumber3: 0,
                    itUnitNumber4: 0,
                    itUnitTag2: "",
                    itUnitTag3: "",
                    itUnitTag4: "",
                    itUnitTag5: "",
                    itUnitTag6: "",
                    itUnitTag7: "",
                    itUnitTag8: "",
                    incrementedValue: 0,
                    incrementedValue2: 0,
                    incrementedValue3: 0,
                    incrementedValue4: 0,
                    incrementedValue5: 0,
                    incrementedValue6: 0,
                    incrementedValue7: 0,
                    incrementedValue8: 0
                },
                Targets: {
                    ToLocationID: 0,
                    ToUomID: 0,
                    ToConvertedQuantity: 0,
                    ToStatus: "",
                    ToLocation: "",
                    ToUom: ""
                },
                CustomData: BuildCustomArrayData()
            };


            _MyObjdata1 = {
                InvID: 0,
                Transaction: {
                    itAID: 0,
                    itAction: $scope._CurrentAction,
                    itBatchID: 0,
                    itCostPerUnit: 0,
                    itID: 0,
                    itInvID: 0,
                    itLID: 0,
                    itPID: 0,
                    itParentTransID: 0,
                    itQtyChange: 0,
                    itReqValue: "",
                    itSourceID: 1,
                    itStatusValue: "",
                    itUpdateDate: wcfDateStr123,
                    itUOMID: 0,
                    itUncontrolled: 0,
                    itUniqueDate: wcfDateStr,
                    itUnitDate2: wcfDateStr,
                    itUnitDate3: wcfDateStr,
                    itUnitDate4: wcfDateStr,
                    itUnitNumber1: 0,
                    itUnitNumber2: 0,
                    itUnitNumber3: 0,
                    itUnitNumber4: 0,
                    itUnitTag2: "",
                    itUnitTag3: "",
                    itUnitTag4: "",
                    itUnitTag5: "",
                    itUnitTag6: "",
                    itUnitTag7: "",
                    itUnitTag8: "",
                    incrementedValue: 0,
                    incrementedValue2: 0,
                    incrementedValue3: 0,
                    incrementedValue4: 0,
                    incrementedValue5: 0,
                    incrementedValue6: 0,
                    incrementedValue7: 0,
                    incrementedValue8: 0
                },
                Targets: {
                    ToLocationID: 0,
                    ToUomID: 0,
                    ToConvertedQuantity: 0,
                    ToStatus: "",
                    ToLocation: "",
                    ToUom: ""
                },
                CustomData: BuildCustomArrayDataSelector("#transactionForm1")
            };

            _MyObjdata2 = {
                InvID: 0,
                Transaction: {
                    itAID: 0,
                    itAction: $scope._CurrentAction,
                    itBatchID: 0,
                    itCostPerUnit: 0,
                    itID: 0,
                    itInvID: 0,
                    itLID: 0,
                    itPID: 0,
                    itParentTransID: 0,
                    itQtyChange: 0,
                    itReqValue: "",
                    itSourceID: 1,
                    itStatusValue: "",
                    itUpdateDate: wcfDateStr123,
                    itUOMID: 0,
                    itUncontrolled: 0,
                    itUniqueDate: wcfDateStr,
                    itUnitDate2: wcfDateStr,
                    itUnitDate3: wcfDateStr,
                    itUnitDate4: wcfDateStr,
                    itUnitNumber1: 0,
                    itUnitNumber2: 0,
                    itUnitNumber3: 0,
                    itUnitNumber4: 0,
                    itUnitTag2: "",
                    itUnitTag3: "",
                    itUnitTag4: "",
                    itUnitTag5: "",
                    itUnitTag6: "",
                    itUnitTag7: "",
                    itUnitTag8: "",     
                    incrementedValue: 0,
                    incrementedValue2: 0,
                    incrementedValue3: 0,
                    incrementedValue4: 0,
                    incrementedValue5: 0,
                    incrementedValue6: 0,
                    incrementedValue7: 0,
                    incrementedValue8: 0

                },
                Targets: {
                    ToLocationID: 0,
                    ToUomID: 0,
                    ToConvertedQuantity: 0,
                    ToStatus: "",
                    ToLocation: "",
                    ToUom: ""

                },
                CustomData: BuildCustomArrayDataSelector("#transactionForm2")
            };


            var _OriginalAction = $scope.CurrentCart[_i].ActionPerformed;
            // k = $scope.IsSingleMode == true ? _i : 0;
            k = _i;
            var _TempQty = $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity;
            var _TempStatus = $scope.CurrentCart[_i].InventoryDataList.iStatusValue;
            var _TempLocID = $scope.CurrentCart[_i].InventoryDataList.iLID;
            var _TempLocText = "";
            var _TempUOM = "";
            var IsAdjustOnData = "False";
            if ($scope.CurrentOperation == "Convert") {
                _TempQty = $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity;
            }

            if ($scope.CurrentOperation == "Apply") {
                 
                var _RecID = $scope.CurrentCart[k].InventoryDataList.uId;
                var _u1prefix = $("#unittext1_" + _RecID).attr("data-prefix");
                var _u1suffix = $("#unittext1_" + _RecID).attr("data-suffix");
                var _u1original = $("#unittext1_" + _RecID).attr("data-original-value");
                var _u1value = $("#unittext1_" + _RecID).val();

                if ($.trim(_u1prefix) != "" || $.trim(_u1suffix) != "") {

                    if ($.trim(_u1value) != "") {

                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag1 = _u1prefix+_u1value+_u1suffix;


                    }
                    else {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag1 = "";

                    }
                }


                var _u2prefix = $("#unittext2_" + _RecID).attr("data-prefix");
                var _u2suffix = $("#unittext2_" + _RecID).attr("data-suffix");
                var _u2original = $("#unittext2_" + _RecID).attr("data-original-value");
                var _u2value = $("#unittext2_" + _RecID).val();

                if ($.trim(_u2prefix) != "" || $.trim(_u2suffix) != "") {

                    if ($.trim(_u2value) != "") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag2 = _u2prefix + _u2value + _u2suffix;
                    }
                    else {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag2 = "";

                    }
                }

                var _u3prefix = $("#unittext3_" + _RecID).attr("data-prefix");
                var _u3suffix = $("#unittext3_" + _RecID).attr("data-suffix");
                var _u3original = $("#unittext3_" + _RecID).attr("data-original-value");
                var _u3value = $("#unittext3_" + _RecID).val();

                if ($.trim(_u3prefix) != "" || $.trim(_u3suffix) != "") {

                    if ($.trim(_u3value) != "") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag3 = _u3prefix + _u3value + _u3suffix;
                    }
                    else {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag3 = "";

                    }
                }

                var _u4prefix = $("#unittext4_" + _RecID).attr("data-prefix");
                var _u4suffix = $("#unittext4_" + _RecID).attr("data-suffix");
                var _u4original = $("#unittext4_" + _RecID).attr("data-original-value");
                var _u4value = $("#unittext4_" + _RecID).val();

                if ($.trim(_u4prefix) != "" || $.trim(_u4suffix) != "") {

                    if ($.trim(_u4value) != "") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag4 = _u4prefix + _u4value + _u4suffix;
                    }
                    else {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag4 = "";

                    }
                }
                var _u5prefix = $("#unittext5_" + _RecID).attr("data-prefix");
                var _u5suffix = $("#unittext5_" + _RecID).attr("data-suffix");
                var _u5original = $("#unittext5_" + _RecID).attr("data-original-value");
                var _u5value = $("#unittext5_" + _RecID).val();

                if ($.trim(_u5prefix) != "" || $.trim(_u5suffix) != "") {

                    if ($.trim(_u5value) != "") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag5 = _u5prefix + _u5value + _u5suffix;
                    }
                    else {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag5 = "";

                    }
                }
                var _u6prefix = $("#unittext6_" + _RecID).attr("data-prefix");
                var _u6suffix = $("#unittext6_" + _RecID).attr("data-suffix");
                var _u6original = $("#unittext6_" + _RecID).attr("data-original-value");
                var _u6value = $("#unittext6_" + _RecID).val();

                if ($.trim(_u6prefix) != "" || $.trim(_u6suffix) != "") {

                    if ($.trim(_u6value) != "") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag6 = _u6prefix + _u6value + _u6suffix;
                    }
                    else {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag6 = "";

                    }
                }
                var _u7prefix = $("#unittext7_" + _RecID).attr("data-prefix");
                var _u7suffix = $("#unittext7_" + _RecID).attr("data-suffix");
                var _u7original = $("#unittext7_" + _RecID).attr("data-original-value");
                var _u7value = $("#unittext7_" + _RecID).val();

                if ($.trim(_u7prefix) != "" || $.trim(_u7suffix) != "") {

                    if ($.trim(_u7value) != "") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag7 = _u7prefix + _u7value + _u7suffix;
                    }
                    else {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag7 = "";

                    }
                }
                var _u8prefix = $("#unittext8_" + _RecID).attr("data-prefix");
                var _u8suffix = $("#unittext8_" + _RecID).attr("data-suffix");
                var _u8original = $("#unittext8_" + _RecID).attr("data-original-value");
                var _u8value = $("#unittext8_" + _RecID).val();

                if ($.trim(_u8prefix) != "" || $.trim(_u8suffix) != "") {

                    if ($.trim(_u8value) != "") {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag8 = _u8prefix + _u8value + _u8suffix;
                    }
                    else {
                        $scope.CurrentCart[k].ApplyTransactionData.UnitTag8 = "";

                    }
                }


                _MyObjdata.incrementedValue = $scope.GetUnitDataFieldByName("ReqValue").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].ApplyTransactionData.UnitTag1, $scope.GetUnitDataFieldByName("ReqValue").Prefix, $scope.GetUnitDataFieldByName("ReqValue").Suffix) : 0;
                _MyObjdata1.incrementedValue2 = $scope.GetUnitDataFieldByName("UnitTag2").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].ApplyTransactionData.UnitTag2, $scope.GetUnitDataFieldByName("UnitTag2").Prefix, $scope.GetUnitDataFieldByName("UnitTag2").Suffix) : 0;
                _MyObjdata2.incrementedValue3 = $scope.GetUnitDataFieldByName("UnitTag3").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].ApplyTransactionData.UnitTag3, $scope.GetUnitDataFieldByName("UnitTag3").Prefix, $scope.GetUnitDataFieldByName("UnitTag3").Suffix) : 0;
              //  _MyObjdata3.incrementedValue4 = $scope.GetUnitDataFieldByName("UnitTag4").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].ApplyTransactionData.UnitTag4, $scope.GetUnitDataFieldByName("UnitTag4").Prefix, $scope.GetUnitDataFieldByName("UnitTag4").Suffix) : 0;
              //  _MyObjdata4.incrementedValue5 = $scope.GetUnitDataFieldByName("UnitTag5").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].ApplyTransactionData.UnitTag5, $scope.GetUnitDataFieldByName("UnitTag5").Prefix, $scope.GetUnitDataFieldByName("UnitTag5").Suffix) : 0;
             //   _MyObjdata5.incrementedValue6 = $scope.GetUnitDataFieldByName("UnitTag6").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].ApplyTransactionData.UnitTag6, $scope.GetUnitDataFieldByName("UnitTag6").Prefix, $scope.GetUnitDataFieldByName("UnitTag6").Suffix) : 0;
             //   _MyObjdata6.incrementedValue7 = $scope.GetUnitDataFieldByName("UnitTag7").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].ApplyTransactionData.UnitTag7, $scope.GetUnitDataFieldByName("UnitTag7").Prefix, $scope.GetUnitDataFieldByName("UnitTag7").Suffix) : 0;
              //  _MyObjdata7.incrementedValue8 = $scope.GetUnitDataFieldByName("UnitTag8").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].ApplyTransactionData.UnitTag8, $scope.GetUnitDataFieldByName("UnitTag8").Prefix, $scope.GetUnitDataFieldByName("UnitTag8").Suffix) : 0;

            }

            if ($scope.CurrentOperation == "Move") {

                _TempQty = $scope.CurrentCart[k].MoveTransactionData.ActionQuantity;
                _TempStatus = $scope.CurrentCart[_i].InventoryDataList.iStatusValue;
                _TempLocID = $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == "" ? 0 : $scope.CurrentCart[k].MoveTransactionData.MoveToLocation;
                _TempLocText = $scope.CurrentCart[k].MoveTransactionData.MoveToLocationText;
                _MyObjdata.Targets.ToLocation = _TempLocText;
                _MyObjdata1.Targets.ToLocation = _TempLocText;
                _MyObjdata2.Targets.ToLocation = _TempLocText;

            }


            if ($scope.CurrentOperation == "MoveTagUpdate") {
                 

                var _RecID = $scope.CurrentCart[k].InventoryDataList.uId;
                var _u1prefix = $("#unittext1_" + _RecID).attr("data-prefix");
                var _u1suffix = $("#unittext1_" + _RecID).attr("data-suffix");
                var _u1original = $("#unittext1_" + _RecID).attr("data-original-value");
                var _u1value = $("#unittext1_" + _RecID).val();

                if ($.trim(_u1prefix) != "" || $.trim(_u1suffix) != "") {

                    if ($.trim(_u1value) != "") {

                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag1 = _u1prefix + _u1value + _u1suffix; 


                    }
                    else {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag1 = "";

                    }
                }


                var _u2prefix = $("#unittext2_" + _RecID).attr("data-prefix");
                var _u2suffix = $("#unittext2_" + _RecID).attr("data-suffix");
                var _u2original = $("#unittext2_" + _RecID).attr("data-original-value");
                var _u2value = $("#unittext2_" + _RecID).val();

                if ($.trim(_u2prefix) != "" || $.trim(_u2suffix) != "") {

                    if ($.trim(_u2value) != "") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag2 = _u2prefix + _u2value + _u2suffix;
                    }
                    else {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag2 = "";

                    }
                }

                var _u3prefix = $("#unittext3_" + _RecID).attr("data-prefix");
                var _u3suffix = $("#unittext3_" + _RecID).attr("data-suffix");
                var _u3original = $("#unittext3_" + _RecID).attr("data-original-value");
                var _u3value = $("#unittext3_" + _RecID).val();

                if ($.trim(_u3prefix) != "" || $.trim(_u3suffix) != "") {

                    if ($.trim(_u3value) != "") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag3 = _u3prefix + _u3value + _u3suffix;
                    }
                    else {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag3 = "";

                    }
                }
                var _u4prefix = $("#unittext4_" + _RecID).attr("data-prefix");
                var _u4suffix = $("#unittext4_" + _RecID).attr("data-suffix");
                var _u4original = $("#unittext4_" + _RecID).attr("data-original-value");
                var _u4value = $("#unittext4_" + _RecID).val();

                if ($.trim(_u4prefix) != "" || $.trim(_u4suffix) != "") {

                    if ($.trim(_u4value) != "") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag4 = _u4prefix + _u4value + _u4suffix;
                    }
                    else {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag4 = "";

                    }
                }

                var _u5prefix = $("#unittext5_" + _RecID).attr("data-prefix");
                var _u5suffix = $("#unittext5_" + _RecID).attr("data-suffix");
                var _u5original = $("#unittext5_" + _RecID).attr("data-original-value");
                var _u5value = $("#unittext5_" + _RecID).val();

                if ($.trim(_u5prefix) != "" || $.trim(_u5suffix) != "") {

                    if ($.trim(_u5value) != "") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag5 = _u5prefix + _u5value + _u5suffix;
                    }
                    else {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag5 = "";

                    }
                }

                var _u6prefix = $("#unittext6_" + _RecID).attr("data-prefix");
                var _u6suffix = $("#unittext6_" + _RecID).attr("data-suffix");
                var _u6original = $("#unittext6_" + _RecID).attr("data-original-value");
                var _u6value = $("#unittext6_" + _RecID).val();

                if ($.trim(_u6prefix) != "" || $.trim(_u6suffix) != "") {

                    if ($.trim(_u6value) != "") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag6 = _u6prefix + _u6value + _u6suffix;
                    }
                    else {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag6 = "";

                    }
                }

                var _u7prefix = $("#unittext7_" + _RecID).attr("data-prefix");
                var _u7suffix = $("#unittext7_" + _RecID).attr("data-suffix");
                var _u7original = $("#unittext7_" + _RecID).attr("data-original-value");
                var _u7value = $("#unittext7_" + _RecID).val();

                if ($.trim(_u7prefix) != "" || $.trim(_u7suffix) != "") {

                    if ($.trim(_u7value) != "") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag7 = _u7prefix + _u7value + _u7suffix;
                    }
                    else {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag7 = "";

                    }
                }

                var _u8prefix = $("#unittext8_" + _RecID).attr("data-prefix");
                var _u8suffix = $("#unittext8_" + _RecID).attr("data-suffix");
                var _u8original = $("#unittext8_" + _RecID).attr("data-original-value");
                var _u8value = $("#unittext8_" + _RecID).val();

                if ($.trim(_u8prefix) != "" || $.trim(_u8suffix) != "") {

                    if ($.trim(_u8value) != "") {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag8 = _u8prefix + _u8value + _u8suffix;
                    }
                    else {
                        $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag8 = "";

                    }
                }



                _TempQty = $scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity;
                _TempStatus = $scope.CurrentCart[k].MoveUpdateTagTransactionData.StatusToUpdate;
                _TempLocID = $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocation == "" ? 0 : $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocation;
                _TempLocText = $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocationText;
                _MyObjdata.Targets.ToLocation = _TempLocText;
                _MyObjdata1.Targets.ToLocation = _TempLocText;
                _MyObjdata2.Targets.ToLocation = _TempLocText;
                _MyObjdata.incrementedValue = $scope.GetUnitDataFieldByName("ReqValue").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag1, $scope.GetUnitDataFieldByName("ReqValue").Prefix, $scope.GetUnitDataFieldByName("ReqValue").Suffix) : 0;
                _MyObjdata1.incrementedValue2 = $scope.GetUnitDataFieldByName("UnitTag2").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag2, $scope.GetUnitDataFieldByName("UnitTag2").Prefix, $scope.GetUnitDataFieldByName("UnitTag2").Suffix) : 0;
                _MyObjdata2.incrementedValue3 = $scope.GetUnitDataFieldByName("UnitTag3").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag3, $scope.GetUnitDataFieldByName("UnitTag3").Prefix, $scope.GetUnitDataFieldByName("UnitTag3").Suffix) : 0;
             //   _MyObjdata3.incrementedValue4 = $scope.GetUnitDataFieldByName("UnitTag4").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag4, $scope.GetUnitDataFieldByName("UnitTag4").Prefix, $scope.GetUnitDataFieldByName("UnitTag4").Suffix) : 0;
            //    _MyObjdata4.incrementedValue5 = $scope.GetUnitDataFieldByName("UnitTag5").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag5, $scope.GetUnitDataFieldByName("UnitTag5").Prefix, $scope.GetUnitDataFieldByName("UnitTag5").Suffix) : 0;
             //   _MyObjdata5.incrementedValue6 = $scope.GetUnitDataFieldByName("UnitTag6").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag6, $scope.GetUnitDataFieldByName("UnitTag6").Prefix, $scope.GetUnitDataFieldByName("UnitTag6").Suffix) : 0;
            //    _MyObjdata6.incrementedValue7 = $scope.GetUnitDataFieldByName("UnitTag7").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag7, $scope.GetUnitDataFieldByName("UnitTag7").Prefix, $scope.GetUnitDataFieldByName("UnitTag7").Suffix) : 0;
             //   _MyObjdata7.incrementedValue8 = $scope.GetUnitDataFieldByName("UnitTag8").FieldSpecialType == 0 ? GetProperUnitValue($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag8, $scope.GetUnitDataFieldByName("UnitTag8").Prefix, $scope.GetUnitDataFieldByName("UnitTag8").Suffix) : 0;
            }

            if ($scope.CurrentOperation == "Convert") {
                _TempUOM = $scope.CurrentCart[k].ConvertTransactionData.ToUOM;
                _MyObjdata.Targets.ToUom = _TempUOM;
                _MyObjdata1.Targets.ToUom = _TempUOM;
                _MyObjdata2.Targets.ToUom = _TempUOM;

                _MyObjdata.Targets.ToUomID = $scope.CurrentCart[k].ConvertTransactionData.ToUOMID;
                _MyObjdata1.Targets.ToUomID = $scope.CurrentCart[k].ConvertTransactionData.ToUOMID;
                _MyObjdata2.Targets.ToUomID = $scope.CurrentCart[k].ConvertTransactionData.ToUOMID;
            }

            if ($scope.CurrentOperation == "Adjust") {
                IsAdjustOnData = "True";
            }

            if ($scope.CurrentCart[k].ApplyTransactionData.UniqueDate != undefined && $scope.CurrentCart[k].ApplyTransactionData.UniqueDate != "") {
                var dateVar = $scope.CurrentCart[k].ApplyTransactionData.UniqueDate;

                if ($scope.GetUnitDataFieldByName('UniqueDate').FieldSpecialType == 16) {

                    if ($scope.CurrentOperation == "Apply") {
                        var _dateValuearray = dateVar.split("T");


                        var tsplit12 = _dateValuearray[1].split(":");
                        var dsplit12 = _dateValuearray[0].split("-");

                        var d1222 = new Date(dsplit12[0], dsplit12[1] - 1, dsplit12[2]);
                        if (_genVar == 1) {
                            d1222.setDate(d1222.getDate());

                        }
                        else {
                            d1222.setDate(d1222.getDate());

                        }
                        var d1122 = new Date(Date.UTC(d1222.getFullYear(), d1222.getMonth(), d1222.getDate(), parseInt(tsplit12[0]), parseInt(tsplit12[1]), 0, 0))

                        wcfDateStr1 = d1122.toMSJSONTime();
                    }
                }
                else if ($scope.GetUnitDataFieldByName('UniqueDate').FieldSpecialType == 17) {
                    if ($scope.CurrentOperation == "Apply") {
                        var dsplit1 = dateVar.split(":");
                        var d122 = new Date(1900, 0, 1);

                        var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), parseInt(dsplit1[0]), parseInt(dsplit1[1]), 0, 0))
                        if (_genVar == 1) {
                            d122.setDate(d122.getDate());
                        }
                        else {

                            d122.setDate(d122.getDate());
                        }
                        var d1123 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), dsplit1[0], dsplit1[1], 0, 0))
                        wcfDateStr1 = d1123.toMSJSONTime();
                    }
                }
                else {

                    var dsplit = dateVar.indexOf("/") == -1 ? dateVar.split("-") : dateVar.split("/");

                    var d1 = dateVar.indexOf("/") == -1 ? new Date(dsplit[0], dsplit[1] - 1, dsplit[2]) : new Date(dsplit[2], dsplit[0] - 1, dsplit[1]);

                    // var d1 =  new Date(dsplit[0], dsplit[1] - 1, dsplit[2]);
                    if (_genVar == 1) {


                        d1.setDate(d1.getDate());
                    }
                    else {
                        d1.setDate(d1.getDate() + 1);
                    }
                    var d11 = new Date(Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(), 0, 0, 0, 0))

                    wcfDateStr1 = d11.toMSJSON();
                }
            }
            if ($scope.CurrentCart[k].ApplyTransactionData.UnitDate2 != undefined && $scope.CurrentCart[k].ApplyTransactionData.UnitDate2 != "") {
                var dateVar = $scope.CurrentCart[k].ApplyTransactionData.UnitDate2;
                if ($scope.GetUnitDataFieldByName('UnitDate2').FieldSpecialType == 16) {
                    if ($scope.CurrentOperation == "Apply") {
                        var _dateValuearray = dateVar.split("T");


                        var tsplit12 = _dateValuearray[1].split(":");
                        var dsplit12 = _dateValuearray[0].split("-");

                        var d1222 = new Date(dsplit12[0], dsplit12[1] - 1, dsplit12[2]);
                        if (_genVar == 1) {
                            d1222.setDate(d1222.getDate());

                        }
                        else {
                            d1222.setDate(d1222.getDate());

                        }
                        var d1122 = new Date(Date.UTC(d1222.getFullYear(), d1222.getMonth(), d1222.getDate(), parseInt(tsplit12[0]), parseInt(tsplit12[1]), 0, 0))

                        wcfDateStr2 = d1122.toMSJSONTime();
                    }


                }
                else if ($scope.GetUnitDataFieldByName('UnitDate2').FieldSpecialType == 17) {
                    if ($scope.CurrentOperation == "Apply") {
                        var dsplit1 = dateVar.split(":");
                        var d122 = new Date(1900, 0, 1);

                        var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), parseInt(dsplit1[0]), parseInt(dsplit1[1]), 0, 0))
                        if (_genVar == 1) {
                            d122.setDate(d122.getDate());
                        }
                        else {

                            d122.setDate(d122.getDate());
                        }
                        var d1123 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), dsplit1[0], dsplit1[1], 0, 0))
                        wcfDateStr2 = d1123.toMSJSONTime();
                    }
                }
                else {
                    var dsplit = dateVar.indexOf("/") == -1 ? dateVar.split("-") : dateVar.split("/");

                    var d2 = dateVar.indexOf("/") == -1 ? new Date(dsplit[0], dsplit[1] - 1, dsplit[2]) : new Date(dsplit[2], dsplit[0] - 1, dsplit[1]);
                    // var d2 = new Date(dsplit[0], dsplit[1] - 1, dsplit[2]);

                    if (_genVar == 1) {


                        d2.setDate(d2.getDate());
                    }
                    else {
                        d2.setDate(d2.getDate() + 1);
                    }
                    var d21 = new Date(Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), 0, 0, 0, 0))

                    wcfDateStr2 = d21.toMSJSON();
                }
            }

            if ($scope.CurrentCart[k].ApplyTransactionData.UnitDate3 != undefined && $scope.CurrentCart[k].ApplyTransactionData.UnitDate3 != "") {
                var dateVar = $scope.CurrentCart[k].ApplyTransactionData.UnitDate3;
                if ($scope.GetUnitDataFieldByName('UnitDate3').FieldSpecialType == 16) {
                    if ($scope.CurrentOperation == "Apply") {
                        var _dateValuearray = dateVar.split("T");


                        var tsplit12 = _dateValuearray[1].split(":");
                        var dsplit12 = _dateValuearray[0].split("-");

                        var d1222 = new Date(dsplit12[0], dsplit12[1] - 1, dsplit12[2]);
                        if (_genVar == 1) {
                            d1222.setDate(d1222.getDate());

                        }
                        else {
                            d1222.setDate(d1222.getDate());

                        }
                        var d1122 = new Date(Date.UTC(d1222.getFullYear(), d1222.getMonth(), d1222.getDate(), parseInt(tsplit12[0]), parseInt(tsplit12[1]), 0, 0))

                        wcfDateStr3 = d1122.toMSJSONTime();
                    }


                }
                else if ($scope.GetUnitDataFieldByName('UnitDate3').FieldSpecialType == 17) {
                    if ($scope.CurrentOperation == "Apply") {
                        var dsplit1 = dateVar.split(":");
                        var d122 = new Date(1900, 0, 1);

                        var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), parseInt(dsplit1[0]), parseInt(dsplit1[1]), 0, 0))
                        if (_genVar == 1) {
                            d122.setDate(d122.getDate());
                        }
                        else {

                            d122.setDate(d122.getDate());
                        }
                        var d1123 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), dsplit1[0], dsplit1[1], 0, 0))
                        wcfDateStr3 = d1123.toMSJSONTime();
                    }
                }
                else {
                    var dsplit = dateVar.indexOf("/") == -1 ? dateVar.split("-") : dateVar.split("/");

                    var d2 = dateVar.indexOf("/") == -1 ? new Date(dsplit[0], dsplit[1] - 1, dsplit[2]) : new Date(dsplit[2], dsplit[0] - 1, dsplit[1]);
                    // var d2 = new Date(dsplit[0], dsplit[1] - 1, dsplit[2]);

                    if (_genVar == 1) {


                        d2.setDate(d2.getDate());
                    }
                    else {
                        d2.setDate(d2.getDate() + 1);
                    }
                    var d21 = new Date(Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), 0, 0, 0, 0))

                    wcfDateStr3 = d21.toMSJSON();
                }
            }
            if ($scope.CurrentCart[k].ApplyTransactionData.UnitDate4 != undefined && $scope.CurrentCart[k].ApplyTransactionData.UnitDate4 != "") {
                var dateVar = $scope.CurrentCart[k].ApplyTransactionData.UnitDate4;
                if ($scope.GetUnitDataFieldByName('UnitDate4').FieldSpecialType == 16) {
                    if ($scope.CurrentOperation == "Apply") {
                        var _dateValuearray = dateVar.split("T");


                        var tsplit12 = _dateValuearray[1].split(":");
                        var dsplit12 = _dateValuearray[0].split("-");

                        var d1222 = new Date(dsplit12[0], dsplit12[1] - 1, dsplit12[2]);
                        if (_genVar == 1) {
                            d1222.setDate(d1222.getDate());

                        }
                        else {
                            d1222.setDate(d1222.getDate());

                        }
                        var d1122 = new Date(Date.UTC(d1222.getFullYear(), d1222.getMonth(), d1222.getDate(), parseInt(tsplit12[0]), parseInt(tsplit12[1]), 0, 0))

                        wcfDateStr4 = d1122.toMSJSONTime();
                    }


                }
                else if ($scope.GetUnitDataFieldByName('UnitDate4').FieldSpecialType == 17) {
                    if ($scope.CurrentOperation == "Apply") {
                        var dsplit1 = dateVar.split(":");
                        var d122 = new Date(1900, 0, 1);

                        var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), parseInt(dsplit1[0]), parseInt(dsplit1[1]), 0, 0))
                        if (_genVar == 1) {
                            d122.setDate(d122.getDate());
                        }
                        else {

                            d122.setDate(d122.getDate());
                        }
                        var d1123 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), dsplit1[0], dsplit1[1], 0, 0))
                        wcfDateStr4 = d1123.toMSJSONTime();
                    }
                }
                else {
                    var dsplit = dateVar.indexOf("/") == -1 ? dateVar.split("-") : dateVar.split("/");

                    var d2 = dateVar.indexOf("/") == -1 ? new Date(dsplit[0], dsplit[1] - 1, dsplit[2]) : new Date(dsplit[2], dsplit[0] - 1, dsplit[1]);
                    // var d2 = new Date(dsplit[0], dsplit[1] - 1, dsplit[2]);

                    if (_genVar == 1) {


                        d2.setDate(d2.getDate());
                    }
                    else {
                        d2.setDate(d2.getDate() + 1);
                    }
                    var d21 = new Date(Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), 0, 0, 0, 0))

                    wcfDateStr4 = d21.toMSJSON();
                }
            }


            if ($scope.CurrentCart[k].MoveUpdateTagTransactionData.UniqueDate != undefined && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UniqueDate != "") {

                var dateVar = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UniqueDate;

                if ($scope.GetUnitDataFieldByName('UniqueDate').FieldSpecialType == 16) {

                    if ($scope.CurrentOperation == "MoveTagUpdate") {

                        var _dateValuearray = dateVar.split("T");


                        var tsplit12 = _dateValuearray[1].split(":");
                        var dsplit12 = _dateValuearray[0].split("-");

                        var d1222 = new Date(dsplit12[0], dsplit12[1] - 1, dsplit12[2]);
                        if (_genVar == 1) {
                            d1222.setDate(d1222.getDate());

                        }
                        else {
                            d1222.setDate(d1222.getDate());

                        }
                        var d1122 = new Date(Date.UTC(d1222.getFullYear(), d1222.getMonth(), d1222.getDate(), parseInt(tsplit12[0]), parseInt(tsplit12[1]), 0, 0))

                        wcfDateStr1New = d1122.toMSJSONTime();
                    }
                }
                else if ($scope.GetUnitDataFieldByName('UniqueDate').FieldSpecialType == 17) {
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        var dsplit1 = dateVar.split(":");
                        var d122 = new Date(1900, 0, 1);

                        var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), parseInt(dsplit1[0]), parseInt(dsplit1[1]), 0, 0))
                        if (_genVar == 1) {
                            d122.setDate(d122.getDate());
                        }
                        else {

                            d122.setDate(d122.getDate());
                        }
                        var d1123 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), dsplit1[0], dsplit1[1], 0, 0))
                        wcfDateStr1New = d1123.toMSJSONTime();
                    }

                }
                else {

                    var dsplit = dateVar.indexOf("/") == -1 ? dateVar.split("-") : dateVar.split("/");
                    var d1 = dateVar.indexOf("/") == -1 ? new Date(dsplit[0], dsplit[1] - 1, dsplit[2]) : new Date(dsplit[2], dsplit[0] - 1, dsplit[1]);

                    //var d1 = new Date(dsplit[0], dsplit[1] - 1, dsplit[2]);
                    if (_genVar == 1) {


                        d1.setDate(d1.getDate());
                    }
                    else {
                        d1.setDate(d1.getDate() + 1);
                    }
                    var d11 = new Date(Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(), 0, 0, 0, 0))

                    wcfDateStr1New = d11.toMSJSON();
                }
            }
            if ($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate2 != undefined && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate2 != "") {
                var dateVar = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate2;

                
                if ($scope.GetUnitDataFieldByName('UnitDate2').FieldSpecialType == 16) {
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        var _dateValuearray = dateVar.split("T");


                        var tsplit12 = _dateValuearray[1].split(":");
                        var dsplit12 = _dateValuearray[0].split("-");

                        var d1222 = new Date(dsplit12[0], dsplit12[1] - 1, dsplit12[2]);
                        if (_genVar == 1) {
                            d1222.setDate(d1222.getDate());

                        }
                        else {
                            d1222.setDate(d1222.getDate());

                        }
                        var d1122 = new Date(Date.UTC(d1222.getFullYear(), d1222.getMonth(), d1222.getDate(), parseInt(tsplit12[0]), parseInt(tsplit12[1]), 0, 0))
                        wcfDateStr2New = d1122.toMSJSONTime();
                    }
                }
                else if ($scope.GetUnitDataFieldByName('UnitDate2').FieldSpecialType == 17) {
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        var dsplit1 = dateVar.split(":");
                        var d122 = new Date(1900, 0, 1);

                        var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), parseInt(dsplit1[0]), parseInt(dsplit1[1]), 0, 0))
                        if (_genVar == 1) {
                            d122.setDate(d122.getDate());
                        }
                        else {

                            d122.setDate(d122.getDate());
                        }
                        var d1123 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), dsplit1[0], dsplit1[1], 0, 0))
                        wcfDateStr2New = d1123.toMSJSONTime();
                    }

                }
                else {
                    var dsplit = dateVar.indexOf("/") == -1 ? dateVar.split("-") : dateVar.split("/");

                    var d2 = dateVar.indexOf("/") == -1 ? new Date(dsplit[0], dsplit[1] - 1, dsplit[2]) : new Date(dsplit[2], dsplit[0] - 1, dsplit[1]);
                    //var d2 = new Date(dsplit[0], dsplit[1] - 1, dsplit[2]);

                    if (_genVar == 1) {


                        d2.setDate(d2.getDate());
                    }
                    else {
                        d2.setDate(d2.getDate() + 1);
                    }
                    var d21 = new Date(Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), 0, 0, 0, 0))

                    wcfDateStr2New = d21.toMSJSON();
                }

            }
            if ($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate3 != undefined && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate3 != "") {
                var dateVar = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate3;


                if ($scope.GetUnitDataFieldByName('UnitDate3').FieldSpecialType == 16) {
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        var _dateValuearray = dateVar.split("T");


                        var tsplit12 = _dateValuearray[1].split(":");
                        var dsplit12 = _dateValuearray[0].split("-");

                        var d1222 = new Date(dsplit12[0], dsplit12[1] - 1, dsplit12[2]);
                        if (_genVar == 1) {
                            d1222.setDate(d1222.getDate());

                        }
                        else {
                            d1222.setDate(d1222.getDate());

                        }
                        var d1122 = new Date(Date.UTC(d1222.getFullYear(), d1222.getMonth(), d1222.getDate(), parseInt(tsplit12[0]), parseInt(tsplit12[1]), 0, 0))
                        wcfDateStr3New = d1122.toMSJSONTime();
                    }
                }
                else if ($scope.GetUnitDataFieldByName('UnitDate3').FieldSpecialType == 17) {
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        var dsplit1 = dateVar.split(":");
                        var d122 = new Date(1900, 0, 1);

                        var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), parseInt(dsplit1[0]), parseInt(dsplit1[1]), 0, 0))
                        if (_genVar == 1) {
                            d122.setDate(d122.getDate());
                        }
                        else {

                            d122.setDate(d122.getDate());
                        }
                        var d1123 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), dsplit1[0], dsplit1[1], 0, 0))
                        wcfDateStr3New = d1123.toMSJSONTime();
                    }

                }
                else {
                    var dsplit = dateVar.indexOf("/") == -1 ? dateVar.split("-") : dateVar.split("/");

                    var d2 = dateVar.indexOf("/") == -1 ? new Date(dsplit[0], dsplit[1] - 1, dsplit[2]) : new Date(dsplit[2], dsplit[0] - 1, dsplit[1]);
                    //var d2 = new Date(dsplit[0], dsplit[1] - 1, dsplit[2]);

                    if (_genVar == 1) {


                        d2.setDate(d2.getDate());
                    }
                    else {
                        d2.setDate(d2.getDate() + 1);
                    }
                    var d21 = new Date(Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), 0, 0, 0, 0))

                    wcfDateStr3New = d21.toMSJSON();
                }

            }
            if ($scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate4 != undefined && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate4 != "") {
                var dateVar = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate4;


                if ($scope.GetUnitDataFieldByName('UnitDate4').FieldSpecialType == 16) {
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        var _dateValuearray = dateVar.split("T");


                        var tsplit12 = _dateValuearray[1].split(":");
                        var dsplit12 = _dateValuearray[0].split("-");

                        var d1222 = new Date(dsplit12[0], dsplit12[1] - 1, dsplit12[2]);
                        if (_genVar == 1) {
                            d1222.setDate(d1222.getDate());

                        }
                        else {
                            d1222.setDate(d1222.getDate());

                        }
                        var d1122 = new Date(Date.UTC(d1222.getFullYear(), d1222.getMonth(), d1222.getDate(), parseInt(tsplit12[0]), parseInt(tsplit12[1]), 0, 0))
                        wcfDateStr4New = d1122.toMSJSONTime();
                    }
                }
                else if ($scope.GetUnitDataFieldByName('UnitDate4').FieldSpecialType == 17) {
                    if ($scope.CurrentOperation == "MoveTagUpdate") {
                        var dsplit1 = dateVar.split(":");
                        var d122 = new Date(1900, 0, 1);

                        var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), parseInt(dsplit1[0]), parseInt(dsplit1[1]), 0, 0))
                        if (_genVar == 1) {
                            d122.setDate(d122.getDate());
                        }
                        else {

                            d122.setDate(d122.getDate());
                        }
                        var d1123 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), dsplit1[0], dsplit1[1], 0, 0))
                        wcfDateStr4New = d1123.toMSJSONTime();
                    }

                }
                else {
                    var dsplit = dateVar.indexOf("/") == -1 ? dateVar.split("-") : dateVar.split("/");

                    var d2 = dateVar.indexOf("/") == -1 ? new Date(dsplit[0], dsplit[1] - 1, dsplit[2]) : new Date(dsplit[2], dsplit[0] - 1, dsplit[1]);
                    //var d2 = new Date(dsplit[0], dsplit[1] - 1, dsplit[2]);

                    if (_genVar == 1) {


                        d2.setDate(d2.getDate());
                    }
                    else {
                        d2.setDate(d2.getDate() + 1);
                    }
                    var d21 = new Date(Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), 0, 0, 0, 0))

                    wcfDateStr4New = d21.toMSJSON();
                }

            }
            //

            for (var x = 0; x < $scope.CurrentCart[k].IsLineItemData.length; x++)
            {
                var dynamicId = "#LineItem_"+ $scope.CurrentCart[k].IsLineItemData[x].cfdID;
                var _u3prefix = $(dynamicId).attr("data-prefix");
                var _u3suffix = $(dynamicId).attr("data-suffix");
                var _u3original = $(dynamicId).attr("data-original-value");
                
                var _value = "";
                if ($.trim(_u3prefix) != "" || $.trim(_u3suffix) != "") {
                    if ($.trim(_u3original) != "") {
                        _value = _u3original;
                    }
                    else {
                        _value = "";
                    }
                }
                else {
                    _value = $scope.CurrentCart[k].IsLineItemData[x].CfValue;
                }
                $scope.CurrentCart[k].IsLineItemData[x].CfValue = _value;
            }           


            //
            if (IsAdjustOnData == "True") {

                var value = 0;

                if ($scope.IsQuantityUpdated == false) {

                    $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = parseInt($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity);
                    $scope.CurrentCart[k].ActionPerformed = $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity ? "1" : "-1";

                    if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                        value = $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity - $scope.CurrentCart[k].InventoryDataList.oquantity;
                        _MyObjdata1.Transaction.itAction = 1;
                    }
                    else {
                        value = $scope.CurrentCart[k].InventoryDataList.oquantity - $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity;
                        _MyObjdata2.Transaction.itAction = -1;
                    }

                    $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = value;

                    _TempQty = $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity;

                    CheckScopeBeforeApply();

                }
                else {

                    _TempQty = $scope.CurrentCart[k].AdjustActionQuantity;
                    $scope.CurrentCart[k].ActionPerformed = _OriginalAction;
                    if ($scope.CurrentCart[k].ActionPerformed == 1 || $scope.CurrentCart[k].ActionPerformed == "1") {
                        _MyObjdata1.Transaction.itAction = 1;
                    }

                    if ($scope.CurrentCart[k].ActionPerformed == -1 || $scope.CurrentCart[k].ActionPerformed == "-1") {
                        _MyObjdata2.Transaction.itAction = -1;
                    }
                    CheckScopeBeforeApply();

                }



                _myData.push({
                    CostPerItem: $scope.CurrentCart[k].iCostPerItem == undefined ? 0 : $scope.CurrentCart[k].iCostPerItem,
                    IsAdjustOn: IsAdjustOnData,
                    ActionData: parseInt($scope.CurrentCart[k].ActionPerformed),
                    ToStatusValue: _TempStatus,
                    iQty: _TempQty == "" ? 0 : _TempQty,
                    ToUOMID: $scope.CurrentCart[k].ConvertTransactionData.ToUOMID,
                    InvID: $scope.CurrentCart[_i].InventoryDataList.uId,
                    ToConvertedQty: $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == "" ? 0 : $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity,
                    UOMID: $scope.CurrentCart[_i].InventoryDataList.iUOMID,
                    LocationID: _TempLocID == "" ? 0 : _TempLocID,
                    pID: $scope.CurrentCart[_i].InventoryDataList.pID,
                    iStatusValue: $scope.CurrentCart[k].UpdateTransactionData.StatusToUpdate,
                    UnitTag1: $scope.CurrentCart[k].ApplyTransactionData.UnitTag1,
                    UnitTag2: $scope.CurrentCart[k].ApplyTransactionData.UnitTag2,
                    UnitTag3: $scope.CurrentCart[k].ApplyTransactionData.UnitTag3,
                    UnitTag4: $scope.CurrentCart[k].ApplyTransactionData.UnitTag4,
                    UnitTag5: $scope.CurrentCart[k].ApplyTransactionData.UnitTag5,
                    UnitTag6: $scope.CurrentCart[k].ApplyTransactionData.UnitTag6,
                    UnitTag7: $scope.CurrentCart[k].ApplyTransactionData.UnitTag7,
                    UnitTag8: $scope.CurrentCart[k].ApplyTransactionData.UnitTag8,
                    UniqueDate: wcfDateStr1,
                    UnitDate2: wcfDateStr2,
                    UnitDate3: wcfDateStr3,
                    UnitDate4: wcfDateStr4,
                    UnitNumber1: $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 == undefined || $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 == null || $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 == "" ? -1500 : $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1,
                    UnitNumber2: $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 == undefined || $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 == null || $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 == "" ? -1500 : $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2,
                    UnitNumber3: $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3 == undefined || $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3 == null || $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3 == "" ? -1500 : $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3,
                    UnitNumber4: $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4 == undefined || $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4 == null || $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4 == "" ? -1500 : $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4,
                    NewToStatusValue: _TempStatus,
                    NewLocationID: _TempLocID,
                    NewUnitTag1: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag1,
                    NewUnitTag2: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag2,
                    NewUnitTag3: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag3,
                    NewUnitTag4: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag4,
                    NewUnitTag5: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag5,
                    NewUnitTag6: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag6,
                    NewUnitTag7: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag7,
                    NewUnitTag8: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag8,
        
                    NewUniqueDate: wcfDateStr1New,
                    NewUnitDate2: wcfDateStr2New,
                    NewUnitDate3: wcfDateStr3New,
                    NewUnitDate4: wcfDateStr4New,

                    NewUnitNumber1: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1 == undefined || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1 == null || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1 == "" ? -1500 : $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1,
                    NewUnitNumber2: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2 == undefined || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2 == null || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2 == "" ? -1500 : $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2,
                    NewUnitNumber3: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3 == undefined || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3 == null || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3 == "" ? -1500 : $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3,
                    NewUnitNumber4: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4 == undefined || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4 == null || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4 == "" ? -1500 : $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4,
                    myPostObj: _MyObjdata1, myPostObj2: _MyObjdata2, IsLineItem: $scope.CurrentCart[k].IsLineItemData
                });
            }
            else {
                _myData.push({
                    CostPerItem: $scope.CurrentCart[k].iCostPerItem == undefined ? 0 : $scope.CurrentCart[k].iCostPerItem,
                    ToStatusValue: _TempStatus,
                    iQty: _TempQty == "" ? 0 : _TempQty,
                    ToUOMID: $scope.CurrentCart[k].ConvertTransactionData.ToUOMID,
                    InvID: $scope.CurrentCart[_i].InventoryDataList.uId,
                    ToConvertedQty: $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == "" ? 0 : $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity,
                    UOMID: $scope.CurrentCart[_i].InventoryDataList.iUOMID,
                    LocationID: _TempLocID == "" ? 0 : _TempLocID,
                    pID: $scope.CurrentCart[_i].InventoryDataList.pID,
                    iStatusValue: $scope.CurrentCart[k].UpdateTransactionData.StatusToUpdate,
                    UnitTag1: $scope.CurrentCart[k].ApplyTransactionData.UnitTag1,
                    UnitTag2: $scope.CurrentCart[k].ApplyTransactionData.UnitTag2,
                    UnitTag3: $scope.CurrentCart[k].ApplyTransactionData.UnitTag3,
                    UnitTag4: $scope.CurrentCart[k].ApplyTransactionData.UnitTag4,
                    UnitTag5: $scope.CurrentCart[k].ApplyTransactionData.UnitTag5,
                    UnitTag6: $scope.CurrentCart[k].ApplyTransactionData.UnitTag6,
                    UnitTag7: $scope.CurrentCart[k].ApplyTransactionData.UnitTag7,
                    UnitTag8: $scope.CurrentCart[k].ApplyTransactionData.UnitTag8,
                    UniqueDate: wcfDateStr1,
                    UnitDate2: wcfDateStr2,
                    UnitDate3: wcfDateStr3,
                    UnitDate4: wcfDateStr4,
                    UnitNumber1: $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 == undefined ? -1500 : $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1,
                    UnitNumber2: $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 == undefined ? -1500 : $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2,
                    UnitNumber3: $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3 == undefined ? -1500 : $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3,
                    UnitNumber4: $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4 == undefined ? -1500 : $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4,
                    NewToStatusValue: _TempStatus,
                    NewLocationID: _TempLocID,
                    NewUnitTag1: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag1,
                    NewUnitTag2: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag2,
                    NewUnitTag3: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag3,
                    NewUnitTag4: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag4,
                    NewUnitTag5: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag5,
                    NewUnitTag6: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag6,
                    NewUnitTag7: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag7,
                    NewUnitTag8: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag8,
                    NewUniqueDate: wcfDateStr1New,
                    NewUnitDate2: wcfDateStr2New,
                    NewUnitDate3: wcfDateStr3New,
                    NewUnitDate4: wcfDateStr4New,
                    NewUnitNumber1: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1 == undefined || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1 == null ? -1500 : $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1,
                    NewUnitNumber2: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2 == undefined || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2 == null ? -1500 : $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2,
                    NewUnitNumber3: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3 == undefined || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3 == null ? -1500 : $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3,
                    NewUnitNumber4: $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4 == undefined || $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4 == null ? -1500 : $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4,
                    myPostObj: _MyObjdata,
                    IsLineItem: $scope.CurrentCart[k].IsLineItemData
                });
            }

        }

        console.log(_myData);
        return _myData;

    }

    $scope.keepcart = function () {
        $location.path("/FindItems");
    }


    $scope.cancel = function () {

        var box = bootbox.confirm("You want to cancel this process ?", function (result) {
            if (result) {


                $scope.CurrentCart = [];
                localStorageService.set("ActivityCart", "");
                $location.path("/FindItems");
                CheckScopeBeforeApply();

            }

        });




    }

    $scope.IsMyInventoryColumns = function (ColumnID) {

        var j = 0;
        for (j = 0; j < $scope.MyinventoryFields.length; j++) {
            if ($scope.MyinventoryFields[j].ColumnName == ColumnID) {

                return true;
                break;
            }

        }
        return false;
    }

    function GetCustomFieldType(fieldID) {
        for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
            if ($scope.CustomActivityDataList[i].cfdID == fieldID) {
                return $scope.CustomActivityDataList[i].cfdDataType;
            }

        }
        return "";
    }
    function IsDateValidated() {
        var _returnVar = true;

        if ($scope.CurrentOperation == 12) {
            var _dateVal1 = $('#transactionForm1').find("#itUpdateDate").val();
            if (_dateVal1 != null && _dateVal1 != undefined) {
                _dateVal1 = $.trim(_dateVal1);
            }

            var _dateVal2 = $('#transactionForm2').find("#itUpdateDate").val();
            if (_dateVal2 != null && _dateVal2 != undefined) {
                _dateVal2 = $.trim(_dateVal2);
            }

            if (_dateVal1 != "" && _dateVal2 != "") {
                _returnVar = true;
            }
            else {
                _returnVar = false;
            }

        }
        else {
            var _dateVal = $("#itUpdateDate").val();
            if (_dateVal != null && _dateVal != undefined) {
                _dateVal = $.trim(_dateVal);
            }

            if (_dateVal != "") {
                _returnVar = true;
            }
            else {
                _returnVar = false;
            }
        }

        return _returnVar
    }

    $scope.clearCartFunction = function () {
        localStorageService.set("ActivityCart", "");
        localStorageService.set("SelectedAction", "");
        $location.path("/FindItems");
    }

    $scope.SubmitAllActivities = function () {

        debugger;

        var _unchangeData = $scope.UnchangedData();
        var _validateObjectVm = $scope.ValidateObjectVM();
        var _validateCustomFields = CheckintoCustomData(0);
        var _dateValidated = IsDateValidated();
        if (!_validateObjectVm && !_unchangeData) {

            if (!_validateCustomFields && _dateValidated == true) {

                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    $scope.SecurityToken = authData.token;
                }
                $scope.IsProcessing = true;

                var _mdata = BuildMultipleData();

                console.log(_mdata);

                $.ajax({
                    type: "POST",
                    url: serviceBase + 'MultipleActivity',
                    contentType: 'application/json; charset=utf-8',

                    dataType: 'json',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "data": _mdata, "CustomAutoClear": $scope.CustomAutoClear }),
                    success: function (response) {
                        if (response.MultipleActivityResult.Success == true) {

                            localStorageService.set("ActivityCart", "");
                            localStorageService.set("SelectedAction", "");

                            $scope.IsProcessing = false;
                            $scope.CurrentCart = [];
                            ShowSuccessActivity('Saved', $scope._CurrentAction);

                            $location.path("/FindItems");
                            localStorageService.set("ActivityCart", "");
                            localStorageService.set("SelectedAction", "");

                            $scope.clearCartFunction();
                            $scope.$apply();

                        }
                        else {
                            $scope.ShowErrorMessage("Multiple activity", 1, 1, response.MultipleActivityResult.Message)

                        }
                    },
                    error: function (err) {

                        $scope.ShowErrorMessage("Multiple activity", 2, 1, err.statusText);


                    }
                });
            }
            else {

                if (_validateObjectVm || _validateCustomFields || _dateValidated == false) {

                    var _dataIndex = $scope.IsSingleMode == true ? $scope.CurrentCart.length : 1;
                    $scope.GoToStep(_dataIndex, 1);
                    if (!CheckintoCustomData(0) == false) {
                        $scope.IssueType = 5;
                    }
                    else if (IsDateValidated() == false) {
                        $scope.IssueType = 6;
                    }
                    $scope.ShowErrorMessage($scope.IssueType);
                }
            }
        }

        else {
            if (_validateObjectVm || _validateCustomFields || _dateValidated == false) {
                $scope.ShowErrorMessage($scope.IssueType);
            }
        }



    }



    $scope.HasClassData = function (id) {
        id = "#" + id;
        if ($(id).hasClass("in")) {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.GetObjIndex = function (CurrentActiveObject) {


        for (var i = 0; i < $scope.CurrentCart.length; i++) {
            if ($scope.CurrentCart[i].InventoryID == CurrentActiveObject.InventoryID) {
                return i + 1;
            }
        }
    }



    $scope.DeleteItem = function (CurrentActiveObject) {




        var _ID = "#CartData_" + CurrentActiveObject.InventoryID.toString();

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {


                var _tempArray = $scope.CurrentCart;
                var _tempIndex = -1;
                for (var i = 0; i < _tempArray.length; i++) {
                    if (_tempArray[i].InventoryID == CurrentActiveObject.InventoryID) {
                        $(_ID).addClass("animated zoomOutDown");
                        _tempIndex = i;
                        //  $scope.CurrentCart.splice(i, 1);

                    }
                }
                setTimeout(function () {
                    if (_tempIndex != -1) {
                        $scope.CurrentCart.splice(_tempIndex, 1);
                    }

                    localStorageService.set("ActivityCart", "")
                    localStorageService.set("ActivityCart", $scope.CurrentCart);
                    CheckScopeBeforeApply();

                    if ($scope.CurrentCart.length == 0) {
                        log.warning("Seems like you don't have any item in your cart.")
                        $location.path("/FindItems");
                        CheckScopeBeforeApply();

                    }
                }, 1000);




            }
            else {



            }
        });

        box.on("shown.bs.modal", function () {
            $(".mybootboxbody").html("Press ok to delete item to your cart list ");

        });
    }



    $scope.FillLineItem = function (LineItemIndex, fieldID, value, InventoryID) {

        var _DataType = GetCustomFieldType(fieldID);
        $scope.ActionLineItemData = value;

        $scope.ActionLineItemData = $scope.ActionLineItemData == "" && _DataType == "checkbox" ? "false" : $scope.ActionLineItemData;
        if ($scope.ActionLineItemData != "") {
            var k = 0;
            for (k = 0; k < $scope.CurrentCart.length; k++) {
                $scope.CurrentCart[k].IsLineItemData[LineItemIndex].CfValue = $scope.ActionLineItemData;

            }
            ShowSuccessActivity('Updated', $scope._CurrentAction);
            var _idtoPass = "#lineitem_" + fieldID.toString() + "_" + InventoryID.toString();
            $(_idtoPass).addClass("movepin");

            $scope.CurrentLineItemIndex = -1;
            $scope.CurrentInventoryId = -1;




        }

        else {
            log.error("Please fill some value.");
        }
    }


    $scope.ShowErrorMessage = function (Option) {
        var _itemIDs = "";

        if ($scope.AffectedItemIds.length > 0) {
            _itemIDs = $scope.AffectedItemIds.join(",");
        }
        switch (Option) {
            case 1:
                log.error("Quantity is required field or quantity is greater than original quantity,please fill quantity in following cart items " + _itemIDs);
                break;
            case 2:
                log.error("Convert Quantity and into this quantity are required fields,please fill proper values in following cart items " + _itemIDs);
                break;
            case 21:
                log.error("Destination UOM is required fields,please fill proper values in following cart items " + _itemIDs);
                break;
            case 3:
                log.error("Moveable Quantity is required field,please fill proper values in following cart items " + _itemIDs);
                break;
            case 32:
                log.error("Destination location is required field,please fill proper values in following cart items " + _itemIDs);
                break;
            case 4:
            case 31:

                log.error("Seems like some items are having same location where it was earlier, please select different location to move in following cart items " + _itemIDs);
                break;

            case 5:
                log.error("Seems like you haven't fill all required fields for Event data, please fill them first in following cart items " + _itemIDs)
                break;
            case 6:
                log.error("Event date is required field, please fill them first")
                break;
            default:

        }




    }


    function CheckintoArray(CurrentIndex) {
        CurrentIndex = CurrentIndex - 1;
        $scope.AffectedItemIds = [];
        var k = 0;
        var _totalLength = $scope.IsSingleMode == true ? $scope.CurrentCart.length : 1;
        if ($scope.CurrentCart != null && $scope.CurrentCart.length > 0) {
            switch ($scope.CurrentOperation) {
                case "Increase":
                case "Decrease":
                    for (k = 0; k < _totalLength; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == "" || $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == null)) {
                            $scope.IssueType = 1;
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }
                            return true;

                            break;
                        }
                        else if ($scope.CurrentOperation == "Decrease") {


                            if (k == CurrentIndex && $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                    $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                                }
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                case "Convert":

                    for (k = 0; k < _totalLength; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == null || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == null || $scope.CurrentCart[k].ConvertTransactionData.ToUOMID == null || $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == "" || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == "" || $scope.CurrentCart[k].ConvertTransactionData.ToUOMID == "")) {
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }

                            if ($scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == null || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == null || $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == "" || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == "") {
                                $scope.IssueType = 2;

                            }
                            else if ($scope.CurrentCart[k].ConvertTransactionData.ToUOMID == null || $scope.CurrentCart[k].ConvertTransactionData.ToUOMID == "") {
                                $scope.IssueType = 21;
                            }
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if (k == CurrentIndex && $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                    $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                                }
                                return true;
                                break;
                            }
                            else {

                            }

                        }

                    }
                    break;
                case "Move":

                    for (k = 0; k < _totalLength; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity == null || $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == null || $scope.CurrentCart[k].MoveTransactionData.ActionQuantity == "" || $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == "")) {
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }
                            if ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity == null || $scope.CurrentCart[k].MoveTransactionData.ActionQuantity == "") {


                                $scope.IssueType = 3;
                            }

                            else if ($scope.CurrentCart[k].MoveTransactionData.MoveToLocation == null || $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == "") {
                                $scope.IssueType = 32;
                            }
                            CheckScopeBeforeApply();
                            return true;

                            break;
                        }
                        else if (k == CurrentIndex && $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == $scope.CurrentCart[k].InventoryDataList.iLID) {
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }

                            $scope.IssueType = 31;
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if (k == CurrentIndex && ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity)) {
                                if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                    $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                                }

                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;


                case "Move":

                    for (k = 0; k < _totalLength; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity == null || $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == null || $scope.CurrentCart[k].MoveTransactionData.ActionQuantity == "" || $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == "")) {
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }
                            if ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity == null || $scope.CurrentCart[k].MoveTransactionData.ActionQuantity == "") {


                                $scope.IssueType = 3;
                            }

                            else if ($scope.CurrentCart[k].MoveTransactionData.MoveToLocation == null || $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == "") {
                                $scope.IssueType = 32;
                            }
                            CheckScopeBeforeApply();
                            return true;

                            break;
                        }
                        else if (k == CurrentIndex && $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == $scope.CurrentCart[k].InventoryDataList.iLID) {
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }

                            $scope.IssueType = 31;
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if (k == CurrentIndex && ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity)) {
                                if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                    $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                                }

                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                case "MoveTagUpdate":
                    for (k = 0; k < _totalLength; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity == "" || $scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity == null)) {
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }
                            $scope.IssueType = 1;
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if (k == CurrentIndex && $scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                    $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                                }
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                case "Update":
                    for (k = 0; k < _totalLength; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == "" || $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == null)) {
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }
                            $scope.IssueType = 1;
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if (k == CurrentIndex && $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                    $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                                }
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                default:

            }

            for (k = 0; k < _totalLength; k++) {

                if (k == CurrentIndex && $scope.CurrentCart[k].IsLineItemData != null && $scope.CurrentCart[k].IsLineItemData != undefined && $scope.CurrentCart[k].IsLineItemData.length > 0) {
                    var _x = 0;
                    for (_x = 0; _x < $scope.CurrentCart[k].IsLineItemData.length; _x++) {
                        var _tempValueData = $.trim($scope.CurrentCart[k].IsLineItemData[_x].CfValue);
                        if ($scope.IsActiveTransactionField($scope.CurrentCart[k].IsLineItemData[_x].cfdID) && $scope.CurrentCart[k].IsLineItemData[_x].cfdIsRequired == true && (_tempValueData == "" || _tempValueData == null)) {
                            log.error($scope.CurrentCart[k].IsLineItemData[_x].cfdName + " is required field, please fill some value");
                            CheckScopeBeforeApply();;
                            return true;
                        }
                    }


                }


            }





            return false;

        }
        else {
            return true;
        }
    }



    function CheckintoCustomData(CurrentIndex) {
        var _returnVar = false
        var _tempArray = [];
        $.each($('.customActivityData input, select'), function () {
            var value = $.trim($(this).val());
            var cfdid = $(this).attr('cfd-id');
            if ((value == null || value == undefined || value == "") && (cfdid != undefined && cfdid != null)) {
                var _tempVar = CheckintoCustomFieldList(cfdid);
                _tempArray.push(_tempVar);

            }
            else {

            }
        });
        var i = 0;
        for (var i = 0; i < _tempArray.length; i++) {
            if (_tempArray[i] == true || _tempArray[i] == "true") {
                _returnVar = true;
            }
        }

        return _returnVar;

    }

    function CheckintoCustomFieldList(id) {
        var k = 0;
        for (k = 0; k < $scope.CustomActivityDataList.length; k++) {
            if ($scope.CustomActivityDataList[k].cfdCustomFieldType.toLowerCase() == "inventory" && $scope.CustomActivityDataList[k].cfdID == id && $scope.CustomActivityDataList[k].cfdIsRequired == true) {
                $scope.IssueType = 5;
                CheckScopeBeforeApply();
                return true;
            }


        }
        return false;
    }
    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }
    $scope.changeNav = function () {

        var _tempLength = $scope.totalLength - 1;
        if (_tempLength != $scope.CurrentStep) {

            setTimeout(function () {



                    if ($(".swiper-slide-active").find("input").length > 0) {
                        var _type = $(".swiper-slide-active").find("input").attr("type");
                        var _value = $(".swiper-slide-active").find("input").attr("value");

                        if (_type == "text" || _type == "number" || _type == "week" || _type == "email") {

                            $(".swiper-slide-active input:first").focus();
                            $('.changebtn').hide();
                            $(".swiper-slide-active input:first").not("input[type='checkbox']").trigger("click");
                            $(".swiper-slide-active input:first").not("input[type='checkbox']").trigger("keypress");

                        }


                    }


              

               

            }, 0);

        }
    }



    var $body = jQuery('body');

    /* bind events */
    $(document)
    .on('focus', 'input,select', function () {


        $('.changebtn').hide();

        $('.collapsible-header').css("position", "absolute");
        $('.collapsible-body').css('margin-top', '49px');
        $('.header').css("position", "relative");
        $('.iteminfopanel').css('margin-top', '0px');
        $('.activityfields').css('margin-top', '0px');
        $('.singlePanel').css('margin-top', '0px');
        $('#transactionForm1').css('margin-top', '0px');
        $('.bottombutton').css("position", "relative");

    })
    .on('blur', 'input,select', function () {

     

        $('.collapsible-header').css("position", "fixed");
        $('.changebtn').show();
        $('.header').css("position", "fixed");
        $('.iteminfopanel').css('margin-top', '80px');
        $('.collapsible-body').css('margin-top', '85px');
        $('.activityfields').css('margin-top', '80px');
        $('.singlePanel').css('margin-top', '35px');
        $('#transactionForm1').css('margin-top', '85px');
        $('.bottombutton').css("position", "fixed");

    });



    $(document)
 .on('change', "input[type='email']", function () {

     if ($.trim($(this).val()) != "") {
         var _value = $(this).val();
         if ($scope.IsProperEmail(_value) == false) {
             $(this).css("border-color", "#c31818");
             $(this).parent("div").find(".emailError").remove();
             $('<span class="emailError">Invalid email</span>').insertAfter(this);

         }
         else {
             $(this).css("border-color", "#cccccc");
             $(this).parent("div").find(".emailError").remove();

         }
     }


 });

    $scope.IsProperEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    var now = new Date();

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear() + "-" + (month) + "-" + (day);


    setTimeout(function () { $('.itUpdateDate').val(today) }, 1000);

    setTimeout(function () {
        $('.FormDateType').each(function () {
            if ($.trim($(this).val()) != "") {
                $(this).val(today)

            }
        });


    }, 1000);

    setTimeout(function () {


        $(".datetimedata").each(function () {
            var _val = $(this).val();
            $(this).val(_val);
            setTimeout(function () {
                $(this).trigger("input");
                $(this).trigger("blur");
                $(this).trigger("change");
            }, 1000);
        });

        $(".weekPicker,.monthPicker").each(function () {
            var _val = $(this).attr("selectvalue");
            $(this).val(_val);
            $(this).trigger("change");
        });

    }, 4000);


    function ShowErrorMessage(Action) {
        var _MsgTitle = "DATA HAS NOT CHANGED";
        var _Msg = "Please update at least one unit data field or change status or location to perform an activity.";
        switch (Action) {
            case "Move":
                _MsgTitle = "ONE (OR MORE) LOCATIONs HAVE NOT CHANGED";
                _Msg = "You are trying to move some units in your cart to their current locations, which is not allowed.  Please make sure that the units in each line item of your cart are moving to locations that are different from their current locations."
                break;
            case "Convert":
                _MsgTitle = "ONE (OR MORE) UNITS OF MEASURE HAVE NOT CHANGED";
                _Msg = "You are trying to convert some units in your cart to their current unit of measure, which is not allowed.  Please make sure that the units in each line item of your cart are converting to units of measure that are different than their current unit of measure."
                break;
            case "Update":
                _MsgTitle = "ONE (OR MORE) STATUSES HAVE NOT CHANGED";
                _Msg = "You are trying to update some units in your cart with to their current status, which is not allowed.  Please make sure that the units in each line item of your cart are getting updated to statuses that are different than their current status."
                break;
            case "Apply":
                _MsgTitle = "ONE (OR MORE) TAGS HAVE NOT CHANGED";
                _Msg = "You are trying to tag some units in your cart with their current values, which is not allowed.  Please make sure that the units in each line item of your cart are getting tagged with at least one value which is different than the current value."
                break;
            case "MoveTagUpdate":
                _MsgTitle = "ONE (OR MORE) LOCATIONS, TAGS, AND/OR STATUSES HAVE NOT CHANGED";
                _Msg = "You are trying to move tag & update some units in your cart without changing their location, tags, or statuses, which is not allowed.  Please make sure that the units in each line item of your cart have at least one value (location or tag or status) that is different than their current value."
                break;
            default:
        }
        //toastr.newwarning(_Msg);
        toastr.error(_Msg, _MsgTitle, {
            "closeButton": true,
            "timeOut": 0,
            "extendedTimeOut": 0
        });
    }

    function MatchString(_Val1, _Val2) {
        _Val1 = $.trim(_Val1) != "" ? _Val1.toLowerCase() : "";
        _Val2 = $.trim(_Val2) != "" ? _Val2.toLowerCase() : "";

        return _Val1 == _Val2;

    }

    setTimeout(function() {
        $("select.uniqueunitData").each(function () {
         
         // $(this).trigger("change");
        })
    },5000)

  


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

        if ($.trim(_timeValue) != "") {
             
            var _ToMergeTime = "";
            var _timeString = "";
            if (_timeValue.indexOf("AM") > -1 || _timeValue.indexOf("PM") > -1) {

                var _timeSplit = _timeValue.split(" ");
                _timeString = _timeSplit[0].split(":");

                if (parseInt(_timeString[0]) > 12 || parseInt(_timeString[0]) == 12) {

                    _timeString[0] = (parseInt(_timeString[0]) - 12).toString();
                }


                _ToMergeTime = (_timeSplit[1] == "AM" ? leadZero(_timeString[0]) : leadZero((12 + parseInt(_timeString[0]))).toString()) + ":" + leadZero(_timeString[1]);
            }
            else {
                _timeString = _timeValue.split(":");
                _ToMergeTime = (_timeString[0]) + ":" + (_timeString[1]) + ":" + (_timeString[2]);
            }
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

                    if ($scope.GetUnitDataFieldByName("UniqueDate").FieldSpecialType == 16) {
                        return ConverttoMsJsonDateTime(value);
                    }

                    else if ($scope.GetUnitDataFieldByName("UniqueDate").FieldSpecialType == 17) {
                        return ConvertToTime(value);
                    }
                    else {
                        return formatDate(value);
                    }

                    break;
                case 2:
                    if ($scope.GetUnitDataFieldByName("UnitDate2").FieldSpecialType == 16) {
                        return ConverttoMsJsonDateTime(value);
                    }

                    else if ($scope.GetUnitDataFieldByName("UnitDate2").FieldSpecialType == 17) {
                        return ConvertToTime(value);
                    }
                    else {
                        return formatDate(value);
                    }

                    break;
                case 3:
                    if ($scope.GetUnitDataFieldByName("UnitDate3").FieldSpecialType == 16) {
                        return ConverttoMsJsonDateTime(value);
                    }

                    else if ($scope.GetUnitDataFieldByName("UnitDate3").FieldSpecialType == 17) {
                        return ConvertToTime(value);
                    }
                    else {
                        return formatDate(value);
                    }

                    break;
                case 4:
                    if ($scope.GetUnitDataFieldByName("UnitDate4").FieldSpecialType == 16) {
                        return ConverttoMsJsonDateTime(value);
                    }

                    else if ($scope.GetUnitDataFieldByName("UnitDate4").FieldSpecialType == 17) {
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
    $scope.UnchangedData = function () {
        var k = 0;
        if ($scope.CurrentCart != null && $scope.CurrentCart.length > 0) {

            switch ($scope.CurrentOperation) {
                case "Convert":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentCart[k].ConvertTransactionData.ToUOMID == $scope.CurrentCart[k].InventoryDataList.iUOMID) {
                            ShowErrorMessage($scope.CurrentOperation);
                            $scope.GoToStep(k);
                            //$("#" + $scope.CurrentCart[k].InventoryDataList.uId).removeClass("animated shake").addClass("animated shake");
                            return true;
                        }
                    }
                    break;
                case "MoveTagUpdate":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        var _x1 = false;
                        var _x2 = false;
                        var _x3 = false;
                        var _x4 = false;
                        var _x5 = false;
                        var _x6 = false;
                        var _x7 = false;
                        var _x8 = false;
                        var _x9 = false;
                        var _x10 = false;
                        var _x11 = false;
                        var _x12 = false;
                        var _x13 = false;
                        var _x14 = false;
                        var _x15 = false;
                        var _x16 = false;
                        var _x17 = false;
                        var _x18 = false;


                        if ($scope.IsMyInventoryColumns('iReqValue') == true) {

                            var _val1 = $scope.CurrentCart[k].InventoryDataList.iReqValue != null && $scope.CurrentCart[k].InventoryDataList.iReqValue != undefined ? $scope.CurrentCart[k].InventoryDataList.iReqValue : "";

                            var _val2 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag1 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag1 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag1 : "";

                            _x1 = MatchString(_val1, _val2);
                        } else {

                            _x1 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitTag2') == true) {


                            var _val11 = $scope.CurrentCart[k].InventoryDataList.iUnitTag2 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag2 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag2 : "";

                            var _val12 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag2 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag2 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag2 : "";

                            _x2 = MatchString(_val11, _val12);



                        } else {

                            _x2 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitTag3') == true) {


                            var _val21 = $scope.CurrentCart[k].InventoryDataList.iUnitTag3 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag3 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag3 : "";

                            var _val22 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag3 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag3 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag3 : "";

                            _x3 = MatchString(_val21, _val22);

                        } else {

                            _x3 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitTag4') == true) {


                            var _val23 = $scope.CurrentCart[k].InventoryDataList.iUnitTag4 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag4 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag4 : "";

                            var _val24 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag4 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag4 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag4 : "";

                            _x4 = MatchString(_val23, _val24);

                        } else {

                            _x4 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitTag5') == true) {


                            var _val25 = $scope.CurrentCart[k].InventoryDataList.iUnitTag5 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag5 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag5 : "";

                            var _val26 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag5 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag5 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag5 : "";

                            _x5 = MatchString(_val25, _val26);

                        } else {

                            _x5 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitTag6') == true) {


                            var _val27 = $scope.CurrentCart[k].InventoryDataList.iUnitTag6 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag6 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag6 : "";

                            var _val28 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag6 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag6 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag6 : "";

                            _x6 = MatchString(_val27, _val28);

                        } else {

                            _x6 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitTag7') == true) {


                            var _val29 = $scope.CurrentCart[k].InventoryDataList.iUnitTag7 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag7 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag7 : "";

                            var _val30 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag7 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag7 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag7 : "";

                            _x7 = MatchString(_val29, _val30);

                        } else {

                            _x7 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitTag8') == true) {


                            var _val31 = $scope.CurrentCart[k].InventoryDataList.iUnitTag8 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag8 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag8 : "";

                            var _val32 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag8 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag8 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitTag8 : "";

                            _x8 = MatchString(_val31, _val32);

                        } else {

                            _x8 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUniqueDate') == true) {


                            var _val33 = $scope.CurrentCart[k].InventoryDataList.iUniqueDate_date != "" && $scope.CurrentCart[k].InventoryDataList.iUniqueDate_date != null && $scope.CurrentCart[k].InventoryDataList.iUniqueDate_date != undefined ? $scope.CurrentCart[k].InventoryDataList.iUniqueDate_date : null;

                            var _val34 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UniqueDate != "" && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UniqueDate != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UniqueDate != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UniqueDate : null;

                            _val33 = ConvertToProperDate($scope.CurrentCart[k].InventoryDataList.iUniqueDate_date, 1);
                            _x9 = ((_val33) == _val34);


                        }
                        else {

                            _x9 = true;
                        }

                        if ($scope.IsMyInventoryColumns('iUnitDate2') == true) {


                            var _val35 = $scope.CurrentCart[k].InventoryDataList.iUnitDate2_date != "" && $scope.CurrentCart[k].InventoryDataList.iUnitDate2_date != null && $scope.CurrentCart[k].InventoryDataList.iUnitDate2_date != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitDate2_date : null;

                            var _val36 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate2 != "" && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate2 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate2 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate2 : null;
                            _val35 = ConvertToProperDate($scope.CurrentCart[k].InventoryDataList.iUnitDate2_date, 2);

                            _x10 = ((_val35) == _val36);
                        }
                        else {

                            _x10 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitDate3') == true) {


                            var _val37 = $scope.CurrentCart[k].InventoryDataList.iUnitDate3_date != "" && $scope.CurrentCart[k].InventoryDataList.iUnitDate3_date != null && $scope.CurrentCart[k].InventoryDataList.iUnitDate3_date != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitDate3_date : null;

                            var _val38 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate3 != "" && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate3 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate3 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate3 : null;
                            _val37 = ConvertToProperDate($scope.CurrentCart[k].InventoryDataList.iUnitDate3_date, 3);

                            _x11 = ((_val37) == _val38);
                        }
                        else {

                            _x11 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitDate4') == true) {


                            var _val39 = $scope.CurrentCart[k].InventoryDataList.iUnitDate4_date != "" && $scope.CurrentCart[k].InventoryDataList.iUnitDate4_date != null && $scope.CurrentCart[k].InventoryDataList.iUnitDate4_date != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitDate4_date : null;

                            var _val40 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate4 != "" && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate4 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate4 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitDate4 : null;
                            _val39 = ConvertToProperDate($scope.CurrentCart[k].InventoryDataList.iUnitDate4_date, 4);

                            _x12 = ((_val39) == _val40);
                        }
                        else {

                            _x12 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitNumber1') == true) {


                            var _val41 = $scope.CurrentCart[k].InventoryDataList.iUnitNumber1 != "" && $scope.CurrentCart[k].InventoryDataList.iUnitNumber1 != null && $scope.CurrentCart[k].InventoryDataList.iUnitNumber1 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitNumber1 : null;

                            var _val42 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1 != "" && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber1 : null;

                            _val41 = _val41 != null ? parseFloat(_val41) : null;
                            _val42 = _val42 != null ? parseFloat(_val42) : null;

                            _x13 = (_val41 == _val42);

                        }
                        else {

                            _x13 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitNumber2') == true) {

                            var _val43 = $scope.CurrentCart[k].InventoryDataList.iUnitNumber2 != "" && $scope.CurrentCart[k].InventoryDataList.iUnitNumber2 != null && $scope.CurrentCart[k].InventoryDataList.iUnitNumber2 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitNumber2 : null;

                            var _val44 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2 != "" && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber2 : null;

                            _val43 = _val43 != null ? parseFloat(_val43) : null;
                            _val44 = _val44 != null ? parseFloat(_val44) : null;

                            _x14 = (_val43 == _val44);

                        }
                        else {

                            _x14 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitNumber3') == true) {

                            var _val45 = $scope.CurrentCart[k].InventoryDataList.iUnitNumber3 != "" && $scope.CurrentCart[k].InventoryDataList.iUnitNumber3 != null && $scope.CurrentCart[k].InventoryDataList.iUnitNumber3 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitNumber3 : null;

                            var _val46 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3 != "" && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber3 : null;

                            _val45 = _val45 != null ? parseFloat(_val45) : null;
                            _val46 = _val46 != null ? parseFloat(_val46) : null;

                            _x15 = (_val45 == _val46);

                        }
                        else {

                            _x15 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitNumber4') == true) {

                            var _val47 = $scope.CurrentCart[k].InventoryDataList.iUnitNumber4 != "" && $scope.CurrentCart[k].InventoryDataList.iUnitNumber4 != null && $scope.CurrentCart[k].InventoryDataList.iUnitNumber4 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitNumber4 : null;

                            var _val48 = $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4 != "" && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4 != null && $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4 != undefined ? $scope.CurrentCart[k].MoveUpdateTagTransactionData.UnitNumber4 : null;

                            _val47 = _val47 != null ? parseFloat(_val47) : null;
                            _val48 = _val48 != null ? parseFloat(_val48) : null;

                            _x16 = (_val47 == _val48);

                        }
                        else {

                            _x16 = true;
                        }
                        if (MatchString($scope.CurrentCart[k].MoveUpdateTagTransactionData.StatusToUpdate, $scope.CurrentCart[k].InventoryDataList.iStatusValue)) {
                            _x17 = true;
                        }

                        if ($scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocation == $scope.CurrentCart[k].InventoryDataList.iLID) {
                            _x18 = true;
                        }
                        if (_x9 == false || _x8 == false || _x1 == false || _x2 == false || _x3 == false || _x4 == false || _x5 == false || _x6 == false || _x7 == false || _x10 == false || _x11 == false || _x12 == false || _x13 == false || _x14 == false || _x15 == false || _x16 == false || _x17 == false || _x18 == false) {



                        }
                        else {
                            $scope.GoToStep(k);
                            ShowErrorMessage($scope.CurrentOperation);
                            return true;
                        }

                    }
                    break;
                case "Update":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if (MatchString($scope.CurrentCart[k].UpdateTransactionData.StatusToUpdate, $scope.CurrentCart[k].InventoryDataList.iStatusValue)) {
                            ShowErrorMessage($scope.CurrentOperation);
                            $scope.GoToStep(k);
                            return true;
                        }
                    }
                    break;
                case "Apply":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                         
                        var _x1 = false;
                        var _x2 = false;
                        var _x3 = false;
                        var _x4 = false;
                        var _x5 = false;
                        var _x6 = false;
                        var _x7 = false;
                        var _x8 = false;
                        var _x9 = false;
                        var _x10 = false;          
                        var _x11 = false;
                        var _x12 = false;
                        var _x13 = false;
                        var _x14 = false;
                        var _x15 = false;
                        var _x16 = false;
    

                        if ($scope.IsMyInventoryColumns('iReqValue') == true) {

                            var _val1 = $scope.CurrentCart[k].InventoryDataList.iReqValue != null && $scope.CurrentCart[k].InventoryDataList.iReqValue != undefined ? $scope.CurrentCart[k].InventoryDataList.iReqValue : "";

                            var _val2 = $scope.CurrentCart[k].ApplyTransactionData.UnitTag1 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitTag1 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitTag1 : "";

                            _x1 = MatchString(_val1, _val2);
                        }
                        else {

                            _x1 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitTag2') == true) {


                            var _val11 = $scope.CurrentCart[k].InventoryDataList.iUnitTag2 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag2 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag2 : "";

                            var _val12 = $scope.CurrentCart[k].ApplyTransactionData.UnitTag2 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitTag2 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitTag2 : "";

                            _x2 = MatchString(_val11, _val12);



                        } else {

                            _x2 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitTag3') == true) {


                            var _val21 = $scope.CurrentCart[k].InventoryDataList.iUnitTag3 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag3 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag3 : "";

                            var _val22 = $scope.CurrentCart[k].ApplyTransactionData.UnitTag3 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitTag3 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitTag3 : "";

                            _x3 = MatchString(_val21, _val22);

                        } else {

                            _x3 = true;
                        }

                        if ($scope.IsMyInventoryColumns('iUnitTag4') == true) {


                            var _val23 = $scope.CurrentCart[k].InventoryDataList.iUnitTag4 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag4 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag4 : "";

                            var _val24 = $scope.CurrentCart[k].ApplyTransactionData.UnitTag4 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitTag4 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitTag4 : "";

                            _x4 = MatchString(_val23, _val24);

                        } else {

                            _x4 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitTag5') == true) {


                            var _val25 = $scope.CurrentCart[k].InventoryDataList.iUnitTag5 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag5 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag5 : "";

                            var _val26 = $scope.CurrentCart[k].ApplyTransactionData.UnitTag5 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitTag5 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitTag5 : "";

                            _x5 = MatchString(_val25, _val26);

                        } else {

                            _x5 = true;
                        }

                        if ($scope.IsMyInventoryColumns('iUnitTag6') == true) {


                            var _val27 = $scope.CurrentCart[k].InventoryDataList.iUnitTag6 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag6 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag6 : "";

                            var _val28 = $scope.CurrentCart[k].ApplyTransactionData.UnitTag6 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitTag6 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitTag6 : "";

                            _x6 = MatchString(_val27, _val28);

                        } else {

                            _x6 = true;
                        }

                        if ($scope.IsMyInventoryColumns('iUnitTag7') == true) {


                            var _val29 = $scope.CurrentCart[k].InventoryDataList.iUnitTag7 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag7 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag7 : "";

                            var _val30 = $scope.CurrentCart[k].ApplyTransactionData.UnitTag7 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitTag7 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitTag7 : "";

                            _x7 = MatchString(_val29, _val30);

                        } else {

                            _x7 = true;
                        }

                        if ($scope.IsMyInventoryColumns('iUnitTag8') == true) {


                            var _val31 = $scope.CurrentCart[k].InventoryDataList.iUnitTag8 != null && $scope.CurrentCart[k].InventoryDataList.iUnitTag8 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitTag8 : "";

                            var _val32 = $scope.CurrentCart[k].ApplyTransactionData.UnitTag8 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitTag8 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitTag8 : "";

                            _x8 = MatchString(_val31, _val32);

                        } else {

                            _x8 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUniqueDate') == true) {


                            var _val33 = $scope.CurrentCart[k].InventoryDataList.iUniqueDate_date != "" && $scope.CurrentCart[k].InventoryDataList.iUniqueDate_date != null && $scope.CurrentCart[k].InventoryDataList.iUniqueDate_date != undefined ? $scope.CurrentCart[k].InventoryDataList.iUniqueDate_date : null;

                            var _val34 = $scope.CurrentCart[k].ApplyTransactionData.UniqueDate != "" && $scope.CurrentCart[k].ApplyTransactionData.UniqueDate != null && $scope.CurrentCart[k].ApplyTransactionData.UniqueDate != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UniqueDate : null;
                            _val33 = ConvertToProperDate($scope.CurrentCart[k].InventoryDataList.iUniqueDate_date, 1);
                            _x9 = ((_val33) == _val34);

                        } else {

                            _x9 = true;
                        }

                        if ($scope.IsMyInventoryColumns('iUnitDate2') == true) {


                            var _val35 = $scope.CurrentCart[k].InventoryDataList.iUnitDate2_date != "" && $scope.CurrentCart[k].InventoryDataList.iUnitDate2_date != null && $scope.CurrentCart[k].InventoryDataList.iUnitDate2_date != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitDate2_date : null;

                            var _val36 = $scope.CurrentCart[k].ApplyTransactionData.UnitDate2 != "" && $scope.CurrentCart[k].ApplyTransactionData.UnitDate2 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitDate2 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitDate2 : null;

                            _val35 = ConvertToProperDate($scope.CurrentCart[k].InventoryDataList.iUnitDate2_date, 2);

                            _x10 = ((_val35) == _val36);
                        }
                        else {

                            _x10 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitDate3') == true) {


                            var _val37 = $scope.CurrentCart[k].InventoryDataList.iUnitDate3_date != "" && $scope.CurrentCart[k].InventoryDataList.iUnitDate3_date != null && $scope.CurrentCart[k].InventoryDataList.iUnitDate3_date != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitDate3_date : null;

                            var _val38 = $scope.CurrentCart[k].ApplyTransactionData.UnitDate3 != "" && $scope.CurrentCart[k].ApplyTransactionData.UnitDate3 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitDate3 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitDate3 : null;

                            _val37 = ConvertToProperDate($scope.CurrentCart[k].InventoryDataList.iUnitDate3_date, 3);

                            _x11 = ((_val37) == _val38);
                        }
                        else {

                            _x11 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitDate4') == true) {


                            var _val39 = $scope.CurrentCart[k].InventoryDataList.iUnitDate4_date != "" && $scope.CurrentCart[k].InventoryDataList.iUnitDate4_date != null && $scope.CurrentCart[k].InventoryDataList.iUnitDate4_date != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitDate4_date : null;

                            var _val40 = $scope.CurrentCart[k].ApplyTransactionData.UnitDate4 != "" && $scope.CurrentCart[k].ApplyTransactionData.UnitDate4 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitDate4 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitDate4 : null;

                            _val39 = ConvertToProperDate($scope.CurrentCart[k].InventoryDataList.iUnitDate4_date, 4);

                            _x12 = ((_val39) == _val40);
                        }
                        else {

                            _x12 = true;
                        }
                        if ($scope.IsMyInventoryColumns('iUnitNumber1') == true) {


                            var _val41 = $scope.CurrentCart[k].InventoryDataList.iUnitNumber1 != "" && $scope.CurrentCart[k].InventoryDataList.iUnitNumber1 != null && $scope.CurrentCart[k].InventoryDataList.iUnitNumber1 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitNumber1 : null;

                            var _val42 = $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 != "" && $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 : null;

                            _x13 = (_val41 == _val42);

                        } else {

                            _x13 = true;
                        }

                        if ($scope.IsMyInventoryColumns('iUnitNumber2') == true) {

                            var _val43 = $scope.CurrentCart[k].InventoryDataList.iUnitNumber2 != "" && $scope.CurrentCart[k].InventoryDataList.iUnitNumber2 != null && $scope.CurrentCart[k].InventoryDataList.iUnitNumber2 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitNumber2 : null;

                            var _val44 = $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 != "" && $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 : null;

                            _x14 = (_val43 == _val44);

                        } else {

                            _x14 = true;
                        }

                        if ($scope.IsMyInventoryColumns('iUnitNumber3') == true) {

                            var _val45 = $scope.CurrentCart[k].InventoryDataList.iUnitNumber3 != "" && $scope.CurrentCart[k].InventoryDataList.iUnitNumber3 != null && $scope.CurrentCart[k].InventoryDataList.iUnitNumber3 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitNumber3 : null;

                            var _val46 = $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3 != "" && $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitNumber3 : null;

                            _x15 = (_val45 == _val46);

                        } else {

                            _x15 = true;
                        }

                        if ($scope.IsMyInventoryColumns('iUnitNumber4') == true) {

                            var _val47 = $scope.CurrentCart[k].InventoryDataList.iUnitNumber4 != "" && $scope.CurrentCart[k].InventoryDataList.iUnitNumber4 != null && $scope.CurrentCart[k].InventoryDataList.iUnitNumber4 != undefined ? $scope.CurrentCart[k].InventoryDataList.iUnitNumber4 : null;

                            var _val48 = $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4 != "" && $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4 != null && $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4 != undefined ? $scope.CurrentCart[k].ApplyTransactionData.UnitNumber4 : null;

                            _x16 = (_val47 == _val48);

                        } else {

                            _x16 = true;
                        }

                        if (_x1 == false || _x2 == false || _x3 == false || _x4 == false || _x5 == false || _x6 == false || _x7 == false || _x8 == false || _x9 == false || _x10 == false || _x11 == false || _x12 == false || _x13 == false || _x14 == false || _x15 == false || _x16 == false) {



                        }
                        else {
                            $scope.GoToStep(k);
                            ShowErrorMessage($scope.CurrentOperation);
                            return true;
                        }

                    }
                    break;

                default:
                    return false;


            }
            return false;
        }
        return false;
    }
    $scope.ValidateObjectVM = function () {
        $scope.AffectedItemIds = [];

        var k = 0;
        var _totalLength = $scope.CurrentCart.length;
        if ($scope.CurrentCart != null && $scope.CurrentCart.length > 0) {
            switch ($scope.CurrentOperation) {
                case "Increase":
                case "Decrease":
                case "Adjust":
                    for (k = 0; k < _totalLength; k++) {
                        if ($.trim($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity) == undefined || $.trim($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity) == null || $.trim($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity) == "") {
                            $scope.IssueType = 1;
                            $scope.GoToStep(k);
                            return true;

                            break;
                        }
                        else if ($scope.CurrentOperation == "Decrease") {


                            if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {

                                if ($scope.IsSingleMode == false) {
                                    $scope.GoToStep(0);
                                    log.error("Seems like " + $scope.CurrentCart[k].ItemID + " item is having more than original quantity for activity, please update");
                                }
                                else {
                                    $scope.GoToStep(k);

                                }
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                case "Convert":

                    for (k = 0; k < _totalLength; k++) {
                        if ($scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == undefined || $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == null || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == undefined || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == null || $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == "" || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == "" || $scope.CurrentCart[k].ConvertTransactionData.ToUOMID == "") {

                            if ($scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == undefined || $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == null || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == undefined || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == null || $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == "" || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == "") {
                                $scope.IssueType = 2;

                            }
                            else if ($scope.CurrentCart[k].ConvertTransactionData.ToUOMID == null || $scope.CurrentCart[k].ConvertTransactionData.ToUOMID == "") {



                                if ($scope.CurrentCart[k].ConvertTransactionData.ToUOMID == null || $scope.CurrentCart[k].ConvertTransactionData.ToUOM == "") {


                                    $scope.IssueType = 21;
                                    return true;

                                    break;
                                }



                                else if ($scope.IsActiveUOMLibrary == true && $scope.CurrentCart[k].ConvertTransactionData.ToUOM == "") {
                                    $scope.IssueType = 21;
                                    return true;

                                    break;

                                }
                                else if ($scope.IsActiveUOMLibrary == false && $scope.CurrentCart[k].ConvertTransactionData.ToUOMID == "") {
                                    $scope.IssueType = 21;
                                    return true;

                                    break;

                                }
                            }
                            else {
                                $scope.GoToStep(k);

                            }
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if ($scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {

                                if ($scope.IsSingleMode == false) {
                                    $scope.GoToStep(0);
                                    log.error("Seems like " + $scope.CurrentCart[k].ItemID + " item is having more than original quantity for activity, please update");
                                }
                                else {
                                    $scope.GoToStep(k);

                                }
                                return true;
                                break;
                            }
                            else {

                            }

                        }

                    }
                    break;
                case "Move":

                    for (k = 0; k < _totalLength; k++) {
                        if ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity == undefined || $scope.CurrentCart[k].MoveTransactionData.ActionQuantity == null || $scope.CurrentCart[k].MoveTransactionData.ActionQuantity == "" || $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == "") {
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }

                            if ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity == null || $scope.CurrentCart[k].MoveTransactionData.ActionQuantity == "") {


                                $scope.IssueType = 3;
                                return true;

                                break;
                            }



                            else if ($scope.IsActiveLocationLibrary == true && $scope.checkpermission('URL:Manage/Location') == true && $scope.CurrentCart[k].MoveTransactionData.MoveToLocationText == "") {
                                $scope.IssueType = 32;
                                return true;

                                break;

                            }
                            else if ($scope.IsActiveLocationLibrary == false && $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == "") {
                                $scope.IssueType = 32;
                                return true;

                                break;

                            }

                        }
                        else if ($scope.CurrentCart[k].MoveTransactionData.MoveToLocation == $scope.CurrentCart[k].InventoryDataList.iLID) {
                            $scope.IssueType = 31;
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }
                            $scope.GoToStep(k);
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {

                                if ($scope.IsSingleMode == false) {
                                    $scope.GoToStep(0);
                                    log.error("Seems like " + $scope.CurrentCart[k].ItemID + " item is having more than original quantity for activity, please update");
                                }
                                else {
                                    if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                        $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                                    }
                                    $scope.GoToStep(k);

                                }

                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;


                case "MoveTagUpdate":

                    for (k = 0; k < _totalLength; k++) {
                        if ($scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity == undefined || $scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity == null || $scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity == "" || $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocation == "") {
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }

                            if ($scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity == null || $scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity == "") {


                                $scope.IssueType = 3;
                                return true;

                                break;
                            }



                            else if ($scope.IsActiveLocationLibrary == true && $scope.checkpermission('URL:Manage/Location') == true && $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocationText == "") {
                                $scope.IssueType = 32;
                                return true;

                                break;

                            }
                            else if ($scope.IsActiveLocationLibrary == false && $scope.CurrentCart[k].MoveUpdateTagTransactionData.MoveToLocation == "") {
                                $scope.IssueType = 32;
                                return true;

                                break;

                            }


                        }


                        else if ($scope.CheckIsAllowDuplicate('ReqValue') == true || $scope.CheckIsAllowDuplicate('UnitTag2') == true || $scope.CheckIsAllowDuplicate('UnitTag3') == true || $scope.CheckIsAllowDuplicate('UnitTag4') == true || $scope.CheckIsAllowDuplicate('UnitTag5') == true || $scope.CheckIsAllowDuplicate('UnitTag6') == true || $scope.CheckIsAllowDuplicate('UnitTag7') == true || $scope.CheckIsAllowDuplicate('UnitTag8') == true || $scope.CheckIsAllowDuplicate('UniqueDate') == true || $scope.CheckIsAllowDuplicate('UnitDate2') == true || $scope.CheckIsAllowDuplicate('UnitDate3') == true || $scope.CheckIsAllowDuplicate('UnitDate4') == true || $scope.CheckIsAllowDuplicate('UnitNumber1') == true || $scope.CheckIsAllowDuplicate('UnitNumber2') == true || $scope.CheckIsAllowDuplicate('UnitNumber3') == true || $scope.CheckIsAllowDuplicate('UnitNumber4') == true) {
                            var _count = 1;

                            if ($scope.CheckUnitDataFieldValue('ReqValue', $scope.CheckIsAllowDuplicate('ReqValue'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitTag2', $scope.CheckIsAllowDuplicate('UnitTag2'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UniqueDate', $scope.CheckIsAllowDuplicate('UniqueDate'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitTag3', $scope.CheckIsAllowDuplicate('UnitTag3'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }


                            if ($scope.CheckUnitDataFieldValue('UnitTag4', $scope.CheckIsAllowDuplicate('UnitTag4'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }


                            if ($scope.CheckUnitDataFieldValue('UnitTag5', $scope.CheckIsAllowDuplicate('UnitTag5'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }


                            if ($scope.CheckUnitDataFieldValue('UnitTag6', $scope.CheckIsAllowDuplicate('UnitTag6'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }


                            if ($scope.CheckUnitDataFieldValue('UnitTag7', $scope.CheckIsAllowDuplicate('UnitTag7'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }


                            if ($scope.CheckUnitDataFieldValue('UnitTag8', $scope.CheckIsAllowDuplicate('UnitTag8'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitDate2', $scope.CheckIsAllowDuplicate('UnitDate2'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }
                            if ($scope.CheckUnitDataFieldValue('UnitDate3', $scope.CheckIsAllowDuplicate('UnitDate3'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitDate4', $scope.CheckIsAllowDuplicate('UnitDate4'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitNumber1', $scope.CheckIsAllowDuplicate('UnitNumber1'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitNumber2', $scope.CheckIsAllowDuplicate('UnitNumber2'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }
                            if ($scope.CheckUnitDataFieldValue('UnitNumber3', $scope.CheckIsAllowDuplicate('UnitNumber3'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }
                            if ($scope.CheckUnitDataFieldValue('UnitNumber4', $scope.CheckIsAllowDuplicate('UnitNumber4'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }
                            if (_count == 0) {
                                if ($scope.IsSingleMode == false) {
                                    $scope.GoToStep(0);


                                    log.error("Seems like some cart items is having duplicate unit data, please update");
                                }
                                else {
                                    log.error("Seems like some cart items is having duplicate unit data, please update");
                                    $scope.GoToStep(k);

                                }
                                return true;
                            }


                            else if (_AllowNegative != null && _AllowNegative != "True") {

                                if ($scope.CurrentCart[k].MoveUpdateTagTransactionData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {

                                    if ($scope.IsSingleMode == false) {
                                        $scope.GoToStep(0);
                                        log.error("Seems like " + $scope.CurrentCart[k].ItemID + " item is having more than original quantity for activity, please update");
                                    }
                                    else {
                                        if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                            $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                                        }
                                        $scope.GoToStep(k);

                                    }

                                    return true;
                                    break;
                                }

                            }
                        }

                    }
                    break;
                case "Apply":
                    for (k = 0; k < _totalLength; k++) {
                        if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == undefined || $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == null || $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == "") {
                            $scope.IssueType = 1;
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }
                            $scope.GoToStep(k);
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if ($scope.CheckIsAllowDuplicate('ReqValue') == true || $scope.CheckIsAllowDuplicate('UnitTag2') == true || $scope.CheckIsAllowDuplicate('UnitTag3') == true || $scope.CheckIsAllowDuplicate('UnitTag4') == true || $scope.CheckIsAllowDuplicate('UnitTag5') == true || $scope.CheckIsAllowDuplicate('UnitTag6') == true || $scope.CheckIsAllowDuplicate('UnitTag7') == true || $scope.CheckIsAllowDuplicate('UnitTag8') == true || $scope.CheckIsAllowDuplicate('UniqueDate') == true || $scope.CheckIsAllowDuplicate('UnitDate2') == true || $scope.CheckIsAllowDuplicate('UnitDate3') == true || $scope.CheckIsAllowDuplicate('UnitDate4') == true || $scope.CheckIsAllowDuplicate('UnitNumber1') == true || $scope.CheckIsAllowDuplicate('UnitNumber2') == true || $scope.CheckIsAllowDuplicate('UnitNumber3') == true || $scope.CheckIsAllowDuplicate('UnitNumber4') == true) {
                            var _count = 1;
                            if ($scope.CheckUnitDataFieldValue('ReqValue', $scope.CheckIsAllowDuplicate('ReqValue'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitTag2', $scope.CheckIsAllowDuplicate('UnitTag2'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UniqueDate', $scope.CheckIsAllowDuplicate('UniqueDate'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitTag3', $scope.CheckIsAllowDuplicate('UnitTag3'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitTag4', $scope.CheckIsAllowDuplicate('UnitTag4'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitTag5', $scope.CheckIsAllowDuplicate('UnitTag5'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitTag6', $scope.CheckIsAllowDuplicate('UnitTag6'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitTag7', $scope.CheckIsAllowDuplicate('UnitTag7'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitTag8', $scope.CheckIsAllowDuplicate('UnitTag8'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitDate2', $scope.CheckIsAllowDuplicate('UnitDate2'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }
                            if ($scope.CheckUnitDataFieldValue('UnitDate3', $scope.CheckIsAllowDuplicate('UnitDate3'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }
                            if ($scope.CheckUnitDataFieldValue('UnitDate4', $scope.CheckIsAllowDuplicate('UnitDate4'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }
                            if ($scope.CheckUnitDataFieldValue('UnitNumber1', $scope.CheckIsAllowDuplicate('UnitNumber1'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitNumber2', $scope.CheckIsAllowDuplicate('UnitNumber2'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }
                            if ($scope.CheckUnitDataFieldValue('UnitNumber3', $scope.CheckIsAllowDuplicate('UnitNumber3'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if ($scope.CheckUnitDataFieldValue('UnitNumber4', $scope.CheckIsAllowDuplicate('UnitNumber4'), k) == false) {
                                _count = _count * 0;
                            }
                            else {
                                _count = _count * 1;
                            }

                            if (_count == 0) {
                                if ($scope.IsSingleMode == false) {
                                    $scope.GoToStep(0);


                                    log.error("Seems like some cart items is having duplicate unit data, please update");
                                }
                                else {
                                    log.error("Seems like some cart items is having duplicate unit data, please update");
                                    $scope.GoToStep(k);

                                }
                                return true;
                            }

                            else if (_AllowNegative != null && _AllowNegative != "True") {


                                if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {

                                    if ($scope.IsSingleMode == false) {
                                        $scope.GoToStep(0);
                                        log.error("Seems like " + $scope.CurrentCart[k].ItemID + " item is having more than original quantity for activity, please update");
                                    }
                                    else {
                                        if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                            $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                                        }
                                        $scope.GoToStep(k);

                                    }
                                    return true;
                                    break;
                                }
                                else {

                                }
                            }
                        }

                    }
                    break;
                case "Update":
                    for (k = 0; k < _totalLength; k++) {
                        if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == undefined || $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == null || $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == "") {
                            $scope.IssueType = 1;
                            $scope.GoToStep(k);
                            if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                            }
                            CheckScopeBeforeApply();
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {

                                if ($scope.IsSingleMode == false) {
                                    $scope.GoToStep(0);
                                    log.error("Seems like " + $scope.CurrentCart[k].ItemID + " item is having more than original quantity for activity, please update");
                                }
                                else {
                                    if ($scope.AffectedItemIds.indexOf($scope.CurrentCart[k].ItemID) >= -1) {
                                        $scope.AffectedItemIds.push($scope.CurrentCart[k].ItemID);

                                    }
                                    $scope.GoToStep(k);

                                }
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                default:

            }

            for (k = 0; k < _totalLength; k++) {

                if ($scope.CurrentCart[k].IsLineItemData != null && $scope.CurrentCart[k].IsLineItemData != undefined && $scope.CurrentCart[k].IsLineItemData.length > 0) {
                    var _x = 0;
                    for (_x = 0; _x < $scope.CurrentCart[k].IsLineItemData.length; _x++) {
                        var _tempValueData = $.trim($scope.CurrentCart[k].IsLineItemData[_x].CfValue);
                        if ($scope.IsActiveTransactionField($scope.CurrentCart[k].IsLineItemData[_x].cfdID) && $scope.CurrentCart[k].IsLineItemData[_x].cfdIsRequired == true && _tempValueData == "") {

                            if ($scope.IsSingleMode == false) {
                                $scope.GoToStep(0);

                            }
                            else {
                                $scope.GoToStep(k);

                            }

                            log.error($scope.CurrentCart[k].IsLineItemData[_x].cfdName + " is required field, please fill some value");
                            CheckScopeBeforeApply();;
                            return true;
                        }
                    }


                }


            }





            return false;

        }
        else {
            return true;
        }
    }

    $scope.ValidateObjectVMStop = function (CurrentIndex, Type) {
        switch (Type) {
            case "Cart":
                return CheckintoArray(CurrentIndex);
                break;
            case "Activity":
                return CheckintoCustomData(CurrentIndex);
                break;

            default:
                return false;

        }




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



        }, function (error) {
            log.error("Scanning failed: ", error);
        });
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
                            element.removeClass("bootstrap-switch-off").addClass("bootstrap-switch-on");
                        } else {
                            element.bootstrapSwitch('state', false, true);
                            element.removeClass("bootstrap-switch-on").addClass("bootstrap-switch-off");
                        }
                    });
                }
            };
        }
]);



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



