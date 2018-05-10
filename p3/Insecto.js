
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

		// Variable que indicará en cada momento las acciones del insecto.
		this.estado = Insecto.SIN_ACCION;

	 // Variables de utilidad para "ahorrar en tiempo y espacio "
		this.direccion_a_seguir = new THREE.Vector3();
		this.coordenadas_objetivo = new THREE.Vector3();
		this.ruta = new Array();    // Gestor de los puntos del camino
		for (var i = 0; i < Insecto.PTS_CONTROL; i++)
		{ this.ruta.push(new THREE.Vector3());}
		this.ruta.name = " Ruta "

		this.tamanio = longitud_base;

		//Variables de utilidad, para modificar el movimiento del insecto
		this.velocidad = 0;
		this.angulo = null;

	 // Variables para elegir camino.
		console.log(this.ruta)

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
		this.create_camara_orbital(0, this.tamanio, 4*this.tamanio);
		this.create_camara_subjetiva();
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
			this.tolerancia = scene.ground.boxSize + this.insecto.scale.z;
			console.log(" Distancia a tolerar: " +this.tolerancia);

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
			this.estado = Insecto.CALCULO_DEL_GIRO;


			// Tener el objetivo siempre visible.
//			this.get_camara_subjetiva().lookAt(this.coordenadas_objetivo);

			// Actualización de las coordenadas del objetivo
			this.get_camara_subjetiva().direccion_destino.set(
				this.direccion_a_seguir.x,
				this.direccion_a_seguir.y,
				this.direccion_a_seguir.z);

			// Criterio de actualización
			this.velocidad = 1;
		}

	}


	//
	update(){
		this.giro_orbital(0.000);
//		this.giro_orbital(0.020);
		switch (this.estado) {
			case Insecto.SIN_ACCION:
			break;

			case Insecto.ELEVANDOSE:
			break;

			case Insecto.CALCULO_DEL_GIRO:
				this.angulo = this.get_camara_subjetiva().direccion_origen
				.angleTo(this.get_camara_subjetiva().direccion_destino);
				console.log("Angulo de giro: "+ this.angulo)
// XXX: THREE devuelve el angulo siempre en positivo. NO me conviene ser positivo siempre
// Pues el insecto gira mal.

			// Actualizando la dirección origen
				this.get_camara_subjetiva().direccion_origen.set(
					this.get_camara_subjetiva().direccion_destino.x,
					this.get_camara_subjetiva().direccion_destino.y,
					this.get_camara_subjetiva().direccion_destino.z)

				// Necesario renovar el contador
				this.contador_de_giro = 0;
				// 200, es un dato provisional hasta determinar cual sería el satisfactório.
				this.angulo = this.angulo/Insecto.TIEMPO_DE_GIRO;

				// Cambio de estado
				this.estado = Insecto.GIRANDOSE;
			break;

			case Insecto.GIRANDOSE:
				if(this.giro_insecto() == 0){this.estado = Insecto.CALCULAR_CAMINO;}
			break;

			case Insecto.CALCULAR_CAMINO:
				this.spline = new THREE.CatmullRomCurve3(this.ruta);

				/* IDEA Creado el camino, empiza el tiempo para recorrerlo.
				*  Éste es el lugar más adecuado para evitar errores
				*  en la continuidad del movimiento.
				*/
				this.tiempo_inicial = Date.now();

				// Cambio de estado tras carcular el camino.
				this.estado = Insecto.EN_CAMINO;
			break;

			case Insecto.EN_CAMINO:
				// PRE: La curva con los puntos debe existir YA.
				var t = ((Date.now() - this.tiempo_inicial ) % Insecto.TIEMPO_DE_RECORRIDO)/ Insecto.TIEMPO_DE_RECORRIDO;
				this.insecto.position.copy(this.spline.getPointAt(t));

				this.criterio = this.coordenadas_objetivo.distanceToSquared(this.insecto.position) < this.tolerancia;
				if(this.criterio){ this.estado = Insecto.SIN_ACCION;}
			break;

			case Insecto.POSANDOSE:
			break;

			case Insecto.ATACANDO:

			default:
				break;

		}

// Para visualizar contenido
//         console.log(this.insecto.position)
		}

	giro_insecto(){
		if(this.contador_de_giro < Insecto.TIEMPO_DE_GIRO){
			this.insecto.rotation.y += this.angulo;
			this.contador_de_giro ++;
			return this.angulo;}
		else{
			return 0;}
	}

	espacio_tiempo(){
		var tiempo_del_frame_actual = Date.now();
		var diferencia = tiempo_del_frame_actual - this.tiempo_del_frame_anterior;

		// Actualizando el momento anterior
		this.tiempo_del_frame_anterior = tiempo_del_frame_actual;
		return this.velocidad*diferencia/Insecto.TIEMPO_DE_RECORRIDO;
	}


	camino(origen, destino){
		// Evita alterar los puntos origen y destino
		this.punto_A.copy(origen);
		this.punto_B.copy(destino);

		// El primer punto de control es la posición del insecto.
		this.ruta[0] = this.punto_A;							// Inicio del camino

		// Puntos intermedios
		for(var i=1; i< this.ruta.length-1; i++){
			/* Un punto entre un punto origen y otro destino
			 * 	se consigue con: Pt = t*B + (1-t)*A
			 * 	Fórma expandida de la expresion: Pt = A +t*V
			 * Donde:	Pt	es el punto a obtener
			 *				A	es el punto de origen del vector director V
			 *				V	es el vector director obtenido mediante  B - A
			 *				B  es el punto de destino del vector director V
			 */

			/* Calculando el punto de control.
			 * lerpVectors Realiza justamente lo que busco,
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

				// Evita bajar por debajo del suelo.
				if(sube_baja<0){ sube_baja = 0.0;}

				/* 	Supongo objetos que no salen de la visión del objervador,
				 *  por ello no limito la altura.
				 */

				this.ruta[i].x += atras_delante;
				this.ruta[i].y += sube_baja;
				this.ruta[i].z += izquierda_derecha;

		}
		// El último punto de control el la posición del objetivo.
		this.ruta[this.ruta.length-1] = this.punto_B;	// Final del camino.

		// Muestra los puntos de control para verificarlos
		console.log(this.ruta);
	}

	limpiar_array(padre){  padre.splice(0, padre.length);}

	// Creando cámara orbital (Gira al rededor del insecto)
	create_camara_orbital(x, y, z){
		this.camara = new THREE.PerspectiveCamera(
		 45, window.innerWidth / window.innerHeight, 0.1, 500);

		 // Posicionamiento de la cámara
		 this.camara.position.set(x, y, z);

		// Orbitar al rededor de la insecto
		this.orbital = new THREE.Object3D();
		this.orbital.add(this.camara);

		// Añadiendo la cámara a la instancia insecto
		this.insecto.add(this.orbital);

	  return this.orbital;
	}

	create_camara_subjetiva(){
		this.camara_subjetiva = new THREE.PerspectiveCamera(
		 45, window.innerWidth / window.innerHeight, 1, 14.14*TheScene.TAMANIO_MAXIMO_DEL_ESCENARIO);

		// Posicionamiento de la cámara
		this.camara_subjetiva.rotation.y = Math.PI;
		this.camara_subjetiva.direccion_origen = new THREE.Vector3(0,0,1);
		this.camara_subjetiva.direccion_destino= new THREE.Vector3(0,0,1);

		this.cabeza.add(this.camara_subjetiva);
		return this.camara_subjetiva;
	}

	get_camara_orbital(){	return this.orbital.children[0];}
	get_camara_subjetiva(){	return this.camara_subjetiva;}
	giro_orbital(angulo){ this.orbital.rotation.y += angulo; }

}


// Tipos de movimientos ( Extra, se podría indicar cómo debe moverse el insecto)
Insecto.LINEAL = 1;
Insecto.CUADRATICA = 2;
Insecto.CUBICA = 3;
Insecto.SPLINE = 10;

// Puntos de control que guian el avance del insecto
Insecto.PTS_CONTROL = 5;

// Distancia máxima desde el punto de control del trayecto.
Insecto.AMPLITUD = 10;

// Tiempo en milisegundos que el insecto tarda en llegar al objetivo
Insecto.TIEMPO_DE_RECORRIDO = 4000;

// Tiempo en milisegundos que el insecto tarda en orientarse hacia el objetivo
Insecto.TIEMPO_DE_GIRO = 100;

// Estados del insecto para el update()
Insecto.SIN_ACCION		= 0;
Insecto.ELEVANDOSE		= 1;
Insecto.CALCULO_DEL_GIRO= 2;
Insecto.GIRANDOSE			= 3;
Insecto.CALCULAR_CAMINO	= 4;
Insecto.EN_CAMINO			= 5;
Insecto.POSANDOSE			= 6;
Insecto.ATACANDO			= 7;
