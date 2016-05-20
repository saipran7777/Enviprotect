angular.module('starter.controllers', ['firebase', 'ngCordova'])


//start UploadpageCtrl
.controller('homeCtrl', function($state, $scope, $cordovaCamera, $stateParams) {
        $scope.report = function() {
            $state.go("app.report");
        };

        $scope.upload = function() {
            alert("Sending...");
            $http.get('192.168.216.1:5000/try?txt=' + String($scope.source))
                .success(function(data) {
                    alert("Success" + data);
                })
                .error(function(data) {
                    alert("error" + data);
                })
        };

    })
    .controller('aboutCtrl', function($scope, $stateParams) {

    })

.controller('reportCtrl', function($scope, $stateParams, $firebase, $cordovaGeolocation,$cordovaCamera,$ionicPopup, $ionicLoading, $state, $scope,$ionicPlatform) {

    
            // Code goes here

            $scope.user = {
                name1: "",
                number: "",
                email: ""
            };
            $scope.sample = {
                source: "",
                strength: "",
                smell: "",
                color: "",
                address: ""
            };

            console.log($scope.sample);
            $scope.locstat = true;
            $scope.disableTap = function() {
                var container = document.getElementsByClassName('pac-container');
                angular.element(container).attr('data-tap-disabled', 'true');
                var backdrop = document.getElementsByClassName('backdrop');
                angular.element(backdrop).attr('data-tap-disabled', 'true');
                angular.element(container).on("click", function() {
                    document.getElementById('pac-input').blur();
                });
            };

            $scope.showAlert = function(txt) {
                if (txt = "det") {
                    $ionicPopup.alert({

                        title: 'User Details',
                        template: 'Your Details have been saved! Please Enter the Sample Details'

                    });
                } else {
                    $ionicPopup.alert({
                        title: 'User Details',
                        template: 'Your Report has been recorded successfully!'
                    });
                }

            };

            $scope.geolocat = function() {

                $scope.locstat = false;
                //Geo Location
                var vm = this;
                vm.myLocation = "";

                var geocoder = new google.maps.Geocoder();

                $scope.loading = $ionicLoading.show({
                    content: 'Getting current location...',
                    showBackdrop: false
                });
                
                  navigator.geolocation.getCurrentPosition(function(pos) {
                    $scope.loading=$ionicLoading.hide();
                    $scope.conlat = pos.coords.latitude;
                    $scope.conlong = pos.coords.longitude;
                    console.log(pos);
                    LatLng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
                    showLocation(LatLng);
                  },function(error){
                    $scope.loading=$ionicLoading.hide();
                    alert("failed to get location"+".Code:"+error.code+"Message"+error.message);
                    $scope.locstat = true;
                  },{timeout:15000,enableHighAccuracy: true});

                function showLocation(LatLng) {
                    geocoder.geocode({
                        'latLng': LatLng
                    }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            vm.myLocation = results[0].formatted_address;
                            $scope.sample.address = vm.myLocation;
                            document.getElementById("add").value = vm.myLocation;
                            console.log($scope.sample.address + $scope.sample.source);
                            console.log(results);
                    $ionicPopup.alert({
                        title: 'Location',
                        template: "Your Location is "+$scope.sample.address+".Drag the marker to change location and press tick mark to confirm"
                    });
                        
                            // Code will be here
                            // var myLatLng = {lat: lati, lng: long};
                            // Create a map object and specify the DOM element for display.
                            var map = new google.maps.Map(document.getElementById('map'), {
                                center: LatLng,
                                scrollwheel: false,
                                zoom: 18
                            });

                            //Setting Marker
                            var marker = new google.maps.Marker({
                                position: LatLng,
                                map: map,
                                title: 'Your Location!',
                                draggable: true
                            });
                            // To add the marker to the map, call setMap();
                            marker.setMap(map);
                            //If dragged
                            google.maps.event.addListener(marker, 'dragend', function(event) {
                                $scope.conlat = this.getPosition().lat();
                                $scope.conlong = this.getPosition().lng();
                                console.log("latitude:" + $scope.conlat + ",longitude:" + $scope.conlong);
                                map.setCenter(marker.position);
                                marker.setMap(map);
                            });
                        }
                    })
                };
            };


            $scope.ticklocation = function(){
              $scope.locstat = true;
            };

            $scope.source = {};
            $scope.image = true;

            $scope.imgUpload = function(sourceTypevalue){
              document.addEventListener("deviceready", function () {
                var options = {
                  quality: 100,
                  destinationType: Camera.DestinationType.FILE_URI,
                  sourceType: sourceTypevalue,
                  allowEdit: true,
                  encodingType: Camera.EncodingType.JPEG,
                  targetWidth: 1280,
                  targetHeight: 1280,
                  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false
            };

                $cordovaCamera.getPicture(options).then(function(imageURI) {
                  var image = document.getElementById('myImage');
                  image.src = imageURI;
                  // alert("imageURI: "+ imageURI);
                  $scope.source=image.src;
                  $scope.image = false;
                  // $http.get("10.22.20.129:5000/api/webservice/uploadPrescriptionFile?inputFilePath="+ imageURI)
                  //       .success(function(id) {    
                  //       alert("Successfully Uploaded:"+id);
                  //       $SelectedValues.setAttachmentId(id);
                  //       })
                  //       .error(function(error) {
                  //       alert("Fail.due to "+error);
                  //       $CheckNetwork.check();
                  //       });
                }, function(err) {
                  // error
                  alert("Sorry!No picture was selected");


              }, false);
              });

            };

            firebaseObj1 = new Firebase("https://blinding-torch-2940.firebaseio.com/User_details");
            var fb1 = $firebase(firebaseObj1);

    $scope.savedetails = function() {
        $state.go("app.type");
    };

            firebaseObj2 = new Firebase("https://blinding-torch-2940.firebaseio.com/Sample_details");
            var fb2 = $firebase(firebaseObj1);

    $scope.savesampledetails = function() {

        var source = $scope.sample.source;
        var strength = $scope.sample.strength;
        var smell = $scope.sample.smell;
        var color = $scope.sample.color;
        var address = $scope.sample.finaladdress;
        console.log("source:" + source + "strength:" + strength + "smell:" + smell + "color:" + color + "address:" + address);
        fb2.$push({
                number: $scope.user.number,
                name: $scope.user.name1,
                email: $scope.user.email,
                source: source,
                strength: strength,
                smell: smell,
                color: color,
                address: address
            })
            .then(function(ref) {
                    $scope.user = {};
                    $scope.showAlert("sam");
                    $state.go("app.home");
                },
                function(error) {
                    console.log("Error:", error);
                });
    };
      
    
})

// .directive('map', function() {
//     return {
//         restrict: 'A',
//         link:function(scope, element, attrs){

//     };

// });