'use strict';

app.controller('contactController', ['$scope', '$location', 'authService', 'ngAuthSettings', 'log', function ($scope, $location, authService, ngAuthSettings, log) {

    _CurrentUrl = "MainMenu";
 
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    var myCenter = new google.maps.LatLng(38.5737822, -90.3928599);

    function initialize() {

        var mapProp = {
            center: myCenter,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        var marker = new google.maps.Marker({
            position: myCenter,
        });

        marker.setMap(map);

        var infowindow = new google.maps.InfoWindow({
            content: "Clearly Inventory"
        });

        infowindow.open(map, marker);
    }

    google.maps.event.addDomListener(window, 'load', initialize);
    initialize();

}]);
