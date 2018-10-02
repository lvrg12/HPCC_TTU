function resetTime()
{
    
}


function updateTime()
{
    time = parseInt(document.getElementById("slider").value);
    document.getElementById("demo").innerHTML = time;

    for( var rack=1; rack<=RACK_NUM; rack++ )
        for( var host=1; host<=HOST_NUM; host++ )
            for( var cpu=1; cpu<=CPU_NUM; cpu++ )
                if( hostObj[rack][host] )
                {
                    updateTemperature( [rack,host,cpu,time], hostObj[rack][host][cpu] );
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