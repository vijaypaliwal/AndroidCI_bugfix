'use strict';
app.controller('indexController', ['$scope', 'localStorageService', 'authService', '$location', 'log', '$cordovaKeyboard', '$cordovaStatusbar', '$rootScope', function ($scope, localStorageService, authService, $location, log, $cordovaKeyboard, $cordovaStatusbar, $rootScope) {
    function checkurl() {
        var path = "activity";
        if ($location.path().substr(0, path.length) !== path) {
            // UpdateStatusBar(55);
        }
        else {
            console.log("into activity");
        }
    }


    $scope.restricted = function () {
        log.error("You are Not Authorize to access")
    }

    $scope.currentactiveaccount = function (AccountName) {
        localStorageService.set("ActivityCart", "");
        localStorageService.set("SelectedAction", "");
        localStorageService.set('AccountID', AccountName);
        $scope.CurrentAccount = localStorageService.get('AccountID');
        $scope.$apply();
    }

    $scope.Permission = [];
    $scope.Permission1 = [];
    $scope.Permission2 = [];
    $scope.Permission3 = [];
    $scope.Permission4 = [];

    $scope.IsActiveLocationLibrary = true;
    $scope.IsActiveStatusLibrary = true;
    $scope.IsActiveUOMLibrary = true;
    $scope.IsActiveItemLibrary = true;
    $scope.IsActiveItemGroupLibrary = true;

    $scope.CurrentAccount = localStorageService.get('AccountID');

    $scope.MonthlistGlobal = [];

    function GetMonthTextAndValue(Num, Type, Year) {
        var _monthValue = "";
        switch (Num) {
            case 1:
                _monthValue = Type == 1 ? "January " : "Jan, ";
                break;
            case 2:
                _monthValue = Type == 1 ? "February " : "Feb, ";
                break;
            case 3:
                _monthValue = Type == 1 ? "March " : "Mar, ";
                break;
            case 4:
                _monthValue = Type == 1 ? "April " : "Apr, ";
                break;
            case 5:
                _monthValue = Type == 1 ? "May " : "May, ";
                break;

            case 6:
                _monthValue = Type == 1 ? "June " : "Jun, ";
                break;
            case 7:
                _monthValue = Type == 1 ? "July " : "Jul, ";
                break;
            case 8:
                _monthValue = Type == 1 ? "August " : "Aug, ";
                break;
            case 9:
                _monthValue = Type == 1 ? "September " : "Sep, ";
                break;
            case 10:
                _monthValue = Type == 1 ? "October " : "Oct, ";
                break;

            case 11:
                _monthValue = Type == 1 ? "November " : "Nov, ";
                break;
            case 12:
                _monthValue = Type == 1 ? "December " : "Dec, ";
                break;
            default:

        }

        return _monthValue + Year;

    }
    function FillMonthlist() {
        $scope.MonthlistGlobal = [];
        var CurrentYear = new Date().getFullYear();

        $scope.MonthlistGlobal.push({ Text: "None", Value: "" });
        for (var i = CurrentYear - 10; i <= CurrentYear + 10; i++) {

            for (var j = 1; j <= 12; j++) {
                $scope.MonthlistGlobal.push({ Text: GetMonthTextAndValue(j, 1, i), Value: GetMonthTextAndValue(j, 2, i) })
            }

        }



    }

    $scope.CurrentUserKey = localStorageService.get('UserKey');
    $scope.GetDefaultQty = function () {
        var _DefaultQty = localStorageService.get('DefaultQty');

        if (_DefaultQty == "1" || _DefaultQty == 1) {
            return 1;
        }
        else {
            return "";
        }

    }
    $scope.GetPermission = function (Type, Key) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }


        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetUserPermissions',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Type": Type, "UserKey": Key }),
               success: function (response) {




                   if (response.GetUserPermissionsResult.Success == true) {

                       if (Type == 1) {

                           $scope.Permissions4 = response.GetUserPermissionsResult.Payload;


                       }
                       if (Type == 4) {

                           $scope.Permissions1 = response.GetUserPermissionsResult.Payload;


                       }

                       if (Type == 3) {

                           $scope.Permissions2 = response.GetUserPermissionsResult.Payload;

                       }

                       if (Type == 5) {

                           $scope.Permissions3 = response.GetUserPermissionsResult.Payload;

                       }
                   }
                   else {
                       //   $scope.ShowErrorMessage("Custom column's data", 1, 1, response.GetUserPermissionsResult.Message)

                   }




               },
               error: function (response) {


               },
               complete: function () {


               }
           });

    }

    $scope.locked = function () {
        log.error("This Library is locked");
    }


    $(document).on('blur', '.customnumbergroup input', function () {
        var _val = $(this).val();
        var _minD = $(this).attr("min");
        _minD = $.trim(_minD) != "" ? _minD : -1000;
        var _minVal = parseFloat(_minD);


        var _maxD = $(this).attr("max");
        _maxD = $.trim(_maxD) != "" ? _maxD : -1000;
        var _maxVal = parseFloat(_maxD);



        if ($.trim(_val) != "" && !isNaN(_val)) {

            if (_maxVal != -1000 && _maxVal < _val) {

                log.error("Exceeding maximum value " + _maxVal + ", Please fill lesser value than maximum value");
                $(this).val("");
                $(this).focus();
            }
            if (_minVal != -1000 && _minVal > _val) {

                log.error("Beneath the  minimum value " + _minVal + ", Please fill greater value than minimum value");
                $(this).val("");
                $(this).focus();
            }
        }


    });

    function initIndex() {


        $scope.IsActiveLocationLibrary = IsActiveLocationLibrary;
        $scope.IsActiveStatusLibrary = IsActiveStatusLibrary;
        $scope.IsActiveUOMLibrary = IsActiveUOMLibrary;
        $scope.IsActiveItemLibrary = IsActiveItemLibrary;
        $scope.IsActiveItemGroupLibrary = IsActiveItemGroupLibrary;
        $scope.GetProfileData();
        FillMonthlist();

    }
    function UpdateLockData(IsLocked, Type) {
        switch (Type) {
            case 1:
                $scope.IsActiveLocationLibrary = IsLocked;

                break;
            case 2:
                $scope.IsActiveStatusLibrary = IsLocked;

                break;
            case 3:
                $scope.IsActiveUOMLibrary = IsLocked;

                break;
            case 4:
                $scope.IsActiveItemGroupLibrary = IsLocked;

                break;
            default:

        }

        $scope.$apply();
    }
    $scope.LockOrUnlockLibrary = function (IsLocked, Type) {

        var _Heading = "";
        var _InnerText = "";
        switch (Type) {
            case 1:
                _Heading = "Lock location library ?";
                _InnerText = "Locking a library prevents all users from creating new locations or changing data about locations. Do you want to do this?";

                break;
            case 2:
                _Heading = "Lock Status library ?";
                _InnerText = "Locking a library prevents all users from creating new statuses or changing data about statuses. Do you want to do this?";
                break;
            case 3:
                _Heading = "Lock Unit Of measure library ?";
                _InnerText = "Locking a library prevents all users from creating new units of measure or changing data about Units of measure. Do you want to do this?";

                break;
            case 4:
                _Heading = "Lock Item Group library ?";
                _InnerText = "Locking a library prevents all users from creating new Item group or changing data about Item group. Do you want to do this?";

                break;
            default:

        }

        if (IsLocked == false) {

            var box = bootbox.confirm(_Heading, function (result) {
                if (result) {

                    UpdateLockData(IsLocked, Type);
                    $scope.UpdateLockLibrary();
                }
            });


            box.on("shown.bs.modal", function () {
                $(".mybootboxbody").html(_InnerText);

            });

        }
        else if (IsLocked == true) {
            UpdateLockData(IsLocked, Type);
            $scope.UpdateLockLibrary();
        }


        $('#bottommenumodal').modal('hide');

    }
    $scope.UpdateLockLibrary = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var _LockLibrary = localStorageService.get('LockLibrary');

        var _data = {
            "UserName": _LockLibrary.username, "FirstName": _LockLibrary.firstname, "LastName": _LockLibrary.lastname, "Email": _LockLibrary.email, "Phone": _LockLibrary.phone, "Organization": _LockLibrary.organization, "ProfilePic": _LockLibrary.myprofileimage
         , "IsActiveLocationLibrary": $scope.IsActiveLocationLibrary
        , "IsActiveStatusLibrary": $scope.IsActiveStatusLibrary
        , "IsActiveUOMLibrary": $scope.IsActiveUOMLibrary
            , "IsActiveItemGroupLibrary": $scope.IsActiveItemGroupLibrary
        };


        $.ajax({
            url: serviceBase + "UpdateUserInfo",
            type: 'POST',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "data": _data, "IsUserInfo": false }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {

                if (result.UpdateUserInfoResult.Success == true) {

                    ShowSuccess("Updated");
                    authService.GetuserInfo();

                    $scope.$apply();

                }
                else {
                    $scope.ShowErrorMessage("Updating user info", 3, 1, result.UpdateUserInfoResult.Message)

                }

            },
            error: function (err) {

                $scope.ShowErrorMessage("Updating user info", 2, 1, err.statusText);

                $scope.$apply();

            },
            complete: function () {
                $scope.$apply();
            }
        });

    }

    $scope.getactivepermission = function () {
        
        $scope.CurrentUserKey = localStorageService.get('UserKey');

        $scope.GetPermission(1, $scope.CurrentUserKey);

  
        setTimeout(function () {
            $scope.GetPermission(3, $scope.CurrentUserKey);
        }, 10);

        setTimeout(function () {
            $scope.GetPermission(4, $scope.CurrentUserKey);
        }, 10);

        setTimeout(function () {
            $scope.GetPermission(5, $scope.CurrentUserKey);
        }, 10);


        $scope.$apply();
        setTimeout(function () {

            $scope.Permission = [];
            for (var i = 0; i < $scope.Permissions1.length; i++) {
                $scope.Permission.push($scope.Permissions1[i]);
            }
            for (var i = 0; i < $scope.Permissions2.length; i++) {
                $scope.Permission.push($scope.Permissions2[i]);
            }
            for (var i = 0; i < $scope.Permissions3.length; i++) {
                $scope.Permission.push($scope.Permissions3[i]);
            }

            for (var i = 0; i < $scope.Permissions4.length; i++) {
                $scope.Permission.push($scope.Permissions4[i]);
            }


            $scope.$apply();

            console.log("Permissions list");
            console.log($scope.Permission);

        }, 500);

    }

    $scope.checkpermission = function (permissioncode) {
        for (var i = 0; i < $scope.Permission.length; i++) {
            if ($scope.Permission[i].PermissionCode == permissioncode) {

                return $scope.Permission[i].IsTurnedOn;

            }
        }

    }




    $scope.logOut = function () {
        localStorageService.set("ActivityCart", "");

        localStorageService.set("SelectedAction", "");

        authService.logOut();
        $("#modalerror").modal('hide');
        $("#Inventoryerror").modal('hide');
        $location.path('/login');
    }


    $scope.GetTrimmedString = function (id) {
        var _string = $(id).val();
        if (_string != null && _string != undefined) {
            _string = $.trim(_string);
        }

        return _string == "" ? true : false;
    }

    $scope.GetTrimmedStringData = function (_string) {
        if (_string != null && _string != undefined) {
            _string = $.trim(_string);
        }

        return _string;
    }

    $scope.ShowErrorMessage = function (Place, TextType, Type, Message) {
        var _returnError = ""
        if (Message != undefined && Message != null) {

        }
        else {
            Message = "";
        }
        switch (TextType) {
            case 1:
                _returnError = "Error occurred in fetching " + Place + " " + Message;
                break;
            case 2:
                _returnError = "Error in your requested data while getting " + Place + " " + Message;
                break;
            case 3:
                _returnError = "Error occurred during updating data " + Place + " " + Message;
                break;
            default:
                _returnError = "Error in your requested data while getting " + Place + " " + Message;
        }

        switch (Type) {
            case 1:
                // log.error(_returnError);
                break;
            case 2:
                log.warning(_returnError);
                break;
            default:

        }
    }
    $scope.ShowErrorMessageAccount = function (Place, TextType, Type, Message) {
        var _returnError = ""
        if (Message != undefined && Message != null) {

        }
        else {
            Message = "";
        }
        switch (TextType) {
            case 1:
                _returnError = "Error occurred in fetching " + Place + " " + Message;
                break;
            case 2:
                _returnError = "Error in your requested data while getting " + Place + " " + Message;
                break;
            case 3:
                _returnError = "Error occurred during updating data " + Place + " " + Message;
                break;
            default:
                _returnError = "Error in your requested data while getting " + Place + " " + Message;
        }

        switch (Type) {
            case 1:
               log.error(_returnError);
                break;
            case 2:
                log.warning(_returnError);
                break;
            default:

        }
    }
    //$.ajaxSetup({
    //    timeout: 1000 //Time in milliseconds
    //});

    $(document).ajaxError(function (event, jqxhr, settings, exception) {



        if (jqxhr.status != 200 && (jqxhr.readyState != 0 || jqxhr.status != 0)) {
            if (exception != "timeout") {

                $(".modal").modal("hide");
                HideGlobalWaitingDiv();

                var _path = $location.path();

                if (_path != "/login") {
                    $("#modalerror").modal('show');
                    $("#errortext").html(exception);
                }

            }
            else {
                alert("timeout error");
            }
        }
        else {
            if (exception == "timeout") {
                $("#modalerror").modal('show');
                $("#errortext").html("Slow Network error");
                //toastr.warning("slow network error we are retrying the request.")
                //$.ajax(settings);
            }
        }
    });


    $scope.reload = function () {

        window.location.reload();

    }

    $scope.errorbox = function (error) {




        var _path = $location.path();




        if (_path != "/login") {
            $("#modalerror").modal('show');
            $("#errortext").html(error)
        }




    }


    $scope.changepage = function () {
        setTimeout(
        function () {
            $scope.getactivepermission();
        }, 500
        )
    }


    $scope.$on('$locationChangeStart', function (event) {



        var _path = $location.path();

        $cordovaKeyboard.hideAccessoryBar(false);


        if (_path == "/inventory") {
            $scope.changepage();
            $cordovaKeyboard.disableScroll(true);
        }
        else {
            $scope.changepage();
            $cordovaKeyboard.disableScroll(false);
        }

        if (_path == "/mobileorder") {
            $cordovaKeyboard.disableScroll(true);
        }
        else {
            UpdateStatusBar(55);
        }


        initIndex();

    });

    $scope.getClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }
    $scope.authentication = authService.authentication;

    $scope.GetProfileData = function () {

        debugger;
        authService.GetuserInfo();
        setTimeout(function () {
            $scope.UserInfoData = authService.UserInfo;
            if ($scope.UserInfoData != null && $scope.UserInfoData != undefined) {

                $scope.username = $scope.UserInfoData.username;
                $scope.myprofileimage = $scope.UserInfoData.myprofileimage;
                $scope.ProfilePicURl = $scope.UserInfoData.picURl;
                $scope.$apply();
            }
        }, 1000)

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
    $scope.Validation = function (value, type) {
        switch (type) {
            case 1:
                value = TryParseInt(value, -9890);
                if (value != -9890 && typeof (value) === "number") {
                    return true;
                }
                else { return false; }
                break;
            case 2:
                if (typeof (value) === "boolean") {
                    return true;
                }
                else { return true; }
                break;
            case 3:
                if (typeof (value) === "date") {
                    return true;
                }
                else { return true; }
                break;
            default:

        }
    }



    $scope.UploadImage = function (txnID, ImageList, pID) {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        //  log.info("Image upload processing started at backend side, please be patient .")
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'UploadImage',
              contentType: 'application/json; charset=utf-8',
              dataType: 'text json',
              async: true,
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ImageList": ImageList, "txnID": txnID, "pID": pID }),
              success: function (response) {
                  if (response.UploadImageResult.Success == true) {

                      log.success("Image has been uploaded success fully for last inventory record.");
                      var _path = $location.path();
                      if (_path == "/inventory") {
                          $scope.GetInventories();
                      }

                      CheckScopeBeforeApply();
                  }
                  else {

                      $scope.ShowErrorMessage("Upload image", 1, 1, response.UploadImageResult.Message)
                  }

              },
              error: function (err, textStatus, errorThrown) {
                  if (err.readyState == 0 || err.status == 0) {

                  }
                  else {
                      if (textStatus != "timeout") {
                          if (err.status == 200) {
                              log.success("Image has been uploaded success fully for last inventory record.");
                              var _path = $location.path();
                              if (_path == "/inventory") {
                                  $scope.GetInventories();
                              }

                          }
                          else {
                              log.error(err.statusText);

                          }
                      }
                  }
              }
          });

    }
    $scope.SaveImages = function (txnID, ImageList) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        log.info("Image upload processing started at backend side, please be patient .")
        $.ajax
         ({
             type: "POST",
             url: serviceBase + 'UploadImage',
             contentType: 'application/json; charset=utf-8',

             dataType: 'json',
             data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ImageList": ImageList, "txnID": txnID }),
             success: function (response) {
                 if (response.UploadImageResult.Success == true) {

                     log.success("Image uploaded successfully please refresh grid to see the uploaded image.")

                 }
                 else {
                     log.error(response.UploadImageResult.Message);
                 }



             },
             error: function (err) {

                 if (err.status == 200 || err.status == "200") {
                     log.success("Image uploaded successfully please refresh grid to see the uploaded image.")
                 }
                 else {
                     console.log(err);
                     log.error("Error Occurred during operation");
                 }



             }
         });
    }

    if (_Islive) {
        checkurl();

    }


    $scope.UpdateSecurityTokenGlobal = function () {
        $scope.userName = "";
        var _path = $location.path();
        var AccountID = localStorageService.get('AccountDBID');
        if (_path != "/login" && $.trim(AccountID) != "") {

            var authData = localStorageService.get('lastlogindata');
            if (authData) {
                $scope.userName = authData.userName;
            }

            $.ajax({

                type: "POST",
                url: serviceBase + "UpdateSecurityTokenWithUserName",
                contentType: 'application/json; charset=utf-8',

                dataType: 'json',
                async: true,
                data: JSON.stringify({ "UserName": $scope.userName, "AccountID": AccountID }),
                error: function (err, textStatus) {


                    if (err.readyState == 0 || err.status == 0) {

                    }
                    else {


                        if (textStatus != "timeout") {


                            $scope.ShowErrorMessage("update security token", 2, 1, err.statusText);
                        }
                    }
                },

                success: function (data) {


                    if (data.UpdateSecurityTokenWithUserNameResult.Success == true) {


                        if (data.UpdateSecurityTokenWithUserNameResult != null && data.UpdateSecurityTokenWithUserNameResult.Payload != null) {
                            var _token = data.UpdateSecurityTokenWithUserNameResult.Payload;

                            localStorageService.set('authorizationData', { token: _token });




                        }
                    }
                    else {

                        $scope.ShowErrorMessage("update security token", 1, 1, data.UpdateSecurityTokenWithUserNameResult.Message);
                    }
                }
            });
        }
    }


    $scope.showinventories = function () {

        $("#Inventorylistmodal").modal("show");
    }


    $scope.$on("SendUp", function (evt, data) {
        $scope.MyInventories = data;
        console.log("Account List");
        console.log($scope.MyInventories);

    });

    $scope.$on("MyActiveAccount", function (evt, data) {
        $scope.currentInventoryname = data;
    });




    $scope.$on("MyInventorycolor", function (evt, data) {

        $("#toolbar").attr('style', 'background-color: ' + data + ' !important');

        $(".primary-color").attr('style', 'background-color: ' + data + ' !important');



        $("<style/>", { text: ".title-header {background-color: " + data + "}" }).appendTo('head');


        $("<style/>", { text: ".bluearea {background-color: " + data + ' !important' + "}" }).appendTo('head');

        $scope.currentcolor = data;

    });










    $scope.changeInventory = function (AccountID, AccountName, Inventorycolor) {

        var authData = localStorageService.get('authorizationData');

        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "UpdateSecurityToken",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "AccountID": AccountID }),
            error: function (err, textStatus) {
                $scope.UOMSearching = false;
                debugger;
                $scope.IsLoading = false;

                if (err.readyState == 0 || err.status == 0) {

                }
                else {


                    if (textStatus != "timeout") {


                        $scope.ShowErrorMessage("update security token", 2, 1, err.statusText);
                    }
                }
            },

            success: function (data) {






                if (data.UpdateSecurityTokenResult.Success == true) {

                    if (data.UpdateSecurityTokenResult != null && data.UpdateSecurityTokenResult.Payload != null) {
                        var _token = data.UpdateSecurityTokenResult.Payload;

                        localStorageService.set('authorizationData', { token: _token });
                        $scope.CurrentAccount = AccountName;

                        $scope.currentactiveaccount(AccountName);
                        localStorageService.set('AccountID', AccountName);
                        $scope.GetProfileData();

                        $scope.IsLoading = false;

                        $scope.getactivepermission();

                        $scope.currentInventoryname = AccountName;

                        debugger;

                        $("#toolbar").attr('style', 'background-color: ' + Inventorycolor + ' !important');



                        $("<style/>", { text: ".title-header {background-color: " + Inventorycolor + "}" }).appendTo('head');

                        $(".primary-color").attr('style', 'background-color: ' + Inventorycolor + ' !important');

                        $("<style/>", { text: ".bluearea {background-color: " + Inventorycolor + ' !important' + "}" }).appendTo('head');

                        $("#Inventorylistmodal").modal('hide');

                   

                        $location.path("/permission");
                        localStorageService.set('InventoryColor', Inventorycolor);
                        setTimeout(function () {


                            $location.path("/FindItems");

                        }, 300);




                        $scope.$apply();



                    }
                }
                else {
                    $scope.IsLoading = false;
                    $scope.$apply();
                    $scope.ShowErrorMessageAccount("update security token", 1, 1, data.UpdateSecurityTokenResult.Message);
                }
            }
        });

    }



    //setInterval("UpdateToken", 10000);

    setInterval(function () {
        $scope.UpdateSecurityTokenGlobal();
    }, 2400000);

    document.addEventListener('resume', function () {
        //   alert('resume event. resumeType=' + cordova.backgroundapp.resumeType);
        if (cordova.backgroundapp.resumeType == 'normal') {
            $scope.UpdateSecurityTokenGlobal();
        }
    });

    initIndex();

}]);


app.directive('ngModel', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs, ctrl) {

                    //ctrl.$pristine = false;



                    scope.$watch(attrs.ngModel, function (newValue, oldValue) {

                        if (!$(element).hasClass("unitDatePicker")) {

                            element.trigger("change");
                        }
                    });
                }
            };
        }
]);