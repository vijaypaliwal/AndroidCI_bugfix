'use strict';
app.controller('permissionController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.CustomItemDataList = [];
    $scope.CustomActivityDataList = [];
    $scope.MyinventoryFields = [];
    $scope.UnitDataColumns = [];
    $scope.SearchString = "";
    $scope.IsLoading = false;
    $scope.LocalItemFieldsList = [];

    $scope.IsAdminopen = false;
    $scope.IsViewOpen = false;
    $scope.IsLibrarydataopen = true;
    $scope.IsGlobalopen = false;
    $scope.CurrentUser= $scope.CurrentAccount;

    $scope.LocalCustomItemFieldsList = [];
    $scope.LocalCustomActivityFieldsList = [];
    $scope.Permissions1 = [];
    $scope.Permissions2 = [];
    $scope.Permissions3 = [];

    $scope.showpermission = false;
    $scope.IsLoading = true;


    $scope.ManagePermission = function (userkey, Name)
    {
        $scope.showpermission = true;
        $scope.GetPermission(1, userkey);
        $scope.GetPermission(3,userkey);
        $scope.GetPermission(4, userkey);
        $scope.GetPermission(5, userkey);
        $scope.userkey = userkey;
        $scope.CurrentUser = Name;
        CheckScopeBeforeApply();
    }


    $scope.GetPermission=function(Type, Key)
    {
        $scope.IsLoading = true;
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
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Type": Type,"UserKey": Key}),
               success: function (response) {

                   if (response.GetUserPermissionsResult.Success == true) {
                       if (Type == 4) {

                           $scope.Permissions1 = response.GetUserPermissionsResult.Payload;
                       
                       }

                       if (Type == 1) {

                           $scope.Permissions4 = response.GetUserPermissionsResult.Payload;
                       }

                       if (Type == 3) {

                           $scope.Permissions2 = response.GetUserPermissionsResult.Payload;
                       }

                       if (Type == 5) {

                           $scope.Permissions3 = response.GetUserPermissionsResult.Payload;
                           $scope.IsLoading = false;
                       }
                   }
                   else {
                       $scope.ShowErrorMessage("Custom column's data", 1, 1, response.GetUserPermissionsResult.Message)

                   }


                   console.log($scope.Permissions1);

                   CheckScopeBeforeApply();
               },
               error: function (response) {
                   log.error(response.statusText);
                   $scope.ShowErrorMessage("Custom column's data", 2, 1, response.statusText);

                   //$scope.InventoryObject.Location = 678030;
               }
           });

    }

    $scope.UpdatePermission = function (Permissioncode, Type, Action) {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
        ({
         type: "POST",
         url: serviceBase + 'SaveUserPermissions',
         contentType: 'application/json; charset=utf-8',
         dataType: 'json',
         data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Type": Type, "UserKey": $scope.userkey, "PermissionCode": Permissioncode, "Action": Action }),
         success: function (response) {
             setTimeout(function () {
                 ShowSuccess("Saved");
             }, 100)

             $scope.getactivepermission();

         },
         error: function (err) {
          

         }
     });
    }


    $scope.showuserlist = function () {
        $scope.CurrentUser = $scope.CurrentAccount;
        $scope.showpermission = false;
        $scope.$apply();
    }



    $scope.GetAccountuser = function (Type) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetUserList',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                 
                   $scope.Userlist = response.GetUserListResult.Payload;

                   $scope.IsLoading = false;

                   CheckScopeBeforeApply();

               },
               error: function (response) {
                   $scope.IsLoading = false;
                  
               }
           });

    }


    $scope.Issearch = false;

    $scope.openClosePanel = function (Type) {
        switch (Type) {
            case 1:
                $scope.IsLibrarydataopen = !$scope.IsLibrarydataopen;
                $scope.IsViewOpen = false;
                $scope.IsAdminopen = false;
                $scope.IsGlobalopen = false;
                break;

            case 2:
                $scope.IsLibrarydataopen = false;
                $scope.IsAdminopen = false;
                $scope.IsViewOpen = !$scope.IsViewOpen;
                $scope.IsGlobalopen = false;
                break;

            case 3:
                $scope.IsLibrarydataopen = false;
                $scope.IsAdminopen = !$scope.IsAdminopen;
                $scope.IsViewOpen = false;
                $scope.IsGlobalopen = false;
                break;

            case 4:
                $scope.IsLibrarydataopen = false;
                $scope.IsAdminopen = false;
                $scope.IsGlobalopen = !$scope.IsGlobalopen;
                $scope.IsViewOpen = false;
                break;
            default:

        }
        CheckScopeBeforeApply();
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

            $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars');
        }
        else {
            $("#bottommenumodal").modal('show');
            $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');
        }
    }


    function init()
    {
        $scope.GetPermission(1);
        $scope.GetPermission(3);
        $scope.GetPermission(4);
        $scope.GetPermission(5);

        $scope.GetAccountuser();
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


                                }, 10);
                            }
                        },
                        threshold: 100
                    });
                }
            };
        }
    ]);



}]);