'use strict';
app.controller('loginController', ['$scope','localStorageService', '$location', 'authService', 'ngAuthSettings', function ($scope,localStorageService, $location, authService, ngAuthSettings) {

    $scope.loginData = {
        userName: "",
        password: "",
        account: "",
        useRefreshTokens: false
    };
 
    $scope.message = "";
    $scope.DefaultAccount = function () {


        $.ajax({

            type: "POST",
            url: serviceBase + "DefaultAccount",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            error: function (err, textStatus, errorThrown) {
                $scope.IsLoading = false;
                if (err.readyState == 0 || err.status == 0) {

                }
                else {

                    if (textStatus != "timeout") {

                        // $scope.ShowErrorMessage("Get default Accounts", 2, 1, err.statusText);
                    }
                }
            },

            success: function (data) {

                if (data.DefaultAccountResult.Success == true) {

                    if (data.DefaultAccountResult != null && data.DefaultAccountResult.Payload != null) {
                        var _data = data.DefaultAccountResult.Payload;
                        
                        
                    }
                }
                else {
                    //   $scope.ShowErrorMessage("Get user Accounts", 1, 1, data.GetUserAccountsResult.Message)


                }

             


                $scope.$apply();
            }
        });
    }

    $scope.InIt = function ()
    {
        var authLocalData = localStorageService.get('lastlogindata');

        console.log("auth local Data");
        console.log(authLocalData);
        if (authLocalData != null && authLocalData != undefined)
        {
            $scope.loginData.account = authLocalData.AccountName;
            $scope.loginData.userName = authLocalData.userName;
            $scope.loginData.password = authLocalData.Password;
        }

      //  $scope.DefaultAccount();
    }

    $scope.InIt();

    

    $scope.login = function ()
    {
        
        localStorageService.set("ActivityCart", "");

        localStorageService.set("SelectedAction", "");
        localStorageService.set("lastlogindata", "");


        authService.login($scope.loginData).then(function (response)
        {
           
            $scope.GetProfileData();

           
            $scope.getactivepermission();

            $scope.IsOwner = localStorageService.get('IsOwner');

       
            debugger;


         
           
            //$location.path('/FindItems');
            $location.path('/Accounts');
            
        },
         function (err) {
             $scope.message = err.error_description;
             playBeep();
         });
    };

   
}]);
