
# Internet de las cosas
###### Autor: Juan Germán Gómez Gómez.

## Abstract
Internet de las cosas (loT), es una tecnología basada en la comunicación de un dispositivo a otro dispositivo sin la invervención humana directa a través de internet con el fin de recopilar datos y compartirlos. La dependencia a internet hace que las vulnerabilidades de ésta también afecten a la loT y analizaremos algunos problemas de seguridad encontrados en las loT provocados por las tecnologías que usa.

## Introducción
El internet de las cosas se basa en el concepto de cominucación de un dispositivo a otro (D2D) de Bill Joy [1] e incorpora el concepto de libre flujo de información entre los diversos dispositivos integrados en los objetos que utilizan internet como canal de comunicación.
En la seción 2 veremos la visión que tienen diversos autores sobre el concepto del internet de las cosas. En la sección 3, dos de las tecnologías que utiliza la loT. En la sección 4 las lagunas de seguridad que se han encontrado en estas tecnologías, en la sección 5 se abarca la visión de la privacidad de los usuarios finales y los elementos que la componen según diverso autores. En la sección 6 un ejemplo donde la loT aporta beneficios directos y expone los riesgo que supone algunas fallas de seguridad, y en la sección 7 una conclusión sobre los beneficios de la loT y de los peligros que puede ocasionar la falta de seguridad en la privacidad.

## 2. El concepto del internet de las cosas.
Kevin Ashton en 1982, propuso el término loT con el objetivo de proporcionar un modo de comunicación entre dispositivos de diversos sistemas y facilitar la interacción humana con el entorno virtual.

Garnet [17], define la loT como la red de objetos físicos que tiene tecnología incorporada para comunicarse y sentir o interactuar con sus estados internos o entorno externo.

Atzori [18] describe la loT como una tecnología con capacidad para integrar otras tecnologías de colaboración y comunicación  permitiendo la recopilación de datos.

La loT al utilizar diversas tecnologías está expuesta a los problemas de seguridad y privacidad que afectan a los usuarios finales.
Por ello la sección 2 está oriendata a dos de las tecnologías que utiliza la loT, la sección 3 a las lagunas de seguridad que se han encontrado en estas tecnologías, en la sección 4 se abarca la visión de la privacidad de los usuarios finales y los elementos que la componen según diverso autores. En la sección 5 un ejemplo donde la loT aporta beneficios directos y exposición de los riesgo que supo, y en la sección 5 una conclusión sobre los beneficios de la loT y de los peligros que puede ocasionar la falta de seguridad en la privacidad. 


## 3. Tecnologías de comunicación que usan internet para intercambiar información.
### 3.1 Wireless Sensor NetWork (WSN), red de sensores inalámbricos.
Esta tecnología está compuesta por nodos donde cada nodo tiene:
* Sensor, para percibir algún aspecto medible del entorno.
* Microcontrolador, para realizar las tareas programadas.
* Transceptor (transistor-receptor), para comunicarse con los demás nodos de la red.
* Batería, fuente de alimentación del nodo.

Una red WSN está compuesta de nodos independientes donde la comunicación se realiza en unas frecuencias y ancho de banda limitado,
la limitación del rango en cada nodo produce un relé de información multihop entre la fuente y el destino, es decir, la información pasa de un nodo a otro cercano hasta llegar al nodo de destino.

### 3.2 Radio Frequency Identification (RFID), identificación por radiofrecuencia.
Esta tecnología está utiliza los transponedores como medio de almacenamiento y recuperación de datos. 
Un RFID es una etiqueta que consta de una antena incrustada en un micropocesador, memoria para almacenar su identificador universal EPC (código de producto electrónico), es usada para transmitir la identidad de un dispositivo mediante ondas de radio, sin la necesidad de contacto visual entre los dispositivos.
 * Las __etiquetas activas__ llevan una batería para facilitar la itecacción de su EPC con los EPC circundantes aunque su radio de acción es limitado.
 * Las __etiquetas pasivas__ transmiten la información de su EPC cuando un lector de etiquetas le induce corriente, activando el circuito.
 * El __lector__ funciona como detector de etiquetas por su interacción con los EPC
 
 
## 4. Problemas de seguridad
### 4.1 Wireless Sensor NetWork
Los ataque a las redes de sensores pueden realizarse a distintos niveles o capas.


1. Capa física, encargada de la selección y generación de frecuencia portadora, modulación y demodulación, cifrado y descifrado, transmisión y recepción de datos[7].
   * Atasco o saturación:  El ataque ocupa el canal de comunicación entre nodos, lo que impide que se comuniquen.
   * Manipulación:  Manipulación del nodo de forma física para extraer la información confidencial.

2. Capa de enlace, esta capa multiplexa los divesos flujos de datos, proporcionando detección de trama de datos, MAC, y control de errores, esta capa garantiza la fiabilidad punto a punto o multipunto.
   * Colisión: Transmisión simultánea de datos en el mismo canal de frecuencia por distintos nodos, provocando ligeros cambios en el paquete, lo que provoca su descarte por el receptor.
   * Inundación o agotamiento: Ataque repetido basado en colisiones.
   * Agotamiento de batería: Tráfico inusualmente alto de solicitude y transmisiones en un canal limitando la accesibilidad a los nodos.

3. Capa de red, encargada del enrutamiento de la información.
   * Spoofing: Repetición y suplantación.
   * Inundación (hello flood attack): Un nodo alterado envía un mensaje inutil que reproduce el atacante para provocar un alto tráfico y congestión en el canal.
   * Homing: Busqueda de los principales cluster y administradores de claves para cerrr la red
   * Reenvio selectivo: El atacante desde un nodo alterado selecciona los nodos a comprometer reeinviando información para inutilizarlos.
   * Sybil: El atacante altera un nodo y lo presenta con distintas identificaciones a los demás nodos.
   * Wormhole: Provoca la reubicación de datos mediante un tunel de bit de baja latencia.
   * Inundación por acuse de recibo: En algoritmos de enrutamiento son necesarios estos mensajes. el atacante falsifica dicho mensaje a los vecinos destinatarios.

4. Capa de transporte, proporciona seguridad en la transmisión de los datos y evita la congestión resultante del alto trafico de los enrutadores.
   * Inundación: Envio de mensajes innecesarios.
   * Desincronización: Se crean mensajes falsos en un extremo y solicita retrasmisión para corregir errores inexistentes, ello provoca la pérdida de energía en el extremo final por tener que realizar las instrucciones falsas.


### 4.2 Radio Frequency Identification
En lot se utiliza para el intercambio automatizado de información sin participación manual.
Pero son propensas a ataques de seguridad [9] [16]

  1. Deshabilitación de etiquetas (Ataque a la autenticidad), provocan la incapacitación de la etiqueta temporal o permanentemente, al provocar el mal funcionamiento de éstas, pudiendo realizarse de forma remota permitiendo manipular el comportamiento de la etiqueta a distancia.

  2. Clonación de etiquetas no autorizadas (Ataque de integridad)
Es posible mediante un lector manipulado, obtener la información confidencial de la etiqueta, pudiendo replicarse.
Eso posibilita evitar las medidas de seguridad e introducir vulnerabilidades en cualquier industria mediante la verificación automática.

  3. Seguimiento de etiquetas (Ataque a la confidencialidad)
Una etiqueta puede rastrearse mediante lectores manipulados pudiendo realizar entrega de información personal.
en un caso extremo, la compra de un producto con etiqueta RFIP no garantiza la confidencialidad de la compra.

  4. Repetir ataques (Ataque a la disponibilidad, Suplantación)
Se utiliza la respuesta de la etiqueta ante un lector manipulado.
La señal entre etiqueta y repector es interceptada, registrada y es reproducida, simulando la disponibilidad de la etiqueta. 


## 5. Privacidad para el individuo
Gibbs [20] define la privacidad como la "limitación del acceso de otros a un individuo", y se basa en tres elementos:
  * El secreto (control de la información)
  * El anonimato (actuar sin atención de otros)
  * La sociedad (limitar Acceso físico al individuo)
y menciona la importancia de equilibrar las necesidades de privacidad personal con otros derechos como el bien social.

Smith [21] sostiene que los conceptos de confidencialidad, secreto, anonimato, seguridad y ética están relacionados con la privacidad de la información.

Mason [22] destaca cuatro aspectos éticos clave: privacidad, precisión, propiedad y accesibilidad.
  * Privacidad: Se refiere a la información del individuo que permiter revelar a su entorno sin obligación a ello.
  * Exactitud:   Se refiere a quién es el responsable de la veracidad de la información, autenticidad y fidelidad.
  * Propiedad: Referido a la propiedad de la información y qué medios justificables para pagar su intercambio.
  * Accesibilidad: Se refiere a los derechos que una persona (u organización) tiene para obtener la información específica.

En la lotT hay tres partes interesadas:
  * El usuario, sujeto de la recopilación de datos, pues le proporciona beneficios de valor como el bienestar. 
  * Las organizaciones, encargadas de porcesar los datos de los sujetos, pues le proporciona la oportunidad de mejorar sus servicios 
  * Terceros, que utilizan los datos procesados, pues le proporciona la oportunidad de mejorar sus servicios.

La loT ofrece la posibilidad a los tomadores de decisiones a tomar decisiones más informadas, a cualquier nivel incluso repercutiendo en el desarrollo de políticas.


## 6. Salud basados en la loT.
#### Aspecto positivo
Los avances de la ingeniería con la biología han permitido la aparición de dispositivos portátiles para monitorizar la salud  pudiendo transmitir y compartir la información del sensor a través de internet [28], [30], [31], dando la oportudidas a los profesionales a obtener patrones para una mejor atención al paciente. 

#### Aspecto negativo
 La principal vulnerabilidad de seguridad en estos dispositivos de monitoreo de salud sincronizados con internet son:
   * Información de inicio de sesión sin cifrar.
   * Envio de los datos del sensor como instrucciones HTTP sin cifrar.
 Lo que supone un riesgo al mostrar información de valor a personas desconocidas.
 
 Otro problema derivado es el robo de información confidencial (contraseñas).
  
## 7. Conclusión
El objetivo de la loT es el intercambio de información entre dispositivos sin intevención manual con el fin de mejorar el bienestar del individuo y productividad en el desempeño de su vida cotidiana. Pero tiene varios defectos, el más visible es la sobre monitorización del individuo con la posibilidad de manipularlo o preveer sus acciones, lo que provocaría un rechazo a la loT y a todos sus beneficios.

La adopción de medidas de seguridad sólidas ([6],[8],[11],[15]) contrarestarian algunas situaciones de seguridad
La implementación de sistemas de detección de intrusos ([4],[14]), criptografía y medidas estenográficas([3]) en el proceso de intercambio de información junto con métodos eficientes de comunicación [5] dotarían a la loT de una infraestructurad más segura y robusta.
Por lo tanto desallorar medidas seguras ayudaría al desarrollo de la loT y a su adopción.


## Bibliografía, contenido principal del trabajo
 * https://es.wikipedia.org/wiki/Internet_de_las_cosas
 * https://www.researchgate.net/publication/288918372_The_Internet_of_Things_IoT_and_its_impact_on_individual_privacy_An_Australian_perspective
 * https://www.researchgate.net/publication/270763270_Survey_of_Security_and_Privacy_Issues_of_Internet_of_Things


## 8. Bibliografía, relacionados.
1. Jason Pontin: “ETC: Bill Joy's Six Webs”. In: MIT
Technology Review, 29 September 2005. Retrieved 17
November 2013.

2. Shen, Guicheng, and Bingwu Liu. "The visions,
technologies, applications and security issues of
Internet of Things." E-Business and E-Government
(ICEE), 2011 International Conference on. IEEE, 2011.

3. Dey, Sandipan, Ajith Abraham, and Sugata Sanyal.
"An LSB Data Hiding Technique Using Prime
Numbers." Information Assurance and Security, 2007.
IAS 2007. Third International Symposium on. IEEE,
2007

4. Bhattasali, Tapalina, Rituparna Chaki, and Sugata
Sanyal. "Sleep Deprivation Attack Detection in
Wireless Sensor Network." arXiv preprint arXiv:
1203.0231(2012).

5.  Roy, Bibhash, Suman Banik, Parthi Dey, Sugata Sanyal
and Nabendu Chaki, "Ant colony based routing for
mobile ad-hoc networks towards improved quality of
services." Journal of Emerging Trends in Computing
and Information Sciences 3.1 (2012): 10-14

6. Vipul Goyal, Virendra Kumar, Mayank Singh, Ajith
Abraham and Sugata Sanyal: A New Protocol to
Counter Online Dictionary Attacks, Computers and
Security, Volume 25, Issue 2, pp. 114-120, Elsevier
Science, March, 2006. This paper is now listed in the
top 25 articles of the COMPUTER SCIENCE
(Computer and Security)

7. http://sensors-and-networks.blogspot.in/2011/08/physical-layer-for-wireless-sensor.html

8. Vipul Goyal, Ajith Abraham, Sugata Sanyal and Sang
Yong Han, “The N/R One Time Password System.”
Information Assurance and Security Track (IAS'05),
IEEE International Conference on Information
Technology: Coding and Computing (ITCC'05), USA,
April, 2005. pp 733-738, IEEE Computer Society

9. Burmester, Mike, and Breno De Medeiros. "RFID
security: attacks, countermeasures and
challenges." The 5th RFID Academic Convocation,
The RFID Journal Conference. 2007.

10. Aggarwal, Charu C., and Tarek Abdelzaher.
"Integrating sensors and social networks." Social
Network Data Analytics. Springer US, 2011. 379-412.

11. Vipul Goyal, Virendra Kumar, Mayank Singh, Ajith
Abraham and Sugata Sanyal, CompChall: Addressing
Password Guessing Attacks Information Assurance
and Security Track (IAS'05), IEEE International
Conference on Information Technology: Coding and
Computing (ITCC'05), USA. April 2005, pp 739-744,
IEEE Computer Society. 

12. W. Drira, Renault, E., Zeghlache, D. “Towards a
Secure Social Sensor Network.” Proceedings of the
IEEE International Conference on Bioinformatics and
Biomedicine, pp. 24-29, 2013.

13. N. Eagle, Pentland, A., and Lazer, D. “Inferring Social
Network Structure using Mobile Phone Data.”
Proceedings of the National Academy of Sciences
(PNAS), 2009. vol. 106 no. 36 Nathan Eagle, 15274–
15278, doi: 10.1073/pnas.0900282106

14. Animesh Kr Trivedi, Rishi Kapoor, Rajan Arora, Sudip
Sanyal and Sugata Sanyal, “RISM - Reputation Based
Intrusion Detection System for Mobile Ad hoc
Networks”, Third International Conference on
Computers and Devices for Communications,
CODEC-06, pp. 234-237. Institute of Radio Physics
and Electronics, University of Calcutta, December 18-
20, 2006, Kolkata, India

15. R. A. Vasudevan, A. Abraham, S. Sanyal and D. P.
Agrawal, “Jigsaw-based Secure Data Transfer over
Computer Networks,” IEEE International Conference
on Information Technology: Coding and Computing,
2004. (ITCC ’04), Proceedings of ITCC 2004, Vol. 1,
pp 2-6, April, 2004, Las Vegas, Nevada.

16. Xiao, Qinghan, Thomas Gibbons, and Hervé Lebrun.
"RFID Technology, Security Vulnerabilities, and
Countermeasures." Supply Chain the Way to Flat
Organization, Publisher-Intech (2009): 357-382.

17. Gartner, 2014b. Internet of Things - Gartner IT Glossary. [Online] Available at:
http://www.gartner.com/it-glossary/internet-of-things/ [Accessed 15 August 2014]. 

18. Atzori, L., Iera, A. & Morabito, G., 2010. The Internet of Things: A survey. Computer Networks, Issue
54, p. 2787–2805. 

19. Gibbs, M., 2008. Privacy. In: D. McDermid, ed. Ethics in ICT: An Australian Perspective. NSW:
Pearson, pp. 89-119. 

21. Smith, H. J., Dinev, T. & Xu, H., 2011. Information privacy research: an interdisciplinary review. MIS
quarterly, 35(4), pp. 989-1016

22. Mason, R. O., 1986. Four ethical issues of the information age. MIS Quarterly, pp. 5-12. 





	
	

