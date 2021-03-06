﻿'use strict';
app.controller('itemreportController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {

    $scope.yearList = [];
    $scope.dayList = [];
    $scope.monthList = [];

    $scope.hourList = [];
    $scope.minuteList = [];
    $scope.secondList = [];


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
    $scope.CurrentView = { Name: "Item" };
    $scope.ItemViews = [];
    $scope.ItemList = [];
    $scope.CustomItemDataList = [];
    $scope.FilterData = {SearchValue:""};
    $scope.isDataLoading = true;
    $scope.FilterArray = [{ ColumnName: "", FilterOperator: "", SearchValue: "" }];
    $scope.sortColumn = "pPart";
    $scope.sortDir = "DESC";
    var _sortColumn = "pPart";
    var _sortDir = "DESC";
    $scope.isviewload = false;
    var _IsLazyLoadingUnderProgress = 0;
    var _PageSize = 30;
    $scope.Columns = [];
    var _TotalRecordsCurrent = 0;
    var _masterSearch = "";
    $scope.loadingblock = false;
    $scope.HasImage = "";


    $scope.weeklist = [];

    $scope.CurrentYear = new Date().getFullYear();

    for (var i = 1; i <= 52; i++) {
        $scope.weeklist.push(i);
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
    function onSwipeDown() {
        $('#mylist').on('swipedown', function () {

            if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
                if ($(window).scrollTop() < 500) {

                    $scope.loadingblock = true;

                    _IsLazyLoadingUnderProgress = 1;
                    CheckScopeBeforeApply();
                    $scope.GetItemsDataAccordingToView();


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

    function GetFilterOperator(ColumnName)
    {
         
        
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


    $scope.OpenImageModal = function (Object,Name) {
        $("#imagemodal").modal('show');
        $("#modalheader").find("h4").html(Name);
        $("#imagepreview").attr("src", Object);
    }

    $scope.isFurtherCalculatedColumn=function(ColumnName)
    {
        for (var i = 0; i < $scope.Columns.length; i++) {
            if ($scope.Columns[i].ColumnID == ColumnName) {
                if ($scope.Columns[i].isFirstFurtherCalculated == true || $scope.Columns[i].isSecondFurtherCalculated == true)
                {
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

        $scope.clearAllFilter = true;


        $scope.ClearImageFilter();
        $scope.FilterData.SearchValue = "";
        CheckScopeBeforeApply();
        $scope.GetItemsDataAccordingToView();
    }
    $scope.clearfilter=function()
    {
        $scope.clearfilterArray();
      
      //  CheckScopeBeforeApply();
      //  $scope.GetItemViews();
    }
    $scope.GetComboData=function(ColumnName)
    {
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ColumnName) {
                console.log($scope.CustomItemDataList[i].cfdComboValues);
                return $scope.CustomItemDataList[i].cfdComboValues;
            }

        }
        
    }
    $scope.GetDisplayLabel = function (ColumnName) {
        var DataType=""
        

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

    $scope.getCustomSpecialType = function (FieldName) {
        debugger;
        var type = "";
        var Map = "";

        type = "part";
        Map = FieldName;
        if ($scope.CustomItemDataList.length > 0) {
            for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            


                if ($scope.CustomItemDataList[i].ColumnMap == Map && $scope.CustomItemDataList[i].cfdCustomFieldType.toLowerCase() == type) {
                    return $scope.CustomItemDataList[i];
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
    $scope.GetColumnDataType=function(ColumnName)
    {
        var DataType=""
        

            DataType = $scope.GetCustomFieldTypeByID(ColumnName);
        if(DataType=="N/A") {

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

    function UpdateFilterArray()
    {

        for (var i = 0; i < $scope.FilterArray.length; i++)
        {

            var _datatype = $scope.GetColumnDataType($scope.FilterArray[i].ColumnName);

            if(_datatype=="number"||_datatype=="decimal"||_datatype=="money")
            {
                if($scope.FilterArray[i].SearchValue!=null && $scope.FilterArray[i].SearchValue!=undefined && $.trim($scope.FilterArray[i].SearchValue)!="")
                {
                    var _value = angular.copy($scope.FilterArray[i].SearchValue);
                    $scope.FilterArray[i].SearchValue = parseFloat(_value);
                }

            }
        }
        CheckScopeBeforeApply();
    }
    function FillFilterArray()
    {
        $scope.FilterArray = [];
        for (var i = 0; i < $scope.Columns.length; i++) {
         
            if ($scope.Columns[i].ColumnID != "LeaveBlank") {
                var _obj = { ColumnName: "", FilterOperator: "", SearchValue: "" };
                _obj.ColumnName = $scope.Columns[i].ColumnID;
                var _ID = TryParseInt(_obj.ColumnName, 0);
                if (_ID != 0)
                {
                  
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
                        debugger;


                        _IsLazyLoadingUnderProgress = 1;
                        $scope.isDataLoading = false;
                        _PageSize = _TotalRecordsCurrent + getIncrementor($scope.totalrecords);
                        CheckScopeBeforeApply();
                        $scope.GetItemsDataAccordingToView();
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
            if($scope.CustomItemDataList[i].cfdID==ID)
            {
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

    $scope.GetCustomFieldTypeByID=function(ID)
    {
        var _return = "N/A";
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ID) {
                return $scope.CustomItemDataList[i].cfdDataType;
            }

        }

        return _return;
    }

    $scope.GetImagePath=function(Operator)
    {
         
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
        if (ColumnName.includes("t_")) {
            type = "inventory";
            Map = ColumnName.substring(2);
        }
        else {
            type = "part";
            Map = ColumnName;
        }

        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == Map && $scope.CustomItemDataList[i].cfdCustomFieldType == type) {
                BooeanArray.push($scope.CustomItemDataList[i].cfdTruelabel);
                BooeanArray.push($scope.CustomItemDataList[i].cfdFalselabel);
            }
        }

        return BooeanArray;
    }











   $scope.GetCellData=function(columnName, Index,isCalculated) {
       var _ID = TryParseInt(columnName, 0);
       if (_ID != 0)
       {
           columnName = $scope.GetCustomFieldByID(_ID);
       }
       var _Tempcolumnname = columnName;
       if (isCalculated == true)
       {
           columnName="Calculated"
       }

       switch (columnName) {
           case "Calculated":
               var _valueData = "";
               if ($scope.ItemList[Index].CustomData != null && $scope.ItemList[Index].CustomData != undefined)
                   for (var i = 0; i < $scope.ItemList[Index].CustomData.length; i++) {
                       if( $scope.ItemList[Index].CustomData[i].Key==_Tempcolumnname)
                       {
                           
                           _valueData = $scope.ItemList[Index].CustomData[i].Value;
                           break;
                       }
               }
               return _valueData;
               break;
               
           case "ItemGroup":
               return $scope.ItemList[Index].ItemGroup != null ? $scope.ItemList[Index].ItemGroup : "";
               break;
           case "pTargetQty":
               return $scope.ItemList[Index].pTargetQty != null ? $scope.ItemList[Index].pTargetQty : "";
               break;
           case "pReorderQty":
               return $scope.ItemList[Index].pReorderQty != null ? $scope.ItemList[Index].pReorderQty : "";
               break;
           case "pSupplier":

               return $scope.ItemList[Index].pSupplier != null ? $scope.ItemList[Index].pSupplier : "";
               break;
            case "pPart":

                return $scope.ItemList[Index].pPart != null ? $scope.ItemList[Index].pPart : "";
                break;
           case "iOrgName":
               return $scope.ItemList[Index].iOrgName;
                break;
            case "pDescription":
                return $scope.ItemList[Index].pDescription != null ? $scope.ItemList[Index].pDescription : "";

                break;
            case "uomUOM":
                return $scope.ItemList[Index].uomUOM != null ? $scope.ItemList[Index].uomUOM : "";
                break;
           case "ItemDefaultLocationGroup":
               return $scope.ItemList[Index].ItemDefaultLocationGroup != null ? $scope.ItemList[Index].ItemDefaultLocationGroup : "";
                break;
            case "lLoc":
                return $scope.ItemList[Index].lLoc != null ? $scope.ItemList[Index].lLoc : "";
                break;
           case "ItemDefaultLocation":
               return $scope.ItemList[Index].ItemDefaultLocation != null ? $scope.ItemList[Index].ItemDefaultLocation : "";
                break;

           case "ItemDefaultUOM":
               return $scope.ItemList[Index].ItemDefaultUOM != null ? $scope.ItemList[Index].ItemDefaultUOM : "";
                break;

           case "pDefaultCost":
               return $scope.ItemList[Index].pDefaultCost != null ? ChangeIntoNumberFormat($scope.ItemList[Index].pDefaultCost) : "";
                break;
            case "iUnitNumber1":
                return $scope.ItemList[Index].iUnitNumber1 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].iUnitNumber1) : "";
                break;
           
            case "string_1":
                return $scope.ItemList[Index].string_1 != null ? $scope.ItemList[Index].string_1 : "";
                break;
            case "string_2":
                return $scope.ItemList[Index].string_2 != null ? $scope.ItemList[Index].string_2 : "";
                break;
            case "string_3":
                return $scope.ItemList[Index].string_3 != null ? $scope.ItemList[Index].string_3 : "";
                break;
            case "string_4":
                return $scope.ItemList[Index].string_4 != null ? $scope.ItemList[Index].string_4 : "";
                break;
            case "string_5":
                return $scope.ItemList[Index].string_5 != null ? $scope.ItemList[Index].string_5 : "";
                break;
            case "string_6":
                return $scope.ItemList[Index].string_6 != null ? $scope.ItemList[Index].string_6 : "";
                break;
            case "string_7":
                return $scope.ItemList[Index].string_7 != null ? $scope.ItemList[Index].string_7 : "";
                break;
            case "string_8":
                return $scope.ItemList[Index].string_8 != null ? $scope.ItemList[Index].string_8 : "";
                break;
            case "string_9":
                return $scope.ItemList[Index].string_9 != null ? $scope.ItemList[Index].string_9 : "";
                break;
            case "string_10":
                return $scope.ItemList[Index].string_10 != null ? $scope.ItemList[Index].string_10 : "";
                break;

            case "string_11":
                return $scope.ItemList[Index].string_11 != null ? $scope.ItemList[Index].string_11 : "";
                break;
            case "string_12":
                return $scope.ItemList[Index].string_12 != null ? $scope.ItemList[Index].string_12 : "";
                break;
            case "string_13":
                return $scope.ItemList[Index].string_13 != null ? $scope.ItemList[Index].string_13 : "";
                break;
            case "string_14":
                return $scope.ItemList[Index].string_14 != null ? $scope.ItemList[Index].string_14 : "";
                break;
            case "string_15":
                return $scope.ItemList[Index].string_15 != null ? $scope.ItemList[Index].string_15 : "";
                break;
            case "string_16":
                return $scope.ItemList[Index].string_16 != null ? $scope.ItemList[Index].string_16 : "";
                break;
            case "string_17":
                return $scope.ItemList[Index].string_17 != null ? $scope.ItemList[Index].string_17 : "";
                break;
            case "string_18":
                return $scope.ItemList[Index].string_18 != null ? $scope.ItemList[Index].string_18 : "";
                break;
            case "string_19":
                return $scope.ItemList[Index].string_19 != null ? $scope.ItemList[Index].string_19 : "";
                break;
            case "string_20":
                return $scope.ItemList[Index].string_20 != null ? $scope.ItemList[Index].string_20 : "";
                break;
            case "string_21":
                return $scope.ItemList[Index].string_21 != null ? $scope.ItemList[Index].string_21 : "";
                break;
            case "string_22":
                return $scope.ItemList[Index].string_22 != null ? $scope.ItemList[Index].string_22 : "";
                break;
            case "string_23":
                return $scope.ItemList[Index].string_23 != null ? $scope.ItemList[Index].string_23 : "";
                break;
            case "string_24":
                return $scope.ItemList[Index].string_24 != null ? $scope.ItemList[Index].string_24 : "";
                break;






            case "number_1":
                return $scope.ItemList[Index].number_1 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_1) : "";
                break;
            case "number_2":
                return $scope.ItemList[Index].number_2 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_2) : "";
                break;
            case "number_3":
                return $scope.ItemList[Index].number_3 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_3) : "";
                break;
            case "number_4":
                return $scope.ItemList[Index].number_4 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_4) : "";
                break;
            case "number_5":
                return $scope.ItemList[Index].number_5 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_5) : "";
                break;
            case "number_6":
                return $scope.ItemList[Index].number_6 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_6) : "";
                break;
            case "number_7":
                return $scope.ItemList[Index].number_7 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_7) : "";
                break;
            case "number_8":
                return $scope.ItemList[Index].number_8 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_8) : "";
                break;
            case "number_9":
                return $scope.ItemList[Index].number_9 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_9) : "";
                break;
            case "number_10":
                return $scope.ItemList[Index].number_10 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_10) : "";
                break;

            case "number_11":
                return $scope.ItemList[Index].number_11 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_11) : "";
                break;
            case "number_12":
                return $scope.ItemList[Index].number_12 != null ? ChangeIntoNumberFormat($scope.ItemList[Index].number_12) : "";
                break;

           case "bool_1":
               if ($scope.ItemList[Index].bool_1 != null) {
                   for (var i = 0 ; $scope.CustomItemDataList.length ; i++) {
                       if ($scope.CustomItemDataList[i].cfdID == _ID) {
                           if ($scope.ItemList[Index].bool_1 == true) {
                               return $scope.CustomItemDataList[i].cfdTruelabel;
                           }
                           else {
                               return $scope.CustomItemDataList[i].cfdFalselabel;
                           }
                       }
                   }
               }
                //return $scope.ItemList[Index].bool_1 != null ? $scope.ItemList[Index].bool_1 : "";
                break;
           case "bool_2":
               if ($scope.ItemList[Index].bool_2 != null) {
                   for (var i = 0 ; $scope.CustomItemDataList.length ; i++) {
                       if ($scope.CustomItemDataList[i].cfdID == _ID) {
                           if ($scope.ItemList[Index].bool_2 == true) {
                               return $scope.CustomItemDataList[i].cfdTruelabel;
                           }
                           else {
                               return $scope.CustomItemDataList[i].cfdFalselabel;
                           }
                       }
                   }
               }
                //return $scope.ItemList[Index].bool_2 != null ? $scope.ItemList[Index].bool_2 : "";
                break;
           case "bool_3":
               if ($scope.ItemList[Index].bool_3 != null) {
                   for (var i = 0 ; $scope.CustomItemDataList.length ; i++) {
                       if ($scope.CustomItemDataList[i].cfdID == _ID) {
                           if ($scope.ItemList[Index].bool_3 == true) {
                               return $scope.CustomItemDataList[i].cfdTruelabel;
                           }
                           else {
                               return $scope.CustomItemDataList[i].cfdFalselabel;
                           }
                       }
                   }
               }
                //return $scope.ItemList[Index].bool_3 != null ? $scope.ItemList[Index].bool_3 : "";
                break;
           case "bool_4":
               if ($scope.ItemList[Index].bool_4 != null) {
                   for (var i = 0 ; $scope.CustomItemDataList.length ; i++) {
                       if ($scope.CustomItemDataList[i].cfdID == _ID) {
                           if ($scope.ItemList[Index].bool_4 == true) {
                               return $scope.CustomItemDataList[i].cfdTruelabel;
                           }
                           else {
                               return $scope.CustomItemDataList[i].cfdFalselabel;
                           }
                       }
                   }
               }
                //return $scope.ItemList[Index].bool_4 != null ? $scope.ItemList[Index].bool_4 : "";
                break;
           case "bool_5":
               if ($scope.ItemList[Index].bool_5 != null) {
                   for (var i = 0 ; $scope.CustomItemDataList.length ; i++) {
                       if ($scope.CustomItemDataList[i].cfdID == _ID) {
                           if ($scope.ItemList[Index].bool_5 == true) {
                               return $scope.CustomItemDataList[i].cfdTruelabel;
                           }
                           else {
                               return $scope.CustomItemDataList[i].cfdFalselabel;
                           }
                       }
                   }
               }
                //return $scope.ItemList[Index].bool_5 != null ? $scope.ItemList[Index].bool_5 : "";
                break;
           case "bool_6":
               if ($scope.ItemList[Index].bool_6 != null) {
                   for (var i = 0 ; $scope.CustomItemDataList.length ; i++) {
                       if ($scope.CustomItemDataList[i].cfdID == _ID) {
                           if ($scope.ItemList[Index].bool_6 == true) {
                               return $scope.CustomItemDataList[i].cfdTruelabel;
                           }
                           else {
                               return $scope.CustomItemDataList[i].cfdFalselabel;
                           }
                       }
                   }
               }
                //return $scope.ItemList[Index].bool_6 != null ? $scope.ItemList[Index].bool_6 : "";
                break;

            case "date_1":
                return $scope.ItemList[Index].date_1 != null ? $scope.ItemList[Index].date_1 : "";
                break;
            case "date_2":
                return $scope.ItemList[Index].date_2 != null ? $scope.ItemList[Index].date_2 : "";
                break;
            case "date_3":
                return $scope.ItemList[Index].date_3 != null ? $scope.ItemList[Index].date_3 : "";
                break;
            case "date_4":
                return $scope.ItemList[Index].date_4 != null ? $scope.ItemList[Index].date_4 : "";
                break;
            case "date_5":
                return $scope.ItemList[Index].date_5 != null ? $scope.ItemList[Index].date_5 : "";
                break;
            case "date_6":
                return $scope.ItemList[Index].date_6 != null ? $scope.ItemList[Index].date_6 : "";
                break;

        
            default:
                return "N/A";
        }
    }
   $scope.ShowHideDiv=function(id)
   {
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
       if (_isOpen)
       {
           $(_iconID).parent().css("margin-top", _currentPosition.toString() + "px");

       }
       else {
           setTimeout(function () {
               $(_iconID).parent().css("margin-top", "70px");

           }, 370);

       }
   }
    $scope.GetItemViews = function () {
        $scope.isDataLoading = false;
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
              success: function (response)
              {
                  if (response.GetAllViewsResult.Success == true) {
                      $scope.ItemViews = response.GetAllViewsResult.Payload;

                  }
                  else {
                      $scope.ShowErrorMessage("Getting Item reports", 1, 1, response.GetAllViewsResult.Message)

                  }
                  $scope.isDataLoading = true;
              $scope.$apply();
              },
              error: function (err) {
                  $scope.isDataLoading = true;
                  $scope.ShowErrorMessage("Getting Item reports", 2, 1, err.statusText);

                 $scope.$apply();

              }
          });

    }


    $scope.viewdetail = function(viewname) {
        $scope.isviewload = true;
        $scope.CurrentView = viewname;
        $scope.FilterArray = [];
        CheckScopeBeforeApply();
    }

    $scope.showview = function() {
        $scope.isviewload = false;
        $scope.CurrentView = { Name: "Items" };
    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.AssignCurrentView=function(view)
    {
        $scope.CurrentView = view;
        $scope.FilterArray = [{ ColumnName: "", FilterOperator: "", SearchValue: "" }];
        CheckScopeBeforeApply();
        $scope.GetItemsDataAccordingToView();
    }
    $scope.showfilter = function () {
        $("#filtermodal").modal("show")
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
        debugger;
        for (var i = 0; i < $scope.FilterArray.length ; i++) {
            if ($scope.FilterArray[i].ColumnName.includes("bool")) {
                $scope.FilterArray[i].FilterOperator = 'bool';
            }
        }

        console.log("Filter Array after changing the boolean operator");
        console.log($scope.FilterArray);
    }










    $scope.GetItemsDataAccordingToView=function()
    {
        
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $("#filtermodal").modal('hide');

        if ($scope.CurrentView != undefined) {


            if ($scope.FilterData.SearchValue != undefined && $.trim($scope.FilterData.SearchValue) != "")
            {

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
            $scope.isDataLoading = false;

            for (var i = 0 ; i < $scope.FilterArray.length ; i++) {
                if ($scope.FilterArray[i].FilterOperator == "Empty") {
                    if ($scope.clearAllFilter != true) {
                        $scope.FilterArray[i].SearchValue = "NULL";

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
                  url: serviceBase + 'GetAllItems',
                  data: JSON.stringify({ ClearFilter: $scope.clearAllFilter, SecurityToken: $scope.SecurityToken, HasImage: $scope.HasImage, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: $scope.FilterArray, masterSearch: $scope.FilterData.SearchValue, PageSize: _PageSize, ViewID: $scope.CurrentView.GridLayoutID }),
                  contentType: 'application/json',
                  dataType: 'json',
                  success: function (response) {
                      $scope.isDataLoading = true;
                      $scope.isviewload = true;
                      $scope.clearAllFilter = false;
                      if (response.GetAllItemsResult.Success == true) {
                     
                      
                      _TotalRecordsCurrent = response.GetAllItemsResult.Payload[0].Data.length;
                      $scope.currentrecord = response.GetAllItemsResult.Payload[0].Data.length;
                      $scope.ItemList = response.GetAllItemsResult.Payload[0].Data;
                      $scope.totalrecords = response.GetAllItemsResult.Payload[0].TotalRercords;
                      $scope.Columns = response.GetAllItemsResult.Payload[0].Columns;
                      $scope.ActualTotalRecords = response.GetAllItemsResult.Payload[0].ActualTotalRecords;
                      //$scope.FilterArray = response.GetAllItemsResult.Payload[0].Filters;
                      ConvertToProperFilter(response.GetAllItemsResult.Payload[0].Filters);
                      CheckScopeBeforeApply();

                      ChangeBooleanOperator();

                          //FillFilterArray();

                      UpdateFilterArray();

                      }
                      else {
                          $scope.ShowErrorMessage("Item Data", 1, 1, response.GetAllItemsResult.Message)

                      }

                  },
                  error: function (err) {
                      console.log(err);
                      $scope.ShowErrorMessage("Item Data", 2, 1, err.statusText);

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

    $scope.IsAvailableColumn=function(column)
    {
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
        $scope.GetItemsDataAccordingToView()

    }

    $scope.Quantitylabel = "Quantity";
    $scope.Locationlabel = "Location";
    $scope.UOMlabel = "UOM";

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


                  debugger;



                  if (response.GetMyInventoryColumnsResult.Success == true) {



                      var _TempArrayDummy = response.GetMyInventoryColumnsResult.Payload;

                      for (var i = 0; i < _TempArrayDummy.length; i++) {

                          if (_TempArrayDummy[i].ColumnName == "pPart") {
                              $scope.realItemname = _TempArrayDummy[i].ColumnLabel;
                          }

                          if (_TempArrayDummy[i].ColumnName == "pDescription") {
                              $scope.realDescname = _TempArrayDummy[i].ColumnLabel;
                          }
                          if (_TempArrayDummy[i].ColumnName == "iQty") {
                              $scope.Quantitylabel = _TempArrayDummy[i].ColumnLabel;
                          }

                          if (_TempArrayDummy[i].ColumnName == "lLoc") {
                              $scope.Locationlabel = _TempArrayDummy[i].ColumnLabel;
                          }

                          if (_TempArrayDummy[i].ColumnName == "uomUOM") {
                              $scope.UOMlabel = _TempArrayDummy[i].ColumnLabel;
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


    function init() {
        $scope.GetCustomDataField(0);
        $scope.getuom();
        $scope.GetItemViews();
        $scope.GetMyinventoryColumns();
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