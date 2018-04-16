
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
	 this.camera = null;
	 this.trackballControls = null;
	 this.crane = null;
	 this.ground = null;

	 this.createLights ();
/*S2 añadir foco */ this.createASpotLight();
	 this.createCamera (renderer);
	 this.axis = new THREE.AxisHelper (50);
	 this.add (this.axis);

/*S2 añadir botón al foco */ this.add (this.foco2);
	 this.model = this.createModel ();
	 this.add (this.model);
  }

  /// It creates the camera and adds it to the graph
  /**
	* @param renderer - The renderer associated with the camera
	*/
  createCamera (renderer) {
	 this.camera = new THREE.PerspectiveCamera(
		45, window.innerWidth / window.innerHeight, 0.1, 1000);

	 this.camera.position.set (60, 30, 60);
	 var look = new THREE.Vector3 (0,20,0);      // FIXMI: ¿A qué hacen referencia?
	 this.camera.lookAt(look);                   // Actualización de la matriz de proyección??

	 this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
	 this.trackballControls.rotateSpeed = 5; // Sensibilidad
	 this.trackballControls.zoomSpeed = -2;
	 this.trackballControls.panSpeed = 0.5;
	 this.trackballControls.target = look;

	 this.add(this.camera);
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
  /// It creates the geometric model: crane and ground
  /**
	* @return The model
	*/
  createModel () {
	 var model = new THREE.Object3D()
	 var loader = new THREE.TextureLoader();
	 var textura = loader.load ("imgs/wood.jpg");
	 this.ground = new Ground (
		300, 300,
		new THREE.MeshPhongMaterial ({map: textura}), 4);
	var parametros ={material:new THREE.MeshPhongMaterial ({map: loader.load("imgs/hack.jpeg")})};
	this.crane = new Crane(parametros);
//	 model.add (this.ground);
//	 model.add (this.crane);
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

  /// The crane can take a box
  /**
	* @return The new height of the hook,
	* on the top of the taken box. Zero if no box is taken
	*/
  takeBox () {
	 var box = this.ground.takeBox (this.crane.getHookPosition());
	 if (box === null)
		return 0;
	 else
		return this.crane.takeBox (box);
	 // The retuned height set the new limit to down the hook
  }

  /// The crane drops its taken box
  dropBox () {
	 var box = this.crane.dropBox ();
	 if (box !== null) {
		box.position.copy (this.crane.getHookPosition());
		box.position.y = -2;
		this.ground.dropBox (box);
	 }
  }

  /// It sets the crane position according to the GUI
  /**
	* @controls - The GUI information
	*/
  animate (controls) {
	 this.axis.visible = controls.axis;
/*S2 Añadir boton al foco */	 this.foco2.visible = controls.foco2;
/*S2.8 luz_ambiental */  this.ambientLight.visible = controls.ambientLight;
	 this.spotLight.intensity = controls.lightIntensity;
	 this.crane.setHookPosition (controls.rotation, controls.distance, controls.height);
/*S2.10 Cambiar el grosor de la cuerda */
    this.crane.string.scale.x = controls.grosorCuerda;
    this.crane.string.scale.z = controls.grosorCuerda;
  }

  /// It returns the camera
  /**
	* @return The camera
	*/
  getCamera () {
	 return this.camera;
  }

  /// It returns the camera controls
  /**
	* @return The camera controls
	*/
  getCameraControls () {
	 return this.trackballControls;
  }

  /// It updates the aspect ratio of the camera
  /**
	* @param anAspectRatio - The new aspect ratio for the camera
	*/
  setCameraAspect (anAspectRatio) {
	 this.camera.aspect = anAspectRatio;
	 this.camera.updateProjectionMatrix();
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
