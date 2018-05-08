
/// insecto class
/**
 * @author Juan Germán
 *
 * @param aWidth - The width of the ground
 * @param aDeep - The deep of the ground
 * @param aMaterial - The material of the ground
 * @param aBoxSize - The size for the boxes
 */

class Insecto extends THREE.Object3D {
  constructor (longitud_base) {
	 super();

	 // Variables de utilidad
		this.direccion_a_seguir = new THREE.Vector3();
		this.coordenadas_objetivo = new THREE.Vector3();
		this.tamanio = longitud_base;
		this.velocidad = 0;
		this.angulo = null;

	 // Variables para elegir camino.
		this.ruta = new Array();    // Gestor de los puntos del camino
		for (var i = 0; i < Insecto.PTS_CONTROL; i++) {
			this.ruta.push(new THREE.Vector3());
		}
		console.log(this.ruta)
		this.ruta.name = " Ruta "

		this.punto_A = new THREE.Vector3();
		this.punto_B = new THREE.Vector3();
		this.destino_anterior = new THREE.Vector3();
		this.punto_de_control = new THREE.Vector3();
//      this.spline = new THREE.CatmullRomCurve3(this.ruta);

		this.camino_calculado = false;
		this.tolerancia = 0;

	 // Creando el modelo
	 this.escalado = 0.1
	 this.create_insecto(longitud_base, this.escalado);

	}

	create_insecto(longitud_base, escalado){
		// Creación de las distinpas partes de linsecto
		var abdomen = new THREE.BoxGeometry(longitud_base/2, longitud_base/2, longitud_base);
		var material = new THREE.MeshPhongMaterial({color:0xff0000});
		var cuerpo = new THREE.Mesh(abdomen, material);

		var frontal = new THREE.SphereGeometry(longitud_base/4, 8, 8);
		this.cabeza = new THREE.Mesh(frontal, material);
		this.cabeza.position.y += longitud_base/3;
		this.cabeza.position.z += longitud_base/2;

		// Creación de la raíz del insecto
		this.insecto = new THREE.Object3D();
		this.insecto.name = "INSECTO";
		this.insecto.scale.set(escalado, escalado, escalado);

		// Añadiendo los elementos del insecto
		this.insecto.add(cuerpo);
		this.insecto.add(this.cabeza)
		this.velocidad = 0.0;
		this.createCamaraOrbital(0, this.tamanio, 4*this.tamanio);
		this.createCamaraSubjetiva();
//      this.frontal.position.set(abdomen.position.x, abdomen.position.y, abdomen.position.z);
		// Añadiendo el la jerarquía a la instancia.
		this.add(this.insecto);

	};

	desplazarse_a(elemento){
		// [elemento != null] Evita fallo al marcar en zona vacía

		if(elemento !== null && elemento.material.transparent){
			// Si el objetivo anterior es distinto al nuevo objetivo.
			// Éste debe ser modificado para evitar tener más de un elemento como objetivo.
			if(target_box !== null && target_box !== elemento) {
				target_box.objetivo = false;
				target_box.material.transparent = false;
			}

			// Se indica que el nuevo elemento es el objetivo
			elemento.objetivo = true;

			// Se actualiza el objetivo anterior.
			target_box = elemento;

			// Criterio de cercania entre la libélula y el elemento objetivo
			this.tolerancia = scene.ground.boxSize;

			// Cálculo de las coordenadas a desplazarse el insecto
			var superficie_del_elemento = scene.ground.boxSize/2;
			this.coordenadas_objetivo.set(
				elemento.position.x, //+ Math.random(aleatoria),
				// No entiendo la razón par la que debo
				elemento.position.y + superficie_del_elemento,
//				elemento.position.y,
				elemento.position.z) //+ Math.random(aleatoria));

			// Crea los puntos de control hacia el objetivo. (Para Splines)
			this.camino(this.insecto.position, this.coordenadas_objetivo);

			// Camino en linea recta (también dirección del objetivo)
			this.direccion_a_seguir.subVectors(this.coordenadas_objetivo, this.insecto.position);

			// Cálculo del tiempo y limitador de movimientos.
//			this.tiempo_del_frame_anterior = Date.now();
//			this.contador_de_frame = 0;

			// Iniciar el camino, emperanzo por girar hacia el objetivo.
			this.iniciar_giro = true;


			// Tener el objetivo siempre visible.
//			this.get_camara_subjetiva().lookAt(this.coordenadas_objetivo);

			// Actualización de las coordenadas del objetivo
			this.get_camara_subjetiva().direccion_destino.set(
				this.coordenadas_objetivo.x,
				this.coordenadas_objetivo.y,
				this.coordenadas_objetivo.z);

			// Criterio de actualización
			this.velocidad = 1;
		}

	}


	//
	update(){
		this.giro_orbital(0.000);
//		this.giro_orbital(0.020);

		if( this.velocidad > 0){
//		if( this.contador_de_frame < this.tiempo){
			this.desplazamiento(Insecto.SPLINE);

			// Criterio de parada.
			this.criterio = this.coordenadas_objetivo.distanceToSquared(this.insecto.position) < this.tolerancia;
			if(this.criterio){
				this.velocidad = 0;
				console.log("Criterio verificado");
				// IDEA: Además debe eliminarse los puntos del camino.
			}

// Para visualizar contenido
//         console.log(this.insecto.position)
		}
	}

	giro_insecto(){
		if(this.iniciar_giro){
			// Calculando ángulo entre anbas direcciones.
			this.angulo = this.get_camara_subjetiva().direccion_origen
				.angleTo(this.get_camara_subjetiva().direccion_destino);

			// Actualizando la dirección origen
			this.get_camara_subjetiva().direccion_origen.set(
				this.get_camara_subjetiva().direccion_destino.x,
				this.get_camara_subjetiva().direccion_destino.y,
				this.get_camara_subjetiva().direccion_destino.z)

			this.contador_de_giro = 0;
			// 200, es un dato provisional hasta determinar cual sería el satisfactório.
			this.angulo = this.angulo/100;

			this.iniciar_giro = false;
		}


		if(this.contador_de_giro < 100){
			this.insecto.rotation.y += this.angulo;
			this.contador_de_giro ++;
			return this.angulo;
		}
		else {return 0;}

	}

	espacio_tiempo(){
		var tiempo_del_frame_actual = Date.now();
		var diferencia = tiempo_del_frame_actual - this.tiempo_del_frame_anterior;

		// Actualizando el momento anterior
		this.tiempo_del_frame_anterior = tiempo_del_frame_actual;
		return this.velocidad*diferencia/Insecto.TIEMPO;

	}
	desplazamiento(tipo){
			// Desplazando a la libélula
			switch (tipo) {
				case Insecto.LINEAL:
					// Calculo del posicionamiento
					var factor_et = this.espacio_tiempo();

					this.insecto.position.x += this.direccion_a_seguir.x*factor_et;
					this.insecto.position.y += this.direccion_a_seguir.y*factor_et;
					this.insecto.position.z += this.direccion_a_seguir.z*factor_et;
					break;

				case Insecto.SPLINE:
					if(!this.camino_calculado){
						if(this.giro_insecto() == 0){
							this.spline = new THREE.CatmullRomCurve3(this.ruta);
							this.camino_calculado = true;

							/* IDEA Creado el camino, empiza el tiempo para recorrerlo.
							* Lugar más adecuado para evitar errores en la continuidad del movimiento.
							*/
							this.tiempo_inicial = Date.now();
						}

					}
					else{
						// PRE: La curva con los puntos debe existir YA.
						var t = ((Date.now() - this.tiempo_inicial ) % Insecto.TIEMPO)/ Insecto.TIEMPO;
						this.insecto.position.copy(this.spline.getPointAt(t));
					}

					// Me indefine this.insecto.rotation NO sé el motivo
//					this.insecto.rotation.copy(this.spline.getTangentAt(t));
					break;
				default:
					setMessage("Opción = "+ tipo + "Aún no desarrollada");
				break;
			}
	}

	camino(origen, destino){
//		if(this.criterio)
		{	this.punto_A.copy(origen);
			this.punto_B.copy(destino);
			var ponderador_A = 1;     // Elige el punto de control a utilizar
			var ponderador_B = 1;

			this.ruta[0] = this.punto_A;							// Inicio del camino
			for(var i=1; i< this.ruta.length-1; i++){
				// Un punto entre origen y destino se consigue con : t*B + (1-t)*A
				ponderador_A = Math.random();
				/*  Aclaración: Para evitar objener los puntos origen y destino,
				 * sumo 0.015625 que es representable de forma finita en base dos 1/64
				 * 	0.01 < 1/64 < 0.02
				 * Además es suficientemente pequeño para estar entre 0.01 y 0.02
				 */
				// Calculando el punto de control.

				/* lerpVectors Realiza justamente lo que busco,
				 * devuelve un punto intermedio entre origen y destino
				 * que puedo utilizar como un punto de control.
				 */

				this.ruta[i].lerpVectors(this.punto_A, this.punto_B, i/this.ruta.length);
				/* 	Obtenido el punto de control.
				 * Necesito variar ligeramente los valores de las coordenadas:
				 * *] X, para crear el efecto de atrás-adelante.	-5 < X < 5
				 * *] Y, para crear el efecto de subir-bajar.		-5 < Y < 5
				 * *] Z, para crear el efecto de vaivén izq-der.	-5 < Z < 5
				 */
					var atras_delante			= Insecto.AMPLITUD*(Math.random() - 0.5);
					var sube_baja				= Insecto.AMPLITUD*(Math.random() - 0.5);
					var izquierda_derecha	= Insecto.AMPLITUD*(Math.random() - 0.5);

					// Evita bajar por debajo del suelo
					if(sube_baja<0){ sube_baja = 0.0;}

					this.ruta[i].x += atras_delante;
					this.ruta[i].y += sube_baja;
					this.ruta[i].z += izquierda_derecha;

			}
			this.ruta[this.ruta.length-1] = this.punto_B;	// Final del camino.
			console.log(this.ruta);
		}
	}

	limpiar_array(padre){  padre.splice(0, padre.length);}

	// Creando cámara local (Gira al rededor del insecto)
	createCamaraOrbital(x, y, z){
		this.camara_local = new THREE.PerspectiveCamera(
		 45, window.innerWidth / window.innerHeight, 0.1, 500);

		 // Posicionamiento de la cámara
		 this.camara_local.position.set(x, y, z);
//       this.camara_local.lookAt(this.insecto.position);

		// Orbitar al rededor de la insecto
		this.camara_orbital = new THREE.Object3D();
		this.camara_orbital.add(this.camara_local);
//      this.camara_orbital.rotation.y = Math.PI;

		// Añadiendo la cámara a la instancia
		this.insecto.add(this.camara_orbital);

	  return this.camara_orbital;
	}

	giro_orbital(angulo){
//      this.camara_orbital.lookAt(this.insecto.position)
		this.camara_orbital.rotation.y += angulo
	}

	get_camara_orbital(){return this.camara_local;}

	createCamaraSubjetiva(){
		this.camara_subjetiva = new THREE.PerspectiveCamera(
		 90, window.innerWidth / window.innerHeight, 1, 14.14*TheScene.TAMANIO_MAXIMO_DEL_ESCENARIO);

		// Posicionamiento de la cámara
		this.camara_subjetiva.rotation.y = Math.PI;
		this.camara_subjetiva.direccion_origen = new THREE.Vector3(0,0,1);
		this.camara_subjetiva.direccion_destino= new THREE.Vector3(0,0,1);

		this.cabeza.add(this.camara_subjetiva);
		return this.camara_subjetiva;
	}

	get_camara_subjetiva(){
		return this.camara_subjetiva;}
}

Insecto.LINEAL = 1;
Insecto.CUADRATICA = 2;
Insecto.CUBICA = 3;
Insecto.SPLINE = 10;

Insecto.PTS_CONTROL = 5;
Insecto.AMPLITUD = 10;
Insecto.TIEMPO = 4000;
