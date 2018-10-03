function resetTime()
{
    console.log("reset " + currentTime);
    // updateTime(currentTime++);
}


function updateValues()
{
    service = document.getElementById("services").value;
    updateColorRange(service);

    time = parseInt(document.getElementById("slider").value);
    document.getElementById("demo").innerHTML = time;

    for( var rack=1; rack<=RACK_NUM; rack++ )
        for( var host=1; host<=HOST_NUM; host++ )
            for( var cpu=1; cpu<=CPU_NUM; cpu++ )
                if( hostObj[rack][host] )
                    updateService( service, [rack,host,cpu,time], hostObj[rack][host][cpu] );
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
    rack = keys[0];
    host = keys[1];
    cpu = keys[2];
    time = keys[3];

    key1 = "compute-"+rack+"-"+host;
    key2 = "arrTemperatureCPU"+cpu;

    if( json[key1][key2][time] !=null )
        temperature = color_funct(json[key1][key2][time]);
    else
        temperature = 0xffffff;

    obj.material.color = new THREE.Color( temperature );

}

function updateCPULoad( keys, obj )
{
    rack = keys[0];
    host = keys[1];
    time = keys[3];

    key1 = "compute-"+rack+"-"+host;
    key2 = "arrCPU_load";

    if( json[key1][key2][time] !=null )
        load = color_funct(json[key1][key2][time]);
    else
        load = 0xffffff;

    obj.material.color = new THREE.Color( load );

}

function updateMemoryUsage( keys, obj )
{
    rack = keys[0];
    host = keys[1];
    time = keys[3];

    key1 = "compute-"+rack+"-"+host;
    key2 = "arrMemory_usage";

    if( json[key1][key2][time] !=null )
        usage = color_funct(json[key1][key2][time]);
    else
        usage = 0xffffff;

    obj.material.color = new THREE.Color( usage );

}

function updateFansSpeed( keys, obj )
{
    rack = keys[0];
    host = keys[1];
    cpu = keys[2];
    time = keys[3];

    key1 = "compute-"+rack+"-"+host;
    key2 = "arrFans_speed"+cpu;

    if( json[key1][key2][time] !=null )
        speed = color_funct(json[key1][key2][time]);
    else
        speed = 0xffffff;

    obj.material.color = new THREE.Color( speed );
}

function updatePowerConsumption( keys, obj )
{
    return 0;
}

function updateColorRange( service )
{
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