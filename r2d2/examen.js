


class EXAMEN extends THREE.Object3D {
	constructor(altura, angulo_rotacion, distancia_al_eje_Y){
		super();

		this.amplitud = altura;
		this.angulo_de_giro = angulo_rotacion;
		this.distancia_al_ejeY = distancia_al_eje_Y;

		this.esfera = this.createEsfera();
		this.esfera.velocidad = 1;
		this.tiempo_anterior = Date.now();

		this.add(this.esfera);

		this.tope_sup = false;
		this.top_inf = true;
	}

	createEsfera(){
		// Creada la esfera situada en el origen (0,0,0)
		var esfera = new THREE.SphereGeometry(1.0, 16,16);
		var material = new THREE.MeshPhongMaterial({color: 0x00f0f0});


		var malla = new THREE.Mesh(esfera, material);
		malla.position.set(1.0, 1.0, 0)


		// Desplazando la geometria frente a los ejes locales.
		malla.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0.0, -1.0, 0.0));

		this.objeto = new THREE.Object3D();
		this.objeto.add(malla);

		return this.objeto;
	}

	// Traslacion (r, 0, 0)
	set_distancia_al_ejeY(nuevo_radio){
		if(this.radio_anterior != nuevo_radio){
			this.esfera.position.x = nuevo_radio;
			this.radio_anterior = nuevo_radio;
		}
	}

	// Translacion (0,a,0)
	incrementar_altura(nueva_altura){
		if(this.altura_anterior != nueva_altura){
			this.esfera.position.y += nueva_altura;
			this.altura_anterior = nueva_altura;
		}
	}

	// Rotación
	incrementar_angulo_de_giro(nuevo_angulo){
		if(this.angulo_anterior != nuevo_angulo){
			this.objeto.position.y += nuevo_angulo;
			this.angulo_anterior = nuevo_angulo;
		}
	}

	update(controls){

		var tiempo_actual = Date.now();
		var tiempo_transcorrido = tiempo_actual - this.tiempo_anterior;
		this.tiempo_anterior = tiempo_actual;

		if(this.esfera.position.y <10.0 && !this.tope_sup)
			{	this.esfera.position.y +=
				this.esfera.velocidad*tiempo_transcorrido/100;}
		else{
			this.tope_sup = true;
			this.tope_inf = false;}

		if(this.esfera.position.y < 0.0 && !this.tope_inf){
			this.esfera.position.y -=
			this.esfera.velocidad*tiempo_transcorrido/100;}
		else{
			this.tope_sup = false;
			this.tope_inf = true;}


		this.incrementar_angulo_de_giro(Math.PI/45);

		if(controls.distancia != this.esfera.scale.x )
			{this.set_distancia_al_ejeY(controls.distancia)}

	}

}
