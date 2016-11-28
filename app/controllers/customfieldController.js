'use strict';
app.controller('customfieldController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.CustomItemDataList = [];
    $scope.CustomActivityDataList = [];
    $scope.MyinventoryFields = [];
    $scope.UnitDataColumns = [];
    $scope.SearchString = "";
    $scope.IsLoading = false;
    $scope.LocalItemFieldsList = [];

    $scope.IsActivityOpen = false;
    $scope.IsItemOpen = false;
    $scope.IsUnitDataOpen = true;
    $scope.LocalCustomItemFieldsList = [];
    $scope.LocalCustomActivityFieldsList = [];
    function init() {
        FillLocalArray();
        $scope.GetAllData(true);
        $scope.getUnitDataColumns(true);
        CheckScopeBeforeApply();


    }

    $scope.Issearch = false;


    $scope.openClosePanel=function(Type)
    {
        switch (Type) {
            case 1:
                $scope.IsUnitDataOpen = !$scope.IsUnitDataOpen;
                $scope.IsItemOpen = false;
                $scope.IsActivityOpen = false;
                break;
            case 2:
                $scope.IsUnitDataOpen = false;
                $scope.IsActivityOpen = false;
                $scope.IsItemOpen = !$scope.IsItemOpen;
                break;
            case 3:
                $scope.IsUnitDataOpen = false;
                $scope.IsActivityOpen = !$scope.IsActivityOpen;
                $scope.IsItemOpen = false;
                break;
            default:

        }
        CheckScopeBeforeApply();
    }
    $scope.GetClass = function (index) {
        if (index == 0 || index == 1) {
            return "accent-color";
        }
        else if (index == 2 || index == 3) {
            return "btn-danger";
        }
        else if (index == 4) {
            return "btn-success";
        }
    }

    $scope.FilterDataColumns=function()
    {
        if(IsItemOpen==true)
        {
          

        }
        if(IsActivityOpen==true)
        {

        }
        if(IsUnitDataOpen==true)
        {

        }
    }

    $scope.ClearFilter=function()
    {
    
        $scope.SearchString = "";
        CheckScopeBeforeApply();
    }

    $scope.searchData = function (item) {
        debugger;
        if (!$scope.SearchString || (item.ColumnLabel.toLowerCase().indexOf($scope.SearchString) != -1) || (item.Show.toLowerCase().indexOf($scope.SearchString.toLowerCase()) != -1)) {
            return true;
        }
        return false;
    };

    $scope.searchData1 = function (item) {
        if (!$scope.SearchString || (item.Name.toLowerCase().indexOf($scope.SearchString) != -1) || (item.Datatype.toLowerCase().indexOf($scope.SearchString.toLowerCase()) != -1)) {
            return true;
        }
        return false;
    };

    function CheckCustomField(type, map) {
        var _returnVar = false;
        if (type == 1) {
            for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
                if ($scope.CustomItemDataList[i].ColumnMap == map) {
                    _returnVar = true;
                    return _returnVar;
                }
            }

            for (var i = 0; i < $scope.LocalItemFieldsList.length; i++) {
                if ($scope.LocalItemFieldsList[i].columnmap == map && $scope.LocalItemFieldsList[i].CustomFieldType == "Part") {
                    _returnVar = true;
                    return _returnVar;
                }
            }

            return _returnVar;
        }
        else if (type == 2) {
            for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
                if ($scope.CustomActivityDataList[i].ColumnMap == map) {
                    _returnVar = true;
                    return _returnVar;
                }
            }

            for (var i = 0; i < $scope.LocalItemFieldsList.length; i++) {
                if ($scope.LocalItemFieldsList[i].columnmap == map && $scope.LocalItemFieldsList[i].CustomFieldType == "Inventory") {
                    _returnVar = true;
                    return _returnVar;
                }
            }
            return _returnVar;
        }
    }

    function CheckCustomFieldAvailable(type, name) {
        var _returnVar = false;
        if (type == 1) {
            for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
                if ($scope.CustomItemDataList[i].cfdName.toLowerCase() == name.toLowerCase()) {
                    return $scope.CustomItemDataList[i];
                }
            }




        }
        else if (type == 2) {
            for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
                if ($scope.CustomActivityDataList[i].cfdName.toLowerCase() == name.toLowerCase()) {
                    return $scope.CustomActivityDataList[i];
                }
            }


        }
    }


    $scope.CheckCustomFieldAvailableinLocalArray=function(id) {
        var _returnVar = false;
     
            for (var i = 0; i < $scope.LocalItemFieldsList.length; i++) {
                if ($scope.LocalItemFieldsList[i].cfdid == id) {
                    return true;
                }
            }


            return _returnVar;

        
    }
    function GetColumnMap(Datatype, type) {
        var _length = 0;
        switch (Datatype) {
            case "string":
                _length = 24;
                break;
            case "number":
                _length = 12;
                break;

            default:

        }

        for (var i = 0; i < _length; i++) {
            var _num = i + 1;
            var _columnmap = Datatype + "_" + _num.toString();

            if (!CheckCustomField(type, _columnmap)) {
                return _columnmap;
            }


        }
    }

    function CheckIntoAvailableMyinventoryColumns(cmap) {
        for (var i = 0; i < $scope.MyinventoryFields.length; i++) {
            if ($scope.MyinventoryFields[i].ColumnName == cmap) {
                
                if ($scope.MyinventoryFields[i].mobileorder != 0) {
                    return true;
                }
                else { return false; }

            }

        }
    }

    function CheckIntoAvailableActivityColumns(cmap) {
        for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
            if ($scope.CustomActivityDataList[i].ColumnMap == cmap) {
                if ($scope.CustomActivityDataList[i].cfdmobileorder != 0) {
                    console.log(cmap);
                    return true;
                }
                else { return false; }

            }

        }
    }
    function updateLocalArray() {
       
        var _itemField = CheckCustomFieldAvailable(1, "Item Notes");
        if (_itemField != undefined) {
            $scope.LocalItemFieldsList[0].columnmap = _itemField.ColumnMap;
            $scope.LocalItemFieldsList[0].cfdid = _itemField.cfdID;
            $scope.LocalItemFieldsList[0].IsActive = CheckIntoAvailableMyinventoryColumns(_itemField.ColumnMap);


            $scope.LocalCustomItemFieldsList[0].columnmap = _itemField.ColumnMap;
            $scope.LocalCustomItemFieldsList[0].cfdid = _itemField.cfdID;
            $scope.LocalCustomItemFieldsList[0].IsActive = CheckIntoAvailableMyinventoryColumns(_itemField.ColumnMap);

            
            CheckScopeBeforeApply();
        }
        else {
            $scope.LocalItemFieldsList[0].columnmap = GetColumnMap("string", 1);
            $scope.LocalCustomItemFieldsList[0].columnmap = GetColumnMap("string", 1);
            CheckScopeBeforeApply();
        }

        var _ActivityField1 = CheckCustomFieldAvailable(2, "Activity Notes");
        if (_ActivityField1 != undefined) {
            $scope.LocalItemFieldsList[1].columnmap = _ActivityField1.ColumnMap;
            $scope.LocalItemFieldsList[1].cfdid = _ActivityField1.cfdID;
            $scope.LocalItemFieldsList[1].IsActive = CheckIntoAvailableActivityColumns(_ActivityField1.ColumnMap);


            $scope.LocalCustomActivityFieldsList[0].columnmap = _ActivityField1.ColumnMap;
            $scope.LocalCustomActivityFieldsList[0].cfdid = _ActivityField1.cfdID;
            $scope.LocalCustomActivityFieldsList[0].IsActive = CheckIntoAvailableActivityColumns(_ActivityField1.ColumnMap);

            
            CheckScopeBeforeApply();
        }
        else {
            $scope.LocalItemFieldsList[1].columnmap = GetColumnMap("string", 2);
            $scope.LocalCustomActivityFieldsList[0].columnmap = GetColumnMap("string", 2);
            CheckScopeBeforeApply();
        }


        var _ActivityField2 = CheckCustomFieldAvailable(2, "Sale Price");
        if (_ActivityField2 != undefined) {
            $scope.LocalItemFieldsList[2].columnmap = _ActivityField2.ColumnMap;
            $scope.LocalItemFieldsList[2].cfdid = _ActivityField2.cfdID;
            $scope.LocalItemFieldsList[2].IsActive = CheckIntoAvailableActivityColumns(_ActivityField2.ColumnMap);


            $scope.LocalCustomActivityFieldsList[1].columnmap = _ActivityField2.ColumnMap;
            $scope.LocalCustomActivityFieldsList[1].cfdid = _ActivityField2.cfdID;
            $scope.LocalCustomActivityFieldsList[1].IsActive = CheckIntoAvailableActivityColumns(_ActivityField2.ColumnMap);
            CheckScopeBeforeApply();
        }
        else {
            $scope.LocalItemFieldsList[2].columnmap = GetColumnMap("number", 2);
            $scope.LocalCustomActivityFieldsList[1].columnmap = GetColumnMap("number", 2);
            CheckScopeBeforeApply();
        }


        var _ActivityField3 = CheckCustomFieldAvailable(2, "Invoice #");
        if (_ActivityField3 != undefined) {
            $scope.LocalItemFieldsList[3].columnmap = _ActivityField3.ColumnMap;
            $scope.LocalItemFieldsList[3].cfdid = _ActivityField3.cfdID;
            $scope.LocalItemFieldsList[3].IsActive = CheckIntoAvailableActivityColumns(_ActivityField3.ColumnMap);


            $scope.LocalCustomActivityFieldsList[2].columnmap = _ActivityField3.ColumnMap;
            $scope.LocalCustomActivityFieldsList[2].cfdid = _ActivityField3.cfdID;
            $scope.LocalCustomActivityFieldsList[2].IsActive = CheckIntoAvailableActivityColumns(_ActivityField3.ColumnMap);
            CheckScopeBeforeApply();
        }
        else {
            $scope.LocalItemFieldsList[3].columnmap = GetColumnMap("string", 2);
            $scope.LocalCustomActivityFieldsList[2].columnmap = GetColumnMap("string", 2);
            CheckScopeBeforeApply();
        }
        var _ActivityField4 = CheckCustomFieldAvailable(2, "PO #");
        if (_ActivityField4 != undefined) {
            $scope.LocalItemFieldsList[4].columnmap = _ActivityField4.ColumnMap;
            $scope.LocalItemFieldsList[4].cfdid = _ActivityField4.cfdID;
            $scope.LocalItemFieldsList[4].IsActive = CheckIntoAvailableActivityColumns(_ActivityField4.ColumnMap);

            $scope.LocalCustomActivityFieldsList[3].columnmap = _ActivityField4.ColumnMap;
            $scope.LocalCustomActivityFieldsList[3].cfdid = _ActivityField4.cfdID;
            $scope.LocalCustomActivityFieldsList[3].IsActive = CheckIntoAvailableActivityColumns(_ActivityField4.ColumnMap);
            CheckScopeBeforeApply();
        }
        else {
            $scope.LocalItemFieldsList[4].columnmap = GetColumnMap("string", 2);
            $scope.LocalCustomActivityFieldsList[3].columnmap = GetColumnMap("string", 2);
            CheckScopeBeforeApply();
        }


        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            var _obj = $scope.CustomItemDataList[i];
            if ($scope.CheckCustomFieldAvailableinLocalArray(_obj.cfdID) == false) {


                $scope.LocalCustomItemFieldsList.push({ IsActive: CheckIntoAvailableMyinventoryColumns(_obj.ColumnMap), Name: _obj.cfdName, Datatype: _obj.cfdDataType, CustomFieldType: _obj.cfdCustomFieldType, columnmap: _obj.ColumnMap, description: "", mobileorder: 1, cfdid: _obj.cfdID, canincrease: false, candecrease: false, cantag: false, canconvert: false, canupdate: false, canmove: false })
            }
        }

        CheckScopeBeforeApply();


        for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
            var _obj = $scope.CustomActivityDataList[i];
            if ($scope.CheckCustomFieldAvailableinLocalArray(_obj.cfdID) == false) {
                $scope.LocalCustomActivityFieldsList.push({ IsActive: _obj.cfdmobileorder == 0 ? false : true, Name: _obj.cfdName, Datatype: _obj.cfdDataType, CustomFieldType: _obj.cfdCustomFieldType, columnmap: _obj.ColumnMap, description: "", mobileorder: _obj.cfdmobileorder, cfdid: _obj.cfdID, canincrease: _obj.cfdIncludeOnAdd, candecrease: _obj.cfdIncludeOnSubtract, cantag: _obj.cfdIncludeOnApply, canconvert: _obj.cfdIncludeOnConvert, canupdate: _obj.cfdIncludeOnApply, canmove: _obj.cfdIncludeOnMove })
            }
        }

        CheckScopeBeforeApply();

    }

    function FillLocalArray() {
        $scope.LocalItemFieldsList.push({ IsActive: false, Name: "Item Notes", Datatype: "String", CustomFieldType: "Part", columnmap: "string_1", description: "This is item note field", mobileorder: 1, cfdid: 0, canincrease: false, candecrease: false, cantag: false, canconvert: false, canupdate: false, canmove: false });
        $scope.LocalCustomItemFieldsList.push({ IsActive: false, Name: "Item Notes", Datatype: "String", CustomFieldType: "Part", columnmap: "string_1", description: "This is item note field", mobileorder: 1, cfdid: 0, canincrease: false, candecrease: false, cantag: false, canconvert: false, canupdate: false, canmove: false });

        $scope.LocalItemFieldsList.push({ IsActive: false, Name: "Activity Notes", Datatype: "String", CustomFieldType: "Inventory", columnmap: "string_1", description: "This is activity note field", mobileorder: 1, cfdid: 0, canincrease: true, candecrease: true, cantag: true, canconvert: true, canupdate: true, canmove: true });
        $scope.LocalItemFieldsList.push({ IsActive: false, Name: "Sale Price", Datatype: "Number", CustomFieldType: "Inventory", columnmap: "number_1", description: "This is sale price field", mobileorder: 1, cfdid: 0, canincrease: false, candecrease: true, cantag: false, canconvert: false, canupdate: false, canmove: false });
        $scope.LocalItemFieldsList.push({ IsActive: false, Name: "Invoice #", Datatype: "String", CustomFieldType: "Inventory", columnmap: "string_2", description: "This is invoice# field", mobileorder: 1, cfdid: 0, canincrease: false, candecrease: true, cantag: false, canconvert: false, canupdate: false, canmove: false });
        $scope.LocalItemFieldsList.push({ IsActive: false, Name: "PO #", Datatype: "String", CustomFieldType: "Inventory", columnmap: "string_3", description: "This is invoice# field", mobileorder: 1, cfdid: 0, canincrease: true, candecrease: false, cantag: false, canconvert: false, canupdate: false, canmove: false });

        $scope.LocalCustomActivityFieldsList.push({ IsActive: false, Name: "Activity Notes", Datatype: "String", CustomFieldType: "Inventory", columnmap: "string_1", description: "This is activity note field", mobileorder: 1, cfdid: 0, canincrease: true, candecrease: true, cantag: true, canconvert: true, canupdate: true, canmove: true });
        $scope.LocalCustomActivityFieldsList.push({ IsActive: false, Name: "Sale Price", Datatype: "Number", CustomFieldType: "Inventory", columnmap: "number_1", description: "This is sale price field", mobileorder: 1, cfdid: 0, canincrease: false, candecrease: true, cantag: false, canconvert: false, canupdate: false, canmove: false });
        $scope.LocalCustomActivityFieldsList.push({ IsActive: false, Name: "Invoice #", Datatype: "String", CustomFieldType: "Inventory", columnmap: "string_2", description: "This is invoice# field", mobileorder: 1, cfdid: 0, canincrease: false, candecrease: true, cantag: false, canconvert: false, canupdate: false, canmove: false });
        $scope.LocalCustomActivityFieldsList.push({ IsActive: false, Name: "PO #", Datatype: "String", CustomFieldType: "Inventory", columnmap: "string_3", description: "This is invoice# field", mobileorder: 1, cfdid: 0, canincrease: true, candecrease: false, cantag: false, canconvert: false, canupdate: false, canmove: false });
        CheckScopeBeforeApply();
    }




  

    $scope.UpdateUnitData = function (TagID, IsActive) {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        ShowWaitingInv();
        
            $.ajax
         ({
             type: "POST",
             url: serviceBase + 'UpdateUnitDataColumn',
             contentType: 'application/json; charset=utf-8',
             dataType: 'json',
             data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "TagID": TagID, "IsActive": IsActive }),
             success: function (response) {
                 debugger;
                 HideWaitingInv();
                 if (response.UpdateUnitDataColumnResult.Success == true) {

                     setTimeout(function () {
                         ShowSuccess("Saved");
                     },1000)
                   
                     $scope.getUnitDataColumns(false);
                 }
                 else {
                     $scope.ShowErrorMessage("Getting unit data columns", 1, 1, response.UpdateUnitDataColumnResult.Message)

                 }



                 CheckScopeBeforeApply();
             },
             error: function (err) {
                 HideWaitingInv();
                 $scope.ShowErrorMessage("Getting unit data columns", 2, 1, err.statusText);


             }
         });


    }



    $scope.UpdateCustomField = function (Obj) {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var _TempObj = angular.copy(Obj);
        _TempObj.mobileorder=1;
        var _toSendObj={
            CustomFieldType:_TempObj.CustomFieldType,
            Mobileorder:_TempObj.IsActive==false?0:_TempObj.mobileorder,
            ColumnMap:_TempObj.columnmap,
            cfdDataType:_TempObj.Datatype,
            Name:_TempObj.Name,
            Description: _TempObj.description,
            CanIncrease:_TempObj.canincrease,
            CanDecrease:_TempObj.candecrease,
            CanTag:_TempObj.cantag,
            CanConvert:_TempObj.canconvert,
            CanMove:_TempObj.canmove,
            CanUpdate:_TempObj.canupdate,
            cfdID:_TempObj.cfdid
        }

        ShowWaitingInv();
        $.ajax
     ({
         type: "POST",
         url: serviceBase + 'UpdateCustomColumn',
         contentType: 'application/json; charset=utf-8',
         dataType: 'json',
         data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Model": _toSendObj }),
         success: function (response) {
             debugger;
             HideWaitingInv();
             if (response.UpdateCustomColumnResult.Success == true) {
                 setTimeout(function () {
                     ShowSuccess("Saved");

                     // $scope.GetAllData(false);

                 },1000);
             }
             else {
                 $scope.ShowErrorMessage("Getting unit data columns", 1, 1, response.UpdateCustomColumnResult.Message)

             }
           

             CheckScopeBeforeApply();
         },
         error: function (err) {
             HideWaitingInv();
             $scope.ShowErrorMessage("Getting unit data columns", 2, 1, err.statusText);


         }
     });


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


    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.GoTo = function (url) {
        $location.path(url);
    }
    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }
    $scope.getUnitDataColumns = function (IsLoading) {
        $scope.IsLoading = IsLoading;


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetUnitDataColumns',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   $scope.UnitDataColumns = [];
                   if (response.GetUnitDataColumnsResult.Success == true) {
                       var _unitDataColumns = response.GetUnitDataColumnsResult.Payload;
                      
                       for (var i = 0; i < _unitDataColumns.length; i++) {
                          // if (_unitDataColumns[i].ColumnName == "ReqValue" || _unitDataColumns[i].ColumnName == "UniqueDate") {

                               $scope.UnitDataColumns.push(_unitDataColumns[i]);
                           //}
                       }

                   }
                   else {
                       $scope.ShowErrorMessage("Getting unit data columns", 1, 1, response.GetUnitDataColumnsResult.Message)

                   }


                   $scope.IsLoading = false;
                   CheckScopeBeforeApply();
                   console.log("unit Data columns");
                   console.log($scope.UnitDataColumns);
               },
               error: function (err) {
                   $scope.IsLoading = false;
                   CheckScopeBeforeApply();
                   $scope.ShowErrorMessage("Getting unit data columns", 2, 1, err.statusText);


               }
           });

    }


    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });

    $scope.showfilter = function () {
        $scope.Issearch = true;
        $scope.$apply();
    }

    $scope.hidefilter = function() {
        $scope.Issearch = false;
        $scope.$apply();
    }


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


    $scope.GetAllData = function (IsLoading) {
        $scope.IsLoading = IsLoading;

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
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ConsidermobileOrder": false }),
              success: function (response) {

                  if (response.GetAllDataResult.Success == true) {





                      var _TempArray = response.GetAllDataResult.Payload;

                      // MY inventory column region
                      var _TempArrayMyInventory = response.GetAllDataResult.Payload[0].MyInventoryColumns;
                      $scope.MyinventoryFields = [];
                      for (var i = 0; i < _TempArrayMyInventory.length; i++) {
                          //var _ColName = _TempArrayMyInventory[i].ColumnName.split("#");
                          //_TempArrayMyInventory[i].ColumnName = _ColName[0];
                          $scope.MyinventoryFields.push(_TempArrayMyInventory[i]);
                      }

                      CheckScopeBeforeApply();


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
                      }
                      CheckScopeBeforeApply();
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
                      }
                      $scope.IsLoading = false;

                      $scope.LocalItemFieldsList = [];

                      $scope.LocalCustomItemFieldsList = [];
                      $scope.LocalCustomActivityFieldsList = [];
                      CheckScopeBeforeApply();

                      FillLocalArray();
                      updateLocalArray();
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


    init();

    app.directive('customSwipe', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel) {
                    $(element).swipe({
                        swipe: function (event, direction, distance, duration, fingerCount) {
                            //This only fires when the user swipes left
                            debugger;
                            if (direction == "left" || direction == "right") {

                                setTimeout(function () {

                                    element.find("input").trigger("click");




                                }, 10)
                            }
                        },
                        threshold: 100
                    });
                }
            };
        }
    ]);



}]);