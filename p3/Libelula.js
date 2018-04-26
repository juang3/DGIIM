
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

}
