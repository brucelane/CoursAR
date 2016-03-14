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

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('BrowserController', function($scope) {

  $scope.onLoad = function(){

    $scope.video = document.getElementById('webcam');
    $scope.canvas2d = document.getElementById('canvas2d');
    $scope.canvas3D = document.getElementById('canvas3d');
    $scope.log = document.getElementById('log');
    $scope.stat = new profiler();
    $scope.ctx;
    $scope.img_u8;
    $scope.modelSize = 35;
    $scope.step = 0.0;
    $scope.renderer3d;
    $scope.scene;
    $scope.camera;
    $scope.model;
    $scope.texture;
    $scope.imageData;
    $scope.markers;
    $scope.detector;
    $scope.posit;

    // onload ask for camera and call demo_app
    window.onload = function () {

        // acquisition video
        compatibility.getUserMedia({ video: true }, function (stream) {
            try {
                setTimeout(function () {
                    $scope.video.play();
                }, 500);
                $scope.video.src = compatibility.URL.createObjectURL(stream);
                demo_app($scope.video.videoWidth, $scope.video.videoHeight);
            } catch (error) {
              $scope.video.src = stream;
                console.log("error init");
            }
        }, function (error) {
            console.log("error gum");
        });

        // initialize the application
        function demo_app(videoWidth, videoHeight) {
            $scope.ctx = $scope.canvas2d.getContext('2d');

            $scope.detector = new AR.Detector();
            $scope.posit = new POS.Posit($scope.modelSize, $scope.canvas2d.width);

            createRenderersScene();

            compatibility.requestAnimationFrame(tick);
            console.log("initialized");
            $scope.stat.add("DetectCorners");
            $scope.stat.add("Posit");
            $scope.stat.add("Update");
        }

        // process each acquired image$scope.
        function tick() {
            compatibility.requestAnimationFrame(tick);
            $scope.stat.new_frame();
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                $scope.ctx.drawImage(video, 0, 0, $scope.canvas2d.width, $scope.canvas2d.height);
                $scope.imageData = $scope.ctx.getImageData(0, 0, $scope.canvas2d.width, $scope.canvas2d.height);
                log.innerHTML = $scope.stat.log();

                $scope.stat.start("DetectCorners");
                $scope.markers = $scope.detector.detect($scope.imageData);
                $scope.stat.stop("DetectCorners");
                drawCorners($scope.markers);
                updateScenes($scope.markers);
                render();
            }
        }
    };

    function render() {
        $scope.renderer3d.autoClear = false;
        $scope.renderer3d.clear();
        $scope.renderer3d.render($scope.scene, $scope.camera);
    }

    function drawCorners(markers){

        $scope.corners;
        $scope.corner;
        $scope.i;
        $scope.j;

        $scope.ctx.lineWidth = 3;

        for ($scope.i = 0; $scope.i < $scope.markers.length; ++$scope.i) {
            $scope.corners = $scope.markers[$scope.i].corners;

            $scope.ctx.strokeStyle = "red";
            $scope.ctx.beginPath();

            for ($scope.j = 0; $scope.j < $scope.corners.length; ++$scope.j) {
                $scope.corner = $scope.corners[$scope.j];
                $scope.ctx.moveTo($scope.x, $scope.corner.y);
                $scope.corner = $scope.corners[($scope.j + 1) % $scope.corners.length];
                $scope.ctx.lineTo($scope.corner.x, $scope.corner.y);
            }

            $scope.ctx.stroke();
            $scope.ctx.closePath();

            $scope.ctx.strokeStyle = "green";
            $scope.ctx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
        }
    }

    function createRenderersScene() {
        $scope.renderer3d = new THREE.WebGLRenderer({ canvas: $scope.canvas3D, alpha: true });
        $scope.renderer3d.setClearColor(0xffffff, 0);
        $scope.renderer3d.setSize($scope.canvas2d.width, $scope.canvas2d.height);

        // for 3d projection
        $scope.scene = new THREE.Scene();
        $scope.camera = new THREE.PerspectiveCamera(40, $scope.canvas2d.width / $scope.canvas2d.height, 1, 1000);
        $scope.scene.add($scope.camera);

        $scope.model = createModel();
        $scope.scene.add($scope.model);
    }

    function createModel() {
        $scope.object = new THREE.Object3D();
        $scope.geometry = new THREE.SphereGeometry(0.5, 15, 15, Math.PI);
        $scope.texture = THREE.ImageUtils.loadTexture("artmobilis.png");
        $scope.material = new THREE.MeshBasicMaterial({ map: $scope.texture });
        $scope.mesh = new THREE.Mesh(geometry, material);

        object.add(mesh);

        return object;
    }

    function updateScenes(markers) {

        $scope.corners;
        $scope.corner;
        $scope.pose;
        $scope.i;

        if ($scope.markers.length > 0) {
            $scope.corners = $scope.markers[0].corners;

            for ($scope.i = 0; $scope.i < $scope.corners.length; ++ $scope.i) {
                $scope.corner = $scope.corners[$scope.i];

                $scope.corner.x = $scope.corner.x - ($scope.canvas2d.width / 2);
                $scope.corner.y = ($scope.canvas2d.height / 2) - $scope.corner.y;
            }

            $scope.stat.start("Posit");
            $scope.pose = $scope.posit.pose(corners);
            $scope.stat.stop("Posit");

            $scope.stat.start("Update");
            updateObject($scope.model, pose.bestRotation, pose.bestTranslation);
            $scope.stat.stop("Update");
        }
    }

    function updateObject(object, rotation, translation) {
        object.scale.x = $scope.modelSize;
        object.scale.y = $scope.modelSize;
        object.scale.z = $scope.modelSize;

        object.rotation.x = -Math.asin(-rotation[1][2]);
        object.rotation.y = -Math.atan2(rotation[0][2], rotation[2][2]);
        object.rotation.z = Math.atan2(rotation[1][0], rotation[1][1]);

        object.position.x = translation[0];
        object.position.y = translation[1];
        object.position.z = -translation[2];
    }

  };

});
