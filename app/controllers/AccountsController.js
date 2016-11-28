'use strict';

app.controller('AccountsController', ['$scope', '$location', 'authService','localStorageService', 'ngAuthSettings', 'log', function ($scope, $location, authService,localStorageService, ngAuthSettings, log) {



 
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $scope.AccountsList = [];
    $scope.IsLoading = false;
    $scope.CurrentAccount = "";
    $scope.GetUserAccounts=function()
    {
        $scope.IsLoading = true;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "GetUserAccounts",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken}),
            error: function (err, textStatus, errorThrown) {
                $scope.IsLoading = false;
                if (err.readyState == 0 || err.status == 0)
                {

                }
                else {

                    if (textStatus != "timeout") {

                        $scope.ShowErrorMessage("Get user Accounts", 2, 1, err.statusText);
                    }
                }
            },

            success: function (data) {

                debugger;

                if (data.GetUserAccountsResult.Success == true) {

                    if (data.GetUserAccountsResult != null && data.GetUserAccountsResult.Payload != null) {
                        $scope.AccountsList = data.GetUserAccountsResult.Payload;
                    }
                }
                else {
                    $scope.ShowErrorMessage("Get user Accounts", 1, 1, data.GetUserAccountsResult.Message)


                }
                $scope.IsLoading = false;

                $scope.$apply();
            }
        });
    }
   

    $scope.CheckCurrentAccount=function(Account)
    {
        if($scope.CurrentAccount==Account)
        {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.getactivepermissionNew = function () {
        $scope.CurrentUserKey = localStorageService.get('UserKey');
        setTimeout(function () {
            $scope.GetPermission(3, $scope.CurrentUserKey);
        }, 10);
        setTimeout(function () {
            $scope.GetPermission(4, $scope.CurrentUserKey);
        }, 10);
        setTimeout(function () {
            $scope.GetPermission(5, $scope.CurrentUserKey);
        }, 10);

        setTimeout(function () {
            $scope.GetPermission(1, $scope.CurrentUserKey);
        }, 10);
        $scope.$apply();
        setTimeout(function () {

            $scope.Permission = [];

            if ($scope.Permissions1 != undefined && $scope.Permissions1.length > 0) {

                for (var i = 0; i < $scope.Permissions1.length; i++) {
                    $scope.Permission.push($scope.Permissions1[i]);
                }
            }
            if ($scope.Permissions2 != undefined && $scope.Permissions2.length > 0) {
                for (var i = 0; i < $scope.Permissions2.length; i++) {
                    $scope.Permission.push($scope.Permissions2[i]);
                }
            }
            if ($scope.Permissions3 != undefined && $scope.Permissions3.length > 0) {
                for (var i = 0; i < $scope.Permissions3.length; i++) {
                    $scope.Permission.push($scope.Permissions3[i]);
                }
            }

            if ($scope.Permissions4 != undefined && $scope.Permissions4.length > 0) {
                for (var i = 0; i < $scope.Permissions4.length; i++) {
                    $scope.Permission.push($scope.Permissions4[i]);
                }
            }
            $scope.IsLoading = false;
            $location.path("/FindItems");
            $scope.$apply();
        }, 120);

    }
    $scope.UpdateSecurityToken = function (AccountID, AccountName) {

        $scope.IsLoading = true;

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
            error: function (err, textStatus, errorThrown) {
                $scope.UOMSearching = false;

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

                        localStorageService.set('authorizationData', { token: _token});
                        $scope.CurrentAccount = AccountName;

                        $scope.currentactiveaccount(AccountName);
                        localStorageService.set('AccountID', AccountName);

                       
                        
                        authService.GetuserInfo();
                        $scope.getactivepermissionNew();

                        $scope.$apply();



                    }
                }
                else {
                    $scope.IsLoading = false;
                    $scope.ShowErrorMessage("update security token", 1, 1, data.UpdateSecurityTokenResult.Message)


                }



            }
        });
    }
    function init()
    {
        var _accountID = localStorageService.get('AccountID');
        
        if (_accountID != null && _accountID != undefined)
        {
              $scope.CurrentAccount=_accountID;
        }

        $scope.GetUserAccounts();

    }

    init();  
   

}]);
