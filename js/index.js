 
    var supportTouch = $.support.touch,
        scrollEvent = "touchmove scroll",
        touchStartEvent = supportTouch ? "touchstart" : "mousedown",
        touchStopEvent = supportTouch ? "touchend" : "mouseup",
        touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
$.event.special.swipeupdown = {
    setup: function () {
        var thisObject = this;
        var $this = $(thisObject);
        $this.bind(touchStartEvent, function (event) {
            var data = event.originalEvent.touches ?
                    event.originalEvent.touches[0] :
                    event,
                    start = {
                        time: (new Date).getTime(),
                        coords: [data.pageX, data.pageY],
                        origin: $(event.target)
                    },
                    stop;

            function moveHandler(event) {
                if (!start) {
                    return;
                }
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[0] :
                        event;
                stop = {
                    time: (new Date).getTime(),
                    coords: [data.pageX, data.pageY]
                };

                // prevent scrolling
                if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                    event.preventDefault();
                }
            }
            $this
                    .bind(touchMoveEvent, moveHandler)
                    .one(touchStopEvent, function (event) {
                        $this.unbind(touchMoveEvent, moveHandler);
                        if (start && stop) {
                            if (stop.time - start.time < 1000 &&
                                    Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                    Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                start.origin
                                        .trigger("swipeupdown")
                                        .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                            }
                        }
                        start = stop = undefined;
                    });
        });
    }
};
$.each({
    swipedown: "swipeupdown",
    swipeup: "swipeupdown"
}, function (event, sourceEvent) {
    $.event.special[event] = {
        setup: function () {
            $(this).bind(sourceEvent, $.noop);
        }
    };
});
 
 
var myDate = new Date();
var _Currentpath = "";
var _genVar = 0;
var _timeZone = myDate.getTimezoneOffset();

if (_timeZone == -330) {
    _genVar = 1;
}
function randomStringNew(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
var _Islive = false;
var IsActiveLocationLibrary = true;
var IsActiveStatusLibrary = true;
var IsActiveUOMLibrary = true;
var IsActiveItemLibrary = true;
var IsActiveItemGroupLibrary = true;

$("#mysmallModal").click(function () {
    hideSuccess();
});

$(document).on('input', 'input[type="text"],input[type="number"]', function () {


    $('input[type="text"]:input').not(".hideaddclear").addClear({
        symbolClass: "fa fa-times-circle"
    });
    $('input[type="number"]:input').addClear({
        symbolClass: "fa fa-times-circle"
    });

    $('input[type="password"]:input').addClear({
        symbolClass: "fa fa-times-circle"
    });

    $(this).focus();

    $(this).trigger("change");
});

$(document).on('change', 'input[type="text"],input[type="number"]', function () {


    $('input[type="text"]').not(".hideaddclear").addClear({
        symbolClass: "fa fa-times-circle"
    });
    $('input[type="number"]').addClear({
        symbolClass: "fa fa-times-circle"
    });

    $('input[type="password"]').addClear({
        symbolClass: "fa fa-times-circle"
    });


});


$(document).on('input', '.prepostCustom', function (e) {
    // if useing right key move cursor to first position it auto move focus at last character in text box 

    var prefix = $(this).attr("data-prefix");
    var suffix = $(this).attr("data-suffix");

    if ($.trim(prefix) == "") { prefix = "" };
    if ($.trim(suffix) == "") { suffix = "" };

    var _TotalLength = prefix.length + suffix.length;
    var _defaultValue = prefix + suffix;

    _defaultValue = $(this).attr("data-value");
    if ($.trim($(this).val()).length != _TotalLength) {
        var _value = $(this).val();
        if (_value.indexOf(prefix) == -1 || _value.indexOf(suffix) == -1) {

            $(this).val(_defaultValue);
            $(this).trigger("input");
        }
    }
});
$(document).on('input', '.prepostCustomActivity', function (e) {
    // if useing right key move cursor to first position it auto move focus at last character in text box 

    var prefix = $(this).attr("data-prefix");
    var suffix = $(this).attr("data-suffix");

    if ($.trim(prefix) == "") { prefix = "" };
    if ($.trim(suffix) == "") { suffix = "" };

    var _TotalLength = prefix.length + suffix.length;
    var _defaultValue = prefix + suffix;

    _defaultValue = $(this).attr("data-cvalue");
    if ($.trim($(this).val()).length != _TotalLength) {
        var _value = $(this).val();
        if (_value.indexOf(prefix) == -1 || _value.indexOf(suffix) == -1) {

            $(this).val(_defaultValue);
            $(this).trigger("input");
        }
    }
});



$(document).on('input', '.prepostCustom , .prepostUnit', function (e) {
    var _value = $(this).val();
    if ($.trim(_value) == "") { _value = "" };


    this.selectionStart = this.selectionEnd = _value.length;

});




$(document).on('input', '.prepostUnit', function (e) {

    var prefix = $(this).attr("data-prefix");
    var suffix = $(this).attr("data-suffix");

    if ($.trim(prefix) == "") { prefix = "" };
    if ($.trim(suffix) == "") { suffix = "" };

    var _TotalLength = prefix.length + suffix.length;
    var _defaultValue = prefix + suffix;

    _defaultValue = $(this).attr("data-value");
    if ($.trim($(this).val()).length != _TotalLength) {
        var _value = $(this).val();
        if (_value.indexOf(prefix) == -1 || _value.indexOf(suffix) == -1) {

            $(this).val(_defaultValue);
        }
    }
});
$(".signoutbtn").click(function () {
    $("#sidenav-overlay").hide();
    $(".side-nav").hide();
    $("#slide-out").css("right", "-250px");
    $("#slide-out-left").css("left", "-250px");
});


function hideSuccess() {
    $("#mysmallModal").removeClass('bounceIn').addClass('bounceOut');
}

function HideWaitingInv() {
    $("#mysmallModalSave").removeClass('bounceIn').addClass('bounceOut');
}
function ShowWaitingInv() {
    $(".errorcontent").css("background", "rgba(52, 73, 94,0.8)");
    $("#mysmallModalSave").removeClass('bounceOut').addClass('bounceIn');
    $('#mysmallModalSave').show();
}


function ShowGlobalWaitingDiv() {
    $("#mysmallModalWaiting").removeClass('fadeOut').addClass('fadeIn');
    $('#mysmallModalWaiting').show();
}
function HideGlobalWaitingDiv() {
    $("#mysmallModalWaiting").removeClass('fadeIn').addClass('fadeOut');

    setTimeout(function () {
        $("#mysmallModalWaiting").hide();
        $("#mysmallModalWaiting span").html("Loading..");

    }, 500);

}

function ShowSuccess(Message) {
    $(".errorcontent").css("background", "rgba(52, 73, 94,0.8)");
    Message = Message != null && Message != undefined ? Message : "Saved";
    $("#mysmallModal").removeClass('bounceOut').addClass('bounceIn');
    $('#mysmallModal').show();
    $('#DataText').html(Message);

    setTimeout(function () {
        hideSuccess();
    }, 250)
}
function ShowLoginSuccess() {
    $(".errorcontent").css("background", "rgba(52, 73, 94,0.8)");

    $("#myloginModal").removeClass('bounceOut').addClass('bounceIn');
    $('#myloginModal').show();

}


function ShowsignupSuccess() {
    $(".errorcontent").css("background", "rgba(52, 73, 94,0.8)");

    $("#mysignupModal").removeClass('bounceOut').addClass('bounceIn');
    $('#mysignupModal').show();



}



var _CurrentUrl = "Login";
var _isOpenBootbox = false;
var recognition;




$('#side-left').click(function (e) {



    e.stopPropagation();

    $('#slide-out-left').show();

    $('<div class="modal-backdrop formenuopen"></div>').appendTo(document.body);


});
$('#slide-out-left').click(function (e) {
    e.stopPropagation();

});
$('body,html').click(function (e) {
    $('#slide-out-left').hide();
    $(".formenuopen").remove();

});
      

$("#slide-out-left a").click(function (e) {
    $(".formenuopen").remove();
    $("#slide-out-left").hide();


});

$(".menuclose").click(function (e) {

    $("#wrapper").toggleClass("toggled");
});





document.addEventListener("deviceready", onDeviceReady, false);

function showAlert() {
    navigator.notification.alert(
        'You are the winner!',  // message
        onConfirmnew,         // callback
        'Game Over',            // title
        'Done'                  // buttonName
    );
}


function onConfirm(buttonIndex) {
    alert('You selected button ' + buttonIndex);
}

function onConfirmnew() {
    alert('You selected button new ');
}

// Show a custom confirmation dialog
//
function showConfirm() {
    navigator.notification.confirm(
        'You are the winner!', // message
         onConfirm,            // callback to invoke with index of button pressed
        'Game Over',           // title
        ['Restart', 'Exit']         // buttonLabels
    );
}



document.addEventListener("online", onOnline, false);
document.addEventListener("offline", onOffline, false);

var pictureSource;
var destinationType;
var ImageListAndroid = [];



var mouseEventTypes = {
    touchstart: "mousedown",
    touchmove: "mousemove",
    touchend: "mouseup"
};

for (originalType in mouseEventTypes) {
    document.addEventListener(originalType, function (originalEvent) {
        event = document.createEvent("MouseEvents");
        touch = originalEvent.changedTouches[0];
        event.initMouseEvent(mouseEventTypes[originalEvent.type], true, true,
                window, 0, touch.screenX, touch.screenY, touch.clientX,
                touch.clientY, touch.ctrlKey, touch.altKey, touch.shiftKey,
                touch.metaKey, 0, null);
        originalEvent.target.dispatchEvent(event);
    });
}


//window.onerror = function (error, file, line) {
//    alert("Error below described");
//    alert(error + ", " + file + ", " + line);
//}



function vibrate() {
}


function playBeep() {
}



function UpdateStatusBar(Type) {



    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    if (deviceType != "Android") {
        switch (Type) {
            case -1:

                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#AF2525");
                    //  $cordovaStatusbar.styleHex("#AF2525");
                }

                break;
            case 0:

                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#C65E28");
                    //  $cordovaStatusbar.styleHex("#C65E28");

                }
                break;
            case 1:

                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#177B3D");
                    //  $cordovaStatusbar.styleHex("#177B3D");

                }
                break;
            case 2:


                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#CE59A1");


                    //   $cordovaStatusbar.styleHex("#CE59A1");

                }

                break;
            case 3:


                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#583782");

                }
                break;
            case 4:


                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#0D190F");

                    //  $cordovaStatusbar.styleHex("#0D190F");

                }
                break;
            case 5:

                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#C65E28");
                    //  $cordovaStatusbar.styleHex("#C65E28");

                }
                break;
            case 12:



                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#f8c217");






                }
                break;
            default:
                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#2196F3");


                }
                break;


        }
    }


}

function onDeviceReady() {
    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

    
   

    //InitializeModal();

    //$cordovaSplashscreen.hide();
}

function onOffline()
{

    $(".nointernet").show();
}

function onOnline() {

    $(".nointernet").hide();
}


function doOnOrientationChange() {
    switch (window.orientation) {
        case -90:
        case 90:

            $("#mycartModal").addClass("activitylist")

            break;
        default:
            $("#mycartModal").removeClass("activitylist")
            break;
    }
}

window.addEventListener('orientationchange', doOnOrientationChange);

// Initial execution if needed
doOnOrientationChange();


 

 

    (function ($, window, document, undefined) {

        debugger;

        var pluginName = "addClear";

        // The actual plugin constructor
        function Plugin(element, options) {
            this.element = element;

            this.options = $.extend({}, defaults, options);

            this._defaults = defaults;
            this._name = pluginName;

            this.init();
        }

        Plugin.prototype = {

            init: function () {
                var $this = $(this.element),
                  me = this,
                  options = this.options;

                $this.wrap("<div class='add-clear-span form-group has-feedback " + options.wrapperClass + "'></div>");
                $this.after($("<span class='add-clear-x form-control-feedback " + options.symbolClass + "' style='display: none;'>" + options.closeSymbol + "</span>"));
                $this.next().css({
                    'color': options.color,
                    'cursor': 'pointer',
                    'text-decoration': 'none',
                    'display': 'none',
                    'overflow': 'hidden',
                    'position': 'absolute',
                    'pointer-events': 'auto',
                    'right': options.right,
                    'top': options.top,
                    'z-index': options.zindex
                }, this);

                if ($this.val().length >= 1 && options.showOnLoad === true) {
                    $this.siblings(".add-clear-x").show();
                }

                $this.on('focus.addclear', function () {
                    if ($(this).val().length >= 1) {
                        $(this).siblings(".add-clear-x").show();
                    }
                });

                $this.on('blur.addclear', function () {
                    var self = this;

                    if (options.hideOnBlur) {
                        setTimeout(function () {
                            $(self).siblings(".add-clear-x").hide();
                        }, 50);
                    }
                });

                $this.on('keyup.addclear', function (e) {

                    if (options.clearOnEscape === true && e.keyCode == 27) {
                        $(this).val('').focus();
                        if (options.onClear) {
                            options.onClear($(this).siblings("input"));
                        }
                    }
                    if ($(this).val().length >= 1) {
                        $(this).siblings(".add-clear-x").show();
                    } else {
                        $(this).siblings(".add-clear-x").hide();
                    }
                });

                $this.on('input.addclear change.addclear paste.addclear', function () {
                    if ($(this).val().length >= 1) {
                        $(this).siblings(".add-clear-x").show();
                    } else {
                        $(this).siblings(".add-clear-x").hide();
                    }
                });

                $this.siblings(".add-clear-x").on('click.addclear', function (e) {
                    debugger;



                    $(this).siblings(me.element).val("");
                    $(this).hide();
                    if (options.returnFocus === true) {
                        $(this).siblings(me.element).focus();
                    }
                    if (options.onClear) {
                        options.onClear($(this).siblings("input"));
                    }
                    $(this).siblings(me.element).trigger('input');
                    e.preventDefault();
                });
            }

        };

        $.fn[pluginName] = function (options, optionName, optionValue) {
            return this.each(function () {
                if (options === "option") {
                    var $this = $(this);
                    if (optionName === "show") {
                        $this.siblings(".add-clear-x").show();
                    } else if (optionName === "hide") {
                        $this.siblings(".add-clear-x").hide();
                    }
                }
                var isSetOption = optionName && optionName !== "show" && optionName !== "hide";
                if (isSetOption) {
                    var oldInstance = $.data(this, "plugin_" + pluginName);
                    if (!oldInstance || !oldInstance.options) {
                        throw "Cannot set option, plugin was not instantiated";
                    }
                    oldInstance.options[optionName] = optionValue;
                } else {
                    if (!$.data(this, "plugin_" + pluginName)) {
                        $.data(this,
                            "plugin_" + pluginName,
                            new Plugin(this, options));
                    }
                }

            });
        };

        $.fn[pluginName].Constructor = Plugin;

        var defaults = $.fn[pluginName].defaults = {
            closeSymbol: "",
            symbolClass: 'glyphicon glyphicon-remove-circle',
            color: "#CCC",
            top: 0,
            right: 0,
            returnFocus: true,
            showOnLoad: false,
            onClear: null,
            hideOnBlur: false,
            clearOnEscape: true,
            wrapperClass: '',
            zindex: 99
        };

    })(jQuery, window, document);
 

 
    var addRippleEffect = function (e) {
        var target = e.target;
        if (target.tagName !== 'a') return false;


        var rect = target.getBoundingClientRect();
        var ripple = target.querySelector('.ripple');
        if (!ripple) {
            ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
            target.appendChild(ripple);
        }
        ripple.classList.remove('show');
        var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
        var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
        ripple.style.top = top + 'px';
        ripple.style.left = left + 'px';
        ripple.classList.add('show');
        return false;
    }

document.addEventListener('click', addRippleEffect, false);
 



 

    function ShowSuccessActivity(Message, Type) {

        switch (Type) {
            case -1:
                $(".errorcontent").css("background", "rgba(175,37,37,0.7)");

                break;
            case 0:
                $(".errorcontent").css("background", "rgba(198,94,40,0.7)");
                break;
            case 1:
                $(".errorcontent").css("background", "rgba(23,123,61,0.7)");
                break;
            case 2:

                $(".errorcontent").css("background", "rgba(206,89,161,0.7)");

                break;
            case 3:
                $(".errorcontent").css("background", "rgba(88,55,130,0.7)");
                break;
            case 4:
                $(".errorcontent").css("background", "rgba(13,25,15,0.7)");
                break;
            case 5:
                $(".errorcontent").css("background", "rgba(140, 105,0,0.7)");
                break;
            case 12:

                $(".errorcontent").css("background", "rgba(248,194,23,0.7)");

                break;
            default:

        }
        Message = Message != null && Message != undefined ? Message : "Saved";
        $("#mysmallModal").removeClass('bounceOut').addClass('bounceIn');
        $('#mysmallModal').show();
        $('#DataText').html(Message);

        setTimeout(function () {
            hideSuccess();
        }, 250)
    }
 
