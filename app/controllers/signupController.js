'use strict';
app.controller('signupController', ['$scope', 'localStorageService', '$location', '$timeout', 'authService', 'log', function ($scope, localStorageService, $location, $timeout, authService, log) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.loginData = {
        userName: "",
        password: "",
        account: "",
        useRefreshTokens: false
    };

    $scope.registration = {
        FirstName: "",
        LastName: "",
        OrganizationName: "",
        Email: "",
        UserName: "",
        Password: "",
        TAndC: false
    };
    $scope.dataType = "password";

    $scope.IsProcessing = false;
    $scope.signUp = function () {
        ShowsignupSuccess();

        $scope.IsProcessing = true;
        $.ajax
        ({
            type: "POST",
            url: serviceBase + 'NewSignup',
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',
            data: JSON.stringify({ "_signup": $scope.registration }),
            success: function (response) {
                debugger;
                $("#mysignupModal").removeClass('bounceIn').addClass('bounceOut');
                $('#mysignupModal').hide();
                $scope.IsProcessing = false;
                $scope.$apply();
                if (response.NewSignupResult.Success == true) {

                    log.success("You are successfully registered");
                    localStorageService.set("LatestSignUp", true);

                    localStorageService.set('lastlogindata', { userName: response.NewSignupResult.Payload.UserName, Password: response.NewSignupResult.Payload.Password, AccountName: response.NewSignupResult.Payload.Account });
                    //$location.path('/login');
                    $scope.loginAfterSignup(response.NewSignupResult.Payload.UserName, response.NewSignupResult.Payload.Password, response.NewSignupResult.Payload.Account);
                    $scope.$apply();
                }
                else {
                    log.error(response.NewSignupResult.Message);
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
        $("#Password").attr("type", "text");
        $scope.$apply();

    }


    $scope.hidepassword = function () {
        $(".showbtn").show();
        $(".hidebtn").hide();
        $("#Password").attr("type", "password");

    }


    function init() {
        $scope.registration = {
            FirstName: "",
            LastName: "",
            OrganizationName: "",
            Email: "",
            UserName: "",
            Password: "",
            TAndC: false
        };
        $scope.$apply();
        setTimeout(function () {
            $("#firstName").focus();

        }, 100);
    }

    $scope.CheckIsRequiredfields = function () {
        if ($scope.registration.Name == "" || $scope.registration.Company == "" || $scope.registration.Account == "" || $scope.registration.Email == "" || $scope.registration.UserName == "" || $scope.registration.Password == "") {
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

    init();

}]);