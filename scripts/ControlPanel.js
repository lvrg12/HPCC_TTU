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

        addServiceOutline( plane, serviceList[i] );
        addServiceLabel( plane, serviceList[i] );

        plane.name = serviceList[i];
        plane.type = "service_button";

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

            var geometry = new THREE.TextGeometry( service, {
                font: font,
                size: s/15,
                height: 0,
                curveSegments: 12,
                bevelEnabled: false
            } );

            var textMesh = new THREE.Mesh( geometry, material_text );
            var x = ( service == 4 ) ? -s/2 + 0.5 : -s/2 + 1;
            textMesh.position.set( x, 0, 0.05 );

            textMesh.name = "service_label_"+service;
            textMesh.type = "service_label";

            banner.add( textMesh );
        } );

        banner.position.set( 0, s - s/3 , 0 );

        addServiceOutline( banner, service );

        obj.add( banner );

    }

    function addServiceOutline( obj, service )
    {

        var outline_material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
        var outline = new THREE.Mesh( obj.geometry, outline_material );
        outline.position = obj.position;
        outline.translateZ(-0.05);
        outline.scale.multiplyScalar(1.05);
        outline.type = "outline";
        outline.visible = ( service == selectedService ) ? true : false;
        obj.add( outline );

    }

}

function rotateControlPanel()
{
    control_panel.rotation.y -= CP_SPEED;
}

function updateServiceOutline( obj )
{
    var services = obj.parent.children;
    var children;

    // unhighlight non selected services
    for( var s=0; s<services.length; s++ )
    {
        children = services[s].children;
        for( var c=0; c<children.length; c++ )
            if( children[c].type == "outline" )
                children[c].visible = false;
            else
                for( var cc=0; cc<children[c].children.length; cc++ )
                    if( children[c].children[cc].type == "outline" )
                        children[c].children[cc].visible = false;
    }

    // highligh selected service
    children = obj.children;
    for( var c=0; c<children.length; c++ )
        if( children[c].type == "outline" )
            children[c].visible = true;
        else
            for( var cc=0; cc<children[c].children.length; cc++ )
                if( children[c].children[cc].type == "outline" )
                    children[c].children[cc].visible = true;

}