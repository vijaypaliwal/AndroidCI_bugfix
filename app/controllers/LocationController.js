'use strict';
app.controller('LocationController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.Locations = [];
    var _sortColumn = "lLoc";
    var _sortDir = "DESC";
    $scope.LocationsLoaded = false;

    //var _areZeroRecordsShown = true;
    var _currentPage = 0;
    var _PageSize = 30;
    var _PreviousPageSize = 50;
    var _IsLazyLoading = 0;
    var _IsLazyLoadingUnderProgress = 0;
    var _TotalRecordsCurrent = 0;
    $scope.CurrentActiveSearchField = "lLoc";
    $scope.SearchData = { SearchValue: "" };
    $scope.loadingblock = false;
    $scope.IsProcessing = false;

    $scope.locationdata = {
        LocationName: "",
        LocationID: 0,
        LocationZone: "",
        LocationDescription: ""
    };

    $scope.mode = 1;
    $scope.check = false;


    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });


    $('#mylist').on('swipedown', function () {


        if (_IsLazyLoadingUnderProgress === 0) {
            if ($(window).scrollTop() < 500) {
                

                $scope.loadingblock = true;

                _IsLazyLoadingUnderProgress = 1;
                CheckScopeBeforeApply();
                $scope.GetLocations();
              
            }
        }

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


    $scope.keepformopen = function (check) {


        $scope.check = check;
        $scope.$apply();
    }



    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.FilterArray = [
       { ColumnName: 'lLoc', FilterOperator: 'cn', SearchValue: $('#lLoc-filter').val() },
        { ColumnName: 'lDescription', FilterOperator: 'cn', SearchValue: $('#lDescription-filter').val() },
        { ColumnName: 'lZone', FilterOperator: 'cn', SearchValue: $('#lZone-filter').val() }]


    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    function getIncrementor(_Total) {
        if (_Total <= 100) {
            return 10;
        }
        else if (_Total > 100 && _Total < 500) {
            return 20;
        }
        else if (_Total > 500) {
            return 50;
        }
        else {
            return 10;
        }
    }
    $(window).scroll(function () {

        if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                if (_PageSize < $scope.totalrecords) {
                    _IsLazyLoadingUnderProgress = 1;
                    _PageSize = _TotalRecordsCurrent + getIncrementor($scope.totalrecords);
                    CheckScopeBeforeApply();
                    $scope.GetLocations();
                }
                else {
                    // log.info("You have already loaded all data.")
                }

            }
        }



    });

    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }


    $scope.ClearFilter = function () {





        for (var i = 0; i < $scope.FilterArray.length; i++) {
            $scope.FilterArray[i].SearchValue = "";

        }


        $("#MasterSearch").val('');
        $scope.SearchData.SearchValue = $("#MasterSearch").val();

        CheckScopeBeforeApply();

        $scope.GetLocations();






    }

    $scope.GetLocations = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }


        $scope.SearchData.SearchValue = $("#MasterSearch").val();

        if ($scope.SearchData.SearchValue != null && $.trim($scope.SearchData.SearchValue)) {

            if ($scope.CurrentActiveSearchField == "lLoc") {

                $scope.FilterArray[0].SearchValue = $scope.SearchData.SearchValue;

            }
            else if ($scope.CurrentActiveSearchField == "lZone") {
                $scope.FilterArray[2].SearchValue = $scope.SearchData.SearchValue;
            }
        }
        $scope.LocationsLoaded = false;

        CheckScopeBeforeApply();

        $.ajax({
            type: "POST",
            url: serviceBase + 'LoadLocations',
            data: JSON.stringify({ SecurityToken: $scope.SecurityToken, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: $scope.FilterArray, PageSize: _PageSize }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {


                if (result.LoadLocationsResult.Success == true) {

                    $scope.LocationsLoaded = true;
                    $scope.Locations = result.LoadLocationsResult.Payload[0].Data;

                    _TotalRecordsCurrent = result.LoadLocationsResult.Payload[0].Data.length;

                    $scope.currentrecord = _TotalRecordsCurrent;
                    $scope.totalrecords = result.LoadLocationsResult.Payload[0].TotalRercords;
                    $scope.ActualTotalRecords = result.LoadLocationsResult.Payload[0].ActualTotalRecords;
                    if (_TotalRecordsCurrent == 0) {
                        $(".norecords").show();


                    }
                    else {
                        $(".norecords").hide();


                    }

                    if ($scope.ActualTotalRecords) {
                    } else {
                    
                    }
                }
                else {
                    $scope.ShowErrorMessage("Get locations", 1, 1, result.LoadLocationsResult.Message)

                }

                $scope.LocationsLoaded = true;

                CheckScopeBeforeApply();
            },
            error: function (req) {
                $scope.ShowErrorMessage("Get locations", 2, 1, req.statusText);

                $scope.LocationsLoaded = true;
                CheckScopeBeforeApply();
            },
            complete: function () {
                _IsLazyLoadingUnderProgress = 0;
                $scope.loadingblock = false;
                CheckScopeBeforeApply();
            }
        });
    }




    $scope.addlocation = function () {

        $scope.locationdata = {
            LocationName: "",
            LocationID: 0,
            LocationZone: "",
            LocationDescription: ""
        };

        $scope.mode = 2;
        $scope.$apply();

    }


    $scope.editlocation = function (obj) {



        $scope.mode = 3;

        $scope.locationdata.LocationName = obj.LocationName;
        $scope.locationdata.LocationID = obj.LocationID;
        $scope.locationdata.LocationZone = obj.LocationZone;
        $scope.locationdata.LocationDescription = obj.LocationDescription;

        $scope.$apply();

    }

    $scope.savelocation = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var datatosend = { "LocationID": $scope.locationdata.LocationID, "LocationName": $scope.locationdata.LocationName, "LocationZone": $scope.locationdata.LocationZone, "LocationDescription": $scope.locationdata.LocationDescription };

        $scope.IsProcessing = true;

        $.ajax({
            url: serviceBase + "CreateEditLocation",
            type: 'POST',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "_Location": datatosend }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {
                $scope.IsProcessing = false;

                if (result.CreateEditLocationResult.Success == true) {

                    if (result.CreateEditLocationResult.Payload == 1) {
                        if ($scope.mode == 2) {
                            ShowSuccess("Added");

                            if ($scope.check == true || $scope.check == "true") {
                                $scope.mode = 2;
                                $scope.IsProcessing = false;
                                $scope.locationdata.LocationName = "";
                                $scope.locationdata.LocationZone = "";
                                $scope.locationdata.LocationDescription = "";
                                $('#loc').focus();
                                $scope.$apply();
                            
                                $('#loc').focus();

                            }
                            else {
                                $scope.mode = 1;
                                $scope.GetLocations();
                            }

                        }

                        if ($scope.mode == 3) {
                            ShowSuccess("Updated");
                            $scope.mode = 1;
                            $scope.GetLocations();
                        }





                      

                     //   $scope.SearchData.SearchValue = "";
                        $scope.FilterArray[0].SearchValue = "";
                        $scope.FilterArray[1].SearchValue = "";
                        $scope.FilterArray[2].SearchValue = "";

                        CheckScopeBeforeApply();

                      

                    }

                    if (result.CreateEditLocationResult.Payload == 0) {

                        log.warning("Already exist");
                        $scope.IsProcessing = false;
                        $scope.$apply();
                    }


                }
                else {
                    $scope.ShowErrorMessage("Updating location", 1, 1, result.CreateEditLocationResult.Message)

                }

            },
            error: function (err) {
                $scope.IsProcessing = false;
                $scope.ShowErrorMessage("Updating location", 2, 1, err.statusText);



            },
            complete: function () {
                $scope.IsProcessing = false;
            }

        });



    }


    $scope.deletelocation = function (obj) {


        var id = obj.LocationID;

        var _id = "#Delete_" + id;

        var dlID = "#Dlt_" + id;

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {
                $(_id).find("i").addClass("fa-spin");
                $.ajax({
                    url: serviceBase + "DeleteLocation",
                    type: 'POST',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "LocationID": id }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {
                        if (result.DeleteLocationResult.Success == true) {
                       

                        $(_id).find("i").removeClass("fa-spin");
                        if (result.DeleteLocationResult.Payload == 1) {

                            $(dlID).addClass("animated fadeOutRight")

                            ShowSuccess("Deleted");

                            setTimeout(function () {
                                $scope.GetLocations();
                            }, 400)

                         

                        }

                        if (result.DeleteLocationResult.Payload == 0) {

                            log.info("unable to delete, this value used by system")

                        }


                        $scope.mode = 1;
                        }
                        else {
                            $scope.ShowErrorMessage("Deleting location", 1, 1, result.DeleteLocationResult.Message)

                        }
                    },
                    error: function (err) {
                        $(_id).find("i").removeClass("fa-spin");
                        $scope.ShowErrorMessage("Deleting location", 2, 1, err.statusText);



                    },
                    complete: function () {
                    }
                });
            }
        });
    }


    $scope.GetTrimmedStringLoc = function (_string) {
        if (_string != null && _string != undefined) {
            _string = $.trim(_string);
        }
        return _string;
    }
    $scope.leaveform = function () {
        $scope.mode = 1;
        $scope.GetLocations();
        $scope.$apply();
    }

    function init()
    {
        $scope.GetLocations();
        $scope.SearchData.SearchValue = "";
        $scope.$apply();
    }

    init();

}]);

app.directive()

