
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends THREE.Scene {

	constructor (renderer) {
	 super();

	 // Attributes
	 this.ambientLight = null;
	 this.spotLight = null;
	 this.camera_general = null;
	 this.trackballControls_vuelo = null;
	 this.trackballControls_pp = null;		// Camara en primera persona
	 this.trackballControls_planta = null;
	 this.ground = null;
	 this.r2d2 = null;
	 this.campo_de_juego = null;
	 this.num_meteoros = 10;

	 this.createLights ();
/*S2 añadir foco */ this.createASpotLight();
	 this.createCamera_vuelo (renderer);
	 this.axis = new THREE.AxisHelper (50);
	 this.add (this.axis);

/*S2 añadir botón al foco */ this.add (this.foco2);
	 this.model = this.createModel ();
	 //this.createCamera_primera_persona(this.r2d2.camera_lente);
	 this.add (this.model);

	 // Tras crear el modelo, empieza la animación
	 this.animacion_activa = true;
  }

  /// It creates the camera and adds it to the graph
  /**
	* @param renderer - The renderer associated with the camera
	*/
	// Visión esférica
  createCamera_vuelo (renderer) {
	 this.camera_general = new THREE.PerspectiveCamera(
		45, window.innerWidth / window.innerHeight, 0.1, 1000);

	 this.camera_general.position.set (60, 30, 60);
	 var look = new THREE.Vector3 (0,20,0);      // FIXMI: ¿A qué hacen referencia?
	 this.camera_general.lookAt(look);                   // Actualización de la matriz de proyección??


	 this.trackballControls_vuelo=this.createTrackballControls(this.camera_general, look, renderer);
	 this.add(this.camera_general);
  }

  createTrackballControls(camera, objetivo, renderer){
	  var trackballControls = new THREE.TrackballControls (camera, renderer);
	  trackballControls.rotateSpeed = 5; // Sensibilidad
	  trackballControls.zoomSpeed = -2;
	  trackballControls.panSpeed = 0.5;
	  trackballControls.target = objetivo;
	  return trackballControls;
 }
  /* 	IDEA Quiero crear dos cámaras más,
   * Una que sea como mirar desde la lente de r2d2
	* Otra detrás de r2d2 para verle a él y los meteoritos que le vienen de frente
   */
	createCamera_planta(renderer){
		this.trackballControls_vuelo=this.createTrackballControls(
			this.campo_de_juego.get_camera_planta()
			, this.campo_de_juego.position
			, renderer);

		this.add(this.camera_planta);
	}
  /// It creates lights and adds them to the graph
  createLights () {
	 // add subtle ambient lighting
	 this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);   // Creando luz ambiental
	 this.add (this.ambientLight);   // FIXMI ¿Porqué se le añade a la escena?
												// Creía que darle valor a la variable bastaba.

	 // add spotlight for the shadows
	 this.spotLight = new THREE.SpotLight( 0xffffff );    // Creando un foco
	 this.spotLight.position.set( 60, 60, 40 );           // Posicionando el foco
	 this.spotLight.castShadow = true;                    // Indicando Sombra arrojada
	 // the shadow resolution
	 this.spotLight.shadow.mapSize.width=2048    // Resolución de la sombra
	 this.spotLight.shadow.mapSize.height=2048;  // en anchura y altura
	 this.add (this.spotLight);
  }

/* S2 Añadir otra luz */
  createASpotLight(){
	  this.foco2 = new THREE.SpotLight(0xff00ff);	// Se crea la instancia del foco
	  this.foco2.position.set(-60,60,-40);			// Se situa el foco
	  this.foco2.castShadow = false;					// Se indica las sombras arrojadas

	  this.add(this.foco2);								// Se añade a la escena.
  }
  /// It creates the geometric model: r2d2 and ground
  /**
	* @return The model
	*/

// Creando los objetos del escenario
  createModel () {
	 var model = new THREE.Object3D()
	 var loader = new THREE.TextureLoader();
	 var textura = loader.load ("imgs/wood.jpg");
	 var material_superficie = new THREE.MeshPhongMaterial({map: textura});
	 material_superficie.transparent = true;
	 material_superficie.opacity = 0.9;

// Creando el suelo
	 this.ground = new Ground (300, 300, material_superficie, 4);
	 model.add (this.ground);

// Creando a R2d2
	var parametros = {
			longitud_base: 1.0,
			material: new THREE.MeshPhongMaterial({map: loader.load("imgs/blanco_punteado.png")}),
			vida_total: 100
		}
	this.r2d2= new R2D2(parametros);
	model.add(this.r2d2);

// Creando el campo de juego
/**/

// FIXMI ¿Porqué no puedo multiplicar factor_escala*3.0?
// RESPUESTA: Porque la variable se llama factor_de_escala
	 var dimensiones = {
		longitud_X:this.r2d2.embergadura*3.0,
		longitud_Y:this.r2d2.altura_del_robot,
		longitud_Z:this.r2d2.embergadura*6.0};
//	console.log(this.r2d2.embergadura);
	 this.campo_de_juego = new CampoDeJuego(dimensiones, this.num_meteoros);

	model.add(this.campo_de_juego);

//	console.log(this.campo_de_juego.gestor_de_meteoritos.children.length);
// Creando el ambiente
model.add(new Ambiente());
/**/
	 return model;
  }

  // Public methods

  /// It adds a new box, or finish the action
  /**
	* @param event - Mouse information
	* @param action - Which action is requested to be processed:
	*                       *] start adding or finish.
	*/
  addBox (event, action) {
	 this.ground.addBox(event, action);
  }

  /// It moves or rotates a box on the ground
  /**
	* @param event - Mouse information
	* @param action - Which action is requested to be processed:
	*                       *] select a box,
	*                       *] move it,
	*                       *] rotate it or finish the action.
	*/
  moveBox (event, action) {
	 this.ground.moveBox (event, action);
  }

  /// It sets the r2d2 position according to the GUI
  /**
	* @controls - The GUI information
	*/
  animate (controls) {

/* Reflexión sobre el posicionamiento de r2d2 cuando cambia de tamaño:
 *	Debe escalarse en los tres ejes cada vez que r2d2 cambie de tamaño.
 * Opción 1] Escalar las dimensiones en animate.
 *		Esta opción ilustra las modificaciones que r2d2 sufre de manera general.
 *		¿Hay algún modo de discernir si hubo cambios
 *		(sin necesidad de una variable que recuerde el suceso anterior)?
 *
 * Opción 2] Escalar las dimensiones en la clase R2D2.
 *		Esta opción me convence más por delegar la tarea a la clase
 * 	pues tiene todo el conocimiento del grafo.
 */

	// Animate debe utilizarse mientras r2d2 esté activo
	this.animacion_activa = this.r2d2.activo;
	if(this.animacion_activa){
		this.axis.visible = controls.axis;
		/*S2 Añadir boton al foco */	 this.foco2.visible = controls.foco2;
		this.spotLight.intensity = controls.lightIntensity;
/*S2.8 luz_ambiental */  this.ambientLight.visible = controls.ambientLight;

		this.r2d2.esfera_englobante.visible = controls.ver_esfera;
		this.r2d2.caja_englobante.visible = controls.ver_caja;

		this.campo_de_juego.set_Tamanio_campo(controls.tamanio_campo);
		this.campo_de_juego.zona.visible = controls.ver_campo;
		this.r2d2.update(controls);
		this.campo_de_juego.update(this.r2d2);
		this.ground.material.opacity = controls.opacidad_del_suelo;

		setMessage(
			'<verde>Vida: '  + this.r2d2.resistencia.cantidad
			+ '<br> Score: ' + this.r2d2.score.cantidad
			+ '<br> Nivel: ' + this.campo_de_juego.dificultad*controls.tamanio_droide/controls.tamanio_campo
			+ '</verde>');
	}
	else{
		this.ambientLight.visible = false;
		setMessage(
			'<verde> Game Over <br> Score: '+ this.r2d2.score.cantidad
			+ '<br> Nivel: ' + this.campo_de_juego.dificultad*controls.tamanio_droide/controls.tamanio_campo
			+'</verde>');
	}
/* Reflexión sobre la ilustración de la vida de r2d2:
 *		Cuando un meteorito impacta sobre el personaje,
 * Si el meteorito es rojo, pierde "5" vida
 * Si el meteorito es verde,  gana "5" vida
 * ¿Debe la vida gestionarla el campo de juego o el propio r2d2?
 * ¿El indicador de vida debe gestionarlo el campo de juego o r2d2?
 *
 *		Se sobre entiende que las colisiones las gestiona el campo de juego
 * ¿pero quién decide la cantidad de vida a restar, el campo de juego o r2d2?
 *
 *		Cuando un meteorito sale del campo de juego éste debe ser visualmente eliminado.
 * lo que implica que debe frenarse su velocidad y recarculas sus coordenadas
 * para situarlo en el inicio del campo.
 *
 * INICIALMENTE: (IDEAS)
 * *] Todo lo relacionado con r2d2 lo gestionará R2D2 (vida y sus variaciones).
 * *] Si hay colisión, ésta devuelve el tamaño el meteorito y será r2d2 quien
 * decida la cantidad de vida que pierde.
 * *] El campo de juego debe gestionar los meteoritos que salen del campo.
 */
 //console.log(this.r2d2.position);
 //console.log(this.r2d2.rotation);
  }

  /// It returns the camera
  /**
	* @return The camera
	*/
  getCamera_general () {
	 return this.camera_general;
  }

  /**
 * @return The camera
 */
  getCamera_primera_persona () {
  return this.r2d2.camera_lente;
  }

  /// It returns the camera controls
  /**
	* @return The camera controls
	*/
  getCameraControls () {
	 return this.trackballControls_vuelo;
  }
  getCameraControls_pp(){
	  return this.trackballControls_pp;
  }

  /// It updates the aspect ratio of the camera
  /**
	* @param anAspectRatio - The new aspect ratio for the camera
	*/
  setCameraAspect (anAspectRatio) {
	 this.camera_general.aspect = anAspectRatio;
	 this.camera_general.updateProjectionMatrix();
  }

}

  // class variables

  // Application modes
  TheScene.NO_ACTION = 0;
  TheScene.ADDING_BOXES = 1;
  TheScene.MOVING_BOXES = 2;

  // Actions
  TheScene.NEW_BOX = 0;
  TheScene.MOVE_BOX = 1;
  TheScene.SELECT_BOX = 2;
  TheScene.ROTATE_BOX = 3;
  TheScene.END_ACTION = 10;
