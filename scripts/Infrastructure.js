function Quanah()
{
    height = 30;
    depth = 5;
    width = 15;
    separation = width + width*0.2;

    console.log(json);

    for( var i=0; i<10; i++ )
    {
        addRack( i+1, 0, height/2 + 0.1, separation*i );
        break;
    }

    function addRack( rack_num, x, y, z)
    {
        geometry = new THREE.BoxLineGeometry( depth, height, width, 1, 60, 2 );
        material = new THREE.LineBasicMaterial( { color: 0x000000 } );
        rack = new THREE.LineSegments( geometry, material );

        for( var i=1; i<=height/2; i++)
        {
            for( var j=1; j<=2; j++)
            {
                rack.add(addCPU(rack_num,i*j,1));
                rack.add(addCPU(rack_num,i*j,2));
            }
        }

        rack.geometry.translate( x, y, z );
        scene.add( rack );
    }

    function addCPU( rack_num, host_num, cpu_num )
    {
        // key = "compute-"+rack_num+"-"+host_num;
        // if( json[key] )
        // {
        //     key2 = "arrTemperatureCPU"+cpu_num;
        //     if( json[key][key2] )
        //         temperature = avg_temperature(json[key][key2]);
        // }

        geometry = new THREE.BoxGeometry( depth, 0.5, width/2 );
        material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        cpu = new THREE.Mesh( geometry, material );

        // y = ( cpu_num == 1 )? height-host_num*(cpu_num-1)-0.51 : height-host_num*(cpu_num-1.5)-0.51;

        if( host_num%2 == 0 )
        {
            z = 0-width/4;
            if( cpu_num == 1 )
            {
                y = height-host_num/2+1-0.1;
            }
            else
            {
                y = height-host_num/2+0.5-0.1;
            }
        }
        else
        {
            z = width/2-width/4;
            if( cpu_num == 1 )
            {
                y = height-host_num+1-0.1;
            }
            else
            {
                y = height-host_num+0.5-0.1;
            }
        }

        cpu.position.set( 0, y, z );

        return cpu;
    }
}