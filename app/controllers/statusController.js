'use strict';
app.controller('statusController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.slide = 0;
    $scope.Totalslides = 0;
    $scope.listview = true;
    $scope.StatusID = 0;
    $scope.mode = 1;
    $scope.StatusToCreate = "";
    $scope.LocationsLoaded = false;
    $scope.FilterRecordsLength = { length: 0 };
    $scope.filteredBars = [];
    $scope.SearchData = { test: "" };
    $scope.check = false;


    $scope.ClearFilter=function()
    {
        $scope.SearchData = { test: "" };
        $scope.$apply();
    }

    $scope.mainObjectToSend = [];
    function init() {

        $scope.getstatus();



        $scope.$apply();
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.keepformopen = function (check) {


        $scope.check = check;
        $scope.$apply();
    }


    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');

    }
    $scope.getstatus = function () {


        $scope.LocationsLoaded = false;


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetStatus',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   $scope.LocationsLoaded = true;
                    
                   if (response.GetStatusResult.Success == true) {
                       $scope.StatusList = response.GetStatusResult.Payload;

                   }
                   else {
                       $scope.ShowErrorMessage("Get Statues", 1, 1, response.GetStatusResult.Message)

                   }
                   $scope.$apply();
               },
               error: function (err) {
                   $scope.LocationsLoaded = true;
                   $scope.ShowErrorMessage("Get Statues", 2, 1, err.statusText);

               }
           });

    }


    $scope.addstatus = function () {
        $scope.StatusToCreate = "";
        $scope.mode = 2;
        $scope.StatusID = 0;

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



    $scope.editstatus = function (obj) {

         

        $scope.mode = 3;

        $scope.StatusToCreate = obj.StatusValue;
        $scope.StatusID = obj.StatusId;
        $("#StatusToCreate").val($scope.StatusToCreate);
        $scope.$apply();

    }

    

    $scope.savestatus = function () {

        var _StatusValue = $.trim($("#StatusToCreate").val());

        if (_StatusValue != "") {

            $scope.StatusToCreate = $("#StatusToCreate").val();
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.SecurityToken = authData.token;
            }
            $scope.IsProcessing = true;
            var datatosend = { "StatusId": $scope.StatusID, "StatusValue": $scope.StatusToCreate };

            console.log(datatosend);

            $.ajax({
                url: serviceBase + "CreateEditStatus",
                type: 'POST',
                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "_StatusVM": datatosend }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {

                    $scope.IsProcessing = false;

                    if (result.CreateEditStatusResult.Success == true) {

                        if (result.CreateEditStatusResult.Payload.ID == 1) {
                            if ($scope.mode == 2) {
                                ShowSuccess("Added");
                                if ($scope.check == true || $scope.check == "true") {
                                    $scope.mode = 2;
                                    $scope.IsProcessing = false;
                                    $('#StatusToCreate').val("");
                                    $('#StatusToCreate').focus();
                                    $scope.$apply();
                                    $('#StatusToCreate').val("");
                                    $('#StatusToCreate').focus();

                                }
                                else {
                                    $scope.getstatus();
                                    $scope.mode = 1;
                                }
                            }

                            if ($scope.mode == 3) {


                                $scope.IsProcessing = false;
                                $scope.$apply();


                                $scope.similar = false;




                                if ($scope.similar == false) {
                                    $scope.IsProcessing = false;
                                    ShowSuccess("Updated");
                                    $scope.getstatus();
                                    $scope.mode = 1;
                                }




                            }



                        }

                        if (result.CreateEditStatusResult.Payload.ID == 0) {
                            if ($scope.mode == 3) {
                                var _headerText = result.CreateEditStatusResult.Payload.OldStatus + " into " + result.CreateEditStatusResult.Payload.NewStatus + " ?"
                                var _OldStatus = result.CreateEditStatusResult.Payload.OldStatus;
                                var _NewStatus = result.CreateEditStatusResult.Payload.NewStatus;
                                var box = bootbox.confirm(_headerText, function (result) {
                                    if (result) {

                                        $.ajax({
                                            url: serviceBase + "MergeStatus",
                                            type: 'POST',
                                            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "OldStatus": _OldStatus, "NewStatus": _NewStatus }),
                                            dataType: 'json',
                                            contentType: 'application/json',
                                            success: function (result) {

                                                if (result.MergeStatusResult.Success == true) {

                                                    ShowSuccess("Merged");
                                                    $scope.getstatus();

                                                    $scope.mode = 1;

                                                }
                                                else {
                                                    $scope.ShowErrorMessage("Merging status", 1, 1, result.MergeStatusResult.Message)

                                                }

                                            },
                                            error: function (err) {
                                                $scope.ShowErrorMessage("Merging status", 2, 1, err.statusText);



                                            },
                                            complete: function () {
                                            }

                                        });
                                    }
                                });

                                var _msg = "The new status name you have chosen is already in use.  If you like, you may merge all existing records at the status, " + _OldStatus + ", into the existing unit of measure called " + _NewStatus + ".<br /><br />If you proceed, all existing references to " + _OldStatus + " will be removed.  <strong>This may take up to a minute, and the action cannot be undone.</strong><br /><br /> Would you like to proceed?"

                                box.on("shown.bs.modal", function () {
                                    $(".mybootboxbody").html(_msg);

                                });
                            }
                            if ($scope.mode == 2) {
                                log.warning("Already exist");
                                $scope.IsProcessing = false;
                                $scope.$apply();
                            }
                        }
                    }
                    else {
                        $scope.ShowErrorMessage("Updating status", 3, 1, result.CreateEditStatusResult.Message)

                    }

                },
                error: function (err) {
                    $scope.IsProcessing = false;
                    $scope.ShowErrorMessage("Updating Status", 2, 1, err.statusText);


                },
                complete: function () {
                    $scope.IsProcessing = false;
                }

            });

            $scope.$apply();

        }

    }


    $scope.deletestatus = function (obj) {


        var id = obj.StatusId;
         
        var _id = "#Delete_" + id;

        var dlID = "#Dlt_" + id;

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {
                $(_id).find("i").addClass("fa-spin");
                $.ajax({
                    url: serviceBase + "DeleteStatus",
                    type: 'POST',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "StatusID": id }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {

                        $(_id).find("i").removeClass("fa-spin");

                        if (result.DeleteStatusResult.Success == true) {
                       

                            if (result.DeleteStatusResult.Payload == 1) {
                                $(dlID).addClass("animated fadeOutRight")
                                 ShowSuccess("Deleted");

                        }

                        if (result.DeleteStatusResult.Payload == 0) {

                            log.info("unable to delete, this value used by system")

                        }

                        $scope.getstatus();


                        }
                        else {
                            $scope.ShowErrorMessage("Deleting status", 1, 1, result.DeleteStatusResult.Message)

                        }

                     

                        $scope.mode = 1;

                    },
                    error: function (err) {
                        $(_id).find("i").removeClass("fa-spin");
                        $scope.ShowErrorMessage("Deleting status", 2, 1, err.statusText);

                         

                    },
                    complete: function () {
                    }

                });
            }
        });

    }

    $scope.leaveform = function() {
        $scope.mode = 1;
        $scope.getstatus();
        $scope.$apply();
    }



    init();





}]);