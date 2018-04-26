
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
    this.opacidad_del_suelo = 0.8;

	 this.addBox   = function () {
		setMessage ("Añadir cajas clicando en el suelo");
		applicationMode = TheScene.ADDING_BOXES;
	 };
	 this.moveBox  = function () {
		setMessage ("Mover y rotar cajas clicando en ellas");
		applicationMode = TheScene.MOVING_BOXES;
	 };
	 this.takeBox  = false;
    this.foco2 = false;
    this.ambientLight = true;
	this.pose = function(){
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
//	 var addingBoxes = actions.add(GUIcontrols, 'addBox').name (': Adding boxes :');
//	 var movingBoxes = actions.add (GUIcontrols, 'moveBox').name (': Move and rotate boxes :');
//	 var poseGrua = actions.add(GUIcontrols,'pose').name('Pose r2d2');

var suelo = gui.add(GUIcontrols, 'opacidad_del_suelo', 0.0, 1.0, 0.1).name('Opacidad del suelo').listen();

  var insecto_controls = gui.addFolder ('Libelula Controls');

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
	 scene.getCameraControls().enabled = true;   }
   else {
	 scene.getCameraControls().enabled = false;}
}

/// It processes the drag of the mouse
/**
 * @param event - Mouse information
 */
function onMouseMove (event) {}

/// It processes the clic-up of the mouse
/**
 * @param event - Mouse information
 */
function onMouseUp (event) {}

/// It processes the wheel rolling of the mouse
/**
 * @param event - Mouse information
 */
function onMouseWheel (event) {
   if (event.ctrlKey) {
	 // The Trackballcontrol only works if Ctrl key is pressed
    scene.getCameraControls().enabled = true;  }
   else {
	 scene.getCameraControls().enabled = false;  }
}

// IDEA Movimiento por teclas.

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
//Fondo espacio negro ( Agua cristalina 0x00f0f0 )
  renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
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

//  renderViewport(scene, scene.getCamera_primera_persona(),
//   0,0,
//   tres_cuartos_ancho, tres_cuartos_alto);
//   window.innerWidth, window.innerHeight);
  renderViewport(scene, scene.getCamera_general(),
  0, 0,
  window.innerWidth, window.innerHeight);
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
//  window.addEventListener ("mousemove", onMouseMove, true);
//  window.addEventListener ("mousedown", onMouseDown, true);
//  window.addEventListener ("mouseup", onMouseUp, true);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox


  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new TheScene (renderer.domElement);
  createGUI(true);

  render();
});
