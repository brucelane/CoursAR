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
    .controller('ImageProcTreeJSCtrl', function($scope, $cordovaCapture) {
        var video = document.getElementById('webcam');
        var canvas2d = document.getElementById('canvas2d');
        var canvas3D = document.getElementById('canvas3d');
        var log = document.getElementById('log');
        var stat = new profiler();
        var ctx;
        var img_u8;
        var modelSize = 35;
        var renderer3d, scene, camera, model, texture;
        console.log("beforetry");
        // acquisition video
        compatibility.getUserMedia({ video: true }, function(stream) {
            try {
              console.log("intry");
                setTimeout(function() {
                    video.play();
                }, 500);
                video.src = compatibility.URL.createObjectURL(stream);
                demo_app(video.videoWidth, video.videoHeight);
            } catch (error) {
                video.src = stream;
                console.log("error init");
            }
        }, function(error) {
            console.log("error gum");
        });

        // initialize the application
        function demo_app(videoWidth, videoHeight) {
            ctx = canvas2d.getContext('2d');

            createRenderersScene();

            img_u8 = new jsfeat.matrix_t(640, 480, jsfeat.U8_t | jsfeat.C1_t);

            compatibility.requestAnimationFrame(tick);
            console.log("initialized");
        }

        // process each acquired image
        function tick() {
            compatibility.requestAnimationFrame(tick);
            stat.new_frame();
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                ctx.drawImage(video, 0, 0, 640, 480);
                log.innerHTML = stat.log();

                updateObject(model);
                render();
            }
        }


        function render() {
            renderer3d.clear();
            renderer3d.render(scene, camera);
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

            camera.position.z = 5;
        };

        function createModel() {
            var object = new THREE.Object3D();
            var geometry = new THREE.SphereGeometry(1, 15, 15, Math.PI);
            var texture = THREE.ImageUtils.loadTexture("artmobilis.png");
            var material = new THREE.MeshBasicMaterial({ map: texture });
            var mesh = new THREE.Mesh(geometry, material);

            object.add(mesh);

            return object;
        };

        function updateObject(object) {
            object.rotation.x += 0.05;
            object.rotation.y += 0.05;
        };

    })

.controller('PlaylistCtrl', function($scope, $stateParams) {});
