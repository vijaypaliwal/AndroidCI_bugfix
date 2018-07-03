'use strict';

app.controller('AccountsController', ['$scope', '$location', 'authService', 'localStorageService', 'ngAuthSettings', 'log', '$rootScope', function ($scope, $location, authService, localStorageService, ngAuthSettings, log, $rootScope) {



 
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $scope.AccountsList = [];
    $scope.IsLoading = false;
    $scope.isSaving = false;
    $scope.CurrentAccount = "";
    $scope.Addinventory = false;
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



                    if (data.GetInventoryAccountsResult != null && data.GetInventoryAccountsResult.Payload != null) {
                        $scope.AccountsList = data.GetInventoryAccountsResult.Payload;

                        $scope.OwnedInventoryCount = $scope.AccountsList[0].CurrentUserOwnedInventoryCount;
                        $scope.StripeSubscription = $scope.AccountsList[0].CurrentUserStripeSubscription;

                        if ($.trim($scope.StripeSubscription) != '' || $scope.OwnedInventoryCount == 0)
                        {
                            $scope.IsAddInventoryShown = true;
                        }

                        $scope.$emit("SendUp", $scope.AccountsList);

                    
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

   
   
   

    $scope.AddNewAccount=function()
    {
        $scope.Addinventory = true;
        $scope.$apply();
    }

    function ResetObject()
    {
        $scope.InventoryObj = { InventoryAccountName: "", InventoryAccountID: 0, PlanCode: "" }
    }

    $scope.OpenEditInventoryModal = function (_obj) {
        $scope.InventoryObj.InventoryAccountName = _obj.InventoryName;
        $scope.InventoryObj.InventoryAccountID = _obj.InventoryAccountID;
        $scope.Addinventory = true;
        $scope.$apply();
    }


    $scope.GetDisabledClass = function () {
        if($.trim($scope.InventoryObj.InventoryAccountName)=="")
        {
            return "disabled";
        }

        return "";
    }


    $scope.CloseInventory = function (InventoryAccountID) {
       var box = bootbox.confirm({
            message: "Are you sure you want to close this inventory ?",
            buttons: {
                confirm: {
                    label: 'Close Inventory',

                },
                cancel: {
                    label: 'Keep',
                }
            },
            callback: function (result) {
                if (result) {
                    $.ajax({

                        type: "POST",
                        url: serviceBase + "UpdateInventoryStatus",
                        contentType: 'application/json; charset=utf-8',

                        dataType: 'json',

                        data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "InventoryAccountID": InventoryAccountID }),
                        error: function (err) {
                        },

                        success: function (data) {

                            if (data.UpdateInventoryStatusResult.Success == true) {
                                log.success("Inventory Account status successfully updated");
                                $scope.GetUserAccounts();

                            }
                            else {
                                $scope.ShowErrorMessage("Get user Accounts", 1, 1, data.UpdateInventoryStatusResult.Message);

                            }

                            $scope.$apply();
                        }
                    });


                }
            }
        });

        box.on("shown.bs.modal", function () {
            $(".mybootboxbody").html("This operation is going to close this inventory. ");

        });
    }

    $scope.UpdateInventoryName = function () {
        $scope.IsLoading = true;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope.isSaving = true;
        $.ajax({

            type: "POST",
            url: serviceBase + "UpdateInventoryName",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Model": $scope.InventoryObj }),
            error: function (err) {
                $scope.isSaving = false;
            },

            success: function (data) {

                if (data.UpdateInventoryNameResult.Success == true) {
                    $scope.isSaving = false;
                    log.success("Inventory Account Name successfully updated");
                    $scope.CancelNewAccount();
                    $scope.$apply();
                    $scope.GetUserAccounts();

                }
                else {
                    $scope.ShowErrorMessage("Update Inventory Name", 1, 1, data.UpdateInventoryNameResult.Message);

                }
                $scope.isSaving = false;

                $scope.$apply();
            }
        });
    };

    $scope.CreateNewInventoryAccount = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope.isSaving = true;
        $.ajax({

            type: "POST",
            url: serviceBase + "CreateInventoryAccount",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Model": $scope.InventoryObj }),
            error: function (err) {
                $scope.isSaving = false;
            },

            success: function (data) {

                if (data.CreateInventoryAccountResult.Success == true) {
                    $scope.isSaving = false;
                    log.success("Inventory Account successfully created");
                    $scope.CancelNewAccount();
                    $scope.$apply();
                    $scope.GetUserAccounts();

                }
                else {
                    $scope.ShowErrorMessage("Update Inventory Name", 1, 1, data.CreateInventoryAccountResult.Message);

                }
                $scope.isSaving = false;

                $scope.$apply();
            }
        });
    }

    $scope.CancelNewAccount = function () {
        $scope.Addinventory = false;
        ResetObject();
        $scope.$apply();
    }

    $scope.CheckCurrentAccount = function (Account, AccountID) {
        if ($scope.CurrentAccount == Account) {

            localStorageService.set('AccountDBID', AccountID);
            return true;
        }
        else {
            return false;
        }
    };
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
