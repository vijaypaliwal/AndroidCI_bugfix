'use strict';
app.controller('signupController', ['$scope','localStorageService', '$location', '$timeout', 'authService', 'log', function ($scope,localStorageService, $location, $timeout, authService, log) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.loginData = {
        userName: "",
        password: "",
        account: "",
        useRefreshTokens: false
    };
    $scope.registration = {
        Name:"",
    Company:"",
    Email:"",
    Account:"",
    UserName:"",
    Password:"",
    TAndC:false
    };
    $scope.dataType = "password";

    $scope.IsProcessing = false;
    $scope.signUp = function () {
        ShowsignupSuccess();

        $scope.IsProcessing = true;
        $.ajax
        ({
            type: "POST",
            url: serviceBase + 'Signup',
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',
            data: JSON.stringify({ "_signup": $scope.registration }),
            success: function (response) {
                debugger;
                $("#mysignupModal").removeClass('bounceIn').addClass('bounceOut');
                $('#mysignupModal').hide();
                $scope.IsProcessing = false;
                $scope.$apply();
                if (response.SignupResult.Success == true) {

                    log.success("You are successfully registered");
                    localStorageService.set("LatestSignUp", true);

                    localStorageService.set('lastlogindata', { userName: response.SignupResult.Payload.UserName, Password: response.SignupResult.Payload.Password, AccountName: response.SignupResult.Payload.Account });
                    //$location.path('/login');
                    $scope.loginAfterSignup(response.SignupResult.Payload.UserName, response.SignupResult.Payload.UserName, response.SignupResult.Payload.Account);
                    $scope.$apply();
                }
                else {
                    log.error(response.SignupResult.Message);
                }
            
            },
            error: function (err) {
                debugger;
                $("#mysignupModal").removeClass('bounceIn').addClass('bounceOut');
                $('#mysignupModal').hide();
                console.log(err);
                log.error("Error Occurred during operation");


            }
        });
       
    };


    $scope.loginAfterSignup = function (userName, Password, AccountName) {
        localStorageService.set("ActivityCart", "");

        localStorageService.set("SelectedAction", "");
        localStorageService.set("lastlogindata", "");
        $scope.loginData = {
            userName: userName,
            password: Password,
            account: AccountName,
            useRefreshTokens: false
        };

        $scope.$apply();
        authService.login($scope.loginData).then(function (response) {

         
         

            $scope.IsOwner = localStorageService.get('IsOwner');




            //$location.path('/FindItems');
            $location.path('/Accounts');

        },
    function (err) {
        $scope.message = err.error_description;
        playBeep();
    });
    }

    $scope.showpassword = function () {
        $(".showbtn").hide();
        $(".hidebtn").show();
        $("#Password").attr("type","text");
        $scope.$apply();
       
    }


    $scope.hidepassword = function () {
        $(".showbtn").show();
        $(".hidebtn").hide();
        $("#Password").attr("type", "password");

    }

    


    $scope.CheckIsRequiredfields=function()
    {
        if($scope.registration.Name=="" ||$scope.registration.Company=="" || $scope.registration.Account=="" ||$scope.registration.Email=="" || $scope.registration.UserName=="" ||$scope.registration.Password=="")
        {
            return true;
        }
        else {
            return false;
        }
    }
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    }

}]);