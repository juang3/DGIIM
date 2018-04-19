/* The R2d2 class
 *	Imposiciones:
 *		1ª] Crear una malla que se parezca a r2d2 (Star Wars)
 *		2ª] La cabeza debe rotar un ángulo entre -80º y 80º
 *		3ª] El brazo derecho se elonga	--> Implica que el apoyo se transade
 *		4ª] El brazo izquierdo se elonga	--> Implica que el apoyo se translade
 *
 *	Implicaciones:
 *		1ª --> La cabeza debe ser un atributo de instancia para provocar el movimiento
 *		2ª --> El brazo izquiero debe ser un atribito de instancia
 *		2.1ª --> El apoyo debe ser un atributo de instancia.
 *		3ª --> El brazo derecho debe ser un atributo de instancia
 *		3.1ª --> El apoyo debe ser un atributo de instancia.
 *
 * Formas de evitar posibles repeticiones de código (en los brazos).
 *  Una extremidad está compuesta por un hombro, un brazo, un apoyo (pie o mano)
 *  Como necesito tener controlados dos extremidades, ello me implica decidir entre:
 *		Opción 1] Crear una función para cada extremidad.
 *		Opción 2] Crear una función que devuelva una un TDA compuesto de {brazo, apoyo}
 * 	Opción 3] Crear una función que instance a cada atributo.
 *
 * Observaciones de cada opción
 *  La opción 1, es más "fácil" de implementar (redunda código => dificil mantenimiento)
 *  La opción 2, es más "dificil" de implementar (no hay redundancia => fácil mantenimiento)
 *  La opción 3, es un mixto entre las opciones anteriores
 *
 * Conclusión: He optado por la opción 3 y
 *					he decidido que cada extremidad sea independiente.
 */

/**
 * @author Juan Germán Gómez
 * @param parameters - Incluye parámetros de tamaño y material
 * @param parameters.longitud_base - Todo será proporcional a esta longitud
 * @param parameters.aMaterial - Material de R2d2
 */

class R2D2 extends THREE.Object3D {
/*******************************************************************************/
/* CONSTRUCTOR *****************************************************************/
	constructor(parameters){
		super();
/* [Tamaño_base de r2d2] *****************************************************/
		this.longitud_base 	= (parameters.longitud_base === undefined ? 1.0 : parameters.longitud_base);
		this.material			= (parameters.material === undefined ? new THREE.MeshPhongMaterial ({color: 0xd4af37, specular: 0xfbf804, shininess: 70}) : parameters.material);
		this.vida_total		= (parameters.vida_total === undefined ? 1000 : parameters.vida_total);

/* [Grados de libertad] *******************************************************/
		this.gira = 0.0;			// La cabeza.gira un ángulo ALFA
		this.factor_de_escala = 3.0*this.longitud_base;	// Los brazos.suben una altura H (mediante escalado)
		this.se_inclina = 0.0;	// El cuerpo.se_inclina un ángulo BETA

/*** Mallas implicadas */
	// Para poder editar los movimientos de la cabeza
		this.cabeza = null;						// Asociado a: this.gira

	// Para poder elongar las extremidades (mediante escalado)
		this.brazo_escalado_Xpos = null;		// Asociado a: this.factor_de_escala
		this.brazo_escalado_Xneg = null;		// Asociado a: this.factor_de_escala
		this.apoyo_Xpos = null;					// Asociado a: this.factor_de_escala
		this.apoyo_Xneg = null;					// Asociado a: this.factor_de_escala

	// Para poder inclunar a r2d2
		this.cuerpo_y_cabeza = null;			// Asociado a: this.se_inclina

/* FIN de libertades **********************************************************/

/* [TAMAÑOS DEDUCIDOS del tamaño base y los grados de libertad ] */
/* Cabeza */
		this.radio_ojo 		= this.longitud_base/2.0;
		this.radio_cabeza		= this.longitud_base +this.radio_ojo;

/* Cuerpo */
		this.altura_cuerpo 	= this.factor_de_escala + this.longitud_base/2;

/* Extremidades */
	/* apoyos, pies-manos */
		this.base_cono 		= this.longitud_base;
		this.tapa_cono 		= this.base_cono/2.0;
		this.altura_cono		= this.base_cono;

	/* brazos */
		this.altura_brazo 	= 1.0;
		this.altura_brazo_escalado = this.altura_brazo*this.factor_de_escala;
		this.altura_brazo_maxima = this.factor_de_escala*1.2;
		this.grosor_brazo 	= this.tapa_cono/3;
/* FIN de proporciones ********************************************************/
/* Datos para las figuras englobantes *****************************************/
		this.radio = 1.0;
		this.radio_escalado = this.radio*this.factor_de_escala;

/* Fin ************************************************************************/
/* VARIABLES DE UTILIDAD */
	this.altura_del_robot = this.altura_cono + this.factor_de_escala + this.radio_cabeza;
	/* *] this.altura_cono:			Indica la longitud del apoyo
	 * *] this.factor_de_escala:	Indica la longitud del brazo
	 *			(longitud_cuerpo <= longitud_brazo).
	 *
	 * *] this.radio_cabeza:		Indica la longitud de la semiesfera
	 			que sobre sale del cuerpo
	 */
	this.embergadura = this.longitud_base + 2*this.radio_cabeza + this.longitud_base;
	/* *] this.longitud_base:	Indica el grosor del hombro izquierdo y derecho.
	 * *] this.radio_cabeza:	Indica el ancho del cuerpo
	 *			(radio_cabeza == radio_cuerpo)
	 */

/* CALCULADAS LAS DISTANCIAS, se crea la malla de r2d2 ************************/
	/* Creando a r2d2 */
	 this.r2d2 = 	this.create_R2D2();

/* Añadiendo a r2d2 a la escena */
	 this.add(this.r2d2);
	 this.add(this.esfera_englobante);
	 this.add(this.caja_englobante);
	 this.add(this.resistencia);
	 this.add(this.score);
	 this.add(this.createCamera_tercera_persona(0, 2*this.altura_del_robot,-5*this.altura_del_robot))
//	 this.position.set(0,0,this.embergadura);

	 console.log('La vida total de r2d2 es:'+this.vida_total);
	 console.log('Creado r2d2, cuya cantidad es: '+ this.resistencia.cantidad);
}
/* FIN Constructor ************************************************************/
/******************************************************************************/

/* FUNCIONES privadas de la clase:
 * *] create_R2D2 	--> Crea el grafo del personaje.
 * *] create_cabeza	--> Crea el grafo de la cabeza incluyendo el grafo del ojo
 * *] create_cuerpo	--> Crea el grafo del cuerpo incluyendo
 * *] create_extremidades --> Crea el grafo de ambas extremidades (Simétricas)
 *			incluye la el grafo del hombro, brazo, apoyo.
 * *] create_ojo		--> Crea el grafo de la lente (Debe incluir un foco).
 * *] create_hombro	--> Crea el grafo del hombro.
 * *] create_brazo	--> Crea el grafo del brazo (interseca al hombro).
 * *] create_apoyo	--> Crea el grafo de uno de los apoyos

 ******************************************************************************/
	create_R2D2(numero_positivo){
		var r2d2 = new THREE.Object3D();
// Partes Simples
		this.cabeza = this.create_cabeza(0.0, 0.0 + this.longitud_base/2, 0.0);
		var cuerpo = this.create_cuerpo(0.0, -this.altura_cuerpo/2 + this.longitud_base/2, 0.0);
		var extremidades = this.create_extremidades(+this.radio_cabeza, 0, 0);
		// IMPORTANTE: Ambos extremidades se

// Partes Compuestas
		this.cuerpo_y_cabeza = new THREE.Object3D();
		this.cuerpo_y_cabeza.add(this.cabeza);
		this.cuerpo_y_cabeza.add(cuerpo);

// r2d2
		r2d2.add(this.cuerpo_y_cabeza);
		r2d2.add(extremidades);

// Creando fiujas englobantes.
		this.esfera_englobante = this.create_esfera_englobante();
		this.caja_englobante = this.create_caja_englobante();

// Creando la barra de vida (resistencia) y de puntuación (score)
		this.factor_de_barra_visual = 16; // necesario para matener la barra localizada.
		this.resistencia = this.create_resistencia(this.vida_total);
		this.score = this.create_score();

		console.log('Tras crear la barra de vida, la cantidad de vida es: '+this.resistencia.cantidad)
		this.activo = true;
		this.gravedad = 10; // Indica la cantidad de daño a sufrir por cada impacto

// Añadiendo figuras englobantes a r2d2,
// implica que las figuras se moveran junto a r2d2 cuando se mueva.
//		r2d2.add(this.esfera_englobante);
//		r2d2.add(this.caja_englobante);
// NOTA: Los escalados a r2d2 afectan a las figuras englobantes
		return r2d2;
	}

	create_cabeza(x, y, z){
		/* Creando la cabeza */
		var cabeza = new THREE.Mesh(
			new THREE.SphereGeometry(this.radio_cabeza, 16, 16),
			this.material
		);

		/* Creando y situando el ojo en la escena de la cabeza */
		this.lente = this.create_ojo(0.0, 2*this.radio_ojo, 2*this.radio_cabeza/3);

		// Añadiendo el ojo
		cabeza.add(this.lente);

		// Cambios en el movimiento de la cabeza
		cabeza.rotation.y = this.gira;

		// Posicionamiento en la ESCENA
		cabeza.position.set(x, y, z);

		return cabeza;
	}

	create_cuerpo(x, y, z){
		/* Creando el cuerpo */
		var cuerpo = new THREE.Mesh(
		new THREE.CylinderGeometry(
			this.radio_cabeza, this.radio_cabeza, this.altura_cuerpo),
			this.material);

		// Posicionamiento en la escena
		cuerpo.position.set(x, y, z);

		return cuerpo;
	}

	create_extremidades(x, y, z){
		/* Creando ambos brazos */
		this.brazo_escalado_Xpos = new THREE.Object3D();
		this.brazo_escalado_Xpos.add(this.create_brazo(0.0, -this.altura_brazo/2, 0.0));

		this.brazo_escalado_Xneg = new THREE.Object3D();
		this.brazo_escalado_Xneg.add(this.create_brazo(0.0, -this.altura_brazo/2, 0.0));

/* Aclaración. Para que el escalado sea correcto en mi interpretación
	debo decidir cual forma utilizar.

	Ejemplo: "El brazo mide 7 unidades y quiero que despues tenga 10 unidades"

	Forma1: Necesito encontrar el factor que me convierta 7 en 10
	(Para mi, es la forma más intuitiva, pero más costosa)

	Forma2: Tomo el brazo de tamaño 1, y el factor que actualmente vale 7,
		lo cambio por 10.
	(Para mi es una forma antiintuitiva pero más rápida incluso "entendible")
	*/

		this.brazo_escalado_Xpos.scale.set(1, this.factor_de_escala ,1);
		this.brazo_escalado_Xneg.scale.set(1, this.factor_de_escala ,1);

		this.hombro_Xpos = this.create_hombro(0.0 ,0.0, 0.0 );
		this.hombro_Xneg = this.create_hombro(0.0 ,0.0, 0.0 );

		this.apoyo_Xpos = this.create_apoyo(0.0, -this.altura_cono/2.0 - this.brazo_escalado_Xpos, 0.0);
		this.apoyo_Xneg = this.create_apoyo(0.0, -this.altura_cono/2.0 - this.brazo_escalado_Xneg, 0.0);


		var extremidad_Xpos = new THREE.Object3D();
		var extremidad_Xneg = new THREE.Object3D();

		extremidad_Xpos.add(this.brazo_escalado_Xpos);
		extremidad_Xneg.add(this.brazo_escalado_Xneg);

		extremidad_Xpos.add(this.hombro_Xpos);
		extremidad_Xneg.add(this.hombro_Xneg);

		extremidad_Xpos.add(this.apoyo_Xpos);
		extremidad_Xneg.add(this.apoyo_Xneg);

// Situando el elemento en la ESCENA
		extremidad_Xpos.position.set(x, y, z);
		extremidad_Xneg.position.set(-x, y, z);

// Creando una sola malla para las extremidades
		var extremidades = new THREE.Object3D();
		extremidades.add(extremidad_Xpos);
		extremidades.add(extremidad_Xneg);

		return extremidades;
	}
	create_ojo(x, y, z){
		var ojo = new THREE.Mesh (
			new THREE.CylinderGeometry (
				this.radio_ojo,
				this.radio_ojo,
				this.longitud_base,
				16, 1),
			this.material);

		// FIXMI: En este momento debe incluirse el foco en la lente.
		// Posicionamiento en la ESCENA

		/* 	La sesión 3, pide poner un foco en la lente de r2d2
		 * por ese motivo creo conveniente, crear y añadir en este movimiento
		 * dicha luz.
		 */
		 var foco = new THREE.SpotLight(0x00ff00, 1);
		 foco.position.set( 0, this.longitud_base/2, 0 );		// Posicionando el foco
		 foco.angle = R2D2.NOVENTA/3;
		 foco.castShadow = true;                    			// Indicando Sombra arrojada
		 // the shadow resolution
		 foco.shadow.mapSize.width=2048    // Resolución de la sombra
		 foco.shadow.mapSize.height=2048;  // en anchura y altura
		 foco.decay = 2;	// La luz se atenua con la distancia
		 foco.distance = this.longitud_base*100;

		 /* 	Construido el foco ahora toca dirigir la luz del cono
		  * según THREE.js debo crear un punto relativo (target) hacia donde
		  * se dirigirá la luz.
		  * Para que la luz y la lente se muevan conjuntamente debe asignarse
		  * dicho objeto target al atributo target de la luz
		  */
		 var target = new THREE.Object3D();
		 foco.target = target;
		 target.position.set(0, 1,
//			  1);
			 2*this.longitud_base);
		 this.add(target);
// FIXMI: PORQUÉ no puedo anclar el target al ojo o al foco?
// ¿Porqué debe ser a la escena?
//		 ojo.add(target);

		 ojo.add(foco)

		 ojo.position.set(x, y, z);
		 ojo.rotation.x = -R2D2.NOVENTA;

		 ojo.add(this.createCamera_primera_persona(x, y, z));
		return ojo;
	}

	createCamera_primera_persona(x, y, z){
		/* IDEA Camera_primera_persona
		 * Para ver lo que deberia ver r2d2 la mejor opción es crear la cámara
		 * y situarla en la lente
		 */
		this.camera_lente = new THREE.PerspectiveCamera(
		  45, window.innerWidth / window.innerHeight, 0.1, 500);

		// Posicionamiento de la cámara
		this.camera_lente.position.set(x, y, z);
//		var look = new THREE.Vector3(0,0,0);

		// Rotando la cámara para enfocar lo que debería ver r2d2
		this.camera_lente.rotation.y = Math.PI;
		this.camera_lente.rotation.x = R2D2.NOVENTA;
//		this.camera_lente.lookAt(look);

		return this.camera_lente;
	}

	createCamera_tercera_persona(x,y,z){
		/* IDEA Camera_tercera_persona
		* Para ver lo que deberia ver r2d2 la mejor opción es crear la cámara
		* y situarla en la lente
		*/
	  this.camera_3p = new THREE.PerspectiveCamera(
		 45, window.innerWidth / window.innerHeight, 0.1, 500);

	  // Posicionamiento de la cámara
	  this.camera_3p.position.set(x, y, z);
// 		var look = new THREE.Vector3(0,0,0);

	  // Rotando la cámara para enfocar lo que debería ver r2d2
//	  this.camera_3p.rotation.y = Math.PI;
//	  this.camera_3p.rotation.x = R2D2.NOVENTA/4;
 		this.camera_3p.lookAt(this.r2d2.position);

	  return this.camera_3p;
	}

	create_hombro(x, y, z){
	// El hombro y el ojo tienen las misma dimensiones.
		var hombro = new THREE.Mesh (
			new THREE.CylinderGeometry (
				this.radio_ojo,
				this.radio_ojo,
				this.longitud_base,
				16, 1),
			this.material);

		// Posicionamiento en la ESCENA
		hombro.position.set(x, y, z);
		hombro.rotation.z = R2D2.NOVENTA;

		return hombro;
	}

	create_brazo(x, y, z){
		var brazo = new THREE.Mesh(
			new THREE.CylinderGeometry(this.tapa_cono, this.tapa_cono, this.altura_brazo)
			, this.material);
		brazo.position.set(x, y, z);
		return brazo;
	}

	create_apoyo(x, y, z){
		var apoyo = new THREE.Mesh(
			new THREE.CylinderGeometry(this.tapa_cono,this.base_cono,this.altura_cono),
			this.material
			);

		// Posicionamiento en la escena
		apoyo.position.set(x, y, z);

		return apoyo;
	}

	create_resistencia(numero_positivo){
		// Colores de la barra de vida
		this.rojo  = 0xff0000;
		this.naranja = 0xff7000;
		this.verde = 0x00ff00;
		this.azul  = 0x2271b3;

		if(numero_positivo<0){ numero_positivo = -numero_positivo;}
		this.vida_total = numero_positivo;

		// Barra de vida
		var simbolo = new THREE.CylinderGeometry(0.1, 0.1, 1);
		var material= new THREE.MeshPhongMaterial({color:this.verde});
		var barra_de_vida = new THREE.Mesh(simbolo, material);
		barra_de_vida.cantidad = numero_positivo;

		console.log('La cantidad de barra de vida es: '+ numero_positivo)
		barra_de_vida.scale.set(1, numero_positivo, 1);
		barra_de_vida.position.set(
			0,
			this.altura_del_robot ,
			0 - this.radio_cabeza);
		barra_de_vida.rotation.z = R2D2.NOVENTA;

		return barra_de_vida;
	}
	create_score(){
		this.gris = 0xc1c1c1;
		var simbolo = new THREE.CylinderGeometry(0.1, 0.1, 1);
		var material= new THREE.MeshPhongMaterial({color:this.gris});
		var barra_de_puntuacion = new THREE.Mesh(simbolo, material);
		barra_de_puntuacion.cantidad = 0;
		barra_de_puntuacion.position.set(
			0,
			this.altura_del_robot + 0.2,
			0 - this.radio_cabeza );
			barra_de_puntuacion.rotation.z = R2D2.NOVENTA
		barra_de_puntuacion.scale.y = 0.001
		return barra_de_puntuacion;
	}
/*******************************************************************************
 Movimientos privados ********************************************************
 * *] set_Gira_Cabeza		-->
 * *] set_Inclinar_Cuerpo	-->
 * *] set_Alargar_Brazos	-->
 * *] set_Tamanio				-->
 * *] set_Posicionamiento	-->

 Movimientos públicos (Interfaz) **********************************************
 * *] update
*/

/******************************************************************************/
/* PRIVADOS *******************************************************************/
/******************************************************************************/
// El ángulo debe ser en radianes
	set_Gira_Cabeza(nuevo_angulo){
		if(this.cabeza_anterior != nuevo_angulo){
			this.gira = nuevo_angulo;
		 	this.cabeza.rotation.y = nuevo_angulo;

// Actualizando memoria
			this.cabeza_anterior = nuevo_angulo;
		}
	}
/**/
	set_Alargar_Brazos(nuevo_escalado){
// Verificando que debe realizarse la acción
		if(this.escalado_anterior != nuevo_escalado){
/* Modificando la longitud de las brazos
 * (implica modificar la altura de r2d2
 * ello conlleva acturalizar el factor_de_escala y la altura
 * ocasionando la modificación de la figuras englobantes)
*/
			this.brazo_escalado_Xpos.scale.set(1, nuevo_escalado, 1);
			this.brazo_escalado_Xneg.scale.set(1, nuevo_escalado, 1);

			this.apoyo_Xpos.position.set(0, -nuevo_escalado ,0);
			this.apoyo_Xneg.position.set(0, -nuevo_escalado ,0);

			// Modificando las dimensiones de las englobantes
			// Debe escalarse la esfera cada vez que r2d2 cambie de tamaño,
			this.esfera_englobante.scale.set(
				nuevo_escalado*this.tamanio_anterior,
				nuevo_escalado*this.tamanio_anterior,
				nuevo_escalado*this.tamanio_anterior);

			this.caja_englobante.scale.set(
				this.factor_de_escala*this.tamanio_anterior*this.arista_X,
				this.factor_de_escala*nuevo_escalado*this.tamanio_anterior*this.arista_Y/3,
				this.factor_de_escala*this.tamanio_anterior*this.arista_Z);

			// actualizando memoria
			this.escalado_anterior = nuevo_escalado;

		}
	}
/* Cuando se modifica la altura o tamaño de r2d2
 * Deben actualizarse las variables:
 * 	altura_del_robot
 *		factor_de_escala
 *		embergadura
*/

/* Solo serealizan las acciones cuando hay un ángulo nuevo */
	set_Inclinar_Cuerpo(nuevo_angulo){
		if(this.inclinar_anterior != nuevo_angulo){
			this.se_inclina = nuevo_angulo;
			this.cuerpo_y_cabeza.rotation.x = nuevo_angulo;

// Actualizando memria
			this.inclinar_anterior = nuevo_angulo;
		}
	}

	set_Tamanio(nuevo_tamanio){
		if (this.tamanio_anterior != nuevo_tamanio) {

			// Agrandando toda la figura
			this.r2d2.scale.set(nuevo_tamanio, nuevo_tamanio, nuevo_tamanio);

			// Agrandando las englobantes
			this.esfera_englobante.scale.set(
				nuevo_tamanio*this.escalado_anterior,
				nuevo_tamanio*this.escalado_anterior,
				nuevo_tamanio*this.escalado_anterior);

			this.caja_englobante.scale.set(
				nuevo_tamanio*this.escalado_anterior*this.arista_X,
				nuevo_tamanio*this.escalado_anterior*this.arista_Y,
				nuevo_tamanio*this.escalado_anterior*this.arista_Z);

			// Actualiza memoria
			this.tamanio_anterior = nuevo_tamanio;

		}
	}

	set_posicion(nuevo_tamanio){
		var longitud_Y = nuevo_tamanio*(this.escalado_anterior -0.25);
		this.r2d2.position.set(0, (0.5+this.escalado_anterior)*nuevo_tamanio ,0);
		this.caja_englobante.position.set(0.0,longitud_Y, 0.0);
		this.esfera_englobante.position.set(0.0,longitud_Y, 0.0);
// FIXMI: No llego a entender el motivo por el cual debo trasladar a r2d2, a*(0.5 + factor_escala)
//		this.set_segmento();
		this.set_diagonal();
	}

	set_segmento(){
		if(this.pto_min != this.pto_min_anterior){
		this.pto_min.x = -this.caja_englobante.scale.x/2;
		this.pto_min.y = 0.0;
		this.pto_min.z = this.caja_englobante.scale.z/2;

		this.pto_min_anterior = this.pto_min;
//		console.log(this.pto_min);
		}

		if(this.pto_max != this.pto_max_anterior){
			this.pto_max.x = 0;
			this.pto_max.y = 0;
			this.pto_max.z = 0;

			this.pto_max_anterior = this.pto_max;
//			console.log(this.pto_max);
		}
	}

/* Fin de los métodos privados ************************************************/
/******************************************************************************/
/* FUNCIONES de la INTERFAZ ***************************************************
	*] El constructor.
	*] El actualizador de todos los parámetros
		(Tamaño, Inclinación del cuerpo,
		Giro de la cabeza, Elongación de las brazos
		y la actualización de las dimensiones de la caja englobante y de la esfera)
		y los movimientos: delante, detrás, girar_cuerpo_izq, girar_cuerpo_der
*******************************************************************************/
/* INTERFAZ *******************************************************************/
update(movimientos){
	//console.log(this.activo);
	if(this.activo){
	this.set_Gira_Cabeza(movimientos.gira_cabeza);
	this.set_Inclinar_Cuerpo(movimientos.se_inclina);
	this.set_Alargar_Brazos(movimientos.sube_cuerpo);
	this.set_Tamanio(movimientos.tamanio_droide);
	this.set_posicion(movimientos.tamanio_droide);
	this.set_centinelas();}
//	this.avanza(0.1);
//	this.gira_hacia_izquierda(0.01)
//	console.log(this.camera_lente.position)
//	console.log(this.lente.position)
	// Creada la etiqueta en index.html

	//		this.set_resistencia(valor_de_colision);
	// Cuando r2d2 se queda sin resistencia, éste se tumba.
	if(this.resistencia.cantidad<0){
		this.resistencia.cantidad = 0;
		this.descansando();
	}
}

incrementar_score(numero){
	this.score.cantidad +=numero;
	this.score.scale.set(1, this.score.cantidad/this.factor_de_barra_visual, 1);
}
/* Fin de la interfaz *********************************************************/
/******************************************************************************/
/******************************************************************************/
	create_esfera_englobante(){
// Creando la ENGLOBANTE.

		var zona_segura = new THREE.SphereGeometry(this.radio, 16,16);
		var texturador = new THREE.TextureLoader();
		var visual_zona = new THREE.MeshPhongMaterial({map: texturador.load("imgs/eye_nebula.jpeg")});

		var englobante = new THREE.Mesh(zona_segura, visual_zona);
		englobante.material.transparent = true;
		englobante.material.opacity = 0.2;

// Creando un acceso a la malla de la caja y la esfera englobante
		return englobante;
	}

	create_caja_englobante(){
		this.arista_X = this.embergadura/this.factor_de_escala;
		this.arista_Y = this.altura_del_robot/this.factor_de_escala;
		this.arista_Z = 2*this.radio_cabeza/3.0;

		var caja = new THREE.BoxGeometry (1.0, 1.0, 1.0);
		var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

		var englobante = new THREE.Mesh( caja, material );
		englobante.material.transparent = true;
		englobante.material.opacity = 0.2;

		this.pto_min_anterior = englobante.scale;
		this.pto_max_anterior = englobante.scale;
		this.pto_min = englobante.position;
		this.pto_max = englobante.position;

		// Creando diagonal de la caja englobante
		this.diagonal = new Object();
		this.diagonal.Xmin_Ymin_Zmin = new THREE.Vector3(0.0, 0.0, 0.0);
		this.diagonal.Xmax_Ymax_Zmax = new THREE.Vector3(0.0, 0.0, 0.0);

		// Creando elementos visuales que delimitan la caja englobante
		this.create_centinelas();

		return englobante;
	}

	set_diagonal(){
		var caja = this.caja_englobante;

		this.diagonal.Xmin_Ymin_Zmin.x = caja.position.x - caja.scale.x/2;
//		this.diagonal.Xmin_Ymin_Zmin.y = caja.position.x - caja.scale.y/2;
		this.diagonal.Xmin_Ymin_Zmin.y = caja.position.y - caja.scale.y/2;
		this.diagonal.Xmin_Ymin_Zmin.z = caja.position.z - caja.scale.z/2;

		this.diagonal.Xmax_Ymax_Zmax.x = caja.position.x + caja.scale.x/2;
		this.diagonal.Xmax_Ymax_Zmax.y = caja.position.y + caja.scale.y/2;
		this.diagonal.Xmax_Ymax_Zmax.z = caja.position.z + caja.scale.z/2;
	}

	create_centinelas(){
		this.centinelas = new THREE.Object3D();
		var simbolo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
		var material= new THREE.MeshPhongMaterial({color:0xffff00});

		this.centinelas.add(new THREE.Mesh(simbolo, material));
		this.centinelas.add(new THREE.Mesh(simbolo, material));

		this.add(this.centinelas);
		return this.centinelas;
	}

	set_centinelas(){
		var pos = this.diagonal.Xmin_Ymin_Zmin;
		this.centinelas.children[0].position.set(pos.x, pos.y, pos.z);

		pos = this.diagonal.Xmax_Ymax_Zmax;
		this.centinelas.children[1].position.set(pos.x, pos.y, pos.z);
	}

	set_resistencia(numero){
//		console.log('\n La cantidad de vida a modificar es:'+numero)
		if(0<this.resistencia.cantidad && this.resistencia.cantidad<this.vida_total*2){
			// Contabilizando las colisiones
			if(numero>0)
				{this.resistencia.cantidad -=this.gravedad*numero;}
			else
				{this.resistencia.cantidad -=numero;}

			// Representación visual de la resistencia mediante colores.
			if (this.resistencia.cantidad <= this.vida_total*0.25)
				{this.resistencia.material.color.setHex(this.rojo);}

			else
			if (this.resistencia.cantidad <= this.vida_total*0.5)
				{this.resistencia.material.color.setHex(this.naranja);}

			else
			if (this.resistencia.cantidad <= this.vida_total)
				{this.resistencia.material.color.setHex(this.verde);}
			else {this.resistencia.material.color.setHex(this.azul);}

			if(this.resistencia.cantidad >= this.vida_total*2)
				{this.resistencia.cantidad = this.vida_total*2;}

			// Representación visual mediante la longitud de la barra
			// Dividir entre 10, ayuda a tener una barra más pequeña
			this.resistencia.scale.set(1,this.resistencia.cantidad/this.factor_de_barra_visual, 1);
		}

	}

	avanza(num){
		/* 	Por motivos de posicionamiento de r2d2 sobre la escena,
		 * debo realizar los cálculos de forma opuesta.
		 * Es decir:
		 * 	[Forma original]
		 * 		this.position.x +=incremento_en_X
		 *			this.position.z -=incremento_en_Z
		 * 	[Mi forma, por estár r2d2 orientadohacie el ejeZ positivo]
		 *			this.position.x -=incremento_en_X
		 *			this.position.z +=incremento_en_Z
		 */
		var incremento_en_X = num*Math.sin(this.rotation.y);
		var incremento_en_Z = -num*Math.cos(this.rotation.y);
		this.position.x +=incremento_en_X
		this.position.z -=incremento_en_Z

		/* 	IDEA: Avanzar y retroceder es el mismo acto en sentidos contrarios
		 * por ello al indicar avanzar(n) con n>0, r2d2 avanza
		 * por ello al indicar avanzar(n) con n<0, r2d2 retrocede
		*/
		this.resistencia.cantidad -= 0.02;
	}

	gira_hacia_izquierda(num){
		this.rotation.y += num;
		this.resistencia.cantidad -= 0.02;
	}

	descansando(){
			this.rotation.x =-R2D2.NOVENTA;
			this.set_posicion(0);
			this.activo = false;
	}
}

R2D2.CONVERSION_A_RADIANES = Math.PI/180;
R2D2.NOVENTA = Math.PI/2;		// 90*Math.PI/180
R2D2.OCHENTA = 80*R2D2.CONVERSION_A_RADIANES;
