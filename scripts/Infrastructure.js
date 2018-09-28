function Quanah()
{
    height = 30;
    depth = 5;
    width = 15;
    separation = width + width*0.2;

    console.log(json);

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

function tempColor(t)
{
    gradient = [0xFFFFFF,0xFFECEC,0xFFDADA,0xFFC8C8,0xFFB6B6,0xFFA3A3,
                0xFF9191,0xFF7F7F,0xFF6D6D,0xFF5B5B,0xFF4848,0xFF3636,
                0xFF2424,0xFF1212,0xFF0000];

    var arrTemp = [20, 60, 80, 100];
    var arrColor = ['#44f', '#1a9850','#fee08b', '#d73027'];
    
    var color = d3.scaleLinear()
        .domain(arrTemp)
        .range(arrColor)
        .interpolate(d3.interpolateHcl);

    console.log( color(20) );

    
    t = Math.ceil(t);
    if( t==0 )
    {
        return 0x000000;
    }
    else
    {
        return gradient[Math.round((t-30)/3.6)]
    }
}