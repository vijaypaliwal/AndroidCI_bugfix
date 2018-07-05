'use strict';
app.controller('profileController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
    $scope.Currentuser = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.firstname = "";
    $scope.lastname = "";
    $scope.usename = "";
    $scope.phone = "";
    $scope.organization = "";
    $scope.email = "";
    $scope.picURl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
    $scope.Image={ImageID:0,FileName:"",bytestring:"",Size:0}
    $scope.isSaving = false;
    $scope._isProfileLoading = false;

    $scope.changePassword = {currentPassword:"",newPassword:"",confirmPassword:""}

    function init() {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");
        console.log($scope.CurrentInventory);
        $scope.CurrentAccount = localStorageService.get('AccountID');
        $scope.Getuserinfo();
        $scope.$apply();
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.ischangepassword = false;
    $scope.changePassword = function () {

        if ($scope.changePassword.newPassword == $scope.changePassword.confirmPassword) {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.SecurityToken = authData.token;
            }


            $scope.ischangepassword = true;

            $.ajax({
                url: serviceBase + "ChangePassword",
                type: 'POST',
                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "CurrentPassword": $scope.changePassword.currentPassword, "NewPassword": $scope.changePassword.newPassword }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {



                    if (result.ChangePasswordResult.Success == true) {

                        log.success("Password changed successfully");
                        $scope.changePassword.currentPassword="";
                        $scope.changePassword.newPassword = "";
                        $scope.changePassword.confirmPassword = "";

                    }
                    else {
                        log.error(result.ChangePasswordResult.Message);

                    }

                
                    $scope.ischangepassword = false;
                    $scope.$apply();

                },
                error: function (err) {

                 

                    $scope.ischangepassword = false;
                    $scope.$apply();
                },
                complete: function () {

               
                    $scope.ischangepassword = false;
                    $scope.$apply();
                }
            });

        }

        else {
            log.error("New and confirm password not match");
        }

     

    }



    function removePaddingCharacters(bytes) {
        bytes = bytes.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");

        return bytes;
    }

    $scope.IsdummyImage = true;


    $scope.PreviewImage = function () {

      

        if ($scope.IsdummyImage==false) {
            $("#imagemodaldetail").modal("show");
        }

        
    }

    $scope.Getuserinfo = function () {

        debugger;
        var _string="this.onerror = null;this.src = 'img/dummy-user48.png'";
        $("#myimgProfile").attr("onerror", _string);
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope._isProfileLoading = true;
        $scope.phoneLabel = "";
        $scope.picURl = "";
        $.ajax
           ({
               type: "POST",
               url: serviceBase + "GetUserInfo",
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {

                   debugger;
                   if (response.GetUserInfoResult.Success == true) {
                       
                       
                       $scope.firstname = response.GetUserInfoResult.Payload[0].FirstName
                   $scope.lastname = response.GetUserInfoResult.Payload[0].LastName;
                   $scope.email = response.GetUserInfoResult.Payload[0].Email
                   $scope.phone = response.GetUserInfoResult.Payload[0].Phone
                   $scope.organization = response.GetUserInfoResult.Payload[0].Organization
                   $scope.username = response.GetUserInfoResult.Payload[0].UserName
                   $scope.myprofileimage = response.GetUserInfoResult.Payload[0].ProfilePic;


                   $scope.firstnameLabel = response.GetUserInfoResult.Payload[0].FirstName
                   $scope.lastnameLabel = response.GetUserInfoResult.Payload[0].LastName;
                   $scope.emailLabel = response.GetUserInfoResult.Payload[0].Email
                   $scope.phoneLabel = response.GetUserInfoResult.Payload[0].Phone
                   $scope.organizationLabel = response.GetUserInfoResult.Payload[0].Organization
                   $scope.usernameLabel = response.GetUserInfoResult.Payload[0].UserName

                   if (response.GetUserInfoResult.Payload[0].ProfilePic != null && response.GetUserInfoResult.Payload[0].ProfilePic != "") {


                       if (response.GetUserInfoResult.Payload[0].ProfilePic.indexOf("png") != -1 || response.GetUserInfoResult.Payload[0].ProfilePic.indexOf("jpg") != -1 || response.GetUserInfoResult.Payload[0].ProfilePic.indexOf("jpeg") != -1 || response.GetUserInfoResult.Payload[0].ProfilePic.indexOf("gif") != -1) {
                           $scope.picURl = response.GetUserInfoResult.Payload[0].ProfilePic;
                           $scope.IsdummyImage = false;

                           $scope.ProfilePicURl = $scope.picURl;
                       }

                       else {
                           $scope.picURl = "img/No_image_available.svg";
                           $scope.IsdummyImage = true;
                           $scope.ProfilePicURl = "img/dummy-user48.png";

                       }
                    
                   }

                   else {

                       $scope.picURl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

                       $scope.ProfilePicURl = "img/dummy-user48.png";

                   }
                   
                   $scope._isProfileLoading = false;
                   }
                   else {
                       $scope.ShowErrorMessage("User Info", 1, 1, response.GetUserInfoResult.Message)

                   }

                 


                   $scope.$apply();

                   var d = new Date();
                   $("#myimg").attr("src", $scope.picURl + "?" + d.getTime());
                   $("#myimgProfile").attr("src", $scope.ProfilePicURl + "?" + d.getTime());
                   $("#myimgProfile1").attr("src", $scope.ProfilePicURl + "?" + d.getTime());
                   
                   $("#imagepreview").attr("src", $scope.picURl + "?" + d.getTime());
                   
               },
               error: function (err) {

                   $scope.ShowErrorMessage("User Info", 2, 1, err.statusText);

                   $scope._isProfileLoading = false;
               }
           });

    }

    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });

    $("#files").on('change', function (event) {
        $scope.handleFileSelect(event);
    });


 

    $scope.handleFileSelect = function (evt) {


        var files = evt.target.files;
      var  FileName = "";
      var  StreamData = "";
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

                _ImgObj.ImageID = 2;



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
            $scope.Image = _ImgObj;
            CheckScopeBeforeApply();


            $scope.uploadProfile();

        }, 100);

    }
    $scope.openModel = function () {
        $("#myModalforlist").modal("show");

     //   $("#files").trigger("click");
    }

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


    $scope.onPhotoURISuccessNew = function (imageData) {
        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }

        imageData = "data:image/jpeg;base64," + imageData;

        var id = randomStringNew(5, '0123456789');
        _ImgObj.ImageID = id;

        $(".viewimage").show();
        $("#myModalforlist").modal("hide");


        _ImgObj.FileName = "IphoneLibrary";
        _ImgObj.bytestring = imageData;
        $scope.Image = _ImgObj;
        CheckScopeBeforeApply();
        $scope.uploadProfile();

    }

    $scope.getPhoto = function (source) {
        // Retrieve image file location from specified source
        navigator.camera.getPicture($scope.onPhotoURISuccessNew, $scope.onFail, {
            quality: 50,
            destinationType: destinationType.DATA_URL,
            correctOrientation: true,
            sourceType: pictureSource.PHOTOLIBRARY
        });
    }
    $scope.onPhotoDataSuccessNew = function (imageData) {
        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }

        imageData = "data:image/jpeg;base64," + imageData;

        var id = randomStringNew(5, '0123456789');
        _ImgObj.ImageID = id;

        $("#myModalforlist").modal("hide");


        _ImgObj.FileName = "IphoneCapture";
        _ImgObj.bytestring = imageData;
        $scope.Image=_ImgObj;
        CheckScopeBeforeApply();
        $scope.uploadProfile();

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
            allowEdit: true,
            saveToPhotoAlbum: true,
        });
    }
    $scope.uploadProfile = function () {
        $("#myModalforlist").modal("hide");
        $scope._isProfileLoading = true;
        $scope.$apply();
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope.Image.bytestring = removePaddingCharacters($scope.Image.bytestring);

        $.ajax
           ({
               type: "POST",
               url: serviceBase + "UploadProfileImage",
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ProfileImage": $scope.Image }),
               success: function (response) {
                   debugger;
                   if (response.UploadProfileImageResult.Success == true) {

                       $scope.Getuserinfo();
                     ShowSuccess("Updated");
                   }
                   else {
                       $scope.ShowErrorMessage("Upload profile image", 1, 1, response.UploadProfileImageResult.Message)

                   }
                   $scope.$apply();

               },
               error: function (err) {
                   debugger;
                   $scope.ShowErrorMessage("Upload profile image", 2, 1, err.statusText);


               }
           });
    }

    $scope.Updateinfo = function () {

         
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var _data = { "UserName": $scope.username, "FirstName": $scope.firstname, "LastName": $scope.lastname, "Email": $scope.email, "Phone": $scope.phone, "Organization": $scope.organization, "ProfilePic": $scope.myprofileimage };

        $scope.isSaving = true;
         
        $.ajax({
            url: serviceBase + "UpdateUserInfo",
            type: 'POST',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "data": _data,"IsUserInfo":true }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {
                // log.success("Profile information Updated.");

                if (result.UpdateUserInfoResult.Success == true) {
               
                ShowSuccess("Updated");

                $scope.firstnameLabel = $scope.firstname;
                $scope.lastnameLabel = $scope.lastname;
                $scope.emailLabel = $scope.email;
                $scope.phoneLabel = $scope.phone;
                $scope.organizationLabel = $scope.organization;
                $scope.usernameLabel = $scope.username;


                $(".detailmode").show();
                $(".editmode").hide();
                $scope.isSaving = true;
                $scope.$apply();

                }
                else {
                    $scope.ShowErrorMessage("Updating user info", 3, 1, result.UpdateUserInfoResult.Message)

                }

            },
            error: function (err) {

                $scope.ShowErrorMessage("Updating user info", 2, 1, err.statusText);

                $scope.isSaving = false;
                $scope.$apply();
            
            },
            complete: function () {
                $scope.isSaving = false;
                $scope.$apply();
            }
        });
    
    }



    $scope.logOut = function ()
    {
        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }




    init();













    $scope.Editmode = function () {
        $(".editmode").show();
        $(".detailmode").hide();

    }

    $scope.detailmode = function () {
        $(".editmode").hide();
        $(".detailmode").show();

    }












}]);