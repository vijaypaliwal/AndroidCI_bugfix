'use strict';
app.controller('detailController', ['$scope', 'localStorageService', 'authService', '$location', 'log', '$compile', function ($scope, localStorageService, authService, $location, log, $compile) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageListdetail = [];
    $scope.ImageList = [];
    $scope.slide = 0;
    $scope.Totalslides = 0;
    $scope.CanAddIntoCart = false;

    $scope.mainObjectToSend = [];


    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    $scope.IsEmptyAllcheck = function (Obj) {
        var _return = true;


        if (Obj.iUnitNumber2 == null && Obj.iUnitNumber1 == null && Obj.iUnitDate2 == null && Obj.iUniqueDate == null && Obj.iStatusValue == "" && Obj.iReqValue == "" && Obj.iUnitTag2 == "" && Obj.iUnitTag3 == "") {
            _return = false;
        }

        return _return;

    }
    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }
    $scope.OpenmenuModal = function () {

        if ($("body").hasClass("modal-open")) {
            $("#myModal2").modal('hide');
        }
        else {
            $("#myModal2").modal('show');
        }
    }

    $scope.ScanNewCustomSwitch = function (_colID, _Column, CType) {

        _colID = (CType == 1 ? "CustomItem_" : "CustomActivity_") + _colID;
        var _id = "#" + _colID;


        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan(function (result) {


            var resultvalue = result.text;



            $(_id).val(resultvalue);

            $(_id).trigger("change");



        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.CancelEdit = function () {
        $scope.IsEditMode = false;

        $scope.$apply();

    }

    $scope.viewhistory = function () {
        $location.path('/InventoryHistory');

        $scope.$apply();

    }

    $scope.showinventory = function () {
        $location.path('/FindItems');

        $scope.$apply();

    }



    $scope.OpenBox = function () {



        $("#bottommenumodal").modal('hide');

        $("#myModalforlist").modal("show");

    }

    $scope.triggerFileClick = function () {
        $("#files").trigger("click");
        $("#myModalforlist").modal("hide");
    }


    $scope.OpenBoxAndroid = function () {
        $("#myModalforlist").modal("show");
    }



    $("#files").on('change', function (event) {
        $scope.handleFileSelect(event);
    });


    $scope.RemoveFromImageList = function (ID) {
        for (var i = 0; i < $scope.ImageList.length; i++) {
            if ($scope.ImageList[i].ImageID == ID) {
                $scope.ImageList.splice(i, 1);
                break;
            }
        }
    }

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    $scope.handleFileSelect = function (evt) {


        var files = evt.target.files;
        var FileName = "";
        var StreamData = "";
        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {

                var id = randomString(5, '0123456789');
                _ImgObj.ImageID = id;

                var crossicon = '<a class="btn btn-danger removeImage" altid="' + id + '" onclick="removeImage(' + id + ')"><i class="fa fa-times"></i></a>';
                var compilehtml = $compile(crossicon)($scope);

                $(".viewimage").show();
                return function (e) {
                    // Render thumbnail.
                    FileName = theFile.name;
                    StreamData = e.target.result;
                    _ImgObj.FileName = FileName;
                    _ImgObj.bytestring = e.target.result;
                    _ImgObj.Size = theFile.size;


                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }

        setTimeout(function () {

            $scope.ImageList.push(_ImgObj);
            CheckScopeBeforeApply();


            $(".iteminfo").trigger("click;");

        }, 100);

    }

    $scope.onPhotoDataSuccessNew = function (imageData) {

        $("#bottommenumodal").modal('hide');

        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }

        imageData = "data:image/jpeg;base64," + imageData;

        var id = randomStringNew(5, '0123456789');
        _ImgObj.ImageID = id;
        $(".viewimage").show();

        $("#myModalforlist").modal("hide");


        _ImgObj.FileName = "IphoneCapture";
        _ImgObj.bytestring = imageData;


        $scope.ImagObject = _ImgObj

        //updated for image crop
        $scope.myImage = '';
        $scope.myCroppedImage = '';

        $scope.myImage = imageData;

        CheckScopeBeforeApply();
        UsFullImg = true;

        //$("#myModalforCropImg").modal("show");


        $scope.ImageList.push(_ImgObj);
        //CheckScopeBeforeApply();

    }


    $scope.itemsummaryload = false;



    $scope.GetItemSummary = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({
            url: serviceBase + "GetCustomFieldsWithValues",
            type: 'POST',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Type": 0, "ItemId": $scope.CurrentInventory.pID }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {


                $scope.Itemsummary = result.GetCustomFieldsWithValuesResult.Payload;

                console.log("$scope.Itemsummary");
                console.log($scope.Itemsummary);
                $scope.itemsummaryload = true;

                CheckScopeBeforeApply();

            },
            error: function (err) {

                $scope.itemsummaryload = true;

            },
            complete: function () {

                $scope.itemsummaryload = true;
            }
        });

    }



    $scope.saveCroppedImage = function () {
        if (!UsFullImg) {
            $scope.ImagObject.bytestring = "data:image/jpeg;base64," + removePaddingCharacters($("#croppedImage").attr("ng-src"));
        }
        else {
         
            $scope.ImagObject.bytestring = "data:image/jpeg;base64," + removePaddingCharacters($scope.ImagObject.bytestring);
        }
      
        $scope.ImageList.push($scope.ImagObject);
        CheckScopeBeforeApply();
        $("#myModalforCropImg").modal("hide");
    }

    $scope.onFail = function (message) {

        log.error('Failed because: ' + message);
    }


    $scope.capturePhotoNew = function () {

        navigator.camera.getPicture($scope.onPhotoDataSuccessNew, $scope.onFail, {
            quality: 50,
           // targetWidth: 120,
           // targeHeight: 120,
            correctOrientation: true,
            destinationType: destinationType.DATA_URL,
            allowEdit: true,
            saveToPhotoAlbum: false,
        });
    }

    $scope.viewimages = function () {
        $("#imagemodal").modal('show');
    }


    function removeImage(_this) {

        $("#" + _this).each(function () {

            $(this).parent("span").remove();
        });

        for (var i = 0; i < $scope.ImageList.length; i++) {
            if ($scope.ImageList[i].ImageID == _this) {
                $scope.ImageList.splice(i, 1);
                break;
            }
        }


        if ($scope.ImageList.length == 0) {
            $("#imagemodal").modal('hide');

            $(".viewimage").hide();

        }


        removeImage(_this)

    }


    $scope.getPhoto = function (source) {

        navigator.camera.getPicture($scope.onPhotoURISuccessNew, $scope.onFail, {
            quality: 50,
            destinationType: destinationType.DATA_URL,
            correctOrientation: true,
            allowEdit: true,
            sourceType: pictureSource.PHOTOLIBRARY
        });
    }

    $scope.onPhotoURISuccessNew = function (imageData) {

        $(".viewimage").show();
        $("#bottommenumodal").modal('hide');

        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }

        imageData = "data:image/jpeg;base64," + imageData;

        var id = randomStringNew(5, '0123456789');
        _ImgObj.ImageID = id;


        $("#myModalforlist").modal("hide");


        _ImgObj.FileName = "IphoneLibrary";
        _ImgObj.bytestring = imageData;


        $scope.ImagObject = _ImgObj

        //updated for image crop
        $scope.myImage = '';
        $scope.myCroppedImage = '';

        $scope.myImage = imageData;

        UsFullImg = true;
        //$("#myModalforCropImg").modal("show");
        $scope.ImageList.push(_ImgObj);

        CheckScopeBeforeApply();
    }


    $scope.realItemname = "Name";
    $scope.realDescname = "Description";

    $scope.GetMyinventoryColumns = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetMyInventoryColumns',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
              success: function (response) {





                  if (response.GetMyInventoryColumnsResult.Success == true) {

                      var _TempArray = response.GetMyInventoryColumnsResult.Payload;

                      for (var i = 0; i < _TempArray.length; i++) {
                          var _ColName = _TempArray[i].ColumnName.split("#");
                          _TempArray[i].ColumnName = _ColName[0];
                          if (_TempArray[i].Show == "True") {
                              $scope.MyinventoryFields.push(_TempArray[i]);
                          }

                          if (_TempArray[i].ColumnName == "pPart") {
                              $scope.realItemname = _TempArray[i].ColumnLabel;

                          }

                          if (_TempArray[i].ColumnName == "pDescription") {
                              $scope.realDescname = _TempArray[i].ColumnLabel;

                          }

                          if (_TempArray[i].ColumnName == "iStatusValue") {
                              $scope.statusLabel = _TempArray[i].ColumnLabel;
                          }

                      }
                      CheckScopeBeforeApply()
                  }
                  else {
                      $scope.ShowErrorMessage("My inventory Columns", 1, 1, response.GetMyInventoryColumnsResult.Message)

                  }

              },
              error: function (err, textStatus, errorThrown) {
                  if (err.readyState == 0 || err.status == 0) {

                  }
                  else {
                      if (textStatus != "timeout") {
                          console.log(err);
                          $scope.ShowErrorMessage("My inventory Columns", 2, 1, err.statusText);
                      }
                  }


              }
          });

    }


    $scope.GetMyinventoryColumns()




    init();


    function InitializeSwiper() {
        var mySwiper = new Swiper('.swiper-container', {
            initialSlide: 0,
            speed: 200,
            effect: 'flip',

            allowSwipeToPrev: false,


            onSlideChangeEnd: function (swiperHere) {


                $scope.slide = swiperHere.activeIndex;

                $scope.Totalslides = swiperHere.slides.length;


                $scope.$apply();
            }


        });

        $('.arrow-left').on('click', function (e) {
            e.preventDefault()
            mySwiper.swipePrev();

        })
        $('.arrow-right').on('click', function (e) {
            e.preventDefault()
            mySwiper.swipeNext()

        })
        $scope.Totalslides = mySwiper.slides.length;
        $scope.$apply();

    }


    $scope.showbottomarea = function () {

        $("#overlay").addClass("overlay")


        $(".scaninfo").show();
        $(".scaninfo").css("display", "block");

    }


    $scope.GetUnitDataLabel = function (ColumnName) {
        var i = 0;

        ColumnName = ColumnName.substr(1);
        for (i = 0; i < $scope.MyinventoryFieldsNames.length; i++) {
            if ($scope.MyinventoryFieldsNames[i].ColumnName == ColumnName) {
                return $scope.MyinventoryFieldsNames[i].ColumnLabel;
            }
        }

        return "";
    }


    $scope.Scanitem = function () {

        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan(function (result) {

            $scope.itemscanvalue = result.text;
            $scope.CurrentInventory.pPart = result.text;
            $scope.$apply();



        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.Takeitem = function () {

        $scope.CurrentInventory.pPart = $scope.itemscanvalue;

        $("#overlay").removeClass("overlay");
        $("#scaninfo").hide();
        $scope.$apply();

    }

    $scope.closebottoarea = function () {

        $("#overlay").removeClass("overlay");
        $("#scaninfo").hide();
        $scope.Scanitem();

    }






    $scope.Scandescription = function () {

        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan(function (result) {

            $scope.CurrentInventory.pDescription = result.text;

            $scope.$apply();


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }
    $scope.UpdateCartItems = function () {
        var v = angular.copy($scope.CurrentInventory);
        var mainObjectToSend = {
            uId: v.iID,
            pID: v.pID,
            pPart: v.pPart,
            iLID: v.iLID,
            iUOMID: v.iUOMID,
            iQty: 1,
            oquantity: v.iQty,
            uomUOM: v.uomUOM,
            lLoc: v.lLoc,
            iStatusValue: v.iStatusValue,
            pDescription: v.pDescription,
            Action: '',
            iUniqueDate_date: v.iUniqueDate,
            iUnitNumber2: v.iUnitNumber2,
            iUnitNumber1: v.iUnitNumber1,
            iUnitDate2_date: v.iUnitDate2,
            iUnitTag3: v.iUnitTag3,
            iUnitTag2: v.iUnitTag2,
            pCountFrq: v.pCountFrq,
            lZone: v.lZone,
            ImageThumbPath: v.ImageThumbPath,
            ImageDisplayName: v.ImageDisplayName,
            iReqValue: v.iReqValue,
            iCostPerUnit: v.pDefaultCost,
        }
        var _cartData = localStorageService.get("ActivityCart");
        for (var i = 0; i < _cartData.length; i++) {
            if (_cartData[i].InventoryID == $scope.CurrentInventory.iID) {
                _cartData[i].InventoryDataList = mainObjectToSend;
                _cartData[i].ItemID = mainObjectToSend.pPart;
                break;
            }
        }

        localStorageService.set("ActivityCart", "");
        localStorageService.set("ActivityCart", _cartData);
    }

    $scope.currtrentcustomradiovalue = [];
    $scope.customradiolist = function (ColumnName, id, fieldtype) {


        debugger;

        if (fieldtype == "item") {

            $scope.activeradiofield = "CustomItem_" + id;

            for (var i = 0; i < $scope.Itemdata.length; i++) {
                if ($scope.Itemdata[i].ColumnMap == ColumnName) {
                    $scope.currtrentcustomradiovalue = $scope.Itemdata[i].cfdRadioValues;
                    break;
                }
            }



        }


        if (fieldtype == "activity") {
            $scope.activeradiofield = "CustomActivity_" + id;

            for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
                if ($scope.CustomActivityDataList[i].ColumnMap == ColumnName) {
                    $scope.currtrentcustomradiovalue = $scope.CustomActivityDataList[i].cfdRadioValues;
                    break;
                }
            }
        }

        console.log($scope.currtrentcustomradiovalue)

        $("#customradiotextmodal").modal("show");
    }

    $scope.fillcurrentradiovalue = function (value) {

        $scope.selectedradiovalue = value;



    }

    $scope.fillvaluetoradio = function () {

        debugger;

        $("#" + $scope.activeradiofield).val($scope.selectedradiovalue);

        $("#" + $scope.activeradiofield).trigger("input");

        $("#customradiotextmodal").modal("hide");

    }

    $scope.UpdateInventory = function () {

        //Prefix/Suffix fields work
        //for (var i = 0; i < $scope.InventoryObject.length; i++) {

        //    var _cfdID = $scope.InventoryObject[i].CfdID;
        //    var _HasPrefix = $("#CustomItem_" + _cfdID).attr("data-prefix");
        //    var _HasSuffix = $("#CustomItem_" + _cfdID).attr("data-suffix");
        //    var _Value = $("#CustomItem_" + _cfdID).val();

        //    debugger;

        //    if ($.trim(_HasPrefix) != "" || $.trim(_HasSuffix) != "") {
        //        if ($.trim(_Value) != "") {
        //            $scope.InventoryObject[i].Value = $("#CustomItem_" + _cfdID).attr("data-orginal-value");
        //        }
        //        else {
        //            $scope.InventoryObject[i].Value = "";
        //        }
        //    }
        //}



        $scope.InventoryObject;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {

                $(".viewimage").hide();

                var _toSendImages = angular.copy($scope.ImageList);

                for (var i = 0; i < _toSendImages.length; i++) {

                    if (_toSendImages[i].bytestring != null && _toSendImages[i].bytestring != undefined) {
                        _toSendImages[i].bytestring = removePaddingCharacters(_toSendImages[i].bytestring);

                    }
                }

                $scope.SavingData = true;
                $scope.$apply();

                var _data = { "IID": $scope.CurrentInventory.iID, "pID": $scope.CurrentInventory.pID, "pPart": $scope.CurrentInventory.pPart, "pDescription": $scope.CurrentInventory.pDescription };
                $.ajax({
                    url: serviceBase + "UpdateInventory",
                    type: 'POST',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "data": _data, "ImageList": _toSendImages, "CustomFieldsWithData": $scope.InventoryObject }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {

                        if (result.UpdateInventoryResult.Success == true) {

                            if (result.UpdateInventoryResult.Payload == 1) {
                                //log.success("Inventory updated successfully.");
                                ShowSuccess("Updated");
                                $scope.IsEditMode = false;
                                $scope.itemsummaryload = false;
                                $scope.ImageList = [];
                                $scope.$apply();
                                localStorageService.set("CurrentDetailObject", $scope.CurrentInventory);
                                $scope.SavingData = false;
                                init();
                                $scope.getitemimage();
                                $scope.UpdateCartItems();
                            }
                            else {
                                log.error(Message);
                            }

                        }
                        else {

                            $scope.ShowErrorMessage("Update Inventory Detail", 3, 1, result.GetInventoriesResult.Message);
                        }

                    },
                    error: function (err) {

                        $scope.SavingData = false;

                        $scope.ShowErrorMessage("Update Inventory Detail", 1, 2, err.statusText);

                    },
                    complete: function () {
                    }
                });
            }



        });

        box.on("shown.bs.modal", function () {
            $(".mybootboxbody").html("This operation is going to change your item details. ");

        });

    }


    function TryParseFloat(str, defaultValue) {
        var retValue = defaultValue;
        if (str !== null && str != undefined && $.trim(str) != "") {
            if (str.length > 0) {
                if (!isNaN(str)) {
                    retValue = parseFloat(str);
                }
            }
        }
        return retValue;
    }

    $scope.UpDownValue = function (value, IsUp, Type) {

        debugger;

        switch (value) {
            case "Quantity":
                if ($.trim($scope.InventoryObject.Quantity) == "") {

                    $scope.InventoryObject.Quantity = 0;

                }
                if (!IsUp) {
                    if ($scope.InventoryObject.Quantity > 0) {

                        $scope.InventoryObject.Quantity = $scope.InventoryObject.Quantity + (IsUp ? 1 : -1);
                    }
                }
                else if (IsUp) {
                    $scope.InventoryObject.Quantity = $scope.InventoryObject.Quantity + (IsUp ? 1 : -1);
                }
                break;
            default:

                debugger;
                var _name;
                var _ID;

                if (Type == undefined) {
                    _name = $scope.CurrentActiveFieldType == "Inventory" ? "CustomItem_" + value : "CustomActivity_" + value;


                }
                else {
                    _name = Type == 1 ? "CustomItem_" + value : "CustomActivity_" + value;
                }

                _ID = "#" + $("input[name='" + _name + "']").attr("id");
                var _inputvalue = $(_ID).val();
                var _Max = $(_ID).attr("max");
                var _Min = $(_ID).attr("min");
                _inputvalue = TryParseFloat(_inputvalue, 0);
                _Max = TryParseFloat(_Max, -100);
                _Min = TryParseFloat(_Min, -100);
                if (IsUp && _Max != -100 && _inputvalue == _Max) {
                    log.error("Exceeding maximum value " + _Max + ", Please fill lesser value than maximum value");
                }

                else if (!IsUp && _Min != -100 && _inputvalue == _Min) {
                    log.error("Beneath the  minimum value " + _Min + ", Please fill greater value than minimum value");

                }
                else {

                    _inputvalue = _inputvalue + (IsUp ? 1 : -1);

                    $(_ID).val(_inputvalue);


                    $(_ID).trigger("change");
                }
                break;

        }


    }


    $scope.fillcustomvalue = function (value) {
        $("#" + $scope.activecustomfield).val(value);

        $("#" + $scope.activecustomfield).trigger("input");
        CheckScopeBeforeApply();
        $("#customautolistmodal").modal('hide');

    }

    $scope.currtrentcustomauto = [];

    $scope.customautocomplete = function (ColumnName, id, fieldtype) {
        $("#customautolistmodal").modal('show');



        if (fieldtype == "item") {
            $scope.activecustomfield = "CustomItem_" + id;
            for (var i = 0; i < $scope.Itemdata.length; i++) {
                if ($scope.Itemdata[i].ColumnMap == ColumnName) {
                    $scope.currtrentcustomauto = $scope.Itemdata[i].cfdComboValues;
                    break;
                }
            }
        }

    }

    function leadZero(_something) {
        var _TempString = parseInt(_something);
        _something = _TempString.toString();
        if (parseInt(_something) < 10) return "0" + _something;
        return _something;//else    
    }

    $scope.weeklist = [];
    $scope.CurrentYear = new Date().getFullYear();

    for (var i = 1; i <= 52; i++) {

        var x = leadZero(i);

        $scope.weeklist.push(x);
    }
    $scope.GetCustomItemObjByColumnmap = function (columnMap) {


        for (var i = 0; i < $scope.Itemdata.length; i++) {
            if ($scope.Itemdata[i].ColumnMap == columnMap) {


                return $scope.Itemdata[i];
            }
        }
        return new Object();
    }

    $scope.GetCustomColumn = function (ColumnMap) {



        var _obj = undefined;
        for (var i = 0; i < $scope.Itemdata.length; i++) {
            if ($scope.Itemdata[i].ColumnMap == ColumnMap) {



                return $scope.Itemdata[i];
            }

        }


        return _obj;

    }

    $scope.getIndexBycolName = function (_ID) {
        for (var i = 0; i < $scope.InventoryObject.length; i++) {
            if ($scope.InventoryObject[i].CfdID == _ID) {
                return i;
            }

        }

        return 0;
    }

    $scope.InventoryObject = [];
    $scope.MyinventoryFields = [];



    function ConverttoMsJsonDate(_DateValue) {

        if ($.trim(_DateValue) != "") {
            var _date = angular.copy(_DateValue);

            var dsplit1 = _date.split("/");
            var now = new Date(dsplit1[2], dsplit1[0] - 1, dsplit1[1]);

            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);

            var today = now.getFullYear() + "-" + (month) + "-" + (day);

            return today;

        }
        else { return ""; }

    }

    function ConverttoMsJsonDateTime(_DateValue) {


        if ($.trim(_DateValue) != "") {
            var _date = angular.copy(_DateValue);

            var dsplit1 = _date.split("/");

            var _timeSplit = dsplit1[2].split(" ");

            var _timeString = _timeSplit[1].split(":");

            if (parseInt(_timeString[0]) >= 12) {
                _timeString[0] = (parseInt(_timeString[0]) - 12).toString();
            }

            var _ToMergeTime = "T" + (_timeSplit[2] == "AM" ? leadZero(_timeString[0]) : leadZero((12 + parseInt(_timeString[0]))).toString()) + ":" + leadZero(_timeString[1]);

            var now = new Date(_timeSplit[0], dsplit1[0] - 1, dsplit1[1]);

            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);

            var today = now.getFullYear() + "-" + (month) + "-" + (day);

            return today + _ToMergeTime;

        }
        else { return ""; }


    }

    function ConvertToTime(_timeValue) {



        if ($.trim(_timeValue) != "") {

            var _timeSplit = _timeValue.split(" ");
            var _timeString = _timeSplit[0].split(":");

            if (parseInt(_timeString[0]) >= 12) {
                _timeString[0] = (parseInt(_timeString[0]) - 12).toString();
            }

            var _ToMergeTime = (_timeSplit[1] == "AM" ? leadZero(_timeString[0]) : leadZero((12 + parseInt(_timeString[0]))).toString()) + ":" + leadZero(_timeString[1]);

            return _ToMergeTime;
        }

        return "";

    }







    $scope.GetItemvalues = function () {

        $scope.MyinventoryFields = [];

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({
            url: serviceBase + "GetCustomFieldsWithValues",
            type: 'POST',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Type": 0, "ItemId": $scope.CurrentInventory.pID }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {







                $scope.Itemdata = result.GetCustomFieldsWithValuesResult.Payload;


                console.log("=================== $scope.Itemdata=====================");
                console.log($scope.Itemdata);
                console.log("==================== $scope.Itemdata====================");


                for (var i = 0; i < $scope.Itemdata.length; i++) {
                    var _defaultValue = angular.copy($scope.Itemdata[i].cfdValue);


                    if ($scope.Itemdata[i].cfdDataType == "datetime") {

                        if (_defaultValue != null && _defaultValue != "") {
                            if ($scope.Itemdata[i].cfdSpecialType == 2) {
                                $scope.Itemdata[i].cfdValue = ConverttoMsJsonDateTime(_defaultValue);
                            }
                            else if ($scope.Itemdata[i].cfdSpecialType == 3) {
                                $scope.Itemdata[i].cfdValue = ConvertToTime(_defaultValue);
                            }
                            else {

                                $scope.Itemdata[i].cfdValue = ConverttoMsJsonDate(_defaultValue);
                            }
                        }
                    }
                }


                for (var i = 0; i < $scope.Itemdata.length; i++) {
                    var _defaultValue = angular.copy($scope.Itemdata[i].cfdValue);

                    if ($scope.Itemdata[i].cfdDataType == "string" && $scope.Itemdata[i].cfdprefixsuffixtype == 1 && $scope.Itemdata[i].cfdValue != null) {

                        debugger;

                        $scope.Itemdata[i].cfdValue = $scope.Itemdata[i].cfdValue.replace($scope.Itemdata[i].cfdPrefix, '');
                    }

                    if ($scope.Itemdata[i].cfdDataType == "string" && $scope.Itemdata[i].cfdprefixsuffixtype == 2 && $scope.Itemdata[i].cfdValue != null) {

                        $scope.Itemdata[i].cfdValue = $scope.Itemdata[i].cfdValue.replace($scope.Itemdata[i].cfdSuffix, '');
                    }

                    if ($scope.Itemdata[i].cfdDataType == "string" && $scope.Itemdata[i].cfdprefixsuffixtype == 3 && $scope.Itemdata[i].cfdValue != null) {

                        $scope.Itemdata[i].cfdValue = $scope.Itemdata[i].cfdValue.replace($scope.Itemdata[i].cfdSuffix, '');
                        $scope.Itemdata[i].cfdValue = $scope.Itemdata[i].cfdValue.replace($scope.Itemdata[i].cfdPrefix, '');
                    }

                    if ($scope.Itemdata[i].cfdDataType == "currency" || $scope.Itemdata[i].cfdDataType == "number") {

                        $scope.Itemdata[i].cfdValue = parseFloat($scope.Itemdata[i].cfdValue);

                    }

                }




                for (var i = 0; i < $scope.Itemdata.length; i++) {

                    var _obj = {
                        cfdName: "",
                        cfdID: 0,
                        cfdDataType: "",
                        cfdComboValues: [],
                        CfValue: "",
                        ColumnName: $scope.Itemdata[i].ColumnMap,
                        RowID: $scope.Itemdata[i].RowID,
                        ColumnLabel: $scope.Itemdata[i].ColumnLabel,
                        Show: $scope.Itemdata[i].Show,
                        Sort: $scope.Itemdata[i].Sort,
                        mobileorder: $scope.Itemdata[i].mobileorder,
                        Required: $scope.Itemdata[i].Required,
                        CustomFieldIndex: -1,

                    }

                    var _CustomObj = $scope.GetCustomColumn($scope.Itemdata[i].ColumnMap);

                    debugger;

                    if (_CustomObj != undefined && _CustomObj != {}) {


                        _obj.cfdName = _CustomObj.cfdName;
                        _obj.cfdID = _CustomObj.cfdID;
                        _obj.cfdDataType = _CustomObj.cfdDataType;
                        _obj.cfdComboValues = _CustomObj.cfdComboValues;


                        if ($.trim(_obj.cfdComboValues) != '') {
                            _obj.cfdComboValues = _obj.cfdComboValues.filter(function (e) { return e });
                        }

                        // _obj.CfValue = ($.trim(_CustomObj.cfdprefixsuffixtype) != "" ? _CustomObj.CombineValue : _CustomObj.cfdValue);

                        _obj.CfValue = _CustomObj.cfdValue;

                        _obj.Required = _CustomObj.cfdIsRequired;
                        _obj.cfdTruelabel = _CustomObj.cfdTruelabel;
                        _obj.cfdFalselabel = _CustomObj.cfdFalselabel;



                        $scope.InventoryObject.push({ CfdID: _CustomObj.cfdID, Value: _obj.CfValue, DataType: _CustomObj.cfdDataType, TrueLabel: _CustomObj.cfdTruelabel, FalseLabel: _CustomObj.cfdFalselabel });



                        CheckScopeBeforeApply();


                    }





                    console.log("Custom Item data");
                    console.log($scope.InventoryObject);

                    debugger;


                    //for (var x = 0 ; x < $scope.InventoryObject.length; x++)
                    //{
                    //    if ($scope.InventoryObject[x].DataType == "datetime")
                    //    {
                    //        $scope.InventoryObject[x].Value = "02:05";
                    //    }
                    //}











                    _obj.CustomFieldIndex = _obj.cfdID != 0 ? $scope.getIndexBycolName(_obj.cfdID) : -1;


                    $scope.MyinventoryFields.push(_obj);

                    console.log("$scope.MyinventoryFields");
                    console.log($scope.MyinventoryFields);


                }


                console.log("My Inventory fields");

                console.log($scope.MyinventoryFields)



                console.log("$scope.Itemdata");
                console.log($scope.Itemdata);

                setTimeout(function () {
                    SetWeekMonthValues();
                }, 300)

                $scope.loaditemfields = true;
                CheckScopeBeforeApply();

                setTimeout(function () {

                    $("select.form-control").each(function () {
                        $(this).trigger("change");
                    })
                }, 300)


            },
            error: function (err) {


                $scope.loaditemfields = true;



            },
            complete: function () {

                $scope.loaditemfields = true;

            }
        });

    }




    function SetWeekMonthValues() {

        debugger;
        $(".weekPicker").each(function () {
            var _val = $(this).attr("selectvalue");

            $(this).val(_val);
            $(this).trigger("change");
        });

        $(".radioselectlist").each(function () {
            var _val = $(this).attr("selectvalue");



            $(this).val(_val);
            $(this).trigger("change");
        });


        $(".chekasradiotrue").each(function () {
            var _val = $(this).attr("currentvalue");



            if (_val == true || _val == "true") {

                $(this).trigger("click");
            }

        });

        $(".chekasradiofalse").each(function () {
            var _val = $(this).attr("currentvalue");

            if (_val == false || _val == "false") {

                $(this).trigger("click");
            }

        });







    }


    $scope.IsRequired = function (id, type) {

        debugger;

        var _CustomFieldArray = [];
        switch (type) {
            case 1:
                _CustomFieldArray = $scope.Itemdata;
                break;
            case 2:
                _CustomFieldArray = $scope.CustomActivityDataList;
                break;

            default:

        }


        for (var i = 0; i < _CustomFieldArray.length; i++) {
            if (_CustomFieldArray[i].cfdIsRequired == true && _CustomFieldArray[i].cfdID == id) {
                return true;
            }
        }

        return false;

    }


    $scope.CheckCustomRequiredFields = function () {


        for (var i = 0; i < $scope.InventoryObject.length; i++) {

            if ($scope.IsRequired($scope.InventoryObject[i].CfdID, 1) == true && $scope.InventoryObject[i].Value == "") {
                return true;
            }

        }


        return false;
    }


    $scope.IsProperEmail = function (email) {

        if ($.trim(email) != "") {

            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
        return true;
    }


    $scope.GetCustomItemObjByColumnID = function (columnMap) {
        for (var i = 0; i < $scope.Itemdata.length; i++) {
            if ($scope.Itemdata[i].cfdID == columnMap) {
                return $scope.Itemdata[i];
            }
        }
        return new Object();
    }


    $scope.CheckEmailFields = function () {

        for (var i = 0; i < $scope.InventoryObject.length; i++) {

            var _emailValue = $.trim($("#CustomItem_" + $scope.InventoryObject[i].CfdID.toString()).val());
            var _mask = $scope.GetCustomItemObjByColumnID($scope.InventoryObject[i].CfdID).cfdInputMask;
            if (_mask == "email" && _emailValue != "" && $scope.IsProperEmail(_emailValue) == false) {
                return true;
            }
        }


        return false;

    }


    $(document)
  .on('change', "input[type='email']", function () {

      if ($.trim($(this).val()) != "") {
          var _value = $(this).val();
          if ($scope.IsProperEmail(_value) == false) {
              $(this).css("border-color", "#c31818");
              $(this).parent("div").find(".emailError").remove();
              $('<span class="emailError">Invalid email</span>').insertAfter(this);

          }
          else {
              $(this).css("border-color", "#cccccc");
              $(this).parent("div").find(".emailError").remove();

          }
      }


  });





    function removePaddingCharacters(bytes) {
        bytes = bytes.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");

        return bytes;
    }

    

    $scope.saveimage = function () {

        $(".viewimage").hide();

        var _toSendImages = angular.copy($scope.ImageList);

        for (var i = 0; i < _toSendImages.length; i++) {

            if (_toSendImages[i].bytestring != null && _toSendImages[i].bytestring != undefined) {
                _toSendImages[i].bytestring = removePaddingCharacters(_toSendImages[i].bytestring);

            }
        }




        $.ajax
      ({
          type: "POST",
          url: serviceBase + 'UploadImage',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ImageList": _toSendImages, "txnID": 0, "pID": $scope.CurrentInventory.pID }),
          success: function (response) {
              log.success("Image has been uploaded successfully for last inventory record.");
              window.location.reload();

              if (response.UploadImageResult.Success == true) {

                  log.success("Image has been uploaded success fully for last inventory record.");

                  CheckScopeBeforeApply();
              }
              else {

                  $scope.ShowErrorMessage("Upload image", 1, 1, response.UploadImageResult.Message)
              }

          },
          error: function (err, textStatus, errorThrown) {
              if (err.readyState == 0 || err.status == 0) {

              }
              else {
                  if (textStatus != "timeout") {
                      if (err.status == 200) {

                          log.success("Image has been uploaded successfully for last inventory record.");

                      }
                      else {

                          log.error(err.statusText);

                      }
                  }
              }
          }
      });


        log.success("Image save process running, Please wait")


        setTimeout(function () {
            $scope.ImageList = [];
        }, 2000)

    }


    $scope.addtocart = function (v) {


        var _cartData = localStorageService.get("ActivityCart");
        if (_cartData == null || _cartData == undefined) {
            _cartData = [];
        }
        var mainObjectToSend = {
            uId: v.iID,
            pID: v.pID,
            pPart: v.pPart,
            iLID: v.iLID,
            iUOMID: v.iUOMID,
            iQty: 1,
            oquantity: v.iQty,
            uomUOM: v.uomUOM,
            lLoc: v.lLoc,
            iStatusValue: v.iStatusValue,
            pDescription: v.pDescription,
            Action: '',
            iUniqueDate_date: v.iUniqueDate,
            iUnitNumber2: v.iUnitNumber2,
            iUnitNumber1: v.iUnitNumber1,
            iUnitDate2_date: v.iUnitDate2,
            iUnitTag3: v.iUnitTag3,
            iUnitTag2: v.iUnitTag2,
            pCountFrq: v.pCountFrq,
            lZone: v.lZone,
            ImageThumbPath: v.ImageThumbPath,
            ImageDisplayName: v.ImageDisplayName,
            iReqValue: v.iReqValue,
            iCostPerUnit: v.pDefaultCost,
        }
        var _defaultQty = $scope.GetDefaultQty();
        _cartData.push({
            InventoryID: mainObjectToSend.uId,
            IsLineItemData: [],
            iCostPerItem: mainObjectToSend.iCostPerUnit,
            ItemID: mainObjectToSend.pPart,
            ActionPerformed: $scope.selectedAction,
            AdjustActionQuantity: "",
            AdjustCalculation: "",
            InventoryDataList: mainObjectToSend,
            IncreaseDecreaseVMData: ({ ActionQuantity: _defaultQty }),
            MoveTransactionData: ({ ActionQuantity: _defaultQty, StatusToUpdate: mainObjectToSend.iStatusValue, MoveToLocationText: "", MoveToLocation: "" }),
            UpdateTransactionData: ({ ActionQuantity: _defaultQty, StatusToUpdate: mainObjectToSend.iStatusValue }),
            ApplyTransactionData: ({ ActionQuantity: _defaultQty, UnitTag1: mainObjectToSend.iReqValue, UnitTag2: mainObjectToSend.iUnitTag2, UnitTag3: mainObjectToSend.iUnitTag3, UniqueDate: mainObjectToSend.iUniqueDate_date, UnitDate2: mainObjectToSend.iUnitDate2_date, UnitNumber1: mainObjectToSend.iUnitNumber1, UnitNumber2: mainObjectToSend.iUnitNumber2 }),
            ConvertTransactionData: ({ ActionFromQuantity: _defaultQty, ActionToQuantity: _defaultQty, ToUOMID: 0 }),
        });

        localStorageService.set("ActivityCart", "");
        localStorageService.set("ActivityCart", _cartData);
        ShowSuccess('Added');

        setTimeout(function () { $("#myModal2").modal('hide'); }, 1000);

        CheckIntoCartData();

    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    function CheckIntoCartData() {
        $scope.CanAddIntoCart = false;

        var _CartData = localStorageService.get("ActivityCart");
        if (_CartData != null && _CartData != undefined) {

            for (var i = 0; i < _CartData.length; i++) {
                if (_CartData[i].InventoryID == $scope.CurrentInventory.iID) {
                    $scope.CanAddIntoCart = true;
                }
            }
        }
        CheckScopeBeforeApply();


    }

    $scope.removecart = function () {
        var _cartData = localStorageService.get("ActivityCart");
        var _newCart = _cartData;
        for (var i = 0; i < _newCart.length; i++) {
            if (_cartData[i].InventoryID == $scope.CurrentInventory.iID) {
                _cartData.splice(i, 1);
                break;
            }
        }

        localStorageService.set("ActivityCart", "");
        localStorageService.set("ActivityCart", _cartData);

        ShowSuccess('Removed');

        setTimeout(function () { $("#myModal2").modal('hide'); }, 1000);

        CheckIntoCartData();

    }

    function init() {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");

        $scope.MyinventoryFieldsNames = localStorageService.get("unitdatafieldsobject");

        $scope.itemlabel = $scope.CurrentInventory.pPart
        CheckIntoCartData();
        $scope.GetItemSummary();
        CheckScopeBeforeApply();
    }

    $scope.getitemimage = function () {




        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetItemImages',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ItemID": $scope.CurrentInventory.pID }),
               contentType: 'application/json',
               dataType: 'json',
               success: function (response) {


                   if (response.GetItemImagesResult.Success == true) {

                       $scope.ImageListdetail = response.GetItemImagesResult.Payload;
                       $scope.$apply();

                       setTimeout(function () { InitializeSwiper() }, 10);


                       setTimeout(function () {
                           $(".loadingimage").hide();
                           $(".imagesection").show();

                       }, 1000);
                   }
                   else {
                       $scope.ShowErrorMessage("Item Images", 1, 1, response.GetItemImagesResult.Message)
                   }
               },
               error: function (err) {

                   $scope.ShowErrorMessage("Item Images", 2, 1, err.statusText);


               }
           });

    }

    $scope.getitemimage();

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


    $scope.OpenImageModal = function (Object) {
        $("#imagemodaldetail").modal('show');
        $scope.CurrentActiveImage = Object;
        $scope.$apply();
    }


    $scope.ToggleEditView = function () {

        $("#myModal2").modal('hide');
        $("#bottommenumodal").modal('hide');
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");



        $scope.IsEditMode = !$scope.IsEditMode;

        if ($scope.IsEditMode == true) {

            $scope.loaditemfields = false;
            $scope.GetItemvalues();

        }

        else {
            $scope.itemsummaryload = false;
            $scope.GetItemSummary();
            CheckScopeBeforeApply();
        }


        setTimeout(function () { InitializeSwiper() }, 10);

        setTimeout(function () {
            $("#bottommenumodal").modal('hide');
            
            $(".loadingimage").hide();
            $(".imagesection").show();
        }, 300);
    }
    var deviceheight = $(window).height();

    $scope.cropmodalheight = deviceheight
}]);