
/// Libelula class
/**
 * @author Juan Germán
 *
 * @param aWidth - The width of the ground
 * @param aDeep - The deep of the ground
 * @param aMaterial - The material of the ground
 * @param aBoxSize - The size for the boxes
 */

class Libelula extends THREE.Object3D {
  constructor (longitud_base) {
	 super();

	 this.create_libelula(longitud_base);
	}

	create_libelula(longitud_base){
		// Creación de las distinpas partes de linsecto
		var abdomen = new THREE.BoxGeometry(longitud_base/2, longitud_base/2, longitud_base);
		var material = new THREE.MeshPhongMaterial({color:0xff0000});
		var cuerpo = new THREE.Mesh(abdomen, material);

		// Creación de la raíz del insecto
		this.libelula = new THREE.Object3D();

		// Añadiendo los elementos del insecto
		this.libelula.add(cuerpo);

		// Añadiendo el la jerarquía a la instancia.
		this.add(this.libelula);
	};

   // Presupongo que el elemento nuevas_coordenadas es un punto (x,y,z)
   desplazarse_a(nuevas_coordenadas){
      var direcion = nuevas_coordenadas - this.libelula.position;
      this.libelula.velocidad = Math.randFloat(3,8);

      // Cálculo del tiempo y limitador de movimientos.
      this.tiempo_del_frame_anterior = Date.now();
      this.contador_de_frame = 0;
   }


   //
   update(){
      // Calculando la nueva posición
      var tiempo_del_frame_actual = Date.now();
      var diferencia = tiempo_del_frame_actual - this.tiempo_del_frame_anterior;
      var pos = this.libelula.position + this.libelula.velocidad*diferencia;

      this.libelula.position.set(pos.x, pos.y, pos.z);

      this.tiempo_del_frame_anterior = tiempo_del_frame_actual;
      this.contador_de_frame ++;
   }
}
