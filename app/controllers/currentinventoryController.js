'use strict';
app.controller('currentinventoryController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {

    //#region variable declaration
    $scope.CurrentView = { Name: "Current Inventory" };
    $scope.InventoryViews = [];
    $scope.InventoryList = [];
    $scope.CustomItemDataList = [];
    $scope.FilterData = {SearchValue:""};
    $scope.FilterArray = [{ ColumnName: "", FilterOperator: "", SearchValue: "" }];

    $scope.sortColumn = "iLastITID";
    $scope.loadingblock = false;
    $scope.sortDir = "DESC";
    $scope.isviewload = false;
    $scope.isDataLoading = true;
    $scope.Columns = [];

    $scope.HasImage = "";
    var _IsLazyLoadingUnderProgress = 0;
    var _PageSize = 30;
    var _sortColumn = "iLastITID";
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


            default:
                return "cn";
        }
    }

    // check whether the column is further calculated column or not
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

    // pull to refresh function 
    function onSwipeDown()
    {
        $('#mylist').on('swipedown', function () {

            if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
                if ($(window).scrollTop() < 500) {

                    $scope.loadingblock = true;

                    _IsLazyLoadingUnderProgress = 1;
                    CheckScopeBeforeApply();
                    $scope.GetInventoryDataAccordingToView();


                }
            }

        });
    }

    // on modal hidden
    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });


    // bottom menu modal 
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

    // clears filter array which is using by list 
    $scope.clearfilterArray = function () {
        for (var i = 0; i < $scope.FilterArray.length; i++) {
            $scope.FilterArray[i].SearchValue = "";
        }
        $scope.ClearImageFilter();
        $scope.FilterData.SearchValue = "";
        CheckScopeBeforeApply();
        $scope.GetInventoryDataAccordingToView();
    }

    $scope.clearfilter=function()
    {
        $scope.clearfilterArray();
      
      //  CheckScopeBeforeApply();
      //  $scope.GetInventoryDataAccordingToView();
    }

    // Get custom dropdown's column available data
    $scope.GetComboData=function(ColumnName)
    {
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ColumnName) {
                console.log($scope.CustomItemDataList[i].cfdComboValues);
                return $scope.CustomItemDataList[i].cfdComboValues;
            }

        }
        
    }

    // Get display label according to column name
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

    // Get data type according to column name
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

    // Update filter's array after getting from server side
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

    // fill filter's array
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

    // on scroll load function 
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
                        $scope.GetInventoryDataAccordingToView();
                    }
                    else {
                        // log.info("You have already loaded all data.")
                    }

                }
            }
        }



    });

    // text to number conversion
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

    // get custom data field's list according to type
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

    // get custom field according to given id
    $scope.GetCustomFieldByID = function (ID) {
        
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if($scope.CustomItemDataList[i].cfdID==ID)
            {
                return $scope.CustomItemDataList[i].ColumnMap;
            }

        }
    }

    // on body click filter modal open and close animation
    $("body").on("click", function (e) {

        if ($(e.target).hasClass('modal-backdrop')) {

            $('#filtermodal').removeClass('bounceInRight');

            $('#filtermodal').addClass('bounceOutRight');

            setTimeout(function () {

                $('#filtermodal').removeClass('bounceOutRight');

                $('#filtermodal').addClass('bounceInRight');

                $('#filtermodal').modal('hide');

            }, 500)
        }
    });


    // Get custom column name by map
    $scope.GetCustomFieldNameByMap = function (ID) {
        var _return = "N/A";
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ID) {
                return $scope.CustomItemDataList[i].cfdName;
            }

        }

        return _return;
    }

    // Get custom column name by ID
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

    // Get image path of operator
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

    // Get cell's data according to column name and index
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
               if ($scope.InventoryList[Index].CustomData != null && $scope.InventoryList[Index].CustomData != undefined)
                   for (var i = 0; i < $scope.InventoryList[Index].CustomData.length; i++) {
                       if( $scope.InventoryList[Index].CustomData[i].Key==_Tempcolumnname)
                       {
                           
                           _valueData = $scope.InventoryList[Index].CustomData[i].Value;
                           break;
                       }
               }
               return _valueData;
               break;
               
           case "iLastAction":
               return $scope.InventoryList[Index].iLastAction != null ? $scope.InventoryList[Index].iLastAction : "";
               break;
           case "pTargetQty":
               return $scope.InventoryList[Index].pTargetQty != null ? $scope.InventoryList[Index].pTargetQty : "";
               break;
           case "pReorderQty":
               return $scope.InventoryList[Index].pReorderQty != null ? $scope.InventoryList[Index].pReorderQty : "";
               break;
           case "ExtendedCost":

               return $scope.InventoryList[Index].ExtendedCost != null ? $scope.InventoryList[Index].ExtendedCost : "";
               break;
            case "pPart":

                return $scope.InventoryList[Index].pPart != null ? $scope.InventoryList[Index].pPart : "";
                break;
            case "iQty":
                return $scope.InventoryList[Index].iQty;
                break;
            case "pDescription":
                return $scope.InventoryList[Index].pDescription != null ? $scope.InventoryList[Index].pDescription : "";

                break;
            case "uomUOM":
                return $scope.InventoryList[Index].uomUOM != null ? $scope.InventoryList[Index].uomUOM : "";
                break;
            case "iUniqueDate":
                return $scope.InventoryList[Index].iUniqueDate != null ? $scope.InventoryList[Index].iUniqueDate : "";
                break;
            case "lLoc":
                return $scope.InventoryList[Index].lLoc != null ? $scope.InventoryList[Index].lLoc : "";
                break;
            case "lZone":
                return $scope.InventoryList[Index].lZone != null ? $scope.InventoryList[Index].lZone : "";
                break;

            case "iStatusValue":
                return $scope.InventoryList[Index].iStatusValue != null ? $scope.InventoryList[Index].iStatusValue : "";
                break;

            case "iUnitNumber2":
                return $scope.InventoryList[Index].iUnitNumber2 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].iUnitNumber2) : "";
                break;
            case "iUnitNumber1":
                return $scope.InventoryList[Index].iUnitNumber1 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].iUnitNumber1) : "";
                break;
            case "iUnitDate2":

                return $scope.InventoryList[Index].iUnitDate2 != null ? $scope.InventoryList[Index].iUnitDate2 : "";
                break;

            case "iCostPerUnit":
                return $scope.InventoryList[Index].AvgCostPerUnit != null ? $scope.InventoryList[Index].AvgCostPerUnit : "";

                break;
            case "iUnitTag3":
                return $scope.InventoryList[Index].iUnitTag3 != null ? $scope.InventoryList[Index].iUnitTag3 : "";
                break;
            case "iUnitTag2":
                return $scope.InventoryList[Index].iUnitTag2 != null ? $scope.InventoryList[Index].iUnitTag2 : "";
                break;

            case "HasConversion":
                return $scope.InventoryList[Index].HasConversion;
                break;

            case "string_1":
                return $scope.InventoryList[Index].string_1 != null ? $scope.InventoryList[Index].string_1 : "";
                break;
            case "string_2":
                return $scope.InventoryList[Index].string_2 != null ? $scope.InventoryList[Index].string_2 : "";
                break;
            case "string_3":
                return $scope.InventoryList[Index].string_3 != null ? $scope.InventoryList[Index].string_3 : "";
                break;
            case "string_4":
                return $scope.InventoryList[Index].string_4 != null ? $scope.InventoryList[Index].string_4 : "";
                break;
            case "string_5":
                return $scope.InventoryList[Index].string_5 != null ? $scope.InventoryList[Index].string_5 : "";
                break;
            case "string_6":
                return $scope.InventoryList[Index].string_6 != null ? $scope.InventoryList[Index].string_6 : "";
                break;
            case "string_7":
                return $scope.InventoryList[Index].string_7 != null ? $scope.InventoryList[Index].string_7 : "";
                break;
            case "string_8":
                return $scope.InventoryList[Index].string_8 != null ? $scope.InventoryList[Index].string_8 : "";
                break;
            case "string_9":
                return $scope.InventoryList[Index].string_9 != null ? $scope.InventoryList[Index].string_9 : "";
                break;
            case "string_10":
                return $scope.InventoryList[Index].string_10 != null ? $scope.InventoryList[Index].string_10 : "";
                break;

            case "string_11":
                return $scope.InventoryList[Index].string_11 != null ? $scope.InventoryList[Index].string_11 : "";
                break;
            case "string_12":
                return $scope.InventoryList[Index].string_12 != null ? $scope.InventoryList[Index].string_12 : "";
                break;
            case "string_13":
                return $scope.InventoryList[Index].string_13 != null ? $scope.InventoryList[Index].string_13 : "";
                break;
            case "string_14":
                return $scope.InventoryList[Index].string_14 != null ? $scope.InventoryList[Index].string_14 : "";
                break;
            case "string_15":
                return $scope.InventoryList[Index].string_15 != null ? $scope.InventoryList[Index].string_15 : "";
                break;
            case "string_16":
                return $scope.InventoryList[Index].string_16 != null ? $scope.InventoryList[Index].string_16 : "";
                break;
            case "string_17":
                return $scope.InventoryList[Index].string_17 != null ? $scope.InventoryList[Index].string_17 : "";
                break;
            case "string_18":
                return $scope.InventoryList[Index].string_18 != null ? $scope.InventoryList[Index].string_18 : "";
                break;
            case "string_19":
                return $scope.InventoryList[Index].string_19 != null ? $scope.InventoryList[Index].string_19 : "";
                break;
            case "string_20":
                return $scope.InventoryList[Index].string_20 != null ? $scope.InventoryList[Index].string_20 : "";
                break;
            case "string_21":
                return $scope.InventoryList[Index].string_21 != null ? $scope.InventoryList[Index].string_21 : "";
                break;
            case "string_22":
                return $scope.InventoryList[Index].string_22 != null ? $scope.InventoryList[Index].string_22 : "";
                break;
            case "string_23":
                return $scope.InventoryList[Index].string_23 != null ? $scope.InventoryList[Index].string_23 : "";
                break;
            case "string_24":
                return $scope.InventoryList[Index].string_24 != null ? $scope.InventoryList[Index].string_24 : "";
                break;






            case "number_1":
                return $scope.InventoryList[Index].number_1 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_1) : "";
                break;
            case "number_2":
                return $scope.InventoryList[Index].number_2 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_2) : "";
                break;
            case "number_3":
                return $scope.InventoryList[Index].number_3 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_3) : "";
                break;
            case "number_4":
                return $scope.InventoryList[Index].number_4 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_4) : "";
                break;
            case "number_5":
                return $scope.InventoryList[Index].number_5 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_5) : "";
                break;
            case "number_6":
                return $scope.InventoryList[Index].number_6 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_6) : "";
                break;
            case "number_7":
                return $scope.InventoryList[Index].number_7 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_7) : "";
                break;
            case "number_8":
                return $scope.InventoryList[Index].number_8 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_8) : "";
                break;
            case "number_9":
                return $scope.InventoryList[Index].number_9 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_9) : "";
                break;
            case "number_10":
                return $scope.InventoryList[Index].number_10 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_10) : "";
                break;

            case "number_11":
                return $scope.InventoryList[Index].number_11 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_11) : "";
                break;
            case "number_12":
                return $scope.InventoryList[Index].number_12 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_12) : "";
                break;

            case "bool_1":
                return $scope.InventoryList[Index].bool_1 != null ? $scope.InventoryList[Index].bool_1 : "";
                break;
            case "bool_2":
                return $scope.InventoryList[Index].bool_2 != null ? $scope.InventoryList[Index].bool_2 : "";
                break;
            case "bool_3":
                return $scope.InventoryList[Index].bool_3 != null ? $scope.InventoryList[Index].bool_3 : "";
                break;
            case "bool_4":
                return $scope.InventoryList[Index].bool_4 != null ? $scope.InventoryList[Index].bool_4 : "";
                break;
            case "bool_5":
                return $scope.InventoryList[Index].bool_5 != null ? $scope.InventoryList[Index].bool_5 : "";
                break;
            case "bool_6":
                return $scope.InventoryList[Index].bool_6 != null ? $scope.InventoryList[Index].bool_6 : "";
                break;

            case "date_1":
                return $scope.InventoryList[Index].date_1 != null ? $scope.InventoryList[Index].date_1 : "";
                break;
            case "date_2":
                return $scope.InventoryList[Index].date_2 != null ? $scope.InventoryList[Index].date_2 : "";
                break;
            case "date_3":
                return $scope.InventoryList[Index].date_3 != null ? $scope.InventoryList[Index].date_3 : "";
                break;
            case "date_4":
                return $scope.InventoryList[Index].date_4 != null ? $scope.InventoryList[Index].date_4 : "";
                break;
            case "date_5":
                return $scope.InventoryList[Index].date_5 != null ? $scope.InventoryList[Index].date_5 : "";
                break;
            case "date_6":
                return $scope.InventoryList[Index].date_6 != null ? $scope.InventoryList[Index].date_6 : "";
                break;

            case "pCountFrq":
                return $scope.InventoryList[Index].pCountFrq != null ? $scope.InventoryList[Index].pCountFrq : "";
                break;
            case "lZone":
                return $scope.InventoryList[Index].lZone != null ? $scope.InventoryList[Index].lZone : "";
                break;
            case "iReqValue":
                return $scope.InventoryList[Index].iReqValue != null ? $scope.InventoryList[Index].iReqValue : "";
                break;
            default:
                return "N/A";
        }
   }

    // show and hide more div
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

    // get inventory view's list
    $scope.GetInventoryViews = function () {
        $scope.isDataLoading = false;
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
                  debugger;

                  if (response.GetAllViewsResult.Success == true) {
                      $scope.InventoryViews = response.GetAllViewsResult.Payload;

                  }
                  else {
                      $scope.ShowErrorMessage("Getting current inventory reports", 1, 1, response.GetAllViewsResult.Message)

                  }
                  $scope.isDataLoading = true;
              $scope.$apply();
              },
              error: function (err) {
                  $scope.isDataLoading = true;
                  $scope.ShowErrorMessage("Getting current inventory reports", 2, 1, err.statusText);

                 $scope.$apply();

              }
          });

    }

    // get view detail
    $scope.viewdetail = function(viewname) {
        $scope.isviewload = true;
        $scope.CurrentView = viewname;
        $scope.FilterArray = [];
        CheckScopeBeforeApply();
    }

    // show view
    $scope.showview = function() {
        $scope.isviewload = false;
        $scope.CurrentView = { Name: "Current Inventory" };
    }

    // This is an angular function to check whether any scope is under progress before applying scope.
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    // This function assign selected view to load accordingly

    $scope.AssignCurrentView=function(view)
    {
        $scope.CurrentView = view;
        $scope.FilterArray = [{ ColumnName: "", FilterOperator: "", SearchValue: "" }];
        CheckScopeBeforeApply();
        $scope.GetInventoryDataAccordingToView();
    }

    
    $scope.showfilter = function () {
        $("#filtermodal").modal("show")
    }

    $scope.ClearImageFilter=function()
    {
        $scope.HasImage = "";

        CheckScopeBeforeApply();
    }


    // get data according to selected view 
    $scope.GetInventoryDataAccordingToView=function()
    {
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
            $.ajax
              ({
                  type: "POST",
                  url: serviceBase + 'GetCurrentInventoriesNew',
                  data: JSON.stringify({ SecurityToken: $scope.SecurityToken, HasImage:$scope.HasImage, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: $scope.FilterArray, SelectedCartIDs: [], masterSearch: $scope.FilterData.SearchValue, showImage: "True", showZeroRecords: "True", PageSize: _PageSize, IsDateColumnOn: false, ViewID: $scope.CurrentView.GridLayoutID }),
                  contentType: 'application/json',
                  dataType: 'json',
                  success: function (response) {
                      $scope.isDataLoading = true;
                      $scope.isviewload = true;

                      if (response.GetCurrentInventoriesNewResult.Success == true) {
                     
                      
                      _TotalRecordsCurrent = response.GetCurrentInventoriesNewResult.Payload[0].Data.length;
                      $scope.currentrecord = response.GetCurrentInventoriesNewResult.Payload[0].Data.length;
                      $scope.InventoryList = response.GetCurrentInventoriesNewResult.Payload[0].Data;
                      $scope.totalrecords = response.GetCurrentInventoriesNewResult.Payload[0].TotalRercords;
                      $scope.Columns = response.GetCurrentInventoriesNewResult.Payload[0].Columns;
                      $scope.ActualTotalRecords = response.GetCurrentInventoriesNewResult.Payload[0].ActualTotalRecords;
                      $scope.FilterArray = response.GetCurrentInventoriesNewResult.Payload[0].Filters;
                      CheckScopeBeforeApply();
                      // FillFilterArray();
                      UpdateFilterArray();

                      }
                      else {
                          $scope.ShowErrorMessage("Current Inventory Data", 1, 1, response.GetCurrentInventoriesNewResult.Message)

                      }

                  },
                  error: function (err) {
                      console.log(err);
                      $scope.ShowErrorMessage("Current Inventory Data", 2, 1, err.statusText);

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

    // whether the column is available or not according to columnid
    $scope.IsAvailableColumn=function(column)
    {
        for (var i = 0; i < $scope.Columns.length; i++) {
            if ($scope.Columns[i].ColumnID == column) {
                
                return true;
            }

        }
        return false;
    }

    // Gets unit of measure list
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

    // Gets status list
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

    // toggles sort direction
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

    // apply sorting according to selected column
    $scope.applysorting = function (sortby) {

        var _tempCol = _sortColumn;

        _sortColumn = sortby;
      
        if (_tempCol == _sortColumn) {
            _sortDir = ToggleSortDir(_sortDir);
            $scope.sortDir = _sortDir;

        }
        $scope.sortColumn = sortby;
        CheckScopeBeforeApply();
        $scope.GetInventoryDataAccordingToView()

    }

    function init() {
        $scope.getuom();
        $scope.getstatus();
        $scope.GetInventoryViews();
        $scope.GetCustomDataField(0);
        CheckScopeBeforeApply();
      
    
    }

    $scope.OpenImageModal = function (Object, Name) {
        $("#imagemodal").modal('show');
        $("#modalheader").find("h4").html(Name);
        $("#imagepreview").attr("src", Object);
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
