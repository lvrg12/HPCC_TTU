function initQuanah()
{
    height = ROOM_SIZE*0.7;
    depth = ROOM_SIZE*0.1;
    width = ROOM_SIZE*0.5;
    separation = width + width*0.3;

    for( var rack_num=1; rack_num<=RACK_NUM; rack_num++ )
    {
        addRack( rack_num, -1*separation*RACK_NUM/2 + separation*rack_num - ROOM_SIZE/2, 0, ROOM_SIZE * -0.8 );
        // addRack( rack_num, 0, 0, 0 );
    }

    // reset();


    // functions

    function addRack( rack_num, x, y, z)
    {
        hostObj[rack_num] = {};

        var rack = new THREE.Group();
        rack.name = "rack_"+rack_num;
        rack.type = "rack";

        for( var host_num=1; host_num<=HOST_NUM; host_num++ )
        {
            key = "compute-"+rack_num+"-"+host_num;
            if( json[key] )
            {
                hostObj[rack_num][host_num] = {};
                rack.add(addHost(rack_num,host_num));
            }
        }

        addQuanahLabel( "Rack " + rack_num, "rack", rack );

        rack.position.set( x, y, z );
        rack.translateY( ELEVATION - height/60 * 12  );
        scene.add( rack );

    }

    function addHost( rack_num, host_num )
    {
        var host_height = height/30;

        var host_geometry = new THREE.BoxLineGeometry( width/2, host_height, depth, 1, 1, 1 );
        var host_material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
        var host = new THREE.LineSegments( host_geometry, host_material );
        host.name = "rack_"+rack_num+"_host_"+host_num;
        host.type = "host";

        for( var cpu_num=1; cpu_num<=CPU_NUM; cpu_num++ )
        {
            hostObj[rack_num][host_num][cpu_num] = addCPU(rack_num,host_num,cpu_num);
            host.add(hostObj[rack_num][host_num][cpu_num]);
        }

        var x,y;

        if( host_num%2 == 1 )
        {
            y = height/2-(host_num%60)*height/60;
        }
        else
        {
            y = height/2-((host_num-1)%60)*height/60;
        }

        x = (!(host_num%2))*width/2;

        host.position.set( x, y, 0 );

        return host;

    }

    function addCPU( rack_num, host_num, cpu_num )
    {
        var cpu_height = height/60;

        var cpu_geometry = new THREE.BoxGeometry( width/2, cpu_height, depth );
        var cpu_material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        var cpu = new THREE.Mesh( cpu_geometry, cpu_material );
        cpu.name = "rack_"+rack_num+"_host_"+host_num+"_cpu_"+cpu_num;
        cpu.type = "cpu";

        // edges

        // edges_geometry = new THREE.EdgesGeometry( cpu.geometry ); 
        // edges_material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
        // edges = new THREE.LineSegments( edges_geometry, edges_material );
        // cpu.add( edges );

        var y = ( cpu_num%2 ) ? cpu_height/2 : -cpu_height/2;
        cpu.position.set( 0, y, 0 );

        return cpu;
    }

    function addQuanahLabel( text, type, obj )
    {
        var loader = new THREE.FontLoader();

        var material_text = new THREE.MeshBasicMaterial( { color: 0x000000 } );

        var size, x, y, z;

        if( type == "rack" )
        {
            size = 1.5, x = 2.51, y = 16, z = 3;
        }
        else if( type == "host" )
        {
            size = 0.60, x = 2.51, y = -0.5, z = 3.5;
        }
        else
        {
            size = 0.5, x = 2.51, y = 20, z = -6;
        }

        loader.load( 'media/fonts/helvetiker_regular.typeface.json', function ( font ) {

            var geometry = new THREE.TextGeometry( text, {
                font: font,
                size: size,
                height: 0,
                curveSegments: 12,
                bevelEnabled: false
            } );

            var textMesh = new THREE.Mesh( geometry, material_text );
            textMesh.position.set( x, y, z );
            textMesh.rotation.y = Math.PI/2;

            textMesh.name = "quanah_label_"+text;
            textMesh.type = "quanah_label";

            obj.add( textMesh );
        } );

    }
}