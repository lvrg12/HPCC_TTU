function Quanah()
{
    height = HOST_NUM/2;
    depth = 5;
    width = 15;
    separation = width + width*0.3;

    for( var rack_num=1; rack_num<=RACK_NUM; rack_num++ )
    {
        addRack( rack_num, -40, height/2, -1 * separation*rack_num );
    }

    // add component functions

    function addRack( rack_num, x, y, z)
    {
        hostObj[rack_num] = {};

        geometry = new THREE.BoxLineGeometry( depth, height, width, 1, 1, 2 );
        material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 3 } );
        rack = new THREE.LineSegments( geometry, material );

        for( var host_num=1; host_num<=HOST_NUM; host_num++ )
        {
            key = "compute-"+rack_num+"-"+host_num;
            if( json[key] )
            {
                hostObj[rack_num][host_num] = {};
                rack.add(addHost(rack_num,host_num,key));
            }
        }

        addLabel( "Rack " + rack_num, "rack", rack );

        rack.position.set( x, y + 0.1, z );
        scene.add( rack );

    }

    function addHost( rack_num, host_num, key )
    {
        geometry = new THREE.BoxLineGeometry( depth, 1, width/2, 1, 1, 1 );
        material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 3 } );
        host = new THREE.LineSegments( geometry, material );

        for( var cpu_num=1; cpu_num<=CPU_NUM; cpu_num++ )
        {
            key2 = "arrTemperatureCPU"+cpu_num;
            if( json[key][key2] )
            {
                temperature = json[key][key2][0];
                hostObj[rack_num][host_num][cpu_num] = addCPU(cpu_num,temperature);
                host.add(hostObj[rack_num][host_num][cpu_num]);
            }
        }


        if( host_num%2 == 1 )
        {
            addLabel( "Host " + host_num, "host1", host );
            y = height/2-host_num/2-0.5;
            z = 0-width/4;
        }
        else
        {
            addLabel( "Host " + host_num, "host2", host );
            y = height/2-host_num/2;
            z = width/4;
        }

        host.position.set( 0, y + 0.5, z );

        return host;

    }

    function addCPU( cpu_num, temperature )
    {
        geometry = new THREE.BoxGeometry( depth, 0.5, width/2 );
        material = new THREE.MeshBasicMaterial( { color: color_funct(temperature) } );
        cpu = new THREE.Mesh( geometry, material );

        // edges

        edges_geometry = new THREE.EdgesGeometry( cpu.geometry ); 
        edges_material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
        edges = new THREE.LineSegments( edges_geometry, edges_material );
        cpu.add( edges );

        if( cpu_num == 1 )
        {
            y = 0.25;
        }
        else
        {
            y = -0.25;
        }

        cpu.position.set( 0, y, 0 );

        return cpu;
    }
}

function avg_temperature(arr)
{
    if( arr.length == 0 )
        return 0;
    else
    {
        sum = 0;
        for( var i=0; i<arr.length; i++ )
        {
            sum+=arr[i];
        }
        return sum/arr.length;
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
    else if( type == "host1" )
    {
        size = 0.60, x = 2.51, y = -0.5, z = 11;
    }
    else if( type == "host2" )
    {
        size = 0.60, x = 2.51, y = -0.5, z = -4;
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
        obj.add( textMesh );
    } );

}