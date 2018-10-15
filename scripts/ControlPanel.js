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

    for( var i=0; i<4; i++ )
    {
        var texture = new THREE.TextureLoader().load( "media/img/" + serviceList[i] + ".png" );
        var geometry = new THREE.PlaneGeometry( 8, 8, 8 );
        //var material = new THREE.MeshBasicMaterial( { map: textures[i] } );
        var material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, map: texture } );
        var plane = new THREE.Mesh( geometry, material );

        plane.rotation.set( 0, Math.PI/2, 0 );
        plane.position.set( 0 , 10 , i * 10 - 100 );

        // plane.rotation.set( 0, Math.PI/4 * i, 0 );
        // plane.position.set( 0 , i * 5, 0  );

        plane.name = serviceList[i];
        plane.type = "service_button";
        scene.add( plane );
    }

}