class Ambiente extends THREE.Object3D{
   constructor(){
      super();

// Añadiendo partículas Simulando estrellas
      var geometry = new THREE.Geometry();
         for ( var i = 0; i < 1000; i ++ ) {
            var vertex = new THREE.Vector3();
            vertex.x = THREE.Math.randFloatSpread( 1000 );
            vertex.y = THREE.Math.randFloatSpread( 1000 );
            vertex.z = THREE.Math.randFloatSpread( 1000 );
            geometry.vertices.push( vertex );
         }
      var particles = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0xffffff } ) );
      this.add( particles );
   }
}
