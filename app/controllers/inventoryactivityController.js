'use strict';
app.controller('inventoryactivityController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    //#region variable declaration

    // Function to get all active unit data fields.

    $scope.yearList = [];
    $scope.dayList = [];
    $scope.monthList = [];

    $scope.hourList = [];
    $scope.minuteList = [];
    $scope.secondList = [];


    $scope.weeklist = [];

    $scope.CurrentYear = new Date().getFullYear();

    for (var i = 1; i <= 52; i++) {
        $scope.weeklist.push(i);
    }



    for (var i = 1; i <= 24; i++) {
        $scope.hourList.push(i);
    }



    for (var i = 1; i <= 60; i++) {
        $scope.minuteList.push(i);
    }



    for (var i = 1; i <= 60; i++) {
        $scope.secondList.push(i);
    }



    $scope.monthList = [
         { id: 1, text: "January" },
         { id: 2, text: "February" },
         { id: 3, text: "March" },
         { id: 4, text: "April" },
         { id: 5, text: "May" },
         { id: 6, text: "June" },
         { id: 7, text: "July" },
         { id: 8, text: "August" },
         { id: 9, text: "September" },
         { id: 10, text: "October" },
         { id: 11, text: "November" },
         { id: 12, text: "December" }

    ];

    for (var i = 1990; i <= 2020; i++) {
        $scope.yearList.push(i);
    }


    for (var i = 1; i <= 31; i++) {
        $scope.dayList.push(i);
    }


















    $scope.clearAllFilter = false;
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

                       console.log("List of active unitdata fields");
                       console.log($scope.UnitDataList);


                       if ($scope.UnitDataList.length > 0) {
                           for (var i = 0; i < $scope.UnitDataList.length; i++) {
                               if ($.trim($scope.UnitDataList[i].FieldCombovalues) != "") {
                                   $scope.UnitDataFieldCombovalues = $scope.UnitDataList[i].FieldCombovalues.split("\n");
                               }

                               if ($.trim($scope.UnitDataList[i].FieldRadioValues) != "") {
                                   $scope.UnitDataFieldRadioValues = $scope.UnitDataList[i].FieldRadioValues.split("\r\n");
                               }
                           }
                       }
                       else {
                       }





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

    $scope.UnitDataFieldCombovalues = [];

    $scope.UnitDataFieldRadioValues = [];


    $scope.getComboValues = function (FieldName) {



        if ($scope.UnitDataList.length > 0) {
            for (var i = 0; i < $scope.UnitDataList.length; i++) {

                if ($scope.UnitDataList[i].FieldName == FieldName) {
                    if ($.trim($scope.UnitDataList[i].FieldComboValues) != "") {
                        $scope.UnitDataFieldCombovalues = $scope.UnitDataList[i].FieldComboValues.split("\n");
                        return $scope.UnitDataFieldCombovalues;
                    }
                    if ($.trim($scope.UnitDataList[i].FieldRadioValues) != "") {
                        $scope.UnitDataFieldRadioValues = $scope.UnitDataList[i].FieldRadioValues.split("\r\n");
                        return $scope.UnitDataFieldRadioValues;
                    }
                }
            }
        }
        else {
        }
    }


    // Function to get special type of unit data fields.

    $scope.getUnitSpecialType = function (FieldName) {

        if ($scope.UnitDataList.length > 0) {
            for (var i = 0; i < $scope.UnitDataList.length; i++) {
                if ($scope.UnitDataList[i].FieldName == FieldName || "it" + $scope.UnitDataList[i].FieldName == FieldName) {
                    return $scope.UnitDataList[i].FieldSpecialType;
                }
            }

        }
        else {
        }
    }



    $scope.getCustomSpecialType = function (FieldName) {
        
        if ($scope.CustomItemActivityDataList.length > 0) {
            for (var i = 0; i < $scope.CustomItemActivityDataList.length; i++) {
                var type = "";
                var Map = "";
                if (FieldName.includes("i_")) {
                    type = "part";
                    Map = FieldName.substring(2);
                }
                else {
                    type = "inventory";
                    Map = FieldName;
                }


                if ($scope.CustomItemActivityDataList[i].ColumnMap == Map && $scope.CustomItemActivityDataList[i].cfdCustomFieldType == type) {
                    return $scope.CustomItemActivityDataList[i];
                }
            }
        }
        else {
        }
    }




    $scope.CurrentView = { Name: "Inventory Activity" };
    $scope.ActivityViews = [];
    $scope.ActivityList = [];
    $scope.CustomItemDataList = [];
    $scope.CustomActivityDataList = [];
    $scope.CustomItemActivityDataList = [];
    $scope.FilterData = { SearchValue: "" };
    $scope.isDataLoading = true;
    $scope.FilterArray = [{ ColumnName: "", FilterOperator: "", SearchValue: "" }];
    $scope.IsWrongDate = false;
    $scope.datesGlobalforquery = { startDate: "", endDate: "" }
    $scope.sortColumn = "itTransDate";
    $scope.sortDir = "DESC";
    $scope.isviewload = false;
    $scope.Columns = [];
    $scope.loadingblock = false;


    $scope.HasImage = "";
    var _IsLazyLoadingUnderProgress = 0;
    var _PageSize = 30;
    var _sortColumn = "itTransDate";
    var _sortDir = "DESC";
    var _TotalRecordsCurrent = 0;
    var _masterSearch = "";

    //#endregion

    // Method to get incrementer count according to page size
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

    // try parse int javascript version
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

    // this function is giving filter operator according to column name
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
            case "bool":
                return "bool";
                break;


            default:
                return "cn";
        }
    }

    // pull to refresh function 
    function onSwipeDown() {
        $('#mylist').on('swipedown', function () {

            if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
                if ($(window).scrollTop() < 500) {

                    $scope.loadingblock = true;

                    _IsLazyLoadingUnderProgress = 1;
                    CheckScopeBeforeApply();
                    $scope.GetActivityDataAccordingToView();


                }
            }

        });
    }
    // check whether the column is further calculated column or not
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

    // check date comparison
    $scope.$watch("datesGlobalforquery.endDate", function () {
        var _dateStart = new Date();
        var _dateEnd = new Date();
        var _isDate1Ok = false;
        var _isDate2Ok = false;
        if ($.trim($scope.datesGlobalforquery.startDate) != "") {
            _isDate1Ok = true;
            _dateStart = new Date($scope.datesGlobalforquery.startDate);
        }

        if ($.trim($scope.datesGlobalforquery.endDate) != "") {
            _isDate2Ok = true;
            _dateEnd = new Date($scope.datesGlobalforquery.endDate);
        }

        if (_isDate1Ok && _isDate2Ok) {

            if (_dateStart > _dateEnd) {
                $scope.IsWrongDate = true;

            }
            else {
                $scope.IsWrongDate = false;
            }
        }
        CheckScopeBeforeApply()

    });
    $scope.$watch("datesGlobalforquery.startDate", function () {
        var _dateStart = new Date();
        var _dateEnd = new Date();
        var _isDate1Ok = false;
        var _isDate2Ok = false;
        if ($.trim($scope.datesGlobalforquery.startDate) != "") {
            _isDate1Ok = true;
            _dateStart = new Date($scope.datesGlobalforquery.startDate);
        }

        if ($.trim($scope.datesGlobalforquery.endDate) != "") {
            _isDate2Ok = true;
            _dateEnd = new Date($scope.datesGlobalforquery.endDate);
        }

        if (_isDate1Ok && _isDate2Ok) {

            if (_dateStart >= _dateEnd) {
                $scope.IsWrongDate = true;

            }
            else {
                $scope.IsWrongDate = false;
            }
        }
        CheckScopeBeforeApply()

    });

    $scope.GetParentActionClass = function (_cssclass) {
        if (_cssclass == "Move, Tag, & Update") {
            _cssclass = "MoveTagUpdate";
            return _cssclass;
        }
        else {
            return _cssclass;
        }
    }


    // function for hidden modal
    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });

    // open bottom menu modal
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
    // clear complete filter array
    $scope.clearfilterArray = function () {
        for (var i = 0; i < $scope.FilterArray.length; i++) {
            $scope.FilterArray[i].SearchValue = "";
        }


        $scope.clearAllFilter = true;


        $scope.ClearImageFilter();
        $scope.FilterData.SearchValue = "";
        $("#startDate").val("");
        $("#endDate").val("");
        CheckScopeBeforeApply();
        $scope.GetActivityDataAccordingToView();
    }
    // clear complete filter array
    $scope.clearfilter = function () {
        $scope.clearfilterArray();


    }

    // get custom dropdown data 

    $scope.GetComboData = function (ColumnName) {
        debugger;
        var _return = "N/A";
        var type = "";
        var Map = "";
        var _TempArray = angular.copy($scope.CustomItemDataList);
        if (ColumnName.includes("i_")) {
            type = "part";
            _TempArray = angular.copy($scope.CustomItemDataList);
            Map = ColumnName.substring(2);
        }
        else {
            type = "inventory";
            _TempArray = angular.copy($scope.CustomActivityDataList);
            Map = ColumnName;
        }
        for (var i = 0; i < _TempArray.length; i++) {
            if (_TempArray[i].ColumnMap == Map) {
                return _TempArray[i].cfdComboValues;
            }
        }


    }


    //$scope.GetComboData=function(ColumnName)
    //{
    //    for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
    //        if ($scope.CustomItemDataList[i].ColumnMap == ColumnName) {
    //            return $scope.CustomItemDataList[i].cfdComboValues;
    //        }

    //    }

    //}

    // get display label according to column name
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

    // Function to get cfdspecial type for Custom Field

    $scope.getCustomSpecialType = function (FieldName) {
        // 

        debugger;
        if ($scope.CustomItemActivityDataList.length > 0) {
            for (var i = 0; i < $scope.CustomItemActivityDataList.length; i++) {
                var type = "";
                var Map = "";
                if (FieldName.includes("i_")) {
                    type = "part";
                    Map = FieldName.substring(2);
                }
                else {
                    console.log("into inventory");
                    type = "inventory";
                    Map = FieldName;
                }


                if ($scope.CustomItemActivityDataList[i].ColumnMap == Map && $scope.CustomItemActivityDataList[i].cfdCustomFieldType == type) {
                    return $scope.CustomItemActivityDataList[i];
                }
            }
        }
        else {
        }
    }
    // Get Column type according to column name
    $scope.getColumnType = function (ColumnName) {

        var ColumnType = "system"
        var _column = $scope.getCustomSpecialType(ColumnName);
        if (_column != undefined) {

            for (var i = 0; i < $scope.Columns.length; i++) {
                if ($scope.Columns[i].ColumnID == _column.cfdID) {
                    ColumnType = $scope.Columns[i].ColumnType.toLowerCase();
                    return ColumnType;
                }
            }
        }
        return ColumnType;
    }
    // get data type according to column name
    $scope.GetColumnDataType = function (ColumnName) {

       //  
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

    // update filter's array according to server side filters
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

    // update filter's array according to server side filters
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

    // on scroll function to load data
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
                        $scope.GetActivityDataAccordingToView();
                    }
                    else {
                        // log.info("You have already loaded all data.")
                    }

                }
            }
        }



    });

    // change string to number 
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

    // get custom data according to type ( Item/Activity)
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


                       if (Type == 0) {
                           $scope.CustomItemDataList = response.GetCustomFieldsDataResult.Payload;

                       }

                       if (Type == 1) {

                           // 
                           $scope.CustomActivityDataList = response.GetCustomFieldsDataResult.Payload;

                       }

                       if (Type == 2) {
                           $scope.CustomItemActivityDataList = response.GetCustomFieldsDataResult.Payload;

                       }

                   }
                   else {
                       $scope.ShowErrorMessage("Custom Fields data", 1, 1, response.GetCustomFieldsDataResult.Message)

                   }


                   CheckScopeBeforeApply()
               },
               error: function (response) {
                   $scope.ShowErrorMessage("Custom Fields data", 2, 1, response.statusText);

                   //$scope.InventoryObject.Location = 678030;
               }
           });
    }


    var trueFalseArray = [];

    $scope.GetTrueFalseArray = function () {
        trueFalseArray.push("true");
        trueFalseArray.push("false");

        return trueFalseArray;
    }

    $scope.GetBooleabData = function (ColumnName) {
         
        debugger;
        var BooeanArray = [];

        var type = "";
        var Map = "";
        if (ColumnName.includes("i_")) {
            type = "part";
            Map = ColumnName.substring(2);
        }
        else {
            type = "inventory";
            Map = ColumnName;
        }

        for (var i = 0; i < $scope.CustomItemActivityDataList.length; i++) {
            if ($scope.CustomItemActivityDataList[i].ColumnMap == Map && $scope.CustomItemActivityDataList[i].cfdCustomFieldType == type) {
                BooeanArray.push($scope.CustomItemActivityDataList[i].cfdTruelabel);
                BooeanArray.push($scope.CustomItemActivityDataList[i].cfdFalselabel);
            }
        }

        return BooeanArray;
    }

    // get custom column according to ID 
    $scope.GetCustomFieldByID = function (ID) {
        
        for (var i = 0; i < $scope.CustomItemActivityDataList.length; i++) {
            if ($scope.CustomItemActivityDataList[i].cfdID == ID) {
                if ($scope.CustomItemActivityDataList[i].cfdCustomFieldType.toLowerCase() == "part") {

                    return "i_" + $scope.CustomItemActivityDataList[i].ColumnMap;
                }


            }

        }


        for (var i = 0; i < $scope.CustomItemActivityDataList.length; i++) {
            if ($scope.CustomItemActivityDataList[i].cfdID == ID) {


                if ($scope.CustomItemActivityDataList[i].cfdCustomFieldType.toLowerCase() == "inventory") {

                    return $scope.CustomItemActivityDataList[i].ColumnMap;
                }
            }

        }




        //for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
        //    if ($scope.CustomItemDataList[i].cfdID == ID) {
        //        if ($scope.CustomItemDataList[i].cfdCustomFieldType.toLowerCase() == "part") {

        //            return "i_" + $scope.CustomItemDataList[i].ColumnMap;
        //        }


        //    }

        //}


        //for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
        //    if ($scope.CustomActivityDataList[i].cfdID == ID) {


        //        if ($scope.CustomActivityDataList[i].cfdCustomFieldType.toLowerCase() == "inventory") {

        //            return $scope.CustomActivityDataList[i].ColumnMap;
        //        }
        //    }

        //}



    }

    // get custom column by column map

    $scope.GetCustomFieldNameByMap = function (ID) {
        var _return = "N/A";
        var type = "";
        var Map = "";
        var _TempArray = angular.copy($scope.CustomItemDataList);
        if (ID.includes("i_")) {
            type = "part";
            _TempArray = angular.copy($scope.CustomItemDataList);
            Map = ID.substring(2);
        }
        else {
            type = "inventory";
            _TempArray = angular.copy($scope.CustomActivityDataList);
            Map = ID;
        }
        for (var i = 0; i < _TempArray.length; i++) {
            if (_TempArray[i].ColumnMap == Map) {
                return _TempArray[i].cfdName;
            }
        }
        return _return;
    }

    //$scope.GetCustomFieldNameByMap = function (ID) {



    //    var _return = "N/A";
    //    for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
    //        if ($scope.CustomItemDataList[i].ColumnMap == ID) {
    //            return $scope.CustomItemDataList[i].cfdName;
    //        }

    //    }

    //    return _return;
    //}

    // get custom column by ID
    $scope.GetCustomFieldTypeByID = function (ID) {

        var _return = "N/A";
        var type = "";
        var Map = "";
        var _TempArray = angular.copy($scope.CustomItemDataList);
        if (ID.includes("i_")) {
            type = "part";
            _TempArray = angular.copy($scope.CustomItemDataList);
            Map = ID.substring(2);
        }
        else {
            type = "inventory";
            _TempArray = angular.copy($scope.CustomActivityDataList);
            Map = ID;
        }
        for (var i = 0; i < _TempArray.length; i++) {
            if (_TempArray[i].ColumnMap == Map) {
                return _TempArray[i].cfdDataType;
            }
        }
        return _return;
    }

    //$scope.GetCustomFieldTypeByID=function(ID)
    //{
    //    var _return = "N/A";
    //    for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
    //        if ($scope.CustomItemDataList[i].ColumnMap == ID) {
    //            return $scope.CustomItemDataList[i].cfdDataType;
    //        }

    //    }

    //    return _return;
    //}

    // get image path according to operator
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
            case "nc":
                _returnPath = path + "DoesNotContain.gif";
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
            case "Empty":
                _returnPath = path + "IsNull.gif";
                break;
        }
        return _returnPath;
    }

    // get column data according to column name and index of data
    $scope.GetCellData = function (columnName, Index, isCalculated) {

        // 
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
                if ($scope.ActivityList[Index].CustomData != null && $scope.ActivityList[Index].CustomData != undefined)
                    for (var i = 0; i < $scope.ActivityList[Index].CustomData.length; i++) {
                        if ($scope.ActivityList[Index].CustomData[i].Key == _Tempcolumnname) {

                            _valueData = $scope.ActivityList[Index].CustomData[i].Value;
                            break;
                        }
                    }
                return _valueData;
                break;

            case "lLoc":
                return $scope.ActivityList[Index].lLoc != null ? $scope.ActivityList[Index].lLoc : "";
                break;
            case "lZone":
                return $scope.ActivityList[Index].lZone != null ? $scope.ActivityList[Index].lZone : "";
                break;


            case "uomUOM":
                return $scope.ActivityList[Index].uomUOM != null ? $scope.ActivityList[Index].uomUOM : "";
                break;
            case "auDisplayName":
                return $scope.ActivityList[Index].auDisplayName != null ? $scope.ActivityList[Index].auDisplayName : "";
                break;
            case "itAction":
                return $scope.ActivityList[Index].itAction != null ? $scope.ActivityList[Index].itAction : "";
                break;
            case "ParentAction":
                return $scope.ActivityList[Index].ParentAction != null ? $scope.ActivityList[Index].ParentAction : "";
                break;

            case "itAvgCostPerUnit":
                return $scope.ActivityList[Index].itAvgCostPerUnit != null ? $scope.ActivityList[Index].itAvgCostPerUnit : "";
                break;
            case "itCostPerUnit":

                return $scope.ActivityList[Index].itCostPerUnit != null ? $scope.ActivityList[Index].itCostPerUnit : "";
                break;
            case "ItemDescription":

                return $scope.ActivityList[Index].ItemDescription != null ? $scope.ActivityList[Index].ItemDescription : "";
                break;
            case "itQty":
                return $scope.ActivityList[Index].itQty;
                break;
            case "itQtyChange":
                return $scope.ActivityList[Index].itQty;
                break;

            case "ItemGroup":
                return $scope.ActivityList[Index].ItemGroup != null ? $scope.ActivityList[Index].ItemGroup : "";

                break;
            case "ItemNumber":
                return $scope.ActivityList[Index].ItemNumber != null ? $scope.ActivityList[Index].ItemNumber : "";
                break;
            case "itReqValue":
                return $scope.ActivityList[Index].itReqValue != null ? $scope.ActivityList[Index].itReqValue : "";
                break;
            case "itStatusValue":
                return $scope.ActivityList[Index].itStatusValue != null ? $scope.ActivityList[Index].itStatusValue : "";
                break;
            case "iOrgName":
                return $scope.ActivityList[Index].iOrgName != null ? $scope.ActivityList[Index].iOrgName : "";
                break;

            case "ItemSupplier":
                return $scope.ActivityList[Index].ItemSupplier != null ? $scope.ActivityList[Index].ItemSupplier : "";
                break;

            case "itUnitNumber2":
                return $scope.ActivityList[Index].itUnitNumber2 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].itUnitNumber2) : "";
                break;
            case "itUnitNumber1":
                return $scope.ActivityList[Index].itUnitNumber1 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].itUnitNumber1) : "";
                break;
            case "ItemDefaultCost":

                return $scope.ActivityList[Index].ItemDefaultCost != null ? $scope.ActivityList[Index].ItemDefaultCost : "";
                break;

            case "ItemReorderQty":

                return $scope.ActivityList[Index].ItemReorderQty != null ? $scope.ActivityList[Index].ItemReorderQty : "";
                break;

            case "ItemTargetQty":

                return $scope.ActivityList[Index].ItemTargetQty != null ? $scope.ActivityList[Index].ItemTargetQty : "";
                break;

            case "ItemDefaultLocation":
                return $scope.ActivityList[Index].ItemDefaultLocation != null ? $scope.ActivityList[Index].ItemDefaultLocation : "";

                break;
            case "ItemDefaultLocationGroup":
                return $scope.ActivityList[Index].ItemDefaultLocationGroup != null ? $scope.ActivityList[Index].ItemDefaultLocationGroup : "";

                break;

            case "ItemDefaultUOM":
                return $scope.ActivityList[Index].ItemDefaultUOM != null ? $scope.ActivityList[Index].ItemDefaultUOM : "";
                break;
            case "itTransDate":
                return $scope.ActivityList[Index].itTransDate != null ? $scope.ActivityList[Index].itTransDate : "";
                break;
            case "itUniqueDate":
                return $scope.ActivityList[Index].itUniqueDate != null ? $scope.ActivityList[Index].itUniqueDate : "";
                break;

            case "itUnitDate2":
                return $scope.ActivityList[Index].itUnitDate2 != null ? $scope.ActivityList[Index].itUnitDate2 : "";
                break;


            case "itUpdateDate":
                return $scope.ActivityList[Index].itUpdateDate != null ? $scope.ActivityList[Index].itUpdateDate : "";
                break;
            case "itUpdateUser":
                return $scope.ActivityList[Index].itUpdateUser != null ? $scope.ActivityList[Index].itUpdateUser : "";
                break;


            case "itUnitTag2":
                return $scope.ActivityList[Index].itUnitTag2 != null ? $scope.ActivityList[Index].itUnitTag2 : "";
                break;
            case "itUnitTag3":
                return $scope.ActivityList[Index].itUnitTag3 != null ? $scope.ActivityList[Index].itUnitTag3 : "";
                break;


            case "string_1":
                return $scope.ActivityList[Index].string_1 != null ? $scope.ActivityList[Index].string_1 : "";
                break;
            case "string_2":
                return $scope.ActivityList[Index].string_2 != null ? $scope.ActivityList[Index].string_2 : "";
                break;
            case "string_3":
                return $scope.ActivityList[Index].string_3 != null ? $scope.ActivityList[Index].string_3 : "";
                break;
            case "string_4":
                return $scope.ActivityList[Index].string_4 != null ? $scope.ActivityList[Index].string_4 : "";
                break;
            case "string_5":
                return $scope.ActivityList[Index].string_5 != null ? $scope.ActivityList[Index].string_5 : "";
                break;
            case "string_6":
                return $scope.ActivityList[Index].string_6 != null ? $scope.ActivityList[Index].string_6 : "";
                break;
            case "string_7":
                return $scope.ActivityList[Index].string_7 != null ? $scope.ActivityList[Index].string_7 : "";
                break;
            case "string_8":
                return $scope.ActivityList[Index].string_8 != null ? $scope.ActivityList[Index].string_8 : "";
                break;
            case "string_9":
                return $scope.ActivityList[Index].string_9 != null ? $scope.ActivityList[Index].string_9 : "";
                break;
            case "string_10":
                return $scope.ActivityList[Index].string_10 != null ? $scope.ActivityList[Index].string_10 : "";
                break;

            case "string_11":
                return $scope.ActivityList[Index].string_11 != null ? $scope.ActivityList[Index].string_11 : "";
                break;
            case "string_12":
                return $scope.ActivityList[Index].string_12 != null ? $scope.ActivityList[Index].string_12 : "";
                break;
            case "string_13":
                return $scope.ActivityList[Index].string_13 != null ? $scope.ActivityList[Index].string_13 : "";
                break;
            case "string_14":
                return $scope.ActivityList[Index].string_14 != null ? $scope.ActivityList[Index].string_14 : "";
                break;
            case "string_15":
                return $scope.ActivityList[Index].string_15 != null ? $scope.ActivityList[Index].string_15 : "";
                break;
            case "string_16":
                return $scope.ActivityList[Index].string_16 != null ? $scope.ActivityList[Index].string_16 : "";
                break;
            case "string_17":
                return $scope.ActivityList[Index].string_17 != null ? $scope.ActivityList[Index].string_17 : "";
                break;
            case "string_18":
                return $scope.ActivityList[Index].string_18 != null ? $scope.ActivityList[Index].string_18 : "";
                break;
            case "string_19":
                return $scope.ActivityList[Index].string_19 != null ? $scope.ActivityList[Index].string_19 : "";
                break;
            case "string_20":
                return $scope.ActivityList[Index].string_20 != null ? $scope.ActivityList[Index].string_20 : "";
                break;
            case "string_21":
                return $scope.ActivityList[Index].string_21 != null ? $scope.ActivityList[Index].string_21 : "";
                break;
            case "string_22":
                return $scope.ActivityList[Index].string_22 != null ? $scope.ActivityList[Index].string_22 : "";
                break;
            case "string_23":
                return $scope.ActivityList[Index].string_23 != null ? $scope.ActivityList[Index].string_23 : "";
                break;
            case "string_24":
                return $scope.ActivityList[Index].string_24 != null ? $scope.ActivityList[Index].string_24 : "";
                break;

            case "i_string_1":
                return $scope.ActivityList[Index].i_string_1 != null ? $scope.ActivityList[Index].i_string_1 : "";
                break;
            case "i_string_2":
                return $scope.ActivityList[Index].i_string_2 != null ? $scope.ActivityList[Index].i_string_2 : "";
                break;
            case "i_string_3":
                return $scope.ActivityList[Index].i_string_3 != null ? $scope.ActivityList[Index].i_string_3 : "";
                break;
            case "i_string_4":
                return $scope.ActivityList[Index].i_string_4 != null ? $scope.ActivityList[Index].i_string_4 : "";
                break;
            case "i_string_5":
                return $scope.ActivityList[Index].i_string_5 != null ? $scope.ActivityList[Index].i_string_5 : "";
                break;
            case "i_string_6":
                return $scope.ActivityList[Index].i_string_6 != null ? $scope.ActivityList[Index].i_string_6 : "";
                break;
            case "i_string_7":
                return $scope.ActivityList[Index].i_string_7 != null ? $scope.ActivityList[Index].i_string_7 : "";
                break;
            case "i_string_8":
                return $scope.ActivityList[Index].i_string_8 != null ? $scope.ActivityList[Index].i_string_8 : "";
                break;
            case "i_string_9":
                return $scope.ActivityList[Index].i_string_9 != null ? $scope.ActivityList[Index].i_string_9 : "";
                break;
            case "i_string_10":
                return $scope.ActivityList[Index].i_string_10 != null ? $scope.ActivityList[Index].i_string_10 : "";
                break;

            case "i_string_11":
                return $scope.ActivityList[Index].i_string_11 != null ? $scope.ActivityList[Index].i_string_11 : "";
                break;
            case "i_string_12":
                return $scope.ActivityList[Index].i_string_12 != null ? $scope.ActivityList[Index].i_string_12 : "";
                break;
            case "i_string_13":
                return $scope.ActivityList[Index].i_string_13 != null ? $scope.ActivityList[Index].i_string_13 : "";
                break;
            case "i_string_14":
                return $scope.ActivityList[Index].i_string_14 != null ? $scope.ActivityList[Index].i_string_14 : "";
                break;
            case "i_string_15":
                return $scope.ActivityList[Index].i_string_15 != null ? $scope.ActivityList[Index].i_string_15 : "";
                break;
            case "i_string_16":
                return $scope.ActivityList[Index].i_string_16 != null ? $scope.ActivityList[Index].i_string_16 : "";
                break;
            case "i_string_17":
                return $scope.ActivityList[Index].i_string_17 != null ? $scope.ActivityList[Index].i_string_17 : "";
                break;
            case "i_string_18":
                return $scope.ActivityList[Index].i_string_18 != null ? $scope.ActivityList[Index].i_string_18 : "";
                break;
            case "i_string_19":
                return $scope.ActivityList[Index].i_string_19 != null ? $scope.ActivityList[Index].i_string_19 : "";
                break;
            case "i_string_20":
                return $scope.ActivityList[Index].i_string_20 != null ? $scope.ActivityList[Index].i_string_20 : "";
                break;
            case "i_string_21":
                return $scope.ActivityList[Index].i_string_21 != null ? $scope.ActivityList[Index].i_string_21 : "";
                break;
            case "i_string_22":
                return $scope.ActivityList[Index].i_string_22 != null ? $scope.ActivityList[Index].i_string_22 : "";
                break;
            case "i_string_23":
                return $scope.ActivityList[Index].i_string_23 != null ? $scope.ActivityList[Index].i_string_23 : "";
                break;
            case "i_string_24":
                return $scope.ActivityList[Index].i_string_24 != null ? $scope.ActivityList[Index].i_string_24 : "";
                break;




            case "number_1":
                return $scope.ActivityList[Index].number_1 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_1) : "";
                break;
            case "number_2":
                return $scope.ActivityList[Index].number_2 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_2) : "";
                break;
            case "number_3":
                return $scope.ActivityList[Index].number_3 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_3) : "";
                break;
            case "number_4":
                return $scope.ActivityList[Index].number_4 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_4) : "";
                break;
            case "number_5":
                return $scope.ActivityList[Index].number_5 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_5) : "";
                break;
            case "number_6":
                return $scope.ActivityList[Index].number_6 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_6) : "";
                break;
            case "number_7":
                return $scope.ActivityList[Index].number_7 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_7) : "";
                break;
            case "number_8":
                return $scope.ActivityList[Index].number_8 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_8) : "";
                break;
            case "number_9":
                return $scope.ActivityList[Index].number_9 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_9) : "";
                break;
            case "number_10":
                return $scope.ActivityList[Index].number_10 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_10) : "";
                break;

            case "number_11":
                return $scope.ActivityList[Index].number_11 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_11) : "";
                break;
            case "number_12":
                return $scope.ActivityList[Index].number_12 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].number_12) : "";
                break;



            case "i_number_1":
                return $scope.ActivityList[Index].i_number_1 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_1) : "";
                break;
            case "i_number_2":
                return $scope.ActivityList[Index].i_number_2 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_2) : "";
                break;
            case "i_number_3":
                return $scope.ActivityList[Index].i_number_3 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_3) : "";
                break;
            case "i_number_4":
                return $scope.ActivityList[Index].i_number_4 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_4) : "";
                break;
            case "i_number_5":
                return $scope.ActivityList[Index].i_number_5 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_5) : "";
                break;
            case "i_number_6":
                return $scope.ActivityList[Index].i_number_6 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_6) : "";
                break;
            case "i_number_7":
                return $scope.ActivityList[Index].i_number_7 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_7) : "";
                break;
            case "i_number_8":
                return $scope.ActivityList[Index].i_number_8 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_8) : "";
                break;
            case "i_number_9":
                return $scope.ActivityList[Index].i_number_9 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_9) : "";
                break;
            case "i_number_10":
                return $scope.ActivityList[Index].i_number_10 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_10) : "";
                break;

            case "i_number_11":
                return $scope.ActivityList[Index].i_number_11 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_11) : "";
                break;
            case "i_number_12":
                return $scope.ActivityList[Index].i_number_12 != null ? ChangeIntoNumberFormat($scope.ActivityList[Index].i_number_12) : "";
                break;
            case "bool_1":

                if ($scope.ActivityList[Index].bool_1 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].bool_1 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.InventoryList[Index].bool_1 != null ? $scope.InventoryList[Index].bool_1 : "";
                break;
            case "bool_2":
                if ($scope.ActivityList[Index].bool_2 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].bool_2 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.InventoryList[Index].bool_2 != null ? $scope.InventoryList[Index].bool_2 : "";
                break;
            case "bool_3":
                if ($scope.ActivityList[Index].bool_3 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].bool_3 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.InventoryList[Index].bool_3 != null ? $scope.InventoryList[Index].bool_3 : "";
                break;
            case "bool_4":
                if ($scope.ActivityList[Index].bool_4 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].bool_4 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.InventoryList[Index].bool_4 != null ? $scope.InventoryList[Index].bool_4 : "";
                break;
            case "bool_5":
                if ($scope.ActivityList[Index].bool_5 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].bool_5 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.InventoryList[Index].bool_5 != null ? $scope.InventoryList[Index].bool_5 : "";
                break;
            case "bool_6":
                if ($scope.ActivityList[Index].bool_6 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].bool_6 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.InventoryList[Index].bool_6 != null ? $scope.InventoryList[Index].bool_6 : "";
                break;
            //case "bool_1":
            //    return $scope.ActivityList[Index].bool_1 != null ? $scope.ActivityList[Index].bool_1 : "";
            //    break;
            //case "bool_2":
            //    return $scope.ActivityList[Index].bool_2 != null ? $scope.ActivityList[Index].bool_2 : "";
            //    break;
            //case "bool_3":
            //    return $scope.ActivityList[Index].bool_3 != null ? $scope.ActivityList[Index].bool_3 : "";
            //    break;
            //case "bool_4":
            //    return $scope.ActivityList[Index].bool_4 != null ? $scope.ActivityList[Index].bool_4 : "";
            //    break;
            //case "bool_5":
            //    return $scope.ActivityList[Index].bool_5 != null ? $scope.ActivityList[Index].bool_5 : "";
            //    break;
            //case "bool_6":
            //    return $scope.ActivityList[Index].bool_6 != null ? $scope.ActivityList[Index].bool_6 : "";
            //    break;




            case "i_bool_1":
                if ($scope.ActivityList[Index].i_bool_1 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].i_bool_1 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.ActivityList[Index].i_bool_1 != null ? $scope.ActivityList[Index].i_bool_1 : "";
                break;
            case "i_bool_2":
                if ($scope.ActivityList[Index].i_bool_2 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].i_bool_2 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.ActivityList[Index].i_bool_2 != null ? $scope.ActivityList[Index].i_bool_2 : "";
                break;
            case "i_bool_3":
                if ($scope.ActivityList[Index].i_bool_3 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].i_bool_3 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.ActivityList[Index].i_bool_3 != null ? $scope.ActivityList[Index].i_bool_3 : "";
                break;
            case "i_bool_4":
                if ($scope.ActivityList[Index].i_bool_4 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].i_bool_4 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.ActivityList[Index].i_bool_4 != null ? $scope.ActivityList[Index].i_bool_4 : "";
                break;
            case "i_bool_5":
                if ($scope.ActivityList[Index].i_bool_5 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].i_bool_5 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.ActivityList[Index].i_bool_5 != null ? $scope.ActivityList[Index].i_bool_5 : "";
                break;
            case "i_bool_6":
                if ($scope.ActivityList[Index].i_bool_6 != null) {
                    for (var i = 0 ; $scope.CustomItemActivityDataList.length ; i++) {
                        if ($scope.CustomItemActivityDataList[i].cfdID == _ID) {
                            if ($scope.ActivityList[Index].i_bool_6 == true) {
                                return $scope.CustomItemActivityDataList[i].cfdTruelabel;
                            }
                            else {
                                return $scope.CustomItemActivityDataList[i].cfdFalselabel;
                            }
                        }
                    }
                }
                //return $scope.ActivityList[Index].i_bool_6 != null ? $scope.ActivityList[Index].i_bool_6 : "";
                break;

            case "i_date_1":
                return $scope.ActivityList[Index].i_date_1 != null ? $scope.ActivityList[Index].i_date_1 : "";
                break;

            case "i_date_2":
                return $scope.ActivityList[Index].i_date_2 != null ? $scope.ActivityList[Index].i_date_2 : "";
                break;
            case "i_date_3":
                return $scope.ActivityList[Index].i_date_3 != null ? $scope.ActivityList[Index].i_date_3 : "";
                break;
            case "i_date_4":
                return $scope.ActivityList[Index].i_date_4 != null ? $scope.ActivityList[Index].i_date_4 : "";
                break;
            case "i_date_5":
                return $scope.ActivityList[Index].i_date_5 != null ? $scope.ActivityList[Index].i_date_5 : "";
                break;
            case "i_date_6":
                return $scope.ActivityList[Index].i_date_6 != null ? $scope.ActivityList[Index].i_date_6 : "";
                break;


            case "date_1":
                return $scope.ActivityList[Index].date_1 != null ? $scope.ActivityList[Index].date_1 : "";
                break;

            case "date_2":
                return $scope.ActivityList[Index].date_2 != null ? $scope.ActivityList[Index].date_2 : "";
                break;
            case "date_3":
                return $scope.ActivityList[Index].date_3 != null ? $scope.ActivityList[Index].date_3 : "";
                break;
            case "date_4":
                return $scope.ActivityList[Index].date_4 != null ? $scope.ActivityList[Index].date_4 : "";
                break;
            case "date_5":
                return $scope.ActivityList[Index].date_5 != null ? $scope.ActivityList[Index].date_5 : "";
                break;
            case "date_6":
                return $scope.ActivityList[Index].date_6 != null ? $scope.ActivityList[Index].date_6 : "";
                break;


            default:
                return "N/A";
        }
    }

    // show  and hide div according to given instruction 
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

    // get activity views according to logged in user
    $scope.GetActivityViews = function () {
        $scope.isDataLoading = false;
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


                  }
                  else {
                      $scope.ShowErrorMessage("Get activitiy reports", 1, 1, response.GetAllViewsResult.Message)

                  }
                  $scope.isDataLoading = true;
                  $scope.$apply();
              },
              error: function (err) {
                  $scope.isDataLoading = true;
                  console.log(err);
                  $scope.ShowErrorMessage("Get activitiy reports", 2, 1, err.statusText);

                  $scope.$apply();

              }
          });

    }

    // assign current view according to selected view 
    $scope.viewdetail = function (viewname) {
        $scope.isviewload = true;
        $scope.CurrentView = viewname;
        $scope.FilterArray = [];
        CheckScopeBeforeApply();
    }


    $scope.showview = function () {
        $scope.isviewload = false;
        $scope.CurrentView = { Name: "Inventory Activity" };

        console.log($scope.ActivityViews);
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
        $scope.GetActivityDataAccordingToView();
    }
    $scope.showfilter = function () {
        $("#filtermodal").modal("show")
    }

    // get concatenated date string "date1 and date2"
    $scope.computedTwoDatesforquery = function (date1, date2) {


        return date1 + " to " + date2;

    }


    // update parent action
    $scope.UpdateParentAction = function (index, Action) {
        if ($scope.FilterArray[index].SearchValue == Action) {
            $scope.FilterArray[index].SearchValue = "";
        }
        else {
            $scope.FilterArray[index].SearchValue = Action;

        }
        $scope.FilterArray[index].FilterOperator = "eq";
        CheckScopeBeforeApply();
    }


    function GetColumnDataType(ColumnName) {

        for (var i = 0; i < $scope.Columns.length; i++) {
            if ($scope.Columns[i].ColumnID == ColumnName) {
                return $scope.Columns[i].ColumnDataType;
            }

        }

        return "";

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
    function ConvertToProperFilter(_Filters) {

        debugger;
        if (_Filters != null && _Filters != undefined && _Filters.length != 0) {
            for (var i = 0; i < _Filters.length; i++) {
                switch ($scope.GetColumnDataType(_Filters[i].ColumnName)) {
                    case "Decimal":
                    case "decimal":
                    case "number":
                    case "currency":
                        if (_Filters[i].SearchValue != null && _Filters[i].SearchValue != undefined && $.trim(_Filters[i].SearchValue) != "") {

                            _Filters[i].SearchValue = parseFloat(_Filters[i].SearchValue);
                        }
                        break;
                    case "Date":
                    case "date":
                    case "datetime":
                        if (_Filters[i].FilterOperator != "date-year" && _Filters[i].FilterOperator != "date-month" && _Filters[i].FilterOperator != "date-day" && _Filters[i].FilterOperator != "date-hour" && _Filters[i].FilterOperator != "date-minute" && _Filters[i].FilterOperator != "date-second") {

                            if (_Filters[i].SearchValue != null && _Filters[i].SearchValue != undefined && _Filters[i].SearchValue != "") {

                                if (_Filters[i].SearchValue.includes("AM") || _Filters[i].SearchValue.includes("PM")) {
                                    if (_Filters[i].SearchValue.includes("1900")) {
                                        var x = _Filters[i].SearchValue.split(" ");
                                        var y = x[1].split(":");


                                        if (_Filters[i].SearchValue.includes("PM")) {
                                            y[0] = parseInt(y[0]) + 12;
                                        }

                                        if (y[0].length < 2) {
                                            y[0] = "0" + y[0]
                                        }
                                        if (y[1].length < 2) {
                                            y[1] = "0" + y[1]
                                        }


                                        _Filters[i].SearchValue = y[0] + ":" + y[1];
                                        break;
                                    }
                                    else {
                                        var x = _Filters[i].SearchValue.split(" ");
                                        var replaced = x[0].split("/");
                                        var Datereplaced = x[1].split(":");

                                        if (replaced[0].length < 2) {
                                            replaced[0] = "0" + replaced[0]
                                        }

                                        if (replaced[1].length < 2) {
                                            replaced[1] = "0" + replaced[1]
                                        }

                                        if (Datereplaced[0].length < 2) {
                                            Datereplaced[0] = "0" + Datereplaced[0]
                                        }

                                        if (Datereplaced[1].length < 2) {
                                            Datereplaced[1] = "0" + Datereplaced[1]
                                        }


                                        var newdate = replaced[2] + "-" + replaced[0] + "-" + replaced[1];

                                        _Filters[i].SearchValue = newdate + "T" + Datereplaced[0] + ":" + Datereplaced[1]
                                        break;
                                    }
                                }
                            }


                            _Filters[i].SearchValue = formatDate(_Filters[i].SearchValue);
                        }
                        else {
                            _Filters[i].SearchValue = _Filters[i].SearchValue;
                        }
                        break;

                    case "checkbox":
                        _Filters[i].SearchValue = _Filters[i].SearchValue == null ? " " : _Filters[i].SearchValue.toLowerCase();
                        break;
                    case "combobox":
                        _Filters[i].SearchValue = _Filters[i].SearchValue;
                        break;
                    case "string":
                    case "String":
                        _Filters[i].SearchValue = _Filters[i].SearchValue;
                        break;
                    default:
                }
            }
            $scope.FilterArray = _Filters;
        }
        setTimeout(function () {

            $(".weekfilter").each(function () {

                var _val = $(this).attr("currentvalue");
                if ($.trim(_val) != "") {

                    $(this).val(_val);
                    $(this).trigger("change");
                }
            });
        }, 1000);
        CheckScopeBeforeApply();
    }






    function ChangeBooleanOperator() {
         
        for (var i = 0; i < $scope.FilterArray.length ; i++) {
            if ($scope.FilterArray[i].ColumnName.includes("bool")) {
                $scope.FilterArray[i].FilterOperator = 'bool';
            }
        }

        console.log("Filter Array after changing the boolean operator");
        console.log($scope.FilterArray);
    }












    // Get activity data according to selected view 
    $scope.GetActivityDataAccordingToView = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $("#filtermodal").modal('hide');

        $scope.filterVal = "";

        if ($scope.CurrentView != undefined) {





            if ($scope.CurrentView.SearchValue.indexOf("****") > -1) {

                $scope.CurrentView.SearchValue = $scope.CurrentView.SearchValue.replace("****", "");
            }
            if ($scope.CurrentView.SearchValue.indexOf("####") > -1) {
                $scope.CurrentView.SearchValue = $scope.CurrentView.SearchValue.replace("####", "");

            }
            CheckScopeBeforeApply();

            if ($scope.FilterData.SearchValue != undefined && $.trim($scope.FilterData.SearchValue) != "") {
                //$scope.filterVal = $scope.FilterData.SearchValue + "####" + $scope.computedTwoDatesforquery($scope.datesGlobalforquery.startDate, $scope.datesGlobalforquery.endDate);


                //$scope.filterVal = $scope.filterVal + "****" + $scope.CurrentView.SearchValue;
                //CheckScopeBeforeApply();
            }
            else {
                $scope.FilterData.SearchValue = "";

            }

            var _isDate = false;
            if ($scope.datesGlobalforquery.startDate != null && $scope.datesGlobalforquery.endDate != null) {

                if ($.trim($scope.datesGlobalforquery.startDate) != "" && $.trim($scope.datesGlobalforquery.endDate) != "") {

                    if (!$scope.IsWrongDate) {

                        _isDate = true;
                        $scope.filterVal = $scope.FilterData.SearchValue + "####" + $scope.computedTwoDatesforquery($scope.datesGlobalforquery.startDate, $scope.datesGlobalforquery.endDate);
                    }
                    else {
                        log.error("Start date must be lower from end date, please correct.")
                    }
                }
            }

            if (_isDate) {
                $scope.CurrentView.SearchValue = "";
                $scope.filterVal = $scope.filterVal + "****" + $scope.CurrentView.SearchValue;

            }
            else {
                $scope.filterVal = $scope.FilterData.SearchValue + "####" + "****" + $scope.CurrentView.SearchValue;

            }
            CheckScopeBeforeApply();

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

            $scope.isDataLoading = false;

            var _searchParameter = $scope.filterVal;

            for (var i = 0 ; i < $scope.FilterArray.length ; i++) {
                if ($scope.FilterArray[i].FilterOperator == "Empty") {
                    if ($scope.clearAllFilter != true) {
                        $scope.FilterArray[i].SearchValue = "NULL";

                    }
                }
                if ($scope.FilterArray[i].ColumnName == "itUniqueDate" || $scope.FilterArray[i].ColumnName == "itUnitDate2") {
                    var fieldSpecialType = $scope.getUnitSpecialType($scope.FilterArray[i].ColumnName.slice(2));
                    if (fieldSpecialType != undefined) {
                        if (fieldSpecialType == 17) {
                            // For Time Fields
                            if ($.trim($scope.FilterArray[i].SearchValue) != "") {

                                if ($scope.FilterArray[i].FilterOperator != "date-hour" && $scope.FilterArray[i].FilterOperator != "date-minute" && $scope.FilterArray[i].FilterOperator != "date-second") {

                                    $scope.FilterArray[i].SearchValue = "1900-01-01T" + $scope.FilterArray[i].SearchValue;
                                }
                            }
                        }
                    }
                }
                var fieldSpecialType = $scope.getCustomSpecialType($scope.FilterArray[i].ColumnName);
                if (fieldSpecialType != undefined) {
                    if ($.trim($scope.FilterArray[i].SearchValue) != "") {
                        if (fieldSpecialType.cfdSpecialType == 2) {
                            // For DateTime Fields
                        }
                        if (fieldSpecialType.cfdSpecialType == 3) {
                            // For Time Fields
                            if ($scope.FilterArray[i].FilterOperator != "date-hour" && $scope.FilterArray[i].FilterOperator != "date-minute" && $scope.FilterArray[i].FilterOperator != "date-second") {

                                $scope.FilterArray[i].SearchValue = "1900-01-01T" + $scope.FilterArray[i].SearchValue;
                            }
                        }
                    }
                }
            }

            $.ajax
              ({
                  type: "POST",
                  url: serviceBase + 'GetInventoryActivities',
                  data: JSON.stringify({ ClearFilter: $scope.clearAllFilter, SecurityToken: $scope.SecurityToken, HasImage: $scope.HasImage, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: $scope.FilterArray, masterSearch: _searchParameter, PageSize: _PageSize, ViewID: $scope.CurrentView.GridLayoutID }),
                  contentType: 'application/json',
                  dataType: 'json',
                  success: function (response) {
                      $scope.clearAllFilter = false;
                      $scope.isDataLoading = true;
                      $scope.isviewload = true;



                      if (response.GetInventoryActivitiesResult.Success == true) {



                          _TotalRecordsCurrent = response.GetInventoryActivitiesResult.Payload[0].Data.length;
                          $scope.currentrecord = response.GetInventoryActivitiesResult.Payload[0].Data.length;
                          $scope.ActivityList = response.GetInventoryActivitiesResult.Payload[0].Data;
                          $scope.totalrecords = response.GetInventoryActivitiesResult.Payload[0].TotalRercords;
                          $scope.Columns = response.GetInventoryActivitiesResult.Payload[0].Columns;
                          $scope.ActualTotalRecords = response.GetInventoryActivitiesResult.Payload[0].ActualTotalRecords;

                          ConvertToProperFilter(response.GetInventoryActivitiesResult.Payload[0].Filters);
                          ChangeBooleanOperator();
                          //FillFilterArray();
                          UpdateFilterArray();
                      }
                      else {
                          $scope.ShowErrorMessage("Get activitiy data", 1, 1, response.GetInventoryActivitiesResult.Message)

                      }
                      CheckScopeBeforeApply();

                  },
                  error: function (requestObject, err, errorThrown) {

                     //  
                      if (requestObject.readyState == 0 || requestObject.status == 0) {
                          log.error("Seems like some issue in network, please try again.")
                      }
                      else {


                          console.log(err);
                          log.error(requestObject.responseText);
                          var err = eval("(" + requestObject.responseText + ")");
                          alert(err.Message);
                          $scope.ShowErrorMessage("Get activitiy data", 2, 1, err.statusText);
                          $scope.isDataLoading = true;
                      }
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

    // checking of column whether the column is available or not
    $scope.IsAvailableColumn = function (column) {
        for (var i = 0; i < $scope.Columns.length; i++) {
            if ($scope.Columns[i].ColumnID == column) {

                return true;
            }

        }
        return false;
    }

    $scope.OpenImageModal = function (Object, Name) {
        $("#imagemodal").modal('show');
        $("#modalheader").find("h4").html(Name);
        $("#imagepreview").attr("src", Object);
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
        $scope.GetActivityDataAccordingToView()

    }

    function init() {
        $scope.GetCustomDataField(0);
        $scope.GetCustomDataField(1);
        $scope.GetCustomDataField(2);

        $scope.GetActiveUnitDataField();

        $scope.getuom();
        $scope.getstatus();
        $scope.GetActivityViews();
     
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