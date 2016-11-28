'use strict';
app.controller('uomController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.mode = 1;
    $scope.UomID = 0;
    $scope.UOMToCreate = "";
    $scope.IsProcessing = false;
    $scope.LocationsLoaded = false;

    $scope.CurrentID = "";
    $scope.check = false;

    $scope.mainObjectToSend = [];
    function init() {
        $scope.getuom();
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

    $scope.addUOM = function () {
        $scope.UomID = 0;
        $scope.UOMToCreate = "";
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



    $scope.getuom = function () {

        $scope.LocationsLoaded = false;


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetUnitsOfMeasure',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   $scope.LocationsLoaded = true;


                   if (response.GetUnitsOfMeasureResult.Success == true) {
                       $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;

                   }
                   else {
                       $scope.ShowErrorMessage("Get uoms", 1, 1, response.GetUnitsOfMeasureResult.Message)

                   }
                   $scope.$apply();
               },
               error: function (err) {
                   $scope.LocationsLoaded = true;
                   $scope.ShowErrorMessage("Get uoms", 2, 1, err.statusText);


               }
           });

    }



    $scope.editUOM = function (obj) {



        $scope.mode = 3;

        $scope.UOMToCreate = obj.UnitOfMeasureName;
        $scope.UomID = obj.UnitOfMeasureID;
        $("#UOMToCreate").val($scope.UOMToCreate);
        $scope.$apply();

    }

    $scope.saveUOM = function () {

        var _StatusValue = $.trim($("#UOMToCreate").val());

        if (_StatusValue != "") {

           

            $scope.UOMToCreate = $("#UOMToCreate").val();
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.SecurityToken = authData.token;
            }

            var datatosend = { "UomID": $scope.UomID, "UOM": $scope.UOMToCreate };
            $scope.IsProcessing = true;

            $.ajax({
                url: serviceBase + "CreateEditUOM",
                type: 'POST',
                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "UOMModel": datatosend }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {
                    $scope.IsProcessing = false;

                    debugger;
                    if (result.CreateEditUOMResult.Success == true) {

                        if (result.CreateEditUOMResult.Payload.ID == 1) {
                            if ($scope.mode == 2) {
                                ShowSuccess("Added");


                                if ($scope.check == true || $scope.check == "true") {
                                    $scope.mode = 2;
                                    $scope.IsProcessing = false;
                                    $('#UOMToCreate').val("");
                                    $('#UOMToCreate').focus();
                                    $scope.$apply();
                                    $('#UOMToCreate').val("");
                                    $('#UOMToCreate').focus();
                                 
                                }
                                else {
                                    $scope.getuom();
                                    $scope.mode = 1;
                                }
                            }

                      

                            if ($scope.mode == 3) {
                                ShowSuccess("Updated");
                                $scope.getuom();
                                $scope.mode = 1;
                            }

                        

                        }



                        if (result.CreateEditUOMResult.Payload.ID == 0) {

                            if ($scope.mode == 3) {

                                var _headerText = result.CreateEditUOMResult.Payload.OldUOM + " into " + result.CreateEditUOMResult.Payload.NewUOM + " ?"
                                var _OldUOM = result.CreateEditUOMResult.Payload.OldUOM;
                                var _NewUOM = result.CreateEditUOMResult.Payload.NewUOM;
                                var box = bootbox.confirm(_headerText, function (result) {
                                    if (result) {

                                        $.ajax({
                                            url: serviceBase + "MergeUOM",
                                            type: 'POST',
                                            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "OldUOM": _OldUOM, "NewUOM": _NewUOM }),
                                            dataType: 'json',
                                            contentType: 'application/json',
                                            success: function (result) {

                                                if (result.MergeUOMResult.Success == true) {

                                                    ShowSuccess("Merged");
                                                    $scope.getuom();

                                                    $scope.mode = 1;

                                                }
                                                else {
                                                    $scope.ShowErrorMessage("Merging UOM", 1, 1, result.MergeUOMResult.Message)

                                                }

                                            },
                                            error: function (err) {
                                                $scope.ShowErrorMessage("Merging UOM", 2, 1, err.statusText);



                                            },
                                            complete: function () {
                                            }

                                        });
                                    }
                                });

                                var _msg = "The new unit of measure name you have chosen is already in use.  If you like, you may merge all existing records at the unit of measure, " + _OldUOM + ", into the existing unit of measure called " + _NewUOM + ".<br /><br />If you proceed, all existing references to " + _OldUOM + " will be removed.  <strong>This may take up to a minute, and the action cannot be undone.</strong><br /><br /> Would you like to proceed?"

                                box.on("shown.bs.modal", function () {
                                    $(".mybootboxbody").html(_msg);

                                });
                            }

                            if ($scope.mode == 2) {
                                log.warning("Already Exist, please update");
                            }
                            $scope.IsProcessing = false;
                            $scope.$apply();
                        }
                    }
                    else {
                        $scope.ShowErrorMessage("Updating UOM", 1, 1, result.CreateEditUOMResult.Message)

                    }
                },
                error: function (err) {
                    $scope.IsProcessing = false;
                    $scope.ShowErrorMessage("Updating UOM", 2, 1, err.statusText);



                },
                complete: function () {
                    $scope.IsProcessing = false;
                }
            });
        }
    }


    $scope.deleteUOM = function (obj) {


        var id = obj.UnitOfMeasureID;


        var _id = "#Delete_" + id;

        var dlID = "#Dlt_" + id;

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {

                $(_id).find("i").addClass("fa-spin");
                $.ajax({
                    url: serviceBase + "DeleteUOM",
                    type: 'POST',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "UOMID": id }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {

                        if (result.DeleteUOMResult.Success == true) {

                            $(_id).find("i").removeClass("fa-spin");


                            if (result.DeleteUOMResult.Payload == 1) {

                                $(dlID).addClass("animated fadeOutRight")

                                ShowSuccess("Deleted");

                            }

                            if (result.DeleteUOMResult.Payload == 0) {

                                log.info("unable to delete, this value used by system")

                            }

                            setTimeout(function() {
                                $scope.getuom();

                                $scope.mode = 1;
                            },400)

                        
                        }
                        else {
                            $scope.ShowErrorMessage("Deleting UOM", 1, 1, result.DeleteUOMResult.Message)

                        }

                    },
                    error: function (err) {
                        $(_id).find("i").removeClass("fa-spin");
                        $scope.ShowErrorMessage("Deleting UOM", 2, 1, err.statusText);



                    },
                    complete: function () {
                    }

                });
            }
        });

    }

    $scope.leaveform = function () {
        
        $scope.mode = 1;
        $scope.getuom();
        $scope.$apply();
    }
    init();





}]);