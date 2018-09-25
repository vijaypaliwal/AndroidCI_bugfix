'use strict';

app.controller('AccountsController', ['$scope', '$location', 'authService', 'localStorageService', 'ngAuthSettings', 'log', '$rootScope', function ($scope, $location, authService, localStorageService, ngAuthSettings, log, $rootScope) {



 
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $scope.AccountsList = [];
    $scope.IsLoading = false;
    $scope.isSaving = false;
    $scope.CurrentAccount = "";
    $scope.Addinventory = false;
    $scope.inventoryExists = true;
    $scope.otherInventoryExists = true;
    $scope.StripeSubscription = "";
    $scope.InventoryObj={InventoryAccountName:"",InventoryAccountID:0,PlanCode:""}
    $scope.OwnedInventoryCount = 0;
    $scope.IsAddInventoryShown = false;
    $scope.Addinventoryaccount = function () {
        $scope.Addinventory = true;
    }


    $scope.GetUserAccounts = function () {
        $scope.IsLoading = true;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "GetInventoryAccounts",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
            error: function (err) {
                $scope.IsLoading = false;
            },

            success: function (data) {

                if (data.GetInventoryAccountsResult.Success == true) {

                    if (data.GetInventoryAccountsResult.Payload.length != 0) {
                        $scope.inventoryExists = true;
                        if (data.GetInventoryAccountsResult != null && data.GetInventoryAccountsResult.Payload != null) {
                            $scope.AccountsList = data.GetInventoryAccountsResult.Payload;
                           
                            // Check for the existance of Other Inventory.
                            for (var i = 0; i < $scope.AccountsList.length; i++)
                            {
                                if ($scope.AccountsList[i].CurrentUserMasterAccountID != $scope.AccountsList[i].MasterAccountID) {
                                    $scope.otherInventoryExists = true; break;
                                }
                                else {
                                    $scope.otherInventoryExists = false;
                                }
                               
                            }

                            $scope.OwnedInventoryCount = $scope.AccountsList[0].CurrentUserOwnedInventoryCount;
                            $scope.StripeSubscription = $scope.AccountsList[0].CurrentUserStripeSubscription;

                            if ($.trim($scope.StripeSubscription) != '' || $scope.OwnedInventoryCount == 0) {
                                $scope.IsAddInventoryShown = true;
                            }

                            $scope.$emit("SendUp", $scope.AccountsList);


                        }
                    }
                    else {
                        //No inventory exists for that particular user.
                        $scope.inventoryExists = false;                        
                    }
                }
                else {
                    $scope.ShowErrorMessage("Get user Accounts", 1, 1, data.GetInventoryAccountsResult.Message);

                }
                $scope.IsLoading = false;

                $scope.$apply();
            }
        });
    };
   
    function ResetObject()
    {
        $scope.InventoryObj = { InventoryAccountName: "", InventoryAccountID: 0, PlanCode: "" }
    }

    $scope.GetDisabledClass = function () {
        if($.trim($scope.InventoryObj.InventoryAccountName)=="")
        {
            return "disabled";
        }

        return "";
    }

   

    $scope.UpdateSecurityToken = function (AccountID, AccountName, Inventorycolor) {

        $scope.IsLoading = true;

        var authData = localStorageService.get('authorizationData');
        localStorageService.set('AccountDBID', AccountID);

     

        $scope.$emit("MyActiveAccount", AccountName);

        $scope.$emit("MyInventorycolor", Inventorycolor);

        localStorageService.set('InventoryColor', Inventorycolor);
        


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
