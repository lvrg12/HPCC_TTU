function initControlPanel()
{
    // drawing panel

    // var triangle = new THREE.Shape();
    // triangle.moveTo(0,0);
    // triangle.lineTo(0,3);
    // triangle.lineTo(7.5,0);
    // triangle.lineTo(0,0);

    // var panel_geometry = new THREE.ExtrudeGeometry( triangle, { depth: 15, bevelEnabled: false } );
    // var panel = new THREE.Mesh( panel_geometry, new THREE.MeshPhongMaterial( { color: 0x303030 } ) );
    // panel.name = "panel";

    // var box_texture = new THREE.TextureLoader().load( "media/textures/woodstand.jpg" );
    // box_texture.wrapS = THREE.RepeatWrapping;
    // box_texture.wrapT = THREE.RepeatWrapping;
    // box_texture.repeat.set(1,1);
    // var box_geometry = new THREE.BoxGeometry( 7.5, 7.5, 15 );
    // var box_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: box_texture } );
    // var box = new THREE.Mesh( box_geometry, box_material );
    // box.name = "panel_box";
    // box.position.set( 3.75, -3.75, 7.5 );
    // panel.add( box );
    // panel.position.set( 30, 7.5, -115 );
    // scene.add( panel );

    // adding service buttons

    var num = serviceList.length - 1;
    var r = 4;
    var group = new THREE.Group();
    
    // add center to group

    for( var i=0; i<num; i++ )
    {
        var texture = new THREE.TextureLoader().load( "media/img/" + serviceList[i] + ".png" );
        var geometry = new THREE.PlaneGeometry( 8, 8, 8 );
        //var material = new THREE.MeshBasicMaterial( { map: textures[i] } );
        var material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, map: texture } );
        var plane = new THREE.Mesh( geometry, material );

        // var x = r * Math.cos(2 * Math.PI * i / num );
        // var z = r * Math.sin(2 * Math.PI * i / num );

        plane.position.set( 10 , 10 , 0 );
        plane.rotation.set( 0, Math.PI/2, 0 );

        // plane.rotateOnWorldAxis( new THREE.Vector3(0,1,0) , 2*Math.PI / num * i );
        //plane.rotation.set( 0, (2*Math.PI)/8 , 0 );

        // plane.rotation.set( 0, Math.PI/4 * i, 0 );
        // plane.position.set( 0 , i * 5, 0  );

        plane.name = serviceList[i];
        plane.type = "service_button";
        group.add( plane );
        group.rotation.set( 0, group.rotation.y + 2*Math.PI, 0);

    }
    scene.add(group);

}