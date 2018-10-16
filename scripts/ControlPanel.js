function initControlPanel()
{
    initServiceControlPanel();
    initTimeControlPanel();
}

// service control panel init
function initServiceControlPanel()
{
    var num = serviceList.length ;
    var s = 5
    var r = s/(2*Math.tan(Math.PI/num)) + s/15;

    service_control_panel = new THREE.Group();

    service_control_panel.type = "control_panel";
    service_control_panel.name = "service_control_panel";

    for( var i=0; i<num; i++ )
    {
        var texture = new THREE.TextureLoader().load( "media/img/" + serviceList[i] + ".png" );
        var geometry = new THREE.PlaneGeometry( s, s, s );
        var material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, map: texture } );
        var plane = new THREE.Mesh( geometry, material );

        addServiceOutline( plane, serviceList[i] );
        addServiceLabel( plane, serviceList[i] );

        plane.type = "service_button";
        plane.name = serviceList[i];

        plane.rotation.set( 0, i*2*Math.PI/num, 0 );
        plane.translateZ(r);

        service_control_panel.add( plane );
    }

    service_control_panel.position.set( -10, 15, -180 );
    scene.add( service_control_panel );


    // functions

    function addServiceLabel( obj, service )
    {
        var banner_geometry = new THREE.PlaneGeometry( s, s/4, s );
        var banner_material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, color: 0x000000 } );
        var banner = new THREE.Mesh( banner_geometry, banner_material );

        var loader = new THREE.FontLoader();
        var text_material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        loader.load( 'media/fonts/helvetiker_regular.typeface.json', function ( font )
        {
            var text_geometry = new THREE.TextGeometry( service, {
                font: font,
                size: s/15,
                height: 0,
                curveSegments: 12,
                bevelEnabled: false
            } );

            var text = new THREE.Mesh( text_geometry, text_material );
            var x = ( service == serviceList[4] ) ? -s/2 + 0.5 : -s/2 + 1;
            text.position.set( x, 0, 0.05 );

            text.name = "service_label_"+service;
            text.type = "service_label";

            banner.add( text );
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

// time control panel init
function initTimeControlPanel()
{
    time_control_panel = new THREE.Group();

    var n = 15;
    var r = 10;

    for( var t=0; t<n; t++ )
    {
        var x1 = r * Math.cos(2 * Math.PI * t / n);
        var y1 = r * Math.sin(2 * Math.PI * t / n);

        var x2 = r * Math.cos(2 * Math.PI * (t+1) / n);
        var y2 = r * Math.sin(2 * Math.PI * (t+1) / n);

        var triangle = new THREE.Shape();
        triangle.moveTo(0,0);
        triangle.lineTo(x1,y1);
        triangle.lineTo(x2,y2);
        triangle.lineTo(0,0);

        var pie_geometry = new THREE.ExtrudeGeometry( triangle, { depth: r/10, bevelEnabled: false } );
        var pie_material = new THREE.MeshBasicMaterial( { color: 0x333333 } );
        var pie = new THREE.Mesh( pie_geometry, pie_material );
        pie.type = "pie";
        pie.name = "pie_" + t;

        time_control_panel.add( pie );

    }

    scene.add(time_control_panel);

}

function rotateServiceControlPanel()
{
    service_control_panel.rotation.y -= CP_SPEED;
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