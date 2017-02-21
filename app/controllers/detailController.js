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
        $scope.ImageList.push(_ImgObj);
        CheckScopeBeforeApply();

    }

    $scope.onFail = function (message) {

        log.error('Failed because: ' + message);
    }


    $scope.capturePhotoNew = function () {

        navigator.camera.getPicture($scope.onPhotoDataSuccessNew, $scope.onFail, {
            quality: 50,
            targetWidth: 120,
            targeHeight: 120,
            correctOrientation: true,
            destinationType: destinationType.DATA_URL,
            saveToPhotoAlbum: true,
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
        $scope.ImageList.push(_ImgObj);
        CheckScopeBeforeApply();

    }




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
    $scope.UpdateInventory = function () {

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
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "data": _data, "ImageList": _toSendImages }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {

                        if (result.UpdateInventoryResult.Success == true) {

                            if (result.UpdateInventoryResult.Payload == 1) {
                                //log.success("Inventory updated successfully.");
                                ShowSuccess("Updated");
                                $scope.IsEditMode = false;
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
        setTimeout(function () { InitializeSwiper() }, 10);

        setTimeout(function () {
            $("#bottommenumodal").modal('hide');
            
            $(".loadingimage").hide();
            $(".imagesection").show();
        }, 300);
    }

}]);