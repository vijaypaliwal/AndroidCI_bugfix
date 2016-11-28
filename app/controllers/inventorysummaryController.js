'use strict';
app.controller('inventorysummaryController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {


    $scope.CurrentView = { Name: "Inventory Summary" };
    $scope.InventoryViewsGrouped = [];
    $scope.InventoryListGrouped = [];
    $scope.CustomItemDataList = [];
    $scope.FilterData = { SearchValue: "" };
    $scope.isDataLoading = true;
    $scope.FilterArray = [{ ColumnName: "", FilterOperator: "", SearchValue: "" }];
    $scope.sortColumn = "iLastITID";
    $scope.sortDir = "DESC";
    $scope.ShowGroupedData = false;
    var _sortColumn = "iLastITID";
    var _sortDir = "DESC";
    $scope.isviewload = false;
    $scope.HasImage = "";
    var _IsLazyLoadingUnderProgress = 0;
    var _PageSize = 30;
    $scope.Columns = [];
    var _TotalRecordsCurrent = 0;
    $scope.loadingblock = false;
    var _masterSearch = "";
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
    function onSwipeDown() {
        $('#mylist').on('swipedown', function () {

            if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
                if ($(window).scrollTop() < 500) {

                    $scope.loadingblock = true;

                    _IsLazyLoadingUnderProgress = 1;
                    CheckScopeBeforeApply();
                    $scope.GetInventoryGroupedDataAccordingToView();


                }
            }

        });
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

    function GetFilterOperator(ColumnName) {


        switch (ColumnName.toLowerCase()) {
            case "date":
            case "datetime":
                return "date-eq";
                break;
            case "number":
            case "decimal":
            case "money":
                return "num-eq";
                break;


            default:
                return "cn";
        }
    }



    $scope.isFurtherCalculatedColumn = function (ColumnName) {
        for (var i = 0; i < $scope.Columns.length; i++) {
            if ($scope.Columns[i].ColumnID == ColumnName) {
                if ($scope.Columns[i].isFirstFurtherCalculated == true || $scope.Columns[i].isSecondFurtherCalculated == true) {
                    return true;

                }
            }

        }
        return false;
    }


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

    $scope.ClearImageFilter = function () {
        $scope.HasImage = "";

        CheckScopeBeforeApply();
    }

    $scope.clearfilterArray = function () {
        for (var i = 0; i < $scope.FilterArray.length; i++) {
            $scope.FilterArray[i].SearchValue = "";
        }
        $scope.FilterData.SearchValue = "";
        $scope.ClearImageFilter();
        $scope.ShowGroupedData = false;
        CheckScopeBeforeApply();
        $scope.GetInventoryGroupedDataAccordingToView();
    }
    $scope.clearfilter = function () {
        $scope.clearfilterArray();
    }
    $scope.GetComboData = function (ColumnName) {
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ColumnName) {
                console.log($scope.CustomItemDataList[i].cfdComboValues);
                return $scope.CustomItemDataList[i].cfdComboValues;
            }
        }
    }

    $scope.GetDisplayLabel = function (ColumnName) {
        var DataType = ""

        DataType = $scope.GetCustomFieldNameByMap(ColumnName);
        if (DataType == "N/A") {
            for (var i = 0; i < $scope.Columns.length; i++) {
                if ($scope.Columns[i].ColumnID == ColumnName) {
                    return $scope.Columns[i].DisplayLabel;
                }

            }
        }
        else {
            return DataType;
        }
    }

    $scope.GetColumnDataType = function (ColumnName) {
        var DataType = ""


        DataType = $scope.GetCustomFieldTypeByID(ColumnName);
        if (DataType == "N/A") {

            for (var i = 0; i < $scope.Columns.length; i++) {
                if ($scope.Columns[i].ColumnID == ColumnName) {
                    DataType = $scope.Columns[i].ColumnDataType.toLowerCase();
                    return DataType;
                }
            }
        }
        else {
            return DataType;
        }
    }

    function UpdateFilterArray() {

        for (var i = 0; i < $scope.FilterArray.length; i++) {

            var _datatype = $scope.GetColumnDataType($scope.FilterArray[i].ColumnName);

            if (_datatype == "number" || _datatype == "decimal" || _datatype == "money") {
                if ($scope.FilterArray[i].SearchValue != null && $scope.FilterArray[i].SearchValue != undefined && $.trim($scope.FilterArray[i].SearchValue) != "") {
                    var _value = angular.copy($scope.FilterArray[i].SearchValue);
                    $scope.FilterArray[i].SearchValue = parseFloat(_value);
                }

            }
        }
        CheckScopeBeforeApply();
    }


    function FillFilterArray() {
        $scope.FilterArray = [];
        for (var i = 0; i < $scope.Columns.length; i++) {

            if ($scope.Columns[i].ColumnID != "LeaveBlank") {
                var _obj = { ColumnName: "", FilterOperator: "", SearchValue: "" };
                _obj.ColumnName = $scope.Columns[i].ColumnID;
                var _ID = TryParseInt(_obj.ColumnName, 0);
                if (_ID != 0) {

                    _obj.ColumnName = $scope.GetCustomFieldByID(_ID);
                }
                _obj.FilterOperator = GetFilterOperator($scope.Columns[i].ColumnDataType);
                _obj.SearchValue = "";
                $scope.FilterArray.push(_obj);
            }

        }


        CheckScopeBeforeApply();
    }

    $(window).scroll(function () {
        //var _SearchValue = $.trim($("#MasterSearch").val());
        if ($scope.isviewload == true) {

            if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
                if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                    if (_PageSize < $scope.totalrecords) {


                        _IsLazyLoadingUnderProgress = 1;
                        $scope.isDataLoading = false;
                        _PageSize = _TotalRecordsCurrent + getIncrementor($scope.totalrecords);
                        CheckScopeBeforeApply();
                        $scope.GetInventoryGroupedDataAccordingToView();
                    }
                    else {
                        // log.info("You have already loaded all data.")
                    }

                }
            }
        }



    });
    function ChangeIntoNumberFormat(number) {
        if (number != undefined && number != null && number != "") {

            if (number % 1 != 0) {

                var arr = number.toString().split(".");
                var _tempNumber = number;
                var _tempNumbertoconvert = Math.floor(number);
                var tosend_tempNumbertoconvert = _tempNumbertoconvert.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                var _newArr = tosend_tempNumbertoconvert.split(".");
                var _finallytoSendValue = _newArr[0] += "." + arr[1];
                return _finallytoSendValue;

            }
            else {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            }
        }
        else {
            return number;
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




                   if (response.GetCustomFieldsDataResult.Success == true) {

                       $scope.CustomItemDataList = response.GetCustomFieldsDataResult.Payload;

                   }
                   else {
                       $scope.ShowErrorMessage("Custom column's data", 1, 1, response.GetCustomFieldsDataResult.Message)

                   }




                   CheckScopeBeforeApply();
               },
               error: function (response) {
                   log.error(response.statusText);
                   $scope.ShowErrorMessage("Custom column's data", 2, 1, err.statusText);

                   //$scope.InventoryObject.Location = 678030;
               }
           });
    }
    $scope.GetCustomFieldByID = function (ID) {

        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].cfdID == ID) {
                return $scope.CustomItemDataList[i].ColumnMap;
            }

        }
    }

    $scope.GetCustomFieldNameByMap = function (ID) {
        var _return = "N/A";
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ID) {
                return $scope.CustomItemDataList[i].cfdName;
            }

        }

        return _return;
    }

    $scope.GetCustomFieldTypeByID = function (ID) {
        var _return = "N/A";
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ID) {
                return $scope.CustomItemDataList[i].cfdDataType;
            }

        }

        return _return;
    }

    $scope.GetImagePath = function (Operator) {

        var path = "img/filter/";
        var _returnPath = "img/filter/EqualTo.gif"
        switch (Operator) {
            case "eq":
            case "num-eq":
            case "date-eq":
                _returnPath = path + "EqualTo.gif";
                break;
            case "num-ne":
            case "ne":
                _returnPath = path + "NotEqualTo.gif";
                break;
            case "date-before":
                _returnPath = path + "OnOrBefore.gif";
                break;
            case "cn":
                _returnPath = path + "Contains.gif";
                break;
            case "date-after":
                _returnPath = path + "OnOrAfter.gif";
                break;
            case "bw":
                _returnPath = path + "BeginsWith.gif";
                break;
            case "num-lte":
                _returnPath = path + "LessThanOrEqualTo.gif";
                break;
            case "num-gte":
                _returnPath = path + "GreaterThanOrEqualTo.gif";
                break;
            case "date-gte":
                _returnPath = path + "GreaterThanOrEqualTo.gif";
                break;
        }
        return _returnPath;
    }
    $scope.GetInnerData = function (columnName,parentIndex, Index, isCalculated) {
        var _ID = TryParseInt(columnName, 0);
        if (_ID != 0) {
            columnName = $scope.GetCustomFieldByID(_ID);
        }
        var _Tempcolumnname = columnName;
        if (isCalculated == true) {
            columnName = "Calculated"
        }
     
        switch (columnName) {
          
            case "Calculated":
                var _valueData = "";
                if ($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].CustomData != null && $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].CustomData != undefined)
                    for (var i = 0; i < $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].CustomData.length; i++) {
                        if ($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].CustomData[i].Key == _Tempcolumnname) {

                            _valueData = $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].CustomData[i].Value;
                            break;
                        }
                    }
                return _valueData;
                break;

            case "iLastAction":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iLastAction != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iLastAction : "";
                break;
            case "pTargetQty":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].pTargetQty != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].pTargetQty : "";
                break;
            case "pReorderQty":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].pReorderQty != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].pReorderQty : "";
                break;
            case "ExtendedCost":

                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].ExtendedCost != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].ExtendedCost : "";
                break;
            case "pPart":

                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].pPart != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].pPart : "";
                break;
            case "iQty":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iQty;
                break;
            case "pDescription":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].pDescription != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].pDescription : "";

                break;
            case "uomUOM":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].uomUOM != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].uomUOM : "";
                break;
            case "iUniqueDate":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUniqueDate != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUniqueDate : "";
                break;
            case "lLoc":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].lLoc != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].lLoc : "";
                break;
            case "lZone":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].lZone != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].lZone : "";
                break;

            case "iStatusValue":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iStatusValue != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iStatusValue : "";
                break;

            case "iUnitNumber2":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUnitNumber2 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUnitNumber2) : "";
                break;
            case "iUnitNumber1":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUnitNumber1 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUnitNumber1) : "";
                break;
            case "iUnitDate2":

                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUnitDate2 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUnitDate2 : "";
                break;

            case "iCostPerUnit":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].AvgCostPerUnit != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].AvgCostPerUnit : "";

                break;
            case "iUnitTag3":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUnitTag3 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUnitTag3 : "";
                break;
            case "iUnitTag2":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUnitTag2 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iUnitTag2 : "";
                break;

            case "HasConversion":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].HasConversion;
                break;

            case "string_1":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_1 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_1 : "";
                break;
            case "string_2":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_2 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_2 : "";
                break;
            case "string_3":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_3 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_3 : "";
                break;
            case "string_4":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_4 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_4 : "";
                break;
            case "string_5":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_5 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_5 : "";
                break;
            case "string_6":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_6 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_6 : "";
                break;
            case "string_7":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_7 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_7 : "";
                break;
            case "string_8":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_8 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_8 : "";
                break;
            case "string_9":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_9 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_9 : "";
                break;
            case "string_10":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_10 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_10 : "";
                break;

            case "string_11":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_11 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_11 : "";
                break;
            case "string_12":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_12 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_12 : "";
                break;
            case "string_13":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_13 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_13 : "";
                break;
            case "string_14":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_14 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_14 : "";
                break;
            case "string_15":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_15 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_15 : "";
                break;
            case "string_16":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_16 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_16 : "";
                break;
            case "string_17":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_17 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_17 : "";
                break;
            case "string_18":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_18 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_18 : "";
                break;
            case "string_19":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_19 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_19 : "";
                break;
            case "string_20":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_20 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_20 : "";
                break;
            case "string_21":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_21 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_21 : "";
                break;
            case "string_22":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_22 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_22 : "";
                break;
            case "string_23":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_23 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_23 : "";
                break;
            case "string_24":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_24 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].string_24 : "";
                break;






            case "number_1":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_1 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_1) : "";
                break;
            case "number_2":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_2 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_2) : "";
                break;
            case "number_3":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_3 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_3) : "";
                break;
            case "number_4":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_4 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_4) : "";
                break;
            case "number_5":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_5 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_5) : "";
                break;
            case "number_6":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_6 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_6) : "";
                break;
            case "number_7":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_7 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_7) : "";
                break;
            case "number_8":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_8 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_8) : "";
                break;
            case "number_9":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_9 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_9) : "";
                break;
            case "number_10":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_10 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_10) : "";
                break;

            case "number_11":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_11 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_11) : "";
                break;
            case "number_12":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_12 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].number_12) : "";
                break;

            case "bool_1":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_1 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_1 : "";
                break;
            case "bool_2":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_2 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_2 : "";
                break;
            case "bool_3":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_3 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_3 : "";
                break;
            case "bool_4":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_4 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_4 : "";
                break;
            case "bool_5":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_5 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_5 : "";
                break;
            case "bool_6":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_6 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].bool_6 : "";
                break;

            case "date_1":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_1 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_1 : "";
                break;
            case "date_2":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_2 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_2 : "";
                break;
            case "date_3":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_3 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_3 : "";
                break;
            case "date_4":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_4 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_4 : "";
                break;
            case "date_5":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_5 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_5 : "";
                break;
            case "date_6":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_6 != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].date_6 : "";
                break;

            case "pCountFrq":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].pCountFrq != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].pCountFrq : "";
                break;
            case "lZone":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].lZone != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].lZone : "";
                break;
            case "iReqValue":
                return $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iReqValue != null ? $scope.InventoryListGrouped[parentIndex].OtherPrespectives[Index].iReqValue : "";
                break;
            default:
                return "N/A";
        }
    }

    $scope.GetCellData = function (columnName, parentIndex, Index, isCalculated, isGrouped) {
        var _ID = TryParseInt(columnName, 0);
        if (_ID != 0) {
            columnName = $scope.GetCustomFieldByID(_ID);
        }
        var _Tempcolumnname = columnName;
        if (isCalculated == true) {
            columnName = "Calculated"
        }
        if (isGrouped == true) {
            columnName = "Grouped"
        }

        switch (columnName) {
            case "Grouped":
                return $scope.GetInnerData(_Tempcolumnname, parentIndex, Index, isCalculated);
                break;
            case "Calculated":
                var _valueData = "";
                if ($scope.InventoryListGrouped[Index].CustomData != null && $scope.InventoryListGrouped[Index].CustomData != undefined)
                    for (var i = 0; i < $scope.InventoryListGrouped[Index].CustomData.length; i++) {
                        if ($scope.InventoryListGrouped[Index].CustomData[i].Key == _Tempcolumnname) {

                            _valueData = $scope.InventoryListGrouped[Index].CustomData[i].Value;
                            break;
                        }
                    }
                return _valueData;
                break;

            case "iLastAction":
                return $scope.InventoryListGrouped[Index].iLastAction != null ? $scope.InventoryListGrouped[Index].iLastAction : "";
                break;
            case "pTargetQty":
                return $scope.InventoryListGrouped[Index].pTargetQty != null ? $scope.InventoryListGrouped[Index].pTargetQty : "";
                break;
            case "pReorderQty":
                return $scope.InventoryListGrouped[Index].pReorderQty != null ? $scope.InventoryListGrouped[Index].pReorderQty : "";
                break;
            case "ExtendedCost":

                return $scope.InventoryListGrouped[Index].ExtendedCost != null ? $scope.InventoryListGrouped[Index].ExtendedCost : "";
                break;
            case "pPart":

                return $scope.InventoryListGrouped[Index].pPart != null ? $scope.InventoryListGrouped[Index].pPart : "";
                break;
            case "iQty":
                return $scope.InventoryListGrouped[Index].iQty;
                break;
            case "pDescription":
                return $scope.InventoryListGrouped[Index].pDescription != null ? $scope.InventoryListGrouped[Index].pDescription : "";

                break;
            case "uomUOM":
                return $scope.InventoryListGrouped[Index].uomUOM != null ? $scope.InventoryListGrouped[Index].uomUOM : "";
                break;
            case "iUniqueDate":
                return $scope.InventoryListGrouped[Index].iUniqueDate != null ? $scope.InventoryListGrouped[Index].iUniqueDate : "";
                break;
            case "lLoc":
                return $scope.InventoryListGrouped[Index].lLoc != null ? $scope.InventoryListGrouped[Index].lLoc : "";
                break;
            case "lZone":
                return $scope.InventoryListGrouped[Index].lZone != null ? $scope.InventoryListGrouped[Index].lZone : "";
                break;

            case "iStatusValue":
                return $scope.InventoryListGrouped[Index].iStatusValue != null ? $scope.InventoryListGrouped[Index].iStatusValue : "";
                break;

            case "iUnitNumber2":
                return $scope.InventoryListGrouped[Index].iUnitNumber2 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].iUnitNumber2) : "";
                break;
            case "iUnitNumber1":
                return $scope.InventoryListGrouped[Index].iUnitNumber1 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].iUnitNumber1) : "";
                break;
            case "iUnitDate2":

                return $scope.InventoryListGrouped[Index].iUnitDate2 != null ? $scope.InventoryListGrouped[Index].iUnitDate2 : "";
                break;

            case "iCostPerUnit":
                return $scope.InventoryListGrouped[Index].AvgCostPerUnit != null ? $scope.InventoryListGrouped[Index].AvgCostPerUnit : "";

                break;
            case "iUnitTag3":
                return $scope.InventoryListGrouped[Index].iUnitTag3 != null ? $scope.InventoryListGrouped[Index].iUnitTag3 : "";
                break;
            case "iUnitTag2":
                return $scope.InventoryListGrouped[Index].iUnitTag2 != null ? $scope.InventoryListGrouped[Index].iUnitTag2 : "";
                break;

            case "HasConversion":
                return $scope.InventoryListGrouped[Index].HasConversion;
                break;

            case "string_1":
                return $scope.InventoryListGrouped[Index].string_1 != null ? $scope.InventoryListGrouped[Index].string_1 : "";
                break;
            case "string_2":
                return $scope.InventoryListGrouped[Index].string_2 != null ? $scope.InventoryListGrouped[Index].string_2 : "";
                break;
            case "string_3":
                return $scope.InventoryListGrouped[Index].string_3 != null ? $scope.InventoryListGrouped[Index].string_3 : "";
                break;
            case "string_4":
                return $scope.InventoryListGrouped[Index].string_4 != null ? $scope.InventoryListGrouped[Index].string_4 : "";
                break;
            case "string_5":
                return $scope.InventoryListGrouped[Index].string_5 != null ? $scope.InventoryListGrouped[Index].string_5 : "";
                break;
            case "string_6":
                return $scope.InventoryListGrouped[Index].string_6 != null ? $scope.InventoryListGrouped[Index].string_6 : "";
                break;
            case "string_7":
                return $scope.InventoryListGrouped[Index].string_7 != null ? $scope.InventoryListGrouped[Index].string_7 : "";
                break;
            case "string_8":
                return $scope.InventoryListGrouped[Index].string_8 != null ? $scope.InventoryListGrouped[Index].string_8 : "";
                break;
            case "string_9":
                return $scope.InventoryListGrouped[Index].string_9 != null ? $scope.InventoryListGrouped[Index].string_9 : "";
                break;
            case "string_10":
                return $scope.InventoryListGrouped[Index].string_10 != null ? $scope.InventoryListGrouped[Index].string_10 : "";
                break;

            case "string_11":
                return $scope.InventoryListGrouped[Index].string_11 != null ? $scope.InventoryListGrouped[Index].string_11 : "";
                break;
            case "string_12":
                return $scope.InventoryListGrouped[Index].string_12 != null ? $scope.InventoryListGrouped[Index].string_12 : "";
                break;
            case "string_13":
                return $scope.InventoryListGrouped[Index].string_13 != null ? $scope.InventoryListGrouped[Index].string_13 : "";
                break;
            case "string_14":
                return $scope.InventoryListGrouped[Index].string_14 != null ? $scope.InventoryListGrouped[Index].string_14 : "";
                break;
            case "string_15":
                return $scope.InventoryListGrouped[Index].string_15 != null ? $scope.InventoryListGrouped[Index].string_15 : "";
                break;
            case "string_16":
                return $scope.InventoryListGrouped[Index].string_16 != null ? $scope.InventoryListGrouped[Index].string_16 : "";
                break;
            case "string_17":
                return $scope.InventoryListGrouped[Index].string_17 != null ? $scope.InventoryListGrouped[Index].string_17 : "";
                break;
            case "string_18":
                return $scope.InventoryListGrouped[Index].string_18 != null ? $scope.InventoryListGrouped[Index].string_18 : "";
                break;
            case "string_19":
                return $scope.InventoryListGrouped[Index].string_19 != null ? $scope.InventoryListGrouped[Index].string_19 : "";
                break;
            case "string_20":
                return $scope.InventoryListGrouped[Index].string_20 != null ? $scope.InventoryListGrouped[Index].string_20 : "";
                break;
            case "string_21":
                return $scope.InventoryListGrouped[Index].string_21 != null ? $scope.InventoryListGrouped[Index].string_21 : "";
                break;
            case "string_22":
                return $scope.InventoryListGrouped[Index].string_22 != null ? $scope.InventoryListGrouped[Index].string_22 : "";
                break;
            case "string_23":
                return $scope.InventoryListGrouped[Index].string_23 != null ? $scope.InventoryListGrouped[Index].string_23 : "";
                break;
            case "string_24":
                return $scope.InventoryListGrouped[Index].string_24 != null ? $scope.InventoryListGrouped[Index].string_24 : "";
                break;






            case "number_1":
                return $scope.InventoryListGrouped[Index].number_1 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_1) : "";
                break;
            case "number_2":
                return $scope.InventoryListGrouped[Index].number_2 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_2) : "";
                break;
            case "number_3":
                return $scope.InventoryListGrouped[Index].number_3 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_3) : "";
                break;
            case "number_4":
                return $scope.InventoryListGrouped[Index].number_4 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_4) : "";
                break;
            case "number_5":
                return $scope.InventoryListGrouped[Index].number_5 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_5) : "";
                break;
            case "number_6":
                return $scope.InventoryListGrouped[Index].number_6 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_6) : "";
                break;
            case "number_7":
                return $scope.InventoryListGrouped[Index].number_7 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_7) : "";
                break;
            case "number_8":
                return $scope.InventoryListGrouped[Index].number_8 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_8) : "";
                break;
            case "number_9":
                return $scope.InventoryListGrouped[Index].number_9 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_9) : "";
                break;
            case "number_10":
                return $scope.InventoryListGrouped[Index].number_10 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_10) : "";
                break;

            case "number_11":
                return $scope.InventoryListGrouped[Index].number_11 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_11) : "";
                break;
            case "number_12":
                return $scope.InventoryListGrouped[Index].number_12 != null ? ChangeIntoNumberFormat($scope.InventoryListGrouped[Index].number_12) : "";
                break;

            case "bool_1":
                return $scope.InventoryListGrouped[Index].bool_1 != null ? $scope.InventoryListGrouped[Index].bool_1 : "";
                break;
            case "bool_2":
                return $scope.InventoryListGrouped[Index].bool_2 != null ? $scope.InventoryListGrouped[Index].bool_2 : "";
                break;
            case "bool_3":
                return $scope.InventoryListGrouped[Index].bool_3 != null ? $scope.InventoryListGrouped[Index].bool_3 : "";
                break;
            case "bool_4":
                return $scope.InventoryListGrouped[Index].bool_4 != null ? $scope.InventoryListGrouped[Index].bool_4 : "";
                break;
            case "bool_5":
                return $scope.InventoryListGrouped[Index].bool_5 != null ? $scope.InventoryListGrouped[Index].bool_5 : "";
                break;
            case "bool_6":
                return $scope.InventoryListGrouped[Index].bool_6 != null ? $scope.InventoryListGrouped[Index].bool_6 : "";
                break;

            case "date_1":
                return $scope.InventoryListGrouped[Index].date_1 != null ? $scope.InventoryListGrouped[Index].date_1 : "";
                break;
            case "date_2":
                return $scope.InventoryListGrouped[Index].date_2 != null ? $scope.InventoryListGrouped[Index].date_2 : "";
                break;
            case "date_3":
                return $scope.InventoryListGrouped[Index].date_3 != null ? $scope.InventoryListGrouped[Index].date_3 : "";
                break;
            case "date_4":
                return $scope.InventoryListGrouped[Index].date_4 != null ? $scope.InventoryListGrouped[Index].date_4 : "";
                break;
            case "date_5":
                return $scope.InventoryListGrouped[Index].date_5 != null ? $scope.InventoryListGrouped[Index].date_5 : "";
                break;
            case "date_6":
                return $scope.InventoryListGrouped[Index].date_6 != null ? $scope.InventoryListGrouped[Index].date_6 : "";
                break;

            case "pCountFrq":
                return $scope.InventoryListGrouped[Index].pCountFrq != null ? $scope.InventoryListGrouped[Index].pCountFrq : "";
                break;
            case "lZone":
                return $scope.InventoryListGrouped[Index].lZone != null ? $scope.InventoryListGrouped[Index].lZone : "";
                break;
            case "iReqValue":
                return $scope.InventoryListGrouped[Index].iReqValue != null ? $scope.InventoryListGrouped[Index].iReqValue : "";
                break;
            default:
                return "N/A";
        }
    }
    $scope.ShowHideDiv = function (id) {
        var _id = "#row_" + id.toString();
        var _iconID = "#icon_" + id.toString();
        var _beforePos = $(_id).css("height").replace("px", "");
        var _afterPos = $(_id).css("height").replace("px", "");
        var _isOpen = false;
        if ($(_iconID).hasClass("fa-chevron-up")) {
            _isOpen = true;
            $(_iconID).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            $(_id).find(".Celldata").removeClass("overflowtext");
        }
        else {
            _isOpen = false;
            $(_iconID).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            $(_id).find(".Celldata").addClass("overflowtext");
        }

        $(_id).find(".ExtraTr").toggle("slow");
        _afterPos = $(_id).css("height");


        var _afterPosPx = parseInt(_afterPos);
        var _beforePosPx = parseInt(_beforePos);
        var _currentIconpos = $(_iconID).parent().css("margin-top").replace("px", "");
        var _currentPosition = parseInt(_currentIconpos) + (_afterPosPx - _beforePosPx);
        if (_isOpen) {
            $(_iconID).parent().css("margin-top", _currentPosition.toString() + "px");

        }
        else {
            setTimeout(function () {
                $(_iconID).parent().css("margin-top", "70px");

            }, 370);

        }
    }
    $scope.GetInventoryViewsGrouped = function () {
        $scope.isDataLoading = false;
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
                  debugger;

                  if (response.GetAllViewsResult.Success == true) {
                      $scope.InventoryViewsGrouped = response.GetAllViewsResult.Payload;

                  }
                  else {
                      $scope.ShowErrorMessage("Getting inventory summary reports", 1, 1, response.GetAllViewsResult.Message)

                  }
                  $scope.isDataLoading = true;
                  $scope.$apply();
              },
              error: function (err) {
                  $scope.isDataLoading = true;
                  $scope.ShowErrorMessage("Getting inventory summary reports", 2, 1, err.statusText);

                  $scope.$apply();

              }
          });

    }


    $scope.viewdetail = function (viewname) {
        $scope.isviewload = true;
        $scope.CurrentView = viewname;
        $scope.FilterArray = [];
        CheckScopeBeforeApply();
    }

    $scope.showview = function () {
        $scope.isviewload = false;
        $scope.CurrentView = { Name: "Inventory Summary" };
    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.AssignCurrentView = function (view) {
        $scope.CurrentView = view;
        $scope.FilterArray = [{ ColumnName: "", FilterOperator: "", SearchValue: "" }];
        CheckScopeBeforeApply();
        $scope.GetInventoryGroupedDataAccordingToView();
    }
    $scope.showfilter = function () {
        $("#filtermodal").modal("show")
    }

    $scope.GetInventoryGroupedDataAccordingToView = function () {

        $scope.isDataLoading = false;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $("#filtermodal").modal('hide');

        if ($scope.CurrentView != undefined) {


            if ($scope.FilterData.SearchValue != undefined && $.trim($scope.FilterData.SearchValue) != "") {

            }
            else {
                $scope.FilterData.SearchValue = "";
            }

            ShowGlobalWaitingDiv();
            var count = 0;
            var timer = setInterval(function () {
                count = count + 1;


                if (count > 7) {


                    $("#mysmallModalWaiting span").html("Server still processing, almost there..");

                }
                else if (count > 5) {

                    $("#mysmallModalWaiting span").html("Please wait a bit more...");

                }
                else if (count > 1) {
                    $("#mysmallModalWaiting span").html("Backend processing in progress..");

                }

            }, 1000);

            $.ajax
              ({
                  type: "POST",
                  url: serviceBase + 'GetCurrentInventoriesGrouped',
                  data: JSON.stringify({ SecurityToken: $scope.SecurityToken, HasImage: $scope.HasImage, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: $scope.FilterArray, SelectedCartIDs: [], masterSearch: $scope.FilterData.SearchValue, showImage: "True", showZeroRecords: "True", PageSize: _PageSize, IsDateColumnOn: false, ViewID: $scope.CurrentView.GridLayoutID }),
                  contentType: 'application/json',
                  dataType: 'json',
                  success: function (response) {
                      $scope.isDataLoading = true;
                      $scope.isviewload = true;

                      if (response.GetCurrentInventoriesGroupedResult.Success == true) {

                          
                          _TotalRecordsCurrent = response.GetCurrentInventoriesGroupedResult.Payload[0].Data.length;
                          $scope.currentrecord = response.GetCurrentInventoriesGroupedResult.Payload[0].Data.length;
                          if ($scope.ShowGroupedData == true)
                          {
                              $scope.InventoryListGrouped = [];
                              var _data=response.GetCurrentInventoriesGroupedResult.Payload[0].Data;
                              if (_data.length > 0) {


                                  for (var i = 0; i < _data.length; i++) {
                                      if (_data[i].OtherPrespectives.length > 1) {

                                          $scope.InventoryListGrouped.push(_data[i]);
                                      }


                                  }
                              }
                              $scope.totalrecords = $scope.InventoryListGrouped.length;
                              $scope.currentrecord = $scope.totalrecords;
                          }
                          else {
                              $scope.InventoryListGrouped = response.GetCurrentInventoriesGroupedResult.Payload[0].Data;
                              $scope.totalrecords = response.GetCurrentInventoriesGroupedResult.Payload[0].TotalRercords;
                          }
                       

                          $scope.Columns = response.GetCurrentInventoriesGroupedResult.Payload[0].Columns;
                          $scope.ActualTotalRecords = response.GetCurrentInventoriesGroupedResult.Payload[0].ActualTotalRecords;
                          $scope.FilterArray = response.GetCurrentInventoriesGroupedResult.Payload[0].Filters;
                          CheckScopeBeforeApply();
                          // FillFilterArray();
                          UpdateFilterArray();

                      }
                      else {
                          $scope.ShowErrorMessage("Inventory Summary Data", 1, 1, response.GetCurrentInventoriesGroupedResult.Message)

                      }

                  },
                  error: function (err) {
                      console.log(err);
                      $scope.ShowErrorMessage("Inventory Summary Data", 2, 1, err.statusText);

                      $scope.isDataLoading = true;
                  },
                  complete: function () {
                      _IsLazyLoadingUnderProgress = 0;
                      $scope.isDataLoading = true;
                      HideGlobalWaitingDiv();
                      clearInterval(timer);
                      $scope.loadingblock = false;
                      CheckScopeBeforeApply();
                      onSwipeDown();
                  }
              });
        }
    }

    $scope.IsAvailableColumn = function (column) {
        for (var i = 0; i < $scope.Columns.length; i++) {
            if ($scope.Columns[i].ColumnID == column) {

                return true;
            }

        }
        return false;
    }
    $scope.getuom = function () {

        $scope.LocationsLoaded = false;


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
                       $scope.ShowErrorMessage("Unit of Measure list", 1, 1, response.GetUnitsOfMeasureResult.Message)

                   }
                   $scope.$apply();
               },
               error: function (err) {

                   $scope.ShowErrorMessage("Unit of Measure list", 2, 1, err.statusText);


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
                   if (response.GetStatusResult.Success == true) {
                       $scope.StatusList = response.GetStatusResult.Payload;

                   }
                   else {
                       $scope.ShowErrorMessage("Status list", 1, 1, response.GetStatusResult.Message)

                   }
                   $scope.$apply();
               },
               error: function (err) {
                   $scope.ShowErrorMessage("Status list", 2, 1, err.statusText);

               }
           });

    }

    $scope.OpenmenuModal = function () {

        if ($("body").hasClass("modal-open")) {
            $("#myModal2").modal('hide');

            $(".Addbtn .fa").removeClass('rotate');


        }
        else {
            $("#myModal2").modal('show');
            $(".Addbtn .fa").addClass('rotate');
        }
    }

    function ToggleSortDir(Dir) {
        if (Dir == "DESC") {
            return "ASC"
        }
        else if (Dir == "ASC") {
            return "DESC"
        }
        else {
            return "ASC";
        }
    }
    $scope.applysorting = function (sortby) {

        var _tempCol = _sortColumn;

        _sortColumn = sortby;

        if (_tempCol == _sortColumn) {
            _sortDir = ToggleSortDir(_sortDir);
            $scope.sortDir = _sortDir;

        }
        $scope.sortColumn = sortby;
        CheckScopeBeforeApply();
        $scope.GetInventoryGroupedDataAccordingToView()

    }

    $scope.OpenImageModal = function (Object, Name) {
        $("#imagemodal").modal('show');
        $("#modalheader").find("h4").html(Name);
        $("#imagepreview").attr("src", Object);
    }

    function init() {
        $scope.getuom();
        $scope.getstatus();
        $scope.GetInventoryViewsGrouped();
        $scope.GetCustomDataField(0);
        CheckScopeBeforeApply();


    }

    init();
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

app.directive('customSwipe', [
      function () {
          return {
              restrict: 'A',
              require: '?ngModel',
              link: function (scope, element, attrs, ngModel) {
                  $(element).swipe({
                      swipe: function (event, direction, distance, duration, fingerCount) {
                          //This only fires when the user swipes left

                          setTimeout(function () {

                              element.find("input").trigger("click");




                          }, 10)
                      },
                      threshold: 10
                  });
              }
          };
      }
]);