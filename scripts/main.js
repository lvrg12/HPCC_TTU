var container;
var camera, scene, renderer;
var controller1, controller2;
var room;
var radius = 0.08;
var normal = new THREE.Vector3();
var relativeVelocity = new THREE.Vector3();

init();
animate();

function init()
{
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> webvr - ball shooter';
    container.appendChild( info );
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x505050 );
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10 );
    room = new THREE.Mesh(
        new THREE.BoxBufferGeometry( 6, 6, 6, 8, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: true } )
    );
    room.geometry.translate( 0, 3, 0 );
    scene.add( room );
    scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );
    var geometry = new THREE.IcosahedronBufferGeometry( radius, 2 );
    for ( var i = 0; i < 200; i ++ ) {
        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        object.position.x = Math.random() * 4 - 2;
        object.position.y = Math.random() * 4;
        object.position.z = Math.random() * 4 - 2;
        object.userData.velocity = new THREE.Vector3();
        object.userData.velocity.x = Math.random() * 0.01 - 0.005;
        object.userData.velocity.y = Math.random() * 0.01 - 0.005;
        object.userData.velocity.z = Math.random() * 0.01 - 0.005;
        room.add( object );
    }
    //
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.vr.enabled = true;
    container.appendChild( renderer.domElement );
    //
    document.body.appendChild( WEBVR.createButton( renderer ) );
    // controllers
    function onSelectStart() {
        this.userData.isSelecting = true;
    }
    function onSelectEnd() {
        this.userData.isSelecting = false;
    }
    controller1 = renderer.vr.getController( 0 );
    controller1.addEventListener( 'selectstart', onSelectStart );
    controller1.addEventListener( 'selectend', onSelectEnd );
    scene.add( controller1 );
    controller2 = renderer.vr.getController( 1 );
    controller2.addEventListener( 'selectstart', onSelectStart );
    controller2.addEventListener( 'selectend', onSelectEnd );
    scene.add( controller2 );
    // helpers
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
    var material = new THREE.LineBasicMaterial( { vertexColors: true, linewidth: 2, blending: THREE.AdditiveBlending } );
    controller1.add( new THREE.Line( geometry, material ) );
    controller2.add( new THREE.Line( geometry, material ) );
    //
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function handleController( controller )
{
    if ( controller.userData.isSelecting ) {
        var object = room.children[ 0 ];
        room.remove( object );
        object.position.copy( controller.position );
        object.userData.velocity.x = ( Math.random() - 0.5 ) * 0.02;
        object.userData.velocity.y = ( Math.random() - 0.5 ) * 0.02;
        object.userData.velocity.z = ( Math.random() * 0.02 - 0.1 );
        object.userData.velocity.applyQuaternion( controller.quaternion );
        room.add( object );
    }
}

//
function animate()
{
    renderer.setAnimationLoop( render );
}

function render()
{
    handleController( controller1 );
    handleController( controller2 );
    // keep cubes inside room
    var range = 3 - radius;
    for ( var i = 0; i < room.children.length; i ++ ) {
        var cube = room.children[ i ];
        cube.position.add( cube.userData.velocity );
        if ( cube.position.x < - range || cube.position.x > range ) {
            cube.position.x = THREE.Math.clamp( cube.position.x, - range, range );
            cube.userData.velocity.x = - cube.userData.velocity.x;
        }
        if ( cube.position.y < radius || cube.position.y > 6 ) {
            cube.position.y = Math.max( cube.position.y, radius );
            cube.userData.velocity.x *= 0.98;
            cube.userData.velocity.y = - cube.userData.velocity.y * 0.8;
            cube.userData.velocity.z *= 0.98;
        }
        if ( cube.position.z < - range || cube.position.z > range ) {
            cube.position.z = THREE.Math.clamp( cube.position.z, - range, range );
            cube.userData.velocity.z = - cube.userData.velocity.z;
        }
        for ( var j = i + 1; j < room.children.length; j ++ ) {
            var cube2 = room.children[ j ];
            normal.copy( cube.position ).sub( cube2.position );
            var distance = normal.length();
            if ( distance < 2 * radius ) {
                normal.multiplyScalar( 0.5 * distance - radius );
                cube.position.sub( normal );
                cube2.position.add( normal );
                normal.normalize();
                relativeVelocity.copy( cube.userData.velocity ).sub( cube2.userData.velocity );
                normal = normal.multiplyScalar( relativeVelocity.dot( normal ) );
                cube.userData.velocity.sub( normal );
                cube2.userData.velocity.add( normal );
            }
        }
        cube.userData.velocity.y -= 0.00098;
    }
    renderer.render( scene, camera );
}