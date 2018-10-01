var container, camera, scene, renderer, effect, clock, controls
var raycaster
var cameraPositions;
var pointer;
var json;
var color_funct;

var objects = [];
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

init();
animate();

// init

function init()
{
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    loadJSON();
    initCamera();
    initPointer();
    initScene();
    initLight();
    initControl();
    // initFloor();
    initRoom();
    initColorRange();
    Quanah()
    initRenderer();

    window.requestAnimationFrame( render );
    window.addEventListener( 'resize', onWindowResize, false );
}

function loadJSON()
{
    $.ajax({
        type: 'GET',
        url: "data/hpcc_data__32_.json",
        async: false,
        dataType: 'json',
        success: function (data) {
          json = data
        }
      });
}

function initCamera()
{
    camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 250 );
    camera.position.set( 20, 7.5, -5 );
}

function initPointer()
{
    // pointer = new Pointer( "../media/img/circle-dot.png" );
    // camera.add( pointer );
    // pointer.position.set(0,0,10);
}

function initScene()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x505050 );
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
}

function initLight()
{
    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );
}

function initControl()
{
    controls = new THREE.PointerLockControls( camera );

    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function ( event ){
        controls.lock();
    }, false );

    controls.addEventListener( 'lock', function() {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    } );

    controls.addEventListener( 'unlock', function() {
        blocker.style.display = 'block';
        instructions.style.display = '';
    } );

    scene.add( controls.getObject() );

    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true; break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                if ( canJump === true ) velocity.y += 200;
                canJump = false;
                break;
        }
    };

    var onKeyUp = function ( event ) {
        switch( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
}

function initColorRange()
{
    arrTemp = [20, 60, 80, 100];
    arrColor = ['#44f', '#1a9850','#fee08b', '#d73027'];
    
    color_funct = d3.scaleLinear()
        .domain(arrTemp)
        .range(arrColor)
        .interpolate(d3.interpolateHcl);

}

function initRoom()
{
    geometry = new THREE.BoxGeometry( 50, 40, 220 );

    textures = ["whiteblockwall","whiteblockwall","whiteceiling","silvermetalmeshfloor","whiteblockwall","whiteblockwall"];
    repeats = [[15,2],[15,2],[5,25],[5,12],[2,2],[2,2]];
    materials = [null,null,null,null,null,null];

    for( var i=0; i<6; i++ )
    {
        texture = new THREE.TextureLoader().load( "media/textures/" + textures[i] + ".jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeats[i][0],repeats[i][1]);
        materials[i] = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, map: texture } );
    }

    // material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, envMap: texture } );
    room = new THREE.Mesh( geometry, materials );
    room.geometry.translate( 0, 20, -110 );
    scene.add( room );
}

function initFloor()
{
    var floorGeometry = new THREE.PlaneBufferGeometry( 50, 220, 50, 50 );
    floorGeometry.rotateX( - Math.PI / 2 );
    var floor = new THREE.Mesh( floorGeometry, new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
    floor.position.set( 0, 0, -110  );
    scene.add( floor );
}

function initRenderer()
{
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
}

// Events

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// Animate & Render

function animateControls()
{
    if ( controls.isLocked === true )
    {
        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects( objects );
        var onObject = intersections.length > 0;
        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveLeft ) - Number( moveRight );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
        if ( onObject === true ) {
            velocity.y = Math.max( 0, velocity.y );
            canJump = true;
        }
        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );
        if ( controls.getObject().position.y < 10 ) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        prevTime = time;
    }
}

function animate()
{
    requestAnimationFrame( animate );
    animateControls();
    render();
}

function render()
{
    renderer.render( scene, camera );
}