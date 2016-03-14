angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('BrowseCtrl', function($scope) {

    $scope.onload = function () {
    $scope.video = document.getElementById('webcam');
    $scope.canvas = document.getElementById('canvas');
    $scope.log = document.getElementById('log');
    $scope.stat = new profiler();
    $scope.ctx;
    $scope.img_u8;
    alert($scope.video);
            //alert($scope.video,$scope.canvas,$scope.log,$scope.stat,$scope.ctx,$scope.img_u8);
            
            compatibility.getUserMedia({ video: true }, function (stream) {
                try {
                    setTimeout(function () {
                         $scope.video.play();
                    }, 500);
                    $scope.video.src = compatibility.URL.createObjectURL(stream);
                    demo_app( $scope.video.videoWidth,  $scope.video.videoHeight);
                } catch (error) {
                    $scope.video.src = stream;
                    console.log("error init");
                }
            }, function (error) {
                console.log("error gum");
            });
            // initialize the application
            function demo_app(videoWidth, videoHeight) {
                $scope.ctx = $scope.canvas.getContext('2d');

                $scope.img_u8 = new jsfeat.matrix_t(640, 480, jsfeat.U8_t | jsfeat.C1_t);

                compatibility.requestAnimationFrame(tick);

                console.log("initialized");
                $scope.stat.add("grayscale");
                $scope.stat.add("rewrite");
            }

            // process each acquired image
            function tick() {
                compatibility.requestAnimationFrame(tick);
                $scope.stat.new_frame();
                if ($scope.video.readyState === $scope.video.HAVE_ENOUGH_DATA) {
                    $scope.ctx.drawImage($scope.video, 0, 0, 640, 480);
                    $scope.imageData = $scope.ctx.getImageData(0, 0, 640, 480);

                    // greyscale conversion
                    $scope.stat.start("grayscale");
                    // I should put some code here
                    jsfeat.imgproc.grayscale($scope.imageData.data, 640, 480, $scope.img_u8);s

                    $scope.stat.stop("grayscale");

                    // render result back to canvas (Warning: format is RGBA)
                    $scope.stat.start("rewrite");
                    // I should put some more code here
                    // render result back to canvas
                    $scope.data_u32 = new Uint32Array($scope.imageData.data.buffer);
                    var alpha = (0xff << 24);
                    var i = $scope.img_u8.cols*$scope.img_u8.rows, pix = 0;
                    while(--i >= 0) {
                        pix = $scope.img_u8.data[i];
                        data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
                    }

                    $scope.stat.stop("rewrite");

                    $scope.ctx.putImageData(imageData, 0, 0);
                    $scope.log.innerHTML = $scope.stat.log();
                }
            }
        }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
