'use strict';
app.controller('itemgroupController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.mode = 1;
    $scope.ItemGroupID = 0;
    $scope.ItemGroupToCreate = "";
    $scope.IsProcessing = false;
    $scope.ItemgroupLoaded = false;

    $scope.CurrentID = "";
    $scope.check = false;

    $scope.mainObjectToSend = [];
    function init() {
        $scope.getItemgroup();
        $scope.$apply();
    }

    $scope.FilterRecordsLength = { length: 0 };
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.SearchData = { test: "" };

    $scope.ClearFilter = function () {
        $scope.SearchData = { test: "" };
        $scope.$apply();
    }

    $scope.keepformopen = function (check) {

     
        $scope.check = check;
        $scope.$apply();
    }


    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');

    }

    $scope.addItemGroup = function () {
        $scope.ItemGroupID = 0;
        $scope.ItemGroupToCreate = "";
        $scope.mode = 2;
       
        $scope.$apply();

    }


    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });


    $scope.Openbottommenu = function () {

        if ($("body").hasClass("modal-open")) {
            $("#bottommenumodal").modal('hide');

            $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')


        }
        else {
            $("#bottommenumodal").modal('show');
            $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');
        }
    }



    $scope.getItemgroup = function () {

        $scope.ItemgroupLoaded = false;


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetItemGroup',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response)
               {
                   $scope.ItemgroupLoaded = true;


                   if (response.GetItemGroupResult.Success == true) {
                       $scope.Itemgrouplist = response.GetItemGroupResult.Payload;

                   }
                   else {
                       $scope.ShowErrorMessage("Get Item group", 1, 1, response.GetItemGroupResult.Message)

                   }
                   $scope.$apply();
               },
               error: function (err)
               {
                   $scope.ItemgroupLoaded = true;
                   $scope.ShowErrorMessage("Get Item group", 2, 1, err.statusText);

               }
           });

    }



    $scope.editItemGroup = function (obj)
    {
        $scope.mode = 3;
        $scope.ItemGroupToCreate = obj.pcfCountFrq;
        $scope.ItemGroupID = obj.pcfID;
        $("#ItemGroupToCreate").val($scope.ItemGroupToCreate);
        $scope.$apply();

    }

    $scope.saveItemGroup = function () {

        var _StatusValue = $.trim($("#ItemGroupToCreate").val());

        if (_StatusValue != "") {

    

            $scope.ItemGroupToCreate = $("#ItemGroupToCreate").val();
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.SecurityToken = authData.token;
            }

            var datatosend = { "pcfID": $scope.ItemGroupID, "pcfCountFrq": $scope.ItemGroupToCreate, "pcfAID": 0 };
            $scope.IsProcessing = true;

            $.ajax({
                url: serviceBase + "CreateEditItemGroup",
                type: 'POST',
                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "model": datatosend }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {
                    $scope.IsProcessing = false;

                    debugger;
                    if (result.CreateEditItemGroupResult.Success == true) {

                        if (result.CreateEditItemGroupResult.Payload.pcfID == 1) {
                            if ($scope.mode == 2) {
                                ShowSuccess("Added");


                                if ($scope.check == true || $scope.check == "true") {
                                    $scope.mode = 2;
                                    $scope.IsProcessing = false;
                                    $('#ItemGroupToCreate').val("");
                                    $('#ItemGroupToCreate').focus();
                                    $scope.$apply();
                                    $('#ItemGroupToCreate').val("");
                                    $('#ItemGroupToCreate').focus();
                                 
                                }
                                else {
                                    $scope.getItemgroup();
                                    $scope.mode = 1;
                                }
                            }

                        

                        }
                      
                        if ($scope.mode == 3) {
                            ShowSuccess("Updated");
                            $scope.getItemgroup();
                            $scope.mode = 1;
                        }

                        if (result.CreateEditItemGroupResult.Payload.pcfID == 0)
                        {

                          

                            if ($scope.mode == 2) {
                                log.warning("Already Exist, please update");
                            }
                            $scope.IsProcessing = false;
                            $scope.$apply();
                        }
                    }
                    else
                    {
                        $scope.ShowErrorMessage("Updating ItemGroup", 1, 1, result.CreateEditItemGroupResult.Message)
                    }
                },
                error: function (err)
                {
                    $scope.IsProcessing = false;
                    $scope.ShowErrorMessage("Updating ItemGroup", 2, 1, err.statusText);



                },
                complete: function () {
                    $scope.IsProcessing = false;
                }
            });
        }
    }


    $scope.deleteGroup = function (obj) {


        var id = obj.pcfID;


        var _id = "#Delete_" + id;

        var dlID = "#Dlt_" + id;

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {

                $(_id).find("i").addClass("fa-spin");
                $.ajax({
                    url: serviceBase + "DeleteItemGroup",
                    type: 'POST',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "pcFID": id }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {

                        if (result.DeleteItemGroupResult.Success == true) {

                            $(_id).find("i").removeClass("fa-spin");


                            if (result.DeleteItemGroupResult.Payload == 1) {

                                $(dlID).addClass("animated fadeOutRight")

                                ShowSuccess("Deleted");

                            }

                            if (result.DeleteItemGroupResult.Payload == 0) {

                                log.info("unable to delete, this value used by system")

                            }

                            setTimeout(function() {
                                $scope.getItemgroup();

                                $scope.mode = 1;
                            },400)

                        
                        }
                        else {
                            $scope.ShowErrorMessage("Deleting UOM", 1, 1, result.DeleteItemGroupResult.Message)
                        }

                    },
                    error: function (err) {
                        $(_id).find("i").removeClass("fa-spin");
                        $scope.ShowErrorMessage("Deleting Item group", 2, 1, err.statusText);
                    },
                    complete: function () {
                    }

                });
            }
        });

    }

    $scope.leaveform = function () {
        
        $scope.mode = 1;
        $scope.getItemgroup();
        $scope.$apply();
    }
    init();





}]);