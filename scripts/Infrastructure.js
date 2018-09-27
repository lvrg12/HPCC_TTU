function Quanah()
{
    height = 20;
    depth = 2;
    width = 10;
    separation = width + width*0.2;

    for( var i=-1; i<2; i++ )
    {
        addRack( height, depth, width, 0, height/2 + 0.1, separation*i );
    }
}

function addRack( h, d, w, x, y, z)
{
    geometry = new THREE.BoxLineGeometry( d, h, w, 1, 30, 2 );
    material = new THREE.LineBasicMaterial( { color: 0x000000 } );
    rack = new THREE.LineSegments( geometry, material );
    rack.geometry.translate( x, y, z );
    scene.add( rack );

}