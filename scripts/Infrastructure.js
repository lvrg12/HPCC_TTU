function Quanah()
{
    height = 30;
    depth = 5;
    width = 15;
    separation = width + width*0.2;

    for( var rack_num=1; rack_num<=10; rack_num++ )
    {
        addRack( rack_num, 0, height/2, separation*rack_num );
    }

    function addRack( rack_num, x, y, z)
    {
        geometry = new THREE.BoxLineGeometry( depth, height, width, 1, 1, 2 );
        material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 5 } );
        rack = new THREE.LineSegments( geometry, material );

        for( var host_num=1; host_num<=60; host_num++ )
        {
            rack.add(addHost(rack_num,host_num));
            // break;
        }

        addLabel( "Rack " + rack_num, rack );

        rack.position.set( x, y + 0.1, z );
        scene.add( rack );
    }

    function addHost( rack_num, host_num )
    {
        geometry = new THREE.BoxLineGeometry( depth, 1, width/2, 1, 1, 1 );
        material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 3 } );
        host = new THREE.LineSegments( geometry, material );

        for( var cpu_num=1; cpu_num<=2; cpu_num++ )
            host.add(addCPU(rack_num,host_num,cpu_num));


        if( host_num%2 == 1 )
        {
            y = height/2-host_num/2-0.5;
            z = 0-width/4;
        }
        else
        {
            y = height/2-host_num/2;
            z = width/4;
        }

        host.position.set( 0, y + 0.5, z );

        return host;

    }

    function addCPU( rack_num, host_num, cpu_num )
    {
        key = "compute-"+rack_num+"-"+host_num;
        if( json[key] )
        {
            key2 = "arrTemperatureCPU"+cpu_num;
            if( json[key][key2] )
                temperature = avg_temperature(json[key][key2]);
        }
        else
        {
            temperature = 0;
        }

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

function addLabel( text, rack )
{
    var loader = new THREE.FontLoader();

    material_text = new THREE.MeshPhongMaterial( { color: 0x000000 } );

    loader.load( 'media/fonts/helvetiker_regular.typeface.json', function ( font ) {

        var geometry = new THREE.TextGeometry( text, {
            font: font,
            size: 3,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: false
        } );

        var textMesh = new THREE.Mesh( geometry, material_text );
        textMesh.position.set( 0, 20, -5 );
        textMesh.rotation.y = -Math.PI/2;
        rack.add( textMesh );
    } );

}