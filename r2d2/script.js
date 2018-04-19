
/// Several functions, including the main

/// The scene graph
scene = null;

/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;

/// The current mode of the application
applicationMode = TheScene.NO_ACTION;

/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */

function createGUI (withStats) {
  GUIcontrols = new function() {
	 this.axis = true;
	 this.lightIntensity = 0.5;

	 this.gira_cabeza = 0.0;
	 this.se_inclina = 0.0;
	 this.sube_cuerpo   = ALTURA_MIN;
    this.tamanio_droide = TAMANIO_BASE;
    this.ver_esfera = false;
    this.ver_caja = false;

    this.tamanio_campo = TAMANIO_BASE + 0.5 ;
    // Al crear el campo con la opción wireframe:true, puedo visualizarlo.
    this.ver_campo = true;

/*S2.10*/	 this.grosor = 1;
	 this.addBox   = function () {
		setMessage ("Añadir cajas clicando en el suelo");
		applicationMode = TheScene.ADDING_BOXES;
	 };
	 this.moveBox  = function () {
		setMessage ("Mover y rotar cajas clicando en ellas");
		applicationMode = TheScene.MOVING_BOXES;
	 };
	 this.takeBox  = false;
/*S2*/ this.foco2 = false;
/*S2.8 */ this.ambientLight = true;
/*S2.6 Añadir botón que situe a la grua en una pose concretas*/
	this.pose = function(){
/*  Modifical los elementos de la GUI */
			GUIcontrols.gira_cabeza = CABEZA/2;
			GUIcontrols.se_inclina = (INCLINACION_ATRAS + INCLINACION_DELANTE)/2;
			GUIcontrols.sube_cuerpo = (ALTURA_MIN+ALTURA_MAX)/2;
         GUIcontrols.tamanio = (TAMANIO_MIN+TAMANIO_MAX)/2;
         this.foco2 = true;
	};
  }

  var gui = new dat.GUI();
  var axisLights = gui.addFolder ('Axis and Lights');
	 axisLights.add(GUIcontrols, 'axis').name('Axis on/off :');
/*S2*/    axisLights.add(GUIcontrols,'foco2').name('Roja iluminado');
	 axisLights.add(GUIcontrols, 'lightIntensity', 0, 1.0).name('Light intensity :');
/*S2.8*/ axisLights.add(GUIcontrols,'ambientLight').name('Luz ambiental');

  var actions = gui.addFolder ('Actions');
	 var addingBoxes = actions.add(GUIcontrols, 'addBox').name (': Adding boxes :');
	 var movingBoxes = actions.add (GUIcontrols, 'moveBox').name (': Move and rotate boxes :');
	 var poseGrua = actions.add(GUIcontrols,'pose').name('Pose r2d2');

var ver_campo_juego = gui.add(GUIcontrols,'ver_campo').name('Ver campo');
var tamanio = gui.add (GUIcontrols, 'tamanio_campo', TAMANIO_MIN, TAMANIO_MAX,0.1).name('Campo de juego').listen();
/*   tamanio.onChange(function (value){
      GUIcontrols.tamanio_campo = scene
         .campo_de_juego
         .set_Tamanio_campo(value-scene.campo_de_juego.dificultad)
   })
*/
/*
    var takingBoxes = actions.add (GUIcontrols, 'takeBox').name ('Take the box below');
	 takingBoxes.onChange (function (value) {
		  if (value) {
		  newHeight = scene.takeBox();
			 if (newHeight > 0) {
				  GUIcontrols.sube_cuerpo = newHeight;
				  GUIcontrols.takeBox = true;
			 } else {
				  GUIcontrols.takeBox = false;
			 }
		  } else {
			 scene.dropBox ();
		  }
	 });
    */

  var r2d2Controls = gui.addFolder ('r2d2 Controls');
//	 r2d2Controls.add (GUIcontrols, 'gira_cabeza', -CABEZA, CABEZA, 0.001).name('Gira cabeza :').listen();
	 r2d2Controls.add (GUIcontrols, 'gira_cabeza').min(-CABEZA).max(CABEZA).step(0.001).name('Gira cabeza :').listen();
	 r2d2Controls.add (GUIcontrols, 'se_inclina',INCLINACION_ATRAS , INCLINACION_DELANTE, 0.1).name('Inclinarse :').listen();
    r2d2Controls.add (GUIcontrols, 'sube_cuerpo', ALTURA_MIN, ALTURA_MAX, 0.1).name('Altura :').listen();
	 r2d2Controls.add (GUIcontrols, 'tamanio_droide', TAMANIO_MIN, TAMANIO_MAX, 0.1).name('Tamaño :').listen();
    // The method  listen()  allows the height attribute to be written, not only read
   gui.add(GUIcontrols,'ver_esfera').name('Esfera englobante');
   gui.add(GUIcontrols,'ver_caja').name('Caja englobante');
  if (withStats)
	 stats = initStats();
}

/// It adds statistics information to a previously created Div
/**
 * @return The statistics object
 */
function initStats() {

  var stats = new Stats();

  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  $("#Stats-output").append( stats.domElement );

  return stats;
}

/// It shows a feed-back message for the user
/**
 * @param str - The message
 */
function setMessage (str) {
  document.getElementById ("Messages").innerHTML = "<h2>"+str+"</h2>";
}

/// It processes the clic-down of the mouse
/**
 * @param event - Mouse information
 */
function onMouseDown (event) {
  if (event.ctrlKey) {
	 // The Trackballcontrol only works if Ctrl key is pressed

	 scene.getCameraControls().enabled = true;
  } else {
	 scene.getCameraControls().enabled = false;
	 if (event.button === 0) {   // Left button
		mouseDown = true;
		switch (applicationMode) {
		  case TheScene.ADDING_BOXES :
			 scene.addBox (event, TheScene.NEW_BOX);
			 break;
		  case TheScene.MOVING_BOXES :
			 scene.moveBox (event, TheScene.SELECT_BOX);
			 break;
		  default :
			 applicationMode = TheScene.NO_ACTION;
			 break;
		}
	 } else {
		setMessage ("");
		applicationMode = TheScene.NO_ACTION;
	 }
  }
}

/// It processes the drag of the mouse
/**
 * @param event - Mouse information
 */
function onMouseMove (event) {
  if (mouseDown) {
	 switch (applicationMode) {
		case TheScene.ADDING_BOXES :
		case TheScene.MOVING_BOXES :
		  scene.moveBox (event, TheScene.MOVE_BOX);
		  break;
		default :
		  applicationMode = TheScene.NO_ACTION;
		  break;
	 }
  }
}

/// It processes the clic-up of the mouse
/**
 * @param event - Mouse information
 */
function onMouseUp (event) {
  if (mouseDown) {
	 switch (applicationMode) {
		case TheScene.ADDING_BOXES :
		  scene.addBox (event, TheScene.END_ACTION);
		  break;
		case TheScene.MOVING_BOXES :
		  scene.moveBox (event, TheScene.END_ACTION);
		  break;
		default :
		  applicationMode = TheScene.NO_ACTION;
		  break;
	 }
	 mouseDown = false;
  }
}

/// It processes the wheel rolling of the mouse
/**
 * @param event - Mouse information
 */
function onMouseWheel (event) {
  if (event.ctrlKey) {
	 // The Trackballcontrol only works if Ctrl key is pressed
	 scene.getCameraControls().enabled = true;
  } else {
	 scene.getCameraControls().enabled = false;
	 if (mouseDown) {
		switch (applicationMode) {
		  case TheScene.MOVING_BOXES :
			 scene.moveBox (event, TheScene.ROTATE_BOX);
			 break;
		}
	 }
  }
}

// IDEA Movimiento por teclas.
function onKeyDown(event){
   if(scene.animacion_activa){
      var x = event.which || event.keyCode;

      switch (x) {
         case 37:
            scene.r2d2.gira_hacia_izquierda(0.25);break;
         case 38:
            scene.r2d2.avanza(1);break;
         case 39:
            scene.r2d2.gira_hacia_izquierda(-0.25);break;
         case 40:
            scene.r2d2.avanza(-1);break;
         default:
            break;
         }
   }
}
/// It processes the window size changes
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}

/// It creates and configures the WebGL renderer
/**
 * @return The renderer
 */
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
//IDEA: Necesito un fondo negro para simular el vacío del espacio
  renderer.setClearColor(new THREE.Color(0x000000), 1.0);
//  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  return renderer;
}

/// It renders every frame
function render() {
  requestAnimationFrame(render);

  stats.update();
  scene.getCameraControls().update ();
  scene.animate(GUIcontrols);

  var un_cuarto_ancho  = window.innerWidth*0.25
  var un_cuarto_alto  = window.innerHeight*0.25
  var tres_cuartos_ancho = window.innerWidth*0.75
  var tres_cuartos_alto  = window.innerHeight*0.75

  renderViewport(scene, scene.getCamera_primera_persona(),
   0,0,
   tres_cuartos_ancho, tres_cuartos_alto);

  renderViewport(scene, scene.getCamera_general(),
   tres_cuartos_ancho, 0,
   un_cuarto_ancho, un_cuarto_alto);

  renderViewport(scene, scene.r2d2.camera_3p,
   tres_cuartos_ancho, window.innerHeight*0.5,
   un_cuarto_ancho, un_cuarto_alto);

  renderViewport(scene, scene.campo_de_juego.get_camera_planta(),
   tres_cuartos_ancho, tres_cuartos_alto,
   un_cuarto_ancho, un_cuarto_alto);
    /* NOTA:
     *   0.25 = 1/4
     *   0.50 = 2/4
     *   0.75 = 3/4
     */
}

/* 	IDEA: Creando una función que permite actualizar todoas las camaras
 *
 */
function renderViewport(escena, camara,
    left	/* colunma */,
    top	/* fila */,
    ancho	/* width */,
    alto	/* height*/)
{
    var l = left;
    var t = top;
    var w = ancho;
    var h = alto;

    renderer.setViewport(l,t,w,h);

    renderer.setScissor(l,t,w,h);
    renderer.setScissorTest(true);

    camara.aspect = w/h;
    renderer.render(escena, camara);
}
/// The main function
$(function () {
  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  // liseners
  window.addEventListener ("resize", onWindowResize);
  window.addEventListener ("mousemove", onMouseMove, true);
  window.addEventListener ("mousedown", onMouseDown, true);
  window.addEventListener ("mouseup", onMouseUp, true);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox

  // IDEA Falta poner los Listener para mover a r2d2
  window.addEventListener ("keydown", onKeyDown, true);

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new TheScene (renderer.domElement);

  CABEZA = 80.0*Math.PI/180;
  ALTURA_MIN = scene.r2d2.factor_de_escala;
  ALTURA_MAX = scene.r2d2.altura_brazo_maxima;
  TAMANIO_BASE = scene.r2d2.longitud_base;
  INCLINACION_ATRAS = -45.0*Math.PI/180;
  INCLINACION_DELANTE = 30.0*Math.PI/180;
  TAMANIO_MIN = 1.0;
  TAMANIO_MAX = 9.0;
  createGUI(true);

  render();
});
