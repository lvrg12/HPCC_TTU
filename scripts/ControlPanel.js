function initControlPanel()
{
    var num = serviceList.length ;
    var s = 5
    var r = s/(2*Math.tan(Math.PI/num)) + s/15;

    control_panel = new THREE.Group();

    control_panel.type = "control_panel";
    control_panel.name = "service_control_panel";

    for( var i=0; i<num; i++ )
    {
        var texture = new THREE.TextureLoader().load( "media/img/" + serviceList[i] + ".png" );
        var geometry = new THREE.PlaneGeometry( s, s, s );
        var material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, map: texture } );
        var plane = new THREE.Mesh( geometry, material );

        plane.name = serviceList[i];
        plane.type = "service_button";

        addServiceLabel( plane, i );

        plane.rotation.set( 0, i*2*Math.PI/num, 0 );
        plane.translateZ(r);

        control_panel.add( plane );
    }

    control_panel.position.set( -10, 15, -180 );
    scene.add( control_panel );


    // functions

    function addServiceLabel( obj, service )
    {
        var banner_geometry = new THREE.PlaneGeometry( s, s/4, s );
        var banner_material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, color: 0x000000 } );
        var banner = new THREE.Mesh( banner_geometry, banner_material );

        var loader = new THREE.FontLoader();
        var material_text = new THREE.MeshPhongMaterial( { color: 0xffffff } );

        loader.load( 'media/fonts/helvetiker_regular.typeface.json', function ( font ) {

            var geometry = new THREE.TextGeometry( serviceList[service], {
                font: font,
                size: s/15,
                height: 0,
                curveSegments: 12,
                bevelEnabled: false
            } );

            var textMesh = new THREE.Mesh( geometry, material_text );
            var x = ( service == 4 ) ? -s/2 + 0.5 : -s/2 + 1;
            textMesh.position.set( x, 0, 0.05 );

            textMesh.name = "service_label_"+serviceList[service];
            textMesh.type = "service_label";

            banner.add( textMesh );
        } );

        banner.position.set( 0, s - s/3 , 0 );

        obj.add( banner );

    }

}

function rotateControlPanel()
{
    control_panel.rotation.y -= CP_SPEED;
}