/**
 * @author Juan Germán Gómez
 * @param parameters - Incluye parámetros de tamaño y material
 * @param parameters.longitud_X - Distancia entre las lineas de fondo de los adversarios.
 * @param parameters.longitud_Z - Longitud de las lineas de fondo.
 * @param parameters.longitud_Y - Distancia máxima al suelo
 * @param num_objetos_voladores - Indica la cantidad de meteoritos a crear.
 */

class CampoDeJuego extends THREE.Object3D {
	constructor(parameters, num_objetos_voladores){
		super();


		// Creando el campo y le doy nombre
		this.zona = this.create_campo(parameters);
		this.zona.name = "zona de juego";

		// Creando el gestor de meteoritos y dándole nombre
		this.gestor_de_meteoritos = this.create_meteoritos(num_objetos_voladores);
		this.gestor_de_meteoritos.name='gestor_de_meteoritos';

		// Creando limites visuales de la zona y dándole nombre
		this.limites_de_zona = this.create_limites_de_zona();
		this.limites_de_zona.name ='limites de zona';

		// Creando una cámara con perspectiva en planta
		this.camera_planta = this.create_camera_planta();


		// Añadiendo los elementos a la instancia (al objeto CampoDeJuego)
		this.add(this.zona);
		this.add(this.gestor_de_meteoritos);
		this.add(this.limites_de_zona);
		this.add(this.camera_planta);

//	console.log(this);
		this.tiempo_anterior = Date.now();
		this.milisegundos = 1000;
		this.dificultad = 0.0;

		// Cambios de estado del meteorito
		this.color_impacto = new THREE.Color(0x0000ff);
	}


/******************************************************************************/
/* FUNCIONES Create (Creadoras de los objetos) ********************************/
/* Creación del campo de juego ************************************************/
	create_campo(parameters){
		// Extrayendo las dimensiones
		this.longitud_X = (parameters.longitud_X === undefined ? 4.0 : parameters.longitud_X);
		this.longitud_Z = (parameters.longitud_Z === undefined ? 2.0 : parameters.longitud_Z);
		this.longitud_Y = (parameters.longitud_Y === undefined ? this.longitud_X + this.longitud_Z : parameters.longitud_Y);

		var campo = new THREE.Mesh (
		  new THREE.BoxGeometry (1.0, 1.0, 1.0),
		  new THREE.MeshBasicMaterial ({color: 0xff0000, wireframe:true, wireframeLinewidth:5})
		  // wireframe muestra los triángulos de la malla
		  // wireframeLinewidth indica el grosor de las aristas de los triángulos
//		  new THREE.MeshPhongMaterial ({color: Math.floor (Math.random()*16777215)})
	  );
/* Situando el campo de juego encima del suelo */
	  campo.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0.0, 0.5, 0.5));

/* Dotando al campo de juego de transparencia */
	  campo.material.transparent = true;
	  campo.material.opacity = 0.2;
	  this.campo_escalado = false;
	  return campo;
	}

	create_meteoritos(cantidad){
		// Verificar el número de meteoritos.
		var num_meteoritos = (cantidad === undefined ? 5 : cantidad);
		var lista_de_meteoritos = new THREE.Object3D();
		var color = null;
		var peligroso = true;
		// Añadiendo meteoritos al gestor
		for(var i=0; i<num_meteoritos; i++){
			if(i<num_meteoritos*0.8){
				color = 0xff0000;
				peligroso = true;
			}
			else {
				color = 0x00ff00;
				peligroso = false;}

			var meteorito_iesimo = this.create_Ovo(color);
			meteorito_iesimo.velocidad = 10 + Math.random()*i;
			meteorito_iesimo.peligroso = peligroso;
			lista_de_meteoritos.add(meteorito_iesimo);
		}
		/*
		this.x=0; this.y=0; this.z=0;
		this.meteorito_prueba = this.create_Ovo();
		this.meteorito_prueba.velocidad = 10;
		this.meteorito_prueba.peligroso = true;
		this.activo = true;
		this.meteorito_prueba.name = 'Meteorito de prueba'
		*/
/* Creados los meteoritos, deberia ser el momento de posicionarlos
	Pero como la zona no se ha escalado a sus dimensiones finales.
	Este posicionamiento debe realizarse despues,
	cuando se sepa las dimensiones reales de la zona de juego.
*/

		// Devolviendo los meteoritos con sus respectivas coordenadas
//		lista_de_meteoritos.add(this.meteorito_prueba);
		this.meteoros_activos = lista_de_meteoritos.children.length;
		return lista_de_meteoritos;
	}

	create_Ovo(un_color){
		var superficie = (un_color === undefined? 0xffff1a : un_color);
		var texturador = new THREE.TextureLoader();
		var material = new THREE.MeshPhongMaterial();

		if(superficie === 0xff0000)
			{ var material = new THREE.MeshPhongMaterial({map: texturador.load("imgs/fuego.JPG")});}
		else if(superficie === 0x00ff00)
			{ var material = new THREE.MeshPhongMaterial({map: texturador.load("imgs/cesped.jpg")});}
		else
			{ var material = new THREE.MeshPhongMaterial({color:superficie});}

		this.tamanio_meteorito = 1.0;

		var Objeto_volador = new THREE.SphereGeometry(1.0,16,16);
		material.transparent = true;
		var meteorito =new THREE.Mesh(Objeto_volador, material);
		meteorito.colision = false;	// Al crearse aún no ha podido colisionar
		meteorito.activo = false;		//	Al crearse aún no está en movimiento.

		return meteorito;
	}
/* Fin de creaciones **********************************************************/

/******************************************************************************/
/* Movimientos ****************************************************************/
	set_Tamanio_campo(nuevo_tamanio){
		if (this.tamanio_anterior != nuevo_tamanio) {
			this.zona.scale.set(
				this.longitud_X*nuevo_tamanio,
				this.longitud_Y*nuevo_tamanio,
				this.longitud_Z*nuevo_tamanio);

			this.tamanio_anterior = nuevo_tamanio;
//			var nuevas_coord= this.coordenadas();
//			this.meteorito_prueba.position.set(nuevas_coord.x, nuevas_coord.y, nuevas_coord.z);
			if(!this.campo_escalado){
				this.reset_meteoritos();
				this.campo_escalado = true;
			}

			this.set_limites_de_zona();
		}
	}

	set_Tamanio_meteorito(incremento){
		if(incremento > 0){	this.tamanio_meteorito += incremento; }

		for(var i=0; i<this.gestor_de_meteoritos.length; i++){
			this.gestor_de_meteoritos.children[i].scale.set(
				this.tamanio_meteorito,
				this.tamanio_meteorito,
				this.tamanio_meteorito);
		}
	}
/* 	Imprescindible para calcular nuevas coordenadas
 * para actualizar this.x, this.y, this.z
 */
	reset_meteoritos(velocidad){
		for (var i = 0; i < this.gestor_de_meteoritos.children.length; i++) {
			this.coordenadas();
			this.gestor_de_meteoritos.children[i].position.set(this.x, this.y, this.z);
			this.gestor_de_meteoritos.children[i].activo = true;
		}

		// Reiniciando la rentrada de los meteoritos al campo de juego
		this.meteoros_activos = this.gestor_de_meteoritos.children.length;
	}

	update(droide){
		var segmento_objeto = droide.diagonal;
		var cantidad = 0;
		var tiempo_actual = Date.now();
		var tiempo_transcorrido = tiempo_actual - this.tiempo_anterior;
		this.tiempo_anterior = tiempo_actual;

// Meteorito de prueba
//		this.meteorito_prueba.position.z -= this.meteorito_prueba.velocidad*tiempo_transcorrido/this.milisegundos;

// Los demás meteoritos
		for(var i=0; i<this.gestor_de_meteoritos.children.length; i++){
			var meteoro = this.gestor_de_meteoritos.children[i];
			meteoro.position.z -=
			meteoro.velocidad*tiempo_transcorrido/this.milisegundos;
			cantidad = this.colisiones(segmento_objeto, meteoro);
//			console.log('colisión: '+ cantidad)
			droide.set_resistencia(cantidad);
		}

			this.reciclar_meteoritos(droide);
			this.dentro_de_zona(droide);
//		console.log(this.meteorito_prueba.velocidad)
//		console.log(this.meteoros_activos)
	/* 	Falta verifcar si hay colisiones con otros objetos
	 * para ello necesito las coordenadas del frontal del dichos objetos
	 */
	 console.log(this.dificultad)
	 return this.meteoros_activos;
	}

	colisiones(segmento_objeto, meteoro){
		// Puntos clave de la caja englobante del objeto
		var x_min = segmento_objeto.Xmin_Ymin_Zmin.x;
		var y_min = segmento_objeto.Xmin_Ymin_Zmin.y;
		var z_min = segmento_objeto.Xmin_Ymin_Zmin.z;

		var x_max = segmento_objeto.Xmax_Ymax_Zmax.x;
		var y_max = segmento_objeto.Xmax_Ymax_Zmax.y;
		var z_max = segmento_objeto.Xmax_Ymax_Zmax.z;

		// Puntos importantes del meteorito
		var x = meteoro.position.x;
		var y = meteoro.position.y;
		var z = meteoro.position.z;

		// El meteorito es una esfera por tanto da igual cual scale tomar
		var radio = meteoro.scale.y;
//		console.log('El radio del meteorito es: '+ meteoro.scale.y)

		if(meteoro.activo){
			// Detectando colisión frontal
			if(	x_min <= x && x <= x_max &&
					y_min <= y && y <= y_max &&
					z_min <= z && z-radio <= z_max){
//						meteoro.material.color.setHex(0x000000);
						meteoro.colision = true;}
			else
			// Detectando colisión lateral izquierdo
			if(	x_min <= x+radio && x+radio <= x_max &&
					y_min <= y && y <= y_max &&
					z_min <= z && z <= z_max){
//						meteoro.material.color.setHex(0xff7000);
						meteoro.colision = true;}
			else
			// Detectando colisión lateral derecho
			if(	x_min <= x-radio && x-radio <= x_max &&
					y_min <= y && y <= y_max &&
					z_min <= z && z <= z_max){
//						meteoro.material.color.setHex(0x0070ff);
						meteoro.colision = true;}
			else
			// Detectando colisión en altura
			if(	x_min <= x && x <= x_max &&
					y_min <= y-radio && y-radio <= y_max &&
					z_min <= z && z <= z_max){
//						meteoro.material.color.setHex(0x6800ff);
						meteoro.colision = true;}
			else
			{			meteoro.colision = false;}

			if(meteoro.colision){
				meteoro.activo = false;
				if(meteoro.peligroso)
					{return radio;}
				else
					{return -Math.floor(5*(1-Math.random())) }
			}
		}
		return 0;
	}

/* Fin de Movimientos *********************************************************/
/******************************************************************************/
/* Generador de coordenadas ***************************************************/
	coordenadas(){
/* Analizando las coordenadas límite de la zona
		var x_min = this.zona.position.x - this.zona.scale.x/2
		var y_min = this.zona.position.y
		var z_min = this.zona.position.z + this.zona.scale.z

		var x_max = this.zona.position.x + this.zona.scale.x/2;
		var y_max = this.zona.position.y + this.zona.scale.y;
		var z_max = this.zona.position.z + this.zona.scale.z



 * 	Todas los meteoritos tienen su baricentro en el (0,0,0) por ello,
 * this.zona.position es cero siempre, no añadiendo información a los _min, _max
 *
 * [Eje X]	Los meteoritos pueden situarse en una anchura entre x_min y x_max
 * [Eje Z]	Los meteoritos deben situarse en el exteriror de la zona de juego (z_max)
 *	[Eje Y]	Los meteoritos pueden situarse a una altura entre el suelo (0)
 *		y la altura de la zona de juego (this.zona.scale)
 */
		this.x = (Math.random()- 1/2)*this.zona.scale.x;
		this.y = (Math.random()- 0)*this.zona.scale.y;
		this.z = this.zona.scale.z;
/* Observación:
 * 	Para situar inicialmente los meteoritos dentro de la zona de juego
 * debo reducir los limites donde los baricentros pueden generarse
 *
 */
	}

/*		Metódo para comprobar si los meteoritos están fuera de la zona
 * Observación: Puedo entender que un meteorito está fuera, cuando:
 * 	*] Su baricentro está fuera del campo
 * 	*] Visualmente está fuera del campo.
 *
 * IDEA: Atenuar la intensidad del color del meteorito hasta verlo desaparecer visualmente.
 *		En ese momento recalcular sus ccordenadas y restaurar su visibilidad gradualmente.
 *
 * [Tareas que esto implica]
 * 	1º] Detectar cuando el meteorito ha salido del campo para mitigarle la opacidad
 * 	2ª] Cuando la opacidad sea 0 o inferior, resetear sus coordenadas y su velocidad inicial
 * 	3º] Detectar cuando está reentrando al campo para aumentarle la opacidad.
*/
	reciclar_meteoritos(r2d2){
		/* 	Necesito conocer las dimensiones del campo
		 * para saber si el meteorito se encuentra dentro o fuera de ésta.
		 * Para ello he implementado: create_limites_de_zona, set_limites_de_zona.
		 */
/* 	// Codigo de prueba.
		 if(this.meteorito_prueba.material.opacity<=0){
			 this.meteorito_prueba.velocidad = 0;
			 var pos = this.coordenadas();
			 this.meteorito_prueba.position.set(pos.x, pos.y, pos.z);}

		 if(this.meteorito_prueba.position.z+this.meteorito_prueba.scale.z <0.0){
			 this.meteorito_prueba.material.opacity -= 0.1;}
		 else{
			 this.meteorito_prueba.material.opacity += 0.03;
		 }
*/
		for (var i = 0; i < this.gestor_de_meteoritos.children.length; i++) {
			var meteoro = this.gestor_de_meteoritos.children[i];

			// Reciclando el meteorito
			if(meteoro.material.opacity<=0){
			/* [RESET meteorito]
			 * IDEA: Cada vez que sale un meteorito del recinto
			 * 	su velocidad se incrementa un valor entre 0 y 1 (Math.ramdon())
			 *
			 * IDEA: Las coordenadas de un meteorito al reentrar son aleatorias.
			*/

				if(r2d2.activo){
					if(!meteoro.colision)
					{r2d2.incrementar_score(1);
					 this.dificultad += 0.05;
					}
					else
					{meteoro.colision = false;}

					meteoro.velocidad = meteoro.velocidad + Math.random() + this.dificultad;
					meteoro.activo = true;
/*
					if(meteoro.peligroso)
						{meteoro.material.color.setHex(0xff0000);}
					else
						{meteoro.material.color.setHex(0x00ff00);}
*/
				}
				else if(!meteoro.activo){
					meteoro.velocidad = 0;
					meteoro.activo = true;
					this.meteoros_activos--;
//				console.log(this.meteoros_activos)
				}

				this.coordenadas();
				meteoro.position.set(this.x, this.y, this.z);
			}

			/* IDEA: Forma visual para reposicionar los meteoritos
			*/
			if(meteoro.position.z + meteoro.scale.z < 0.0 ){
					meteoro.material.opacity -= 0.3;
				}
			else
			if(r2d2.activo){	meteoro.material.opacity += 0.3;}

			// Límite de velocidad.
			if(meteoro.velocidad >= 50.0){ meteoro.velocidad = 10;}

			/* 	Cuando el meteorito sale del campo de juego.
			 * éste se consifera inactivo y además se sabe si ha colisionado.
			 * Por tanto:
			 * 	inactivo-colisionado => perder vida
			 * 	inactivo-No_colisionado => aumentar el contador de puntos (score)
			 * Aumentar el score puede realizarse cuando el meteorito es reciclado.
			 * O en el mismo instante en el que sale del campo.
			 * IDEA Realizar el conteo cuando el meteorito es reciclado.
			*/
		}
		/* 	Al incluir la barra de vida de r2d2 y crear la variable "actividad"
		 * para indicar que r2d2 aún tiene resistecia para seguir,
		 * me veo obligado a parar la reentrada de meteoros al campo de juego
		 * por ello necesito parar el movimiento de éstos modificando la velocidad a 0,
		 * en este algoritmo debo contabilizar los meteoros inactivos para indicar
		 * el fin de la reentrada.
		*/
		return this.meteoros_activos;
	}

	create_limites_de_zona(){
				var limites = new THREE.Object3D();
				this.senial = new THREE.SphereGeometry(0.2, 16,16);
				this.color_senial = new THREE.MeshPhongMaterial({color: 0xff00ff});

				// Creando los elementos limítrofes traseros
				this.inf_negX_back = new THREE.Mesh(this.senial, this.color_senial);
				this.inf_posX_back = new THREE.Mesh(this.senial, this.color_senial);
				this.sup_negX_back = new THREE.Mesh(this.senial, this.color_senial);
				this.sup_posX_back = new THREE.Mesh(this.senial, this.color_senial);

				// Creando los elementos limítrofes delanteros
				this.inf_negX_front = new THREE.Mesh(this.senial, this.color_senial);
				this.inf_posX_front = new THREE.Mesh(this.senial, this.color_senial);
				this.sup_negX_front = new THREE.Mesh(this.senial, this.color_senial);
				this.sup_posX_front = new THREE.Mesh(this.senial, this.color_senial);

				// Añadiendo los elementos limítrofes al campo.
				limites.add(this.inf_negX_back);
				limites.add(this.inf_posX_back);
				limites.add(this.sup_negX_back);
				limites.add(this.sup_posX_back);

				limites.add(this.inf_negX_front);
				limites.add(this.inf_posX_front);
				limites.add(this.sup_negX_front);
				limites.add(this.sup_posX_front);
		return limites;
	}

	set_limites_de_zona(){
			var x_min = this.zona.position.x + this.zona.scale.x/2;
			var y_max = this.zona.position.y + this.zona.scale.y;
			var z_max = this.zona.position.z + this.zona.scale.z;

			// Posicionando los elementos limitrofes traseros
			this.inf_negX_back.position.set(-x_min, 0, 0);
			this.inf_posX_back.position.set(+x_min, 0, 0);
			this.sup_negX_back.position.set(-x_min, y_max, 0);
			this.sup_posX_back.position.set(+x_min, y_max, 0);

			// Posicionando los elementos limitrofes delanteros
			this.inf_negX_front.position.set(-x_min, 0, z_max);
			this.inf_posX_front.position.set(+x_min, 0, z_max);
			this.sup_negX_front.position.set(-x_min, y_max, z_max);
			this.sup_posX_front.position.set(+x_min, y_max, z_max);
	}

	dentro_de_zona(droide){
		// Como es una esfera, no importa cual dirección elegir.
		var radio = droide.esfera_englobante.scale.y;
		var pos_x = droide.position.x;
		var pos_z = droide.position.z;

		//Laterales Eje_X
		if(pos_x <this.inf_negX_back.position.x-radio || this.sup_posX_back.position.x+radio <pos_x){
				droide.descansando();}

		//Laterales Eje_Z
		if(pos_z < this.inf_negX_back.position.z-radio || this.sup_posX_front.position.z+radio <pos_z){
				droide.descansando();}

		/* IDEA: Efectos:
		 * 		pos_x <this.inf_negX_back.position.x-radio
		 *		No llega a tocar la barrera cuando r2d2 es desactivado.
		 *
		 * 		pos_x-radio <this.inf_negX_back.position.x
		 * 	Cuando r2d2 sale completamente de la barrera, es desactivado.
		 */
	}
	// PRE: La cámara necesita saber donde está la zona a observar.
	create_camera_planta(){
//		var aspect = window.innerWidth/window.innerHeight;
		var frustumSize = 50 	// tamanio del tronco
		var camera_planta = new THREE.OrthographicCamera(
			frustumSize / ( 2)	// izquierda
			,frustumSize / (-2)	// derecha
			,frustumSize /(-2)	// arriba
			,frustumSize /( 2)	// abajo
			, 10		// cercanía
			, 200);	// lejanía

//		this.camera_planta.rotation.y = Math.PI;
		camera_planta.position.set(0.0, 2*frustumSize, 20.0);
		camera_planta.rotation.x = -Math.PI/2;
//		var look = this.zona.position;
//		var objetivo = this.zona.position;
//		objetivo.z = -20;
//		camera_planta.lookAt(objetivo);
		return camera_planta;
	}

	get_camera_planta(){
		return this.camera_planta;
	}
}
