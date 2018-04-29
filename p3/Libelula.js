
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

	 // Variables de utilidad
	 this.direccion_a_seguir = new THREE.Vector3();
	 this.coordenadas_objetivo = new THREE.Vector3();
    this.velocidad = 0;
	 this.tiempo = 10000;

	 // Creando el modelo
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
		this.velocidad = 0.0;
		// Añadiendo el la jerarquía a la instancia.
		this.add(this.libelula);

	};

	desplazarse_a(elemento){
		// [elemento != null] Evita fallo al marcar en zona vacía

		if(elemento != null && !elemento.position.equals(this.coordenadas_objetivo)){
			this.target = elemento;
			this.coordenadas_objetivo.set(
				elemento.position.x,
//            elemento.position.y + elemento.scale.y*2 + this.libelula.scale.y*2,
				elemento.position.y,
				elemento.position.z);

			this.direccion_a_seguir.subVectors(this.coordenadas_objetivo, this.libelula.position);
//			console.log("Dirección a seguir, objetivo, posición de la libelula ");
//			console.log(this.direccion_a_seguir);
//			console.log(this.target.position);
			this.velocidad = Math.random(3) + 5;

			// Cálculo del tiempo y limitador de movimientos.
			this.tiempo_del_frame_anterior = Date.now();
			this.contador_de_frame = 0;
		}

	}


	//
	update(){
		// Verificando que se ha llegado.
		//console.log(this.libelula.position);
      console.log(this.contador_de_frame);
      console.log("Velocidad: " +this.velocidad)
      if( this.velocidad > 0){
//		if( this.contador_de_frame < this.tiempo){

			// Calculando la nueva posición
			var tiempo_del_frame_actual = Date.now();
			var diferencia = tiempo_del_frame_actual - this.tiempo_del_frame_anterior;
         var factor_tiempo = this.velocidad*diferencia/this.tiempo;

         // Desplazando a la libélula
			this.libelula.position.x += this.direccion_a_seguir.x*factor_tiempo;
			this.libelula.position.y += this.direccion_a_seguir.y*factor_tiempo;
			this.libelula.position.z += this.direccion_a_seguir.z*factor_tiempo;

			// Renovando el tiempo y el limitador.
			this.tiempo_del_frame_anterior = tiempo_del_frame_actual;
			this.contador_de_frame ++;

         // Criterio de parada.
         var tolerancia = this.target.scale.x;
         if(this.coordenadas_objetivo.distanceToSquared(this.libelula.position) < tolerancia)
            this.velocidad = 0;
		}
		else if (this.coordenadas_objetivo !== undefined && this.velocidad != 0){
		console.log("He alcanzado al objetivo");
			this.velocidad = 0;

		}
	}
}
