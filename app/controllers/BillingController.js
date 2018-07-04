'use strict';

app.controller('BillingController', ['$scope', '$location', 'authService', 'localStorageService', 'ngAuthSettings', 'log', function ($scope, $location, authService, localStorageService, ngAuthSettings, log) {

    $scope.BillingData = [];
    $scope.IsLoading = true;
    $scope.CurrentSubscriptionTotal = 0;
    $scope.customerdata = { Name: "", accountID: "", }
    $scope.StartDate = "";
    $scope.EndDate = "";
    $scope.CustomerEdit = false;

    $scope.CreditcardEdit = false;
    $scope.UpcomingSubscriptionTotal = 0;
    $scope.CustomerObj = { Name: "", Email: "" };
    $scope.IsSaving = false;
    $scope.ShowInvoicedetails = false;
    $scope.creditcardinfo = { Name: "", Number: "", ExpMonth: "", ExpYear: "", PostalCode: "", CVV: "" }
    $scope.StripePublicKey = "";
    $scope.IsCustomerOn = true;
    $scope.IsProperEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    $scope.GetUserBills = function () {
        $scope.IsLoading = true;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "BillingDetail",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
            error: function (err) {
                debugger;
                $scope.IsLoading = false;
            },

            success: function (data) {
                debugger;
                if (data.BillingDetailResult.Success == true) {

                
                    
                 
                    if (data.BillingDetailResult != null && data.BillingDetailResult.Payload != null) {
                        $scope.BillingData = data.BillingDetailResult.Payload[0];
                        
                        $scope.CustomerObj.Email = $scope.BillingData.Email;
                        $scope.CustomerObj.Name = $scope.BillingData.Description;
                        $scope.creditcardinfo.Name = $scope.BillingData.Description;
                        $scope.StripePublicKey = $scope.BillingData.StripePublicKey;
                        if ($.trim($scope.BillingData.Email) != "") {
                            $scope.IsCustomerOn = true;
                        }
                        else {
                            $scope.IsCustomerOn = false;
                        }

                        for (var i = 0; i < $scope.BillingData.Subscriptions.length; i++) {
                            $scope.CurrentSubscriptionTotal += $scope.BillingData.Subscriptions[i].Quantity * $scope.BillingData.Subscriptions[i].UnitPrice;
                        }

                        for (var i = 0; i < $scope.BillingData.UpComingInvoices.length; i++) {
                            $scope.StartDate = $scope.BillingData.UpComingInvoices[i].StartDate;
                            $scope.EndDate = $scope.BillingData.UpComingInvoices[i].EndDate;
                            $scope.UpcomingSubscriptionTotal += ($scope.BillingData.UpComingInvoices[i].Amount/100);
                        }
                    }
                }
                else {
                    $scope.ShowErrorMessage("Get Billing Detail", 1, 1, data.BillingDetailResult.Message);

                }
                $scope.IsLoading = false;

                $scope.$apply();

                cordova.plugins.stripe.setPublishableKey($scope.StripePublicKey);

            }
        });
    };
   

    $scope.GetDisabledClass = function () {

        if ($.trim($scope.creditcardinfo.Number) == "" || $.trim($scope.creditcardinfo.ExpMonth) == "" || $.trim($scope.creditcardinfo.ExpYear) == "" || $.trim($scope.creditcardinfo.CVV) == "" || $.trim($scope.creditcardinfo.PostalCode) == "") {
            return "disabled";

        }

        return "";
    }

    $scope.savecreditcardinfo = function () {
        debugger;
        var cvv = $("#cvvnumber").val().length;

        var _postelcodelength = $("#PostalCode").val().length;
        if ($("#card_number").hasClass("valid") && cvv == 3 && _postelcodelength == 5) {

            console.log($scope.creditcardinfo);
            card = {
                number: $scope.creditcardinfo.Number, // 16-digit credit card number
                expMonth: $scope.creditcardinfo.ExpMonth, // expiry month
                expYear: $scope.creditcardinfo.ExpYear, // expiry year
                cvc: $scope.creditcardinfo.CVV, // CVC / CCV
                name: $scope.creditcardinfo.Name, // card holder name (optional)
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
            if (_postelcodelength < 5) {
                log.error("Postel code should be atleast 5 digits");
            }
            else if (cvv != 3) {
                log.error("CVV should be atleast 3 digits");
            }
            else {
                log.error("Wrong Credit card Info fill correct")

            }
        }



    }


    $scope.SaveCreditCardDetail = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope.IsSaving = true;
        $scope.$apply();
        
        
        
        $.ajax({

            type: "POST",
            url: serviceBase + "EditCreditCard",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "customerName": $scope.creditcardinfo.Name, "stripeToken": $("#stripe-token").val() }),
            error: function (err) {
                $scope.IsSaving = false;
                $scope.$apply();
                $scope.ToggleCreditcardEdit();
            },

            success: function (data) {

                if (data.EditCreditCardResult.Success == true) {

                    log.success("Card Detail Saved successfully");
                    $scope.ToggleCreditcardEdit();
                    init();
                    $scope.$apply();
                }
                else {
                    $scope.ToggleCreditcardEdit();
                    $scope.ShowErrorMessage("Get Credit Card Detail", 1, 1, data.EditCreditCardResult.Message);

                }
                $scope.IsSaving = false;
                $scope.$apply();
            }
        });
    };



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


    $scope.UpdateCustomerDetail = function () {
        $scope.IsSaving = true;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "EditCustomer",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "customerName": $scope.CustomerObj.Name, "customerEmail": $scope.CustomerObj.Email }),
            error: function (err) {
                debugger;
                $scope.IsSaving = false;
            },

            success: function (data) {
                debugger;
                if (data.EditCustomerResult.Success == true) {




                    if (data.EditCustomerResult != null && data.EditCustomerResult.Payload != null) {
                        log.success("Saved Success fully");
                        $scope.GetUserBills();
                        $scope.ToggleCustomerEdit();
                    }
                }
                else {
                    $scope.ShowErrorMessage("Get Billing Detail", 1, 1, data.BillingDetailResult.Message);

                }
                $scope.IsSaving = false;

                $scope.$apply();
            }
        });
    }

    $scope.getInvoiceDetails = function (InvoiceID) {

        $scope.IsLoading = true;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "GetInvoiceDetail",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "id": InvoiceID }),
            error: function (err) {

                $scope.IsLoading = false;

            },

            success: function (data) {

                $scope.InvoiceDetails = data.GetInvoiceDetailResult.Payload[0];


                for (var i = 0; i < $scope.InvoiceDetails.Invoices.length; i++) {
                    $scope.StartInvoiceDate = $scope.InvoiceDetails.Invoices[i].StartDate;
                    $scope.EndInvoiceDate = $scope.InvoiceDetails.Invoices[i].EndDate;
                }

                $scope.ShowInvoicedetails = true;
                $scope.IsLoading = false;
                $scope.$apply();


            }
        });
    }

  

    $scope.ToggleCustomerEdit=function(){
        $scope.CustomerObj.Email = $scope.BillingData.Email;
        $scope.CustomerObj.Name = $scope.BillingData.Description;

        $scope.CustomerEdit=!$scope.CustomerEdit;
        $scope.$apply();
    }

    $scope.ToggleCreditcardEdit = function () {
        $scope.CreditcardEdit = !$scope.CreditcardEdit;
        $scope.creditcardinfo = { Name: "", Number: "", ExpMonth: "", ExpYear: "", PostalCode: "", CVV: "" }
        $scope.creditcardinfo.Name = $scope.BillingData.Description;

        $scope.$apply();
    }

    
    function init()
    {
        var _accountID = localStorageService.get('AccountID');
        
        if (_accountID != null && _accountID != undefined)
        {
            $scope.CurrentAccount=_accountID;
        }

        $scope.GetUserBills();
    }

    init();  
   

}]);
