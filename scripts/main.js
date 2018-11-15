var container, camera, scene, renderer, effect, clock, controls;
var raycaster, mouse, pointer;
var cameraHolder;
var json;
var color_funct;
var hostObj = {};
var timeObj = {};

var ROOM_SIZE = 1;
var RACK_NUM = 10;
var HOST_NUM = 60;
var CPU_NUM = 2;
var TS_NUM = 19;

var selectedTimestamp = 1;
var INTERSECTED;
var isInit = true;
var pngLoaded = false;

var updateHost;
var updateTimestamp;
var move_timer;

var CP_SPEED = 0.01;

var quanah;
var cpu_marker;
var tooltip;
var tooltip_png;
var service_control_panel;
var time_control_panel;

// HPCC
var hosts = [];
var hostResults = {};
var links =[];
var node,link;

var simulation, link, node;
var dur = 400;  // animation duration
var startDate = new Date("4/1/2018");
var endtDate = new Date("1/1/2019");
var today = new Date();

var maxHostinRack= 60;
var h_rack = 950;
var width = 200;
var w_rack = (width-23)/10-1;
var w_gap =0;
var node_size = 6;
var sHeight=200;  // Summary panel height
var top_margin = sHeight+80;  // Start rack spiatial layout


var users = [];
var racks = [];

var xTimeScale;
var baseTemperature =60;

var interval2;
var simDuration =1;
var numberOfMinutes = 6*60;
var isRealtime = false;
if (isRealtime){
    simDuration = 1000;
    numberOfMinutes = 6*60;
}


var charType = "Heatmap";
//***********************
var serviceList = ["Temperature","CPU_load","Memory_usage","Fans_speed","Power_consumption"]
var initialService = "Temperature";
var selectedService = "Temperature";



// Controls
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
    initScene();
    initCamera();
    initLight();
    initInteractions();


    initRoom();
    initControlPanel();
    initQuanah();
    initImageHolder();
    // initHPCC();
    // initRenderer();

    window.addEventListener( 'mousedown', onMouseDown, false );
    window.addEventListener( 'touchstart', onDocTouch, false );
    window.addEventListener( 'touchend', onDocRelease, false );

    window.addEventListener( 'mousemove', onMouseMove, false );

    // request();
}

function initImageHolder()
{
    tooltip_html = document.createElement( "div" );
    tooltip_html.style.backgroundColor = "lightblue";
    tooltip_html.style.width = "14%";
    tooltip_html.style.fontSize = "40pt";
    tooltip_html.innerHTML = "HELLO WORLD";
    document.getElementById('holder').appendChild( tooltip_html );
    
    
    tooltip_png = new Image();
    tooltip_png.id = "png_tooltip"
    // document.getElementById('holder').appendChild( imageHolder );
    domtoimage.toJpeg( tooltip_html ).then( function(url) { tooltip_png.src = url; tooltip_html.style.display = "none";} );

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
    cameraHolder = document.querySelector('a-entity').object3D;
    cameraHolder.name = "cameraHolder";

    document.querySelector('a-camera').object3D.name = "hppc_camera_group";
    camera = document.querySelector('a-camera').object3D.children[1];
    camera.type = "hpcc_camera"
    camera.name = "camera";

    pointer = camera.el.lastElementChild.object3D.children[0];

    pointer.material.depthTest = false;
    pointer.name = "pointer";
}

function initScene()
{
    scene = document.querySelector('a-scene').object3D;
    scene.name = "hpcc";
}

function initLight()
{
    document.querySelector('a-light').object3D.name = "hpcc_light_group";
    light = document.querySelector('a-light').object3D.children[0];
    light.name = "hpcc_light";
}

function initInteractions()
{
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
}

function initRoom()
{
    var height = ROOM_SIZE;
    var width = ROOM_SIZE * 6;
    var depth = ROOM_SIZE * 2;
    var geometry = new THREE.BoxGeometry( width, height, depth );

    var textures = ["whiteblockwall","whiteblockwall","whiteceiling","silvermetalmeshfloor","whiteblockwall","whiteblockwall"];
    
    var repeats = [ [width,height],
                    [width,height],
                    [width*2,width],
                    [width*2,width],
                    [width*2,height],
                    [width*2,height]];

    var materials = [null,null,null,null,null,null];

    for( var i=0; i<6; i++ )
    {
        var texture = new THREE.TextureLoader().load( "media/textures/" + textures[i] + ".jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeats[i][0],repeats[i][1]);
        materials[i] = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, map: texture } );
    }

    var room = new THREE.Mesh( geometry, materials );
    room.name = "hpcc_room";
    room.type = "room";
    scene.add( room );
}

function initHPCC()
{
    for (var att in hostList.data.hostlist) {
        var h = {};
        h.name = att;
        h.hpcc_rack = +att.split("-")[1];
        h.hpcc_node = +att.split("-")[2].split(".")[0];
        h.index = hosts.length;

        // to contain the historical query results
        hostResults[h.name] = {};
        hostResults[h.name].index = h.index;
        hostResults[h.name].arr = [];
        hostResults[h.name].arrTemperature = [];  
        hostResults[h.name].arrCPU_load = [];
        hostResults[h.name].arrMemory_usage = [];
        hostResults[h.name].arrFans_health= [];
        hostResults[h.name].arrPower_usage= [];
        hosts.push(h);
        // console.log(att+" "+h.hpcc_rack+" "+h.hpcc_node);

        // Compute RACK list
        var rackIndex = isContainRack(racks, h.hpcc_rack);
        if (rackIndex >= 0) {  // found the user in the users list
            racks[rackIndex].hosts.push(h);
        }
        else {
            var obj = {};
            obj.id = h.hpcc_rack;
            obj.hosts = [];
            obj.hosts.push(h);
            racks.push(obj);
        }
        // Sort RACK list
        racks = racks.sort(function (a, b) {
            if (a.id > b.id) {
                return 1;
            }
            else return -1;
        })
    }
    for (var i = 0; i < racks.length; i++) {
        racks[i].hosts.sort(function (a, b) {
            if (a.hpcc_node > b.hpcc_node) {
                return 1;
            }
            else return -1;
        })

    }
    hosts.sort(function (a, b) {
        if (a.hpcc_rack*1000+a.hpcc_node > b.hpcc_rack*1000+b.hpcc_node) {
            return 1;
        }
        else return -1;
    });

    function isContainRack(array, id)
    {
        var foundIndex = -1;
        for(var i = 0; i < array.length; i++) {
            if (array[i].id == id) {
                foundIndex = i;
                break;
            }
        }
        return foundIndex;
    }
}

function initRenderer()
{
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
}

// Animate & Render

function animate()
{
    requestAnimationFrame( animate );
    animateControlPanel();
    animateTooltip();
    // console.log(imageHolder.src);
}