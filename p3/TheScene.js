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
	 this.camara = null;
	 this.controles_actuales = null;
	 this.ground = null;
	 this.insecto = null;
	 this.campo_de_juego = null;

	 this.createLights ();
/*S2 añadir foco */ this.createASpotLight();
	 this.create_camara_general (renderer);
	 this.axis = new THREE.AxisHelper (50);
	 this.add (this.axis);

	 this.model = this.createModel ();
	 this.add (this.model);

	 // Tras crear el modelo, empieza la animación
	 this.animacion_activa = true;
	}

	/// It creates the camera and adds it to the graph
	/**
	* @param renderer - The renderer associated with the camera
	*/
	// Visión esférica
	create_camara_general (renderer) {
	 this.camaraGeneral = new THREE.PerspectiveCamera(
		45, window.innerWidth / window.innerHeight, 0.1, 1000);

	 this.camaraGeneral.position.set (60, 30, 60);
	 this.camaraGeneral.lookAt(TheScene.ORIGEN);// Actualización de la matriz de proyección??

	 // Inicialmente el rederizador utiliza la cámara de visión general.
	 this.camara_actual = this.camaraGeneral;

	 //this.controles_generales = this.create_controles_de_camara(this.camaraGeneral, TheScene.ORIGEN, renderer);
	 //this.controles_actuales = this.controles_generales;

	 // Se crean los controles de cámara para la visión general.
	 this.create_controles_de_camara(this.camara_actual, TheScene.ORIGEN, renderer);

	 // A la escenase añade la visión general.
	 this.add(this.camaraGeneral);

	}

	create_controles_de_camara(camera, objetivo, renderer){
  	 var trackballControls = new THREE.TrackballControls (camera, renderer);
  	 trackballControls.rotateSpeed = 5; // Sensibilidad
  	 trackballControls.zoomSpeed = -1;
  	 trackballControls.panSpeed = 0.5;
  	 trackballControls.target = objetivo;

	 this.controles_actuales = trackballControls;
  	 return trackballControls;
   }

	/// It creates lights and adds them to the graph
	createLights () {
		// add subtle ambient lighting
		this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);	 // Creando luz ambiental
		this.add (this.ambientLight);	// FIXMI ¿Porqué se le añade a la escena?
												// Creía que darle valor a la variable bastaba.

	 // add spotlight for the shadows
	 this.spotLight = new THREE.SpotLight( 0xffffff );	// Creando un foco
	 this.spotLight.position.set( 60, 60, 40 );			// Posicionando el foco
	 this.spotLight.castShadow = true; 						// Indicando Sombra arrojada
	 // the shadow resolution
	 this.spotLight.shadow.mapSize.width=2048				// Resolución de la sombra
	 this.spotLight.shadow.mapSize.height=2048;			// en anchura y altura
	 this.add (this.spotLight);								// Añadiendo foco a la escena
	}

/* S2 Añadir otra luz */
	createASpotLight(){
		this.foco2 = new THREE.SpotLight(0xff00ff);// Se crea la instancia del foco
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
	 var model = new THREE.Object3D();
	 var loader = new THREE.TextureLoader();
	 var textura = loader.load ("imgs/wood.jpg");
	 var material_superficie = new THREE.MeshPhongMaterial({map: textura});
	 material_superficie.transparent = true;
	 material_superficie.opacity = 0.9;

// Creando el suelo
		this.ground = new Ground (
			TheScene.TAMANIO_MAXIMO_DEL_ESCENARIO, // Anchura ejeX
			TheScene.TAMANIO_MAXIMO_DEL_ESCENARIO, // Profundidad ejeZ
			material_superficie, 4);
	 model.add (this.ground);

// Creando a R2d2
	var parametros = {
			longitud_base: 1.0,
			material: new THREE.MeshPhongMaterial({map: loader.load("imgs/blanco_punteado.png")}),
			vida_total: 100
		}
	this.insecto = new Insecto(3.0);

	model.add(this.insecto);

// Creando el campo de juego

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

	selectBox(event, action){
		this.target_box = this.ground.selectBox (event, action);
		return this.target_box;
	}

	/// It sets the r2d2 position according to the GUI
	/**
	* @controls - The GUI information
	*/
	animate (controls) {
		// Manipulación de los elementos del escenario
		this.axis.visible = controls.axis;
		this.foco2.visible = controls.foco2;
		this.spotLight.intensity = controls.lightIntensity;
		this.ambientLight.visible = controls.ambientLight;
		this.ground.material.opacity = controls.opacidad_del_suelo;

		// Todo lo relacionado con el insecto
		this.insecto.update();
	}

	/// It returns the camera
	/**
	* @return The camera
	*/
	get_camara_principal(){	return this.camara_actual; }
	get_camara_general(){	return this.camaraGeneral;}
	get_camara_orbital(){	return this.insecto.get_camara_orbital();}
	get_camara_subjetiva(){	return this.insecto.get_camara_subjetiva();}

	setCamera(tecla){
		var objetivo;
		switch (tecla) {
			case 79:		// La letra 'o' de cámara orbital
				this.camara_actual = this.get_camara_orbital();
				this.controles_actuales.target = this.insecto.position;
				break;
			case 71:		// La letra 'g' de cámara general
				this.camara_actual = this.get_camara_general();
				this.controles_actuales.target = TheScene.ORIGEN;
				break;

			case 76:		// La letra 'l' de cámara local
				this.camara_actual = this.get_camara_subjetiva();
				// No hay objetivo fijo al cual mirar de forma indefinida
				this.controles_actuales.target = this.get_camara_subjetiva().direccion_destino;
				this.controles_actuales.target = target_box.position;
				break;
			default:
			break;
		}
		this.controles_actuales.object = this.camara_actual;

	}

	/// It returns the camera controls
	/**
	* @return The camera controls
	*/
	get_controles_de_camara(){	return this.controles_actuales;}
//	get_controles_generales(){	return this.controles_generales;}
//	get_controles_orbitales(){	return this.controles_orbitales;}
//	get_controles_subjetivos(){return this.controles_subjetivos;}

	/// It updates the aspect ratio of the camera
	/**
	* @param anAspectRatio - The new aspect ratio for the camera
	*/
	setCameraAspect (anAspectRatio) {
	 this.camara_actual.aspect = anAspectRatio;
	 this.camara_actual.updateProjectionMatrix();
	}

}

	// class variables
	TheScene.ORIGEN = new THREE.Vector3 (0,0,0);

	// Application modes
	TheScene.NO_ACTION = 0;
	TheScene.ADDING_BOXES = 1;
	TheScene.MOVING_BOXES = 2;
	TheScene.OBJETIVE_BOX = 3;

	// Actions
	TheScene.NEW_BOX = 0;
	TheScene.MOVE_BOX = 1;
	TheScene.SELECT_BOX = 2;
	TheScene.ROTATE_BOX = 3;
	TheScene.END_ACTION = 10;

	// Límites
	TheScene.TOPE_DE_ELEMENTOS = 10;
	TheScene.TAMANIO_MAXIMO_DEL_ESCENARIO = 100;
