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

.controller('PlaylistCtrl', function($scope, $stateParams) 
{
})
.controller('controllerCam', function($scope) 
{
        var video = document.getElementById('webcam');
        var canvas2d = document.getElementById('canvas2d');
        var canvas3D = document.getElementById('canvas3d');
        var log = document.getElementById('log');
        var stat = new profiler();
        var ctx;
        var img_u8;
        var modelSize = 35;
        var step = 0.0;
        var renderer3d, scene, camera, model, texture;
        var imageData, markers, detector, posit;

        window.onload = function () 
         {

            // acquisition video
            compatibility.getUserMedia({ video: true }, function (stream) 
            {
                try {
                    setTimeout(function () {
                        video.play();
                    }, 500);
                    video.src = compatibility.URL.createObjectURL(stream);
                    demo_app(video.videoWidth, video.videoHeight);
                } catch (error) {
                    video.src = stream;
                    console.log("error init");
                }
            }, function (error) {
                console.log("error gum");
            });

            // initialize the application
            function demo_app(videoWidth, videoHeight) {
                ctx = canvas2d.getContext('2d');

                detector = new AR.Detector();
                posit = new POS.Posit(modelSize, canvas2d.width);

                createRenderersScene();

                compatibility.requestAnimationFrame(tick);
                console.log("initialized");
                stat.add("DetectCorners");
                stat.add("Posit");
                stat.add("Update");
            }

            // process each acquired image
            function tick() {
                compatibility.requestAnimationFrame(tick);
                stat.new_frame();
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    ctx.drawImage(video, 0, 0, canvas2d.width, canvas2d.height);
                    imageData = ctx.getImageData(0, 0, canvas2d.width, canvas2d.height);
                    log.innerHTML = stat.log();

                    stat.start("DetectCorners");
                    var markers = detector.detect(imageData);
                    stat.stop("DetectCorners");
                    drawCorners(markers);
                    updateScenes(markers);
                    render();
                }
            }
        }


        function render() {
            renderer3d.autoClear = false;
            renderer3d.clear();
            renderer3d.render(scene, camera);
        };

         function drawCorners(markers) {
            var corners, corner, i, j;

            ctx.lineWidth = 3;

            for (i = 0; i < markers.length; ++i) {
                corners = markers[i].corners;

                ctx.strokeStyle = "red";
                ctx.beginPath();

                for (j = 0; j < corners.length; ++j) {
                    corner = corners[j];
                    ctx.moveTo(corner.x, corner.y);
                    corner = corners[(j + 1) % corners.length];
                    ctx.lineTo(corner.x, corner.y);
                }

                ctx.stroke();
                ctx.closePath();

                ctx.strokeStyle = "green";
                ctx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
            }
        };

         function createRenderersScene() {
            renderer3d = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true });
            renderer3d.setClearColor(0xffffff, 0);
            renderer3d.setSize(canvas2d.width, canvas2d.height);

            // for 3d projection
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(40, canvas2d.width / canvas2d.height, 1, 1000);
            scene.add(camera);

            model = createModel();
            scene.add(model);
        };
         function createModel() {
            var object = new THREE.Object3D();
            var geometry = new THREE.SphereGeometry(0.5, 15, 15, Math.PI);
            var texture = THREE.ImageUtils.loadTexture("../img/artmobilis.png");
            var material = new THREE.MeshBasicMaterial({ map: texture });
            var mesh = new THREE.Mesh(geometry, material);

            object.add(mesh);

            return object;
        };

        function updateScenes(markers) {
            var corners, corner, pose, i;

            if (markers.length > 0) {
                corners = markers[0].corners;

                for (i = 0; i < corners.length; ++i) {
                    corner = corners[i];

                    corner.x = corner.x - (canvas2d.width / 2);
                    corner.y = (canvas2d.height / 2) - corner.y;
                }

                stat.start("Posit");
                pose = posit.pose(corners);
                stat.stop("Posit");

                stat.start("Update");
                updateObject(model, pose.bestRotation, pose.bestTranslation);
                stat.stop("Update");
            }
        };
         function updateObject(object, rotation, translation) {
            object.scale.x = modelSize;
            object.scale.y = modelSize;
            object.scale.z = modelSize;

            object.rotation.x = -Math.asin(-rotation[1][2]);
            object.rotation.y = -Math.atan2(rotation[0][2], rotation[2][2]);
            object.rotation.z = Math.atan2(rotation[1][0], rotation[1][1]);

            object.position.x = translation[0];
            object.position.y = translation[1];
            object.position.z = -translation[2];
        };
}).controller('controllerCam', function($scope, $stateParams) {
});
