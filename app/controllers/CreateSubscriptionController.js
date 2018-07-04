'use strict';

app.controller('CreateSubscriptionController', ['$scope', '$location', 'authService', 'localStorageService', 'ngAuthSettings', 'log', function ($scope, $location, authService, localStorageService, ngAuthSettings, log) {
    $scope.IsLoading = false;
    $scope.IsSaving = false;
    $scope.CreditCard = {Email:"",Name:"",StripePublicKey:"",StripeToken:"",UserCount:0};
    var stripe = {};
    var _newcard = {};
    var elements = [];
    $scope.includedUserCount = 2;
    $scope.GetCreditCardDetail = function () {
        $scope.IsLoading = true;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax({

            type: "POST",
            url: serviceBase + "GetCreditCardDetail",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken}),
            error: function (err) {
                $scope.IsLoading = false;
            },

            success: function (data) {

                if (data.GetCreditCardDetailResult.Success == true) {
                    $scope.CreditCard = data.GetCreditCardDetailResult.Payload;
                 
                   // stripe = Stripe($scope.CreditCard.StripePublicKey);
                    debugger;
                 //   console.log(stripe);
                  //  elements = stripe.elements();

                

                    if ($scope.CreditCard.UserCount == 1)
                    {
                        $scope.includedUserCount = 1;

                    }
                   
                }
                else {
                    $scope.ShowErrorMessage("Get Credit Card Detail", 1, 1, data.GetCreditCardDetailResult.Message);

                }
                $scope.IsLoading = false;
                $scope.$apply();

                cordova.plugins.stripe.setPublishableKey($scope.CreditCard.StripePublicKey);
             
            }
        });
    };
    $scope.SaveCreditCardDetail = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope.IsSaving = true;
        $scope.$apply();
        $scope.CreditCard.StripeToken = $("#stripe-token").val();
        $.ajax({

            type: "POST",
            url: serviceBase + "CreateNewSubscription",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Model": $scope.CreditCard }),
            error: function (err) {
                $scope.IsSaving = false;
                $scope.$apply();
            },

            success: function (data) {

                if (data.CreateNewSubscriptionResult.Success == true) {
                   
                    log.success("Card Detail Saved successfully");
                    $location.path("/Billings");
                    $scope.$apply();
                }
                else {
                 //   $scope.ShowErrorMessage("Get Credit Card Detail", 1, 1, data.CreateNewSubscriptionResult.Message);

                }
                $scope.IsSaving = false;
                $scope.$apply();
            }
        });
    };

    $scope.creditcardinfo = {Number:"", ExpMonth:"",ExpYear:"",PostalCode:"",CVV:""}


    var card = {
        number: '4242424242424242', // 16-digit credit card number
        expMonth: 12, // expiry month
        expYear: 2020, // expiry year
        cvc: '220', // CVC / CCV
        name: 'John Smith', // card holder name (optional)
        address_line1: '123 Some Street', // address line 1 (optional)
        address_line2: 'Suite #220', // address line 2 (optional)
        address_city: 'Toronto', // city (optional)
        address_state: 'Ontario', // state/province (optional)
        address_country: 'Canada', // country (optional)
        postal_code: 'L5L5L5', // Postal Code / Zip Code (optional)
        currency: 'CAD' // Three-letter ISO currency code (optional)
    };

    function onSuccess(tokenId) {
        var _token = JSON.stringify(tokenId);
        document.getElementById('stripe-token').value = tokenId.id;
        $scope.SaveCreditCardDetail();
    }

    function onError(errorMessage) {
        $scope.IsSaving = false;
        $scope.$apply();
        alert('Error getting card token', errorMessage);
    }

    $scope.CreditCardSubmission = function () {
        $scope.IsSaving = true;
        cordova.plugins.stripe.createCardToken(card, onSuccess, onError);
    }


   

    function init()
    {
        var _accountID = localStorageService.get('AccountID');
        
        if (_accountID != null && _accountID != undefined)
        {
              $scope.CurrentAccount=_accountID;
        }

        $scope.GetCreditCardDetail();
    }

    init();  
    $scope.GetDisabledClass = function () {
        
        if ($.trim($scope.CreditCard.Email) == "" || $.trim($scope.CreditCard.Name) == "" || $.trim($scope.creditcardinfo.Number) == "" || $.trim($scope.creditcardinfo.ExpMonth) == "" || $.trim($scope.creditcardinfo.ExpYear) == "" || $.trim($scope.creditcardinfo.CVV) == "" || $.trim($scope.creditcardinfo.PostalCode) == "")
        {
            return "disabled";

        }

        return "";
    }

    $scope.savecreditcardinfo = function () {
        debugger;
        var cvv = $("#cvvnumber").val().length;
        
        var _postelcodelength = $("#PostalCode").val().length;
        if ($("#card_number").hasClass("valid") && cvv == 3 && _postelcodelength==5) {

            console.log($scope.creditcardinfo);
            card = {
                number: $scope.creditcardinfo.Number, // 16-digit credit card number
                expMonth: $scope.creditcardinfo.ExpMonth, // expiry month
                expYear: $scope.creditcardinfo.ExpYear, // expiry year
                cvc: $scope.creditcardinfo.CVV, // CVC / CCV
                name: $scope.CreditCard.Name, // card holder name (optional)
                address_line1: '', // address line 1 (optional)
                address_line2: '', // address line 2 (optional)
                address_city: '', // city (optional)
                address_state: '', // state/province (optional)
                address_country: '', // country (optional)
                postal_code: $scope.creditcardinfo.PostalCode, // Postal Code / Zip Code (optional)
                currency: 'USD' // Three-letter ISO currency code (optional)
            };

            $scope.CreditCardSubmission();
            
        }

        else {
            if (_postelcodelength < 5)
            {
                log.error("Postel code should be exactly 5 digits");
            }
            else if (cvv != 3)
            {
                log.error("CVV should be exactly 3 digits");
            }
            else {
                log.error("Wrong Credit card Info fill correct")

            }
        }

        

    }


    function setOutcome(result) {
        document.getElementById('card-error').textContent = '';
        if (result.token) {
            document.getElementById('stripe-token').value = result.token.id;
            $("#stripe-token").trigger("input");
        } else if (result.error) {
            document.getElementById('card-error').textContent = result.error.message;
            $scope.IsSaving = false
            $scope.$apply();
        }
    }

  
    document.getElementById('stripeForm').addEventListener('submit', function (e) {
        e.preventDefault();
        $scope.IsSaving = true
        $scope.$apply();
        var extraDetails = {
            name: document.getElementById('cardholder-name').value
        };
        stripe.createToken(_newcard, extraDetails).then(
            function (result) {
                setOutcome(result);
                var _token = document.getElementById('stripe-token').value;
                if (_token.length > 0) {
                   
                    $scope.SaveCreditCardDetail();
                }
                else {
                    $scope.IsSaving = false
                    $scope.$apply();
                }
            });
    });

}]);
