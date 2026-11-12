# E2 — Versión 2: Movimiento físico con Arduino y pista compartida

**Proyecto:** ¿Le ganas al animal?  
**Grupo:** 6  
**Fecha de desarrollo:** 8–10 de noviembre de 2026  
**Estado:** Prototipo funcional. La carrera de ocho segundos funciona con los dos brazos en la maqueta, controlada desde la interfaz web. Faltan las imágenes de los participantes en los brazos.

## 1. Objetivo

Después de presentar nuestra primera versión, que consistía en una pista atlética y figuras impresas de papel, comenzamos a explorar cómo incorporar movimiento físico a la representación de las rapideces de animales y seres humanos.

El objetivo de esta V2 es probar si podemos utilizar Arduino y servomotores para representar el avance de los participantes durante una carrera simulada de ocho segundos.

En esta etapa buscamos comprobar el funcionamiento de los componentes, explorar cómo transmitir el movimiento, conectar la representación física con una interfaz web y definir cómo comparar a la persona y al animal en una misma pista.

## 2. Materiales utilizados

- Arduino Leonardo del curso, con un cable USB de datos facilitado por el profesor.
- Arduino Uno prestado, utilizado temporalmente mientras no contábamos con un cable que transmitiera datos.
- Servomotor MG90S de posición angular.
- Segundo servomotor Tower Pro, que presentó giro continuo durante las primeras pruebas.
- Cables USB y cables de conexión.
- Computador para programar y controlar el Arduino.
- Piezas LEGO: una viga amarilla (≈ 11,5 cm) y una viga azul (≈ 8,5 cm) como brazos giratorios, además de ejes y conectores.
- Cartón piedra de 37,5 × 27 cm como base de la pista.
- Interfaz `maqueta.html`.

## 3. Cambios respecto de la V1

En la V1 contamos únicamente con una pista atlética impresa y figuras de papel. La propuesta contemplaba representar las distancias recorridas por los participantes durante ocho segundos, pero no existía movimiento automático ni conexión electrónica.

Después de la primera revisión docente comenzamos a explorar la incorporación de actuadores físicos.

En esta V2:

- Pasamos de una maqueta estática a una carrera con movimiento automático mediante servomotores.
- Controlamos ese movimiento con Arduino, a partir de instrucciones enviadas desde una interfaz web.
- Reemplazamos la pista recta con figuras por brazos giratorios sobre una pista semicircular.
- Pasamos de dos pistas separadas a **una sola pista con dos carriles**, para que la persona y el animal compitan lado a lado en el mismo espacio.
- Incorporamos sonificación y un mensaje final que indica si la persona ganó o perdió.
- La interfaz utiliza los mismos datos de rapidez de la página de la E1.

El principal cambio consiste en transformar los datos digitales de rapidez en movimiento físico, en lugar de depender exclusivamente de la manipulación manual de las figuras.

## 4. Pruebas realizadas

### 4.1. Conexión y cambio de placa Arduino

Inicialmente intentamos utilizar un Arduino Leonardo, pero no conseguimos cargar correctamente el programa desde el computador.

Posteriormente identificamos que el cable USB utilizado proporcionaba alimentación, pero no transmitía datos.

Para continuar utilizamos un Arduino Uno prestado y un cable USB compatible con transmisión de datos. Esto nos permitió cargar programas y realizar pruebas con los servomotores.

El 10 de noviembre el profesor nos facilitó cables USB que sí transmiten datos, lo que confirmó que el problema era el cable y no la placa. Desde entonces volvimos a utilizar el Arduino Leonardo del curso.

El cambio de placa respondió a una dificultad técnica y no a un cambio en los objetivos de la visualización.

### 4.2. Prueba del servomotor angular

Probamos un servomotor MG90S de posición angular conectado al Arduino Uno.

Utilizamos una interfaz experimental que permitía trabajar con las opciones de participante humano y animal, enviando instrucciones de movimiento al servomotor.

El motor respondió a las instrucciones, pero al principio no logramos calibrar adecuadamente sus posiciones de inicio y final. En algunas pruebas, el desplazamiento entre ambas posiciones fue muy pequeño.

Esto nos mostró que conseguir movimiento no es suficiente: también necesitamos controlar cuánto avanza el participante para que el movimiento represente correctamente los datos.

Para resolverlo, la nueva versión de la interfaz permite guardar la posición exacta de partida y de meta de cada brazo (ver sección 5).

### 4.3. Prueba del segundo servomotor

También conectamos un segundo servomotor Tower Pro.

Inicialmente pensábamos que ambos motores funcionarían de manera similar, pero observamos que este giraba continuamente: en un servomotor continuo, el valor enviado no indica una posición, sino una velocidad.

Esta prueba permitió identificar una diferencia importante entre los componentes disponibles. Un servomotor continuo no permite que el brazo se detenga siempre en la misma posición, por lo que para representar distancias necesitamos dos servomotores que mantengan su posición, como los que usamos en la carrera final.

### 4.4. Exploración con piezas LEGO

Consideramos inicialmente construir un pequeño vehículo con la imagen de un animal encima, pero descartamos esta alternativa porque el servomotor angular no gira de forma continua y porque los cables del Arduino dificultaban el desplazamiento.

Optamos por brazos giratorios: cada servomotor mueve una viga LEGO y la ficha del participante va en su extremo. La viga azul (más corta) representa a la persona y la viga amarilla (más larga) representa al animal.

### 4.5. Montaje de los dos brazos

Nuestra primera idea fue montar ambos servomotores sobre el mismo eje, uno bajo la pista y otro colgando de un puente, para que los dos brazos giraran desde el mismo centro sobre una pista con dos carriles concéntricos.

No logramos construir un puente que sostuviera un motor sobre el otro. Primero probamos poner los dos motores juntos y acostados con la pista de pie, pero así los ejes quedaban separados por unos centímetros y los brazos no giraban desde el mismo centro.

Finalmente pusimos un motor en posición normal y el otro dado vuelta, uno sobre el otro, de modo que ambos ejes quedan alineados. Así los dos brazos giran desde el mismo origen, pero a distinta altura: el brazo amarillo (el más largo, del animal) va abajo y el azul (el de la persona) va arriba. Como la ficha del brazo amarillo queda más lejos del centro que el extremo del brazo azul, los brazos no pueden chocar.

Al estar dado vuelta, uno de los motores gira en sentido contrario al otro con las mismas instrucciones: el azul avanzaba de izquierda a derecha y el amarillo de derecha a izquierda. No modificamos el programa del Arduino: lo resolvimos calibrando la partida y la meta de cada brazo desde la interfaz. En el motor dado vuelta, la partida quedó en un ángulo alto y la meta en uno bajo, y ahora ambos brazos avanzan hacia la meta.

### 4.6. Conexión de los dos motores

El Arduino Leonardo tiene un solo pin de 5 V, por lo que primero intentamos usar dos placas Leonardo, una por motor, y probamos una versión de la interfaz que se conectaba a ambas.

Uno de los motores no se movía. Para descartar si el problema era el Arduino, los cables o el motor, cargamos un programa de prueba que mueve un servomotor conectado a cualquier pin. Con él comprobamos que ambos motores y sus cables funcionaban.

Sin embargo, una de las placas Leonardo no permitió volver a cargar el programa de la carrera (error de carga «butterfly_recv… failed»), ni siquiera usando el botón de reinicio. Esa placa quedaba repitiendo el programa de prueba y movía su motor por su cuenta.

Finalmente conectamos **los dos motores a un solo Arduino Leonardo**:

| Motor | Señal | Alimentación | Tierra |
|---|---|---|---|
| Brazo azul (persona) | Pin ~5 | 5V | GND |
| Brazo amarillo (animal) | Pin ~6 | IOREF | GND |

En el Leonardo, el pin IOREF también entrega 5 V, lo que nos permitió alimentar el segundo motor sin una protoboard. Con esta conexión la carrera funcionó correctamente con la interfaz.

## 5. Interfaz `maqueta.html`

El 10 de noviembre reemplazamos la interfaz anterior, que mostraba dos pistas separadas, por una con una sola pista compartida. La versión anterior se conserva en el historial del repositorio.

La interfaz permite:

- Ingresar la rapidez de la persona en km/h y elegir un rival entre los 43 animales de la página de la E1, con los mismos datos y los mismos colores por medio (tierra, aire y agua).
- Simular una carrera de ocho segundos, con cuenta regresiva («En sus marcas… Listos… ¡Ya!»).
- Representar el avance en una pista semicircular con dos carriles: el interior para la persona y el exterior para el animal. Cada carril se va pintando con lo recorrido por su participante.
- Mostrar un marcador con el tiempo y los metros recorridos por cada uno.
- Indicar al final si la persona **ganó, perdió o empató**, con la diferencia en metros, cuántas veces más rápido va el ganador y en qué porcentaje del recorrido iba el otro participante cuando el ganador cruzó la meta.
- Mostrar marcas de 25 %, 50 % y 75 % del recorrido con su equivalencia en metros para cada duelo.
- Generar sonidos utilizando tono, ritmo y timbres diferentes.
- Enviar las posiciones angulares al Arduino mediante Web Serial (Google Chrome o Edge), esperando a que la placa esté lista antes de iniciar la carrera.
- Calibrar cada brazo guardando su posición de partida y de meta. Esto reemplaza la opción de invertir la dirección de giro, corrige el sentido del motor que está dado vuelta y queda guardado en el navegador.

La comunicación utiliza los pines digitales 5 (persona) y 6 (animal) del Arduino. La interfaz envía líneas de texto con dos ángulos, por ejemplo `30,180`, y el programa `carrera_servos.ino` mueve cada servomotor a ese ángulo.

## 6. Representación de los datos y escala

Nuestra propuesta continúa utilizando las rapideces de los participantes para calcular cuánto recorrerían durante ocho segundos.

La distancia se obtiene mediante:

**Distancia = rapidez × tiempo**

Cuando la rapidez está expresada en km/h, primero debemos dividirla por 3,6 para convertirla a metros por segundo.

Decidimos utilizar una representación angular de las distancias. El participante más rápido alcanza un ángulo final de 180° (la meta), mientras que el otro alcanza un ángulo proporcional a su rapidez.

Por ejemplo, si la persona tiene una rapidez de 20 km/h y compite contra un guepardo de 120 km/h (dato de la página de la E1), el guepardo alcanzaría 180° y la persona 30°.

Esto permite conservar la proporción entre las distancias recorridas durante un mismo tiempo, aunque la escala cambia dependiendo de los dos participantes seleccionados. Por eso la pista física marca porcentajes del recorrido (25 %, 50 % y 75 %) y la pantalla indica a cuántos metros equivale cada marca en el duelo actual.

En la pista compartida se compara el ángulo y no el largo del carril: aunque el carril exterior es más largo sobre el cartón, si los dos brazos apuntan a la misma línea, ambos participantes recorrieron la misma distancia.

Un desplazamiento angular pequeño no necesariamente indica un error de calibración: también puede deberse a la diferencia entre las rapideces de los participantes.

## 7. Sonificación

La interfaz incorpora sonido durante la simulación.

Utiliza:

- **Tono:** la frecuencia aumenta con la rapidez del participante.
- **Ritmo:** los sonidos se repiten más frecuentemente para rapideces mayores.
- **Timbre:** se utilizan formas de onda distintas para diferenciar a la persona y al rival.
- **Señal de término:** al finalizar la simulación se reproduce una secuencia sonora.

Estas características buscan complementar la representación visual y física de la carrera.

Todavía debemos evaluar si los sonidos se comprenden sin explicación.

## 8. Problemas encontrados

| # | Problema | Estado |
|---|---|---|
| 1 | El cable inicial del Arduino Leonardo no permitía transmitir datos. | Resuelto el 10 de noviembre con cables del profesor. |
| 2 | Fue necesario cambiar temporalmente al Arduino Uno. | Resuelto: volvimos al Arduino Leonardo del curso. |
| 3 | El servomotor angular presentaba problemas de calibración del recorrido. | Resuelto: la interfaz permite calibrar partida y meta de cada brazo. |
| 4 | El segundo servomotor giraba de forma continua. | Resuelto: la carrera final usa dos servomotores que mantienen su posición. |
| 5 | No logramos construir un puente para montar un motor sobre el otro. | Resuelto: un motor normal y el otro dado vuelta, con los ejes alineados. |
| 6 | El motor dado vuelta gira en sentido contrario. | Resuelto calibrando partida y meta en la interfaz, sin cambiar el programa. |
| 7 | Las rapideces son muy diferentes para un espacio limitado. | Resuelto: la meta equivale a lo que recorre el más rápido; la pista marca porcentajes. |
| 8 | Uno de los motores no se movía con dos placas Leonardo. | Diagnosticado con un programa de prueba: motores y cables funcionaban. |
| 9 | Una placa Leonardo no permitió volver a cargar el programa de la carrera. | Resuelto usando una sola placa para los dos motores. |
| 10 | El Leonardo tiene un solo pin de 5 V para dos motores. | Resuelto alimentando el segundo motor desde el pin IOREF. |
| 11 | Comprobar una carrera física completa de ocho segundos. | Resuelto el 10 de noviembre (ver videos). |
| 12 | Los brazos todavía no tienen las imágenes de los participantes. | Pendiente para la próxima versión. |
| 13 | La interfaz y la página de la E1 aún no están enlazadas. | Pendiente. La interfaz ya usa los mismos datos. |
| 14 | El segundo motor se alimenta desde IOREF, que no es una fuente de alimentación. El USB limita la corriente a 500 mA. | Pendiente: usar una fuente externa de 5 V con GND común, o alimentar un motor a la vez. |
| 15 | La prueba con usuarios mostró que la interfaz no explica cómo obtener la rapidez y muestra la calibración al público. | Pendiente para la V3 (ver sección 10). |

## 9. Decisiones de diseño y justificación

Después de la R1 decidimos explorar primero el movimiento de un participante antes de intentar construir una carrera física automatizada completa. Esta decisión buscó reducir la complejidad del prototipo y permitirnos identificar problemas técnicos antes de avanzar.

Elegimos brazos giratorios sobre una pista semicircular porque los servomotores angulares se mueven a una posición exacta entre 0° y 180°, lo que se adapta mejor a este recorrido que a una pista recta con ruedas.

Pasamos a una sola pista con dos carriles para que la comparación sea directa: la persona y el animal avanzan en el mismo espacio y con la misma escala, como en una competencia real.

Montamos los dos motores con los ejes alineados para que ambos brazos giren desde el mismo centro: así la persona y el animal comparten la misma escala angular y la comparación es justa (sección 4.5).

Usamos una sola placa para los dos motores porque es más simple que coordinar dos Arduino y porque una de las placas no permitía cargar el programa (sección 4.6).

Marcamos la partida y la meta como franjas anchas porque el servomotor tiene un margen de error de algunos grados.

Agregamos un mensaje final explícito (ganaste, perdiste o empate) para que el resultado se entienda sin necesidad de explicación.

Reconocemos que la implementación tecnológica debe responder a una decisión de visualización: **el objetivo no es simplemente conseguir que un motor gire, sino utilizar ese movimiento para comunicar diferencias entre los datos**.

## 10. Evaluación con usuarios (V2)

**Método:** thinking aloud (pensar en voz alta). La participante es hermana de una integrante del grupo, sin conocimiento previo del proyecto.
**Versión evaluada:** V2 (`maqueta.html` con la calibración visible y sin indicación de cómo obtener la rapidez).
**Duración de la grabación:** aproximadamente 4 minutos y 1 segundo.
**Intervención de la moderadora:** la moderadora respondió preguntas y explicó varias cosas durante la prueba, por lo que algunas respuestas están influidas por esas explicaciones.

### Cambios aplicados en `maqueta.html` (V3)

- Se agregó el paso «Antes de correr», con un enlace a la página principal para medir la rapidez en km/h antes de ingresarla.
- La calibración de los brazos y los pines dejaron de mostrarse al público. Se abren agregando `?equipo` a la dirección de la página.
- Se quitó de la ayuda la instrucción de calibrar, que solo queda visible en modo equipo.

### Registro cronológico

| Tiempo | Lo que dice la participante | Lo que hace o sucede |
|---|---|---|
| 00:01 | «Ya, empezando». | Comienza la exploración de la interfaz. |
| 00:19 | «Es que estoy leyendo». | Lee el contenido antes de interactuar. La moderadora le recuerda que debe expresar lo que piensa. |
| 00:28 | «En la maqueta cada brazo avanza lo que avanzaría su competidor». | Lee parte de las instrucciones e intenta entender la relación entre la página y la maqueta. |
| 00:38 | «¿Y qué tengo que agarrar? ¿Para hacerlo así? ¿O no se puede?». | Tiene dudas sobre qué interacción debe realizar y cómo empezar. |
| 00:49 | «Ah». | La moderadora explica que puede correr la carrera usando el celular. |
| 00:55 | «¿Y eso dónde lo dice?». | Busca una indicación sobre el uso de la otra página. La moderadora reconoce que no aparece. |
| 01:01 | «¿Y por qué aquí dice iniciar carrera?». | Cuestiona el orden de las acciones de la interfaz. |
| 01:08 | «Ah, yo lo tengo que hacer, pero mi rapidez se supone que la tengo que hacer yendo a la página». | Intenta reconstruir cómo obtener e ingresar su rapidez. |
| 01:32 | Se escucha la simulación con sonidos. | Se inicia una demostración, pero aparece un problema con la conexión del Arduino. |
| 01:38 | «Ay, no conectaste el Arduino. O sea, yo no lo conecté». | Identifica que el dispositivo no está conectado. La moderadora interviene. |
| 01:48 | «¿Lo tengo que mover?». | Pregunta si debe manipular físicamente algún elemento. |
| 02:02 | «Oh, qué loco eso. ¿Y este soy yo?». | Reacciona al movimiento de la carrera y busca identificar su representación. |
| 02:10 | «¿Entonces por qué...?». | Intenta formular una pregunta. La moderadora evita explicar la respuesta. |
| 02:17 | «Calibrar los brazos, ¿qué es eso?». | Encuentra la sección de calibración y pregunta por su función. |
| 02:22 | «Ah». | La moderadora explica que esa sección sirve para configurar el montaje, no para el usuario. |
| 02:41 | Se escuchan nuevamente los sonidos de la carrera. | Continúa explorando la interfaz. |
| 02:51 | «¿Y cómo sé cuál es mi rapidez?». | Dificultad central: no sabe cómo obtener el dato que debe ingresar. |
| 02:53 | «Claro». | La moderadora indica que debería calcular su rapidez con la otra página. |
| 03:16 | «¿Qué es esto, pin cinco?». | Se encuentra con información técnica sobre las conexiones del Arduino. |
| 03:26 | «¿Le ganas?, obvio que no». | Reacciona al resultado de una comparación de rapidez. |
| 03:54 | «No sé qué más pienso». | Deja de verbalizar observaciones. |
| 4:00 | «Está cool». | Valoración general positiva al cerrar. |

**Comentario después de detener la grabación:** «Pienso que debería decir algo como que debes ir a la página principal para calcular tu rapidez, porque si no, a mí no se me ocurriría hacer eso».


### Hallazgos

1. **Obtener la rapidez humana.** La interfaz no indica dónde medirla. Se propone un paso previo visible con enlace directo a la página de la E1.
2. **Controles técnicos mezclados con controles de usuario.** La calibración del montaje y el pin 5 aparecen en la misma interfaz que usa el público. Se propone separarla y dejarla oculta tras un modo técnico.
3. **Cómo iniciar la experiencia.** No queda claro qué hacer primero ni por qué aparece «Iniciar carrera». Se propone una instrucción inicial más clara.
4. **Reacción positiva.** La participante se sorprendió con el movimiento, pero no se puede concluir que haya entendido la relación entre sonidos y rapideces.

### Cambios para la V3

- Agregar el paso «mide tu rapidez» con enlace a la página de la E1, indicando la unidad.
- Ocultar la calibración en un modo técnico (por ejemplo, `?equipo`).
- Revisar que los textos de la interfaz no mencionen el pin ni el Arduino.

La efectividad de estos cambios deberá comprobarse con una nueva evaluación.

## 11. Próximos pasos

- Poner las imágenes de los participantes en los brazos. La idea es que la ficha del brazo amarillo cambie según el animal seleccionado en la interfaz.
- Mejorar la terminación de la maqueta y la fijación de los motores.
- Enlazar la interfaz desde la página de la E1.
- Evaluar la comprensión del movimiento, del mensaje final y de la sonificación mediante pruebas con usuarios.
- Revisar la placa Leonardo que no permite cargar programas o reemplazarla.
- Cambiar la alimentación del segundo motor a una fuente externa de 5 V (ver problema 14).
- Aplicar los cambios de la V3 derivados de la evaluación con usuarios (sección 10).

## 12. Evidencias

### Carrera completa (10 de noviembre)

- **[Video: la carrera en la maqueta](https://drive.google.com/file/d/1Potf8K9PHKE2QywsTLvA0Z7WEhNJAZx3/view?usp=sharing)** — Solo los motores, con la pista de fondo.
- **[Video: la carrera en la pantalla](https://drive.google.com/file/d/1X5h1JDLiqFGdM_FmGTCrpDMJJ_U0MB3o/view?usp=share_link)** — Solo la interfaz.
- **[Video: pantalla y maqueta al mismo tiempo](https://drive.google.com/file/d/1u6yWrTqmiBOMtPMsCWpFHHJa1UNM8yii/view?usp=share_link)** — Muestra cómo el resultado de la pantalla se refleja en los motores.

### Fotografías

**Conexión final:** los dos motores en un solo Arduino Leonardo (pin 5 con 5V y pin 6 con IOREF).

![Conexión final de los dos motores en el Arduino Leonardo](https://drive.google.com/file/d/1kqe79EJ9EmekWp3VdB69k6hEINhlF_Js/view?usp=sharing)

**La pista con los dos motores montados.**

![Pista con los dos motores montados](https://drive.google.com/file/d/1Fb0B6ycqcNEPAHPEIAIXH6fL4ex5Blbg/view?usp=share_link)

### Pruebas anteriores con un servomotor

- **[Video: prueba del participante humano](https://drive.google.com/file/d/1_hwZMiRt5t0HUFzzEUbcYTmDxYpDCAAe/view?usp=sharing)** — Demostración del movimiento del servomotor utilizando la opción de humano.
- **[Video: prueba del animal](https://drive.google.com/file/d/1XuTpJAEkveTmNMMYyfglgerEG2nEn3s5/view?usp=sharing)** — Demostración del movimiento utilizando la opción de animal.

### Archivos

- **`maqueta.html`** — Interfaz de la carrera en una pista compartida (actualizada el 10 de noviembre). La versión anterior, con dos pistas separadas, está en el historial del repositorio.
- **`carrera_servos.ino`** — Programa que recibe los ángulos y controla los servomotores.

**Estado al 10 de noviembre de 2026:** la carrera de ocho segundos funciona en la maqueta con los dos brazos, controlada desde la interfaz, con sonido y mensaje de resultado. Ambos motores están conectados a un solo Arduino Leonardo y calibrados desde la interfaz. Para la próxima versión queda poner las imágenes de los participantes en los brazos, mejorar la terminación de la maqueta y enlazar la interfaz con la página de la E1.
