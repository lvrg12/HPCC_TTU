function reset()
{
    for( var rack=1; rack<=RACK_NUM; rack++ )
        for( var host=1; host<=HOST_NUM; host++ )
            for( var cpu=1; cpu<=CPU_NUM; cpu++ )
                if( hostObj[rack][host] )
                    hostObj[rack][host][cpu].material.color = new THREE.Color( 0x222222 );

}

function updateValues()
{
    reset();

    var service = document.getElementById("services").value;
    updateColorRange(service);

    var time = parseInt(document.getElementById("slider").value);
    document.getElementById("demo").innerHTML = time;

    // for( var rack=1; rack<=RACK_NUM; rack++ )
    //     for( var host=1; host<=HOST_NUM; host++ )
    //         for( var cpu=1; cpu<=CPU_NUM; cpu++ )
    //             if( hostObj[rack][host] )
    //                 doTimeout(service,rack,host,cpu,time);

    var rack = 1, host = 1, cpu = 1;

    (function loop( rack, host, cpu )
    {
        setTimeout(function ()
        {
            updateService( service, [rack,host,cpu,time], hostObj[rack][host][cpu] );

            if( cpu+1 <= CPU_NUM )
            {
                loop( rack, host, cpu+1 )
            }
            else
            {
                if( host+1 <= HOST_NUM )
                {
                    loop( rack, host+1, 1 );
                }
                else
                {
                    if( rack+1 <= RACK_NUM )
                    {
                        loop( rack+1, 1, 1 );
                    }
                }
            }

        }, 1000);
        
      })  ( rack, host, cpu );

}

function doTimeout( service, rack, host, cpu, time )
{
    setTimeout( function() { updateService( service, [rack,host,cpu,time], hostObj[rack][host][cpu] ) } , 3000 );
}

function updateService( service, keys, obj )
{
    switch( service )
    {
        case "Temperature":
            updateTemperature( keys, obj );
            break;
        case "CPU_load":
            updateCPULoad( keys, obj );
            break;
        case "Memory_usage":
            updateMemoryUsage( keys, obj );
            break;
        case "Fans_speed":
            updateFansSpeed( keys, obj );
            break;
        case "Power_consumption":
            updatePowerConsumption( keys, obj );
            break;
        default:
            break;
    }

}

function updateTemperature( keys, obj )
{
    var rack = keys[0];
    var host = keys[1];
    var cpu = keys[2];
    var time = keys[3];

    var key1 = "compute-"+rack+"-"+host;
    var key2 = "arrTemperatureCPU"+cpu;

    if( json[key1][key2][time] !=null )
        var temperature = color_funct(json[key1][key2][time]);
    else
        var temperature = 0xffffff;

    obj.material.color = new THREE.Color( temperature );

}

function updateCPULoad( keys, obj )
{
    var rack = keys[0];
    var host = keys[1];
    var time = keys[3];

    var key1 = "compute-"+rack+"-"+host;
    var key2 = "arrCPU_load";

    if( json[key1][key2][time] !=null )
        var load = color_funct(json[key1][key2][time]);
    else
        var load = 0xffffff;

    obj.material.color = new THREE.Color( load );

}

function updateMemoryUsage( keys, obj )
{
    var rack = keys[0];
    var host = keys[1];
    var time = keys[3];

    var key1 = "compute-"+rack+"-"+host;
    var key2 = "arrMemory_usage";

    if( json[key1][key2][time] !=null )
        var usage = color_funct(json[key1][key2][time]);
    else
        var usage = 0xffffff;

    obj.material.color = new THREE.Color( usage );

}

function updateFansSpeed( keys, obj )
{
    var rack = keys[0];
    var host = keys[1];
    var cpu = keys[2];
    var time = keys[3];

    var key1 = "compute-"+rack+"-"+host;
    var key2 = "arrFans_speed"+cpu;

    if( json[key1][key2][time] !=null )
        var speed = color_funct(json[key1][key2][time]);
    else
        var speed = 0xffffff;

    obj.material.color = new THREE.Color( speed );
}

function updatePowerConsumption( keys, obj )
{
    return 0;
}

function updateColorRange( service )
{
    var arrColor, arrDom;

    switch( service )
    {
        case "Temperature":
            arrDom = [20, 60, 80, 100];
            arrColor = ['#44f', '#1a9850','#fee08b', '#d73027'];
            break;
        case "CPU_load":
            arrDom = [0, 0.2, 0.3, 0.5];
            arrColor = ['#ffff00','#c8df00','#91bf00','#589f00','#008000'];
            break;
        case "Memory_usage":
            arrDom = [0, 25, 50, 75, 100];
            arrColor = ['#ffff00','#c8df00','#91bf00','#589f00','#008000'];
            break;
        case "Fans_speed":
            arrDom = [0, 5000, 9000, 10000, 12000];
            arrColor = ['#ff0000','#ffff00','#008000','#ffff00','#ff0000'];
            break;
        case "Power_consumption":
            arrDom = [20, 60, 80, 100];
            arrColor = ['#44f', '#1a9850','#fee08b', '#d73027'];
            break;
        default:
            break;
    }
    
    color_funct = d3.scaleLinear()
        .domain(arrDom)
        .range(arrColor)
        .interpolate(d3.interpolateHcl);

}