function initQuanah()
{
    height = HOST_NUM/2;
    depth = 5;
    width = 15;
    separation = width + width*0.3;

    for( var rack_num=1; rack_num<=RACK_NUM; rack_num++ )
    {
        addRack( rack_num, -40, height/2, -1 * separation*rack_num );
    }

    reset();

    // add component functions

    function addRack( rack_num, x, y, z)
    {
        hostObj[rack_num] = {};

        var geometry = new THREE.BoxLineGeometry( depth, height, width, 1, 1, 2 );
        var material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 3 } );
        var rack = new THREE.LineSegments( geometry, material );
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

        addLabel( "Rack " + rack_num, "rack", rack );

        rack.position.set( x, y + 0.1, z );
        scene.add( rack );

    }

    function addHost( rack_num, host_num )
    {
        var geometry = new THREE.BoxLineGeometry( depth, 1, width/2, 1, 1, 1 );
        var material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 0.5 } );
        var host = new THREE.LineSegments( geometry, material );
        host.name = "rack_"+rack_num+"_host_"+host_num;
        host.type = "host";

        for( var cpu_num=1; cpu_num<=CPU_NUM; cpu_num++ )
        {
            hostObj[rack_num][host_num][cpu_num] = addCPU(rack_num,host_num,cpu_num);
            host.add(hostObj[rack_num][host_num][cpu_num]);
        }

        if( host_num%2 == 1 )
        {
            y = height/2-host_num/2-0.5;
            z = width/4;
        }
        else
        {
            y = height/2-host_num/2;
            z = 0-width/4;
        }

        // addLabel( "Host " + host_num, "host", host );
        host.position.set( 0, y + 0.5, z );

        return host;

    }

    function addCPU( rack_num, host_num, cpu_num )
    {
        var geometry = new THREE.BoxGeometry( depth, 0.5, width/2 );
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        var cpu = new THREE.Mesh( geometry, material );
        cpu.name = "rack_"+rack_num+"_host_"+host_num+"_cpu_"+cpu_num;
        cpu.type = "cpu";

        // edges

        // edges_geometry = new THREE.EdgesGeometry( cpu.geometry ); 
        // edges_material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
        // edges = new THREE.LineSegments( edges_geometry, edges_material );
        // cpu.add( edges );

        y = ( cpu_num == 1 ) ? 0.25 : -0.25;
        cpu.position.set( 0, y, 0 );

        return cpu;
    }
}

function addLabel( text, type, obj )
{
    var loader = new THREE.FontLoader();

    material_text = new THREE.MeshPhongMaterial( { color: 0x000000 } );

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

        textMesh.name = "label_"+text;
        textMesh.type = "label";

        obj.add( textMesh );
    } );

}