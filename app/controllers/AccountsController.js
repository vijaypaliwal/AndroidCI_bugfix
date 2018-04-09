'use strict';

app.controller('AccountsController', ['$scope', '$location', 'authService','localStorageService', 'ngAuthSettings', function ($scope, $location, authService,localStorageService, ngAuthSettings) {



 
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $scope.AccountsList = [];
    $scope.IsLoading = false;
    $scope.CurrentAccount = "";
    $scope.GetUserAccounts = function () {
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

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
            error: function (err) {
                $scope.IsLoading = false;
            },

            success: function (data) {

                if (data.GetUserAccountsResult.Success == true) {

                    if (data.GetUserAccountsResult != null && data.GetUserAccountsResult.Payload != null) {
                        $scope.AccountsList = data.GetUserAccountsResult.Payload;
                    }
                }
                else {
                    $scope.ShowErrorMessage("Get user Accounts", 1, 1, data.GetUserAccountsResult.Message);

                }
                $scope.IsLoading = false;

                $scope.$apply();
            }
        });
    };
   

    $scope.CheckCurrentAccount = function (Account, AccountID) {
        if ($scope.CurrentAccount == Account) {

            localStorageService.set('AccountDBID', AccountID);
            return true;
        }
        else {
            return false;
        }
    };
    $scope.UpdateSecurityToken = function (AccountID, AccountName) {

        $scope.IsLoading = true;

        var authData = localStorageService.get('authorizationData');
        localStorageService.set('AccountDBID', AccountID);
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
                debugger;

                if (data.UpdateSecurityTokenResult.Success == true) {

                    if (data.UpdateSecurityTokenResult != null && data.UpdateSecurityTokenResult.Payload != null) {
                        var _token = data.UpdateSecurityTokenResult.Payload;

                        localStorageService.set('authorizationData', { token: _token});
                        $scope.CurrentAccount = AccountName;

                        $scope.currentactiveaccount(AccountName);
                        localStorageService.set('AccountID', AccountName);
                        $scope.GetProfileData();

                        $scope.IsLoading = false;
       
                            $scope.getactivepermission();

                       
                     
                            $location.path("/FindItems");
            
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
