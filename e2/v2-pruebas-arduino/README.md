# E2 — Versión 2: Exploración de movimiento físico con Arduino

**Proyecto:** ¿Le ganas al animal?  
**Grupo:** 6  
**Fecha de desarrollo:** 8–9 de noviembre de 2026  
**Estado:** Prototipo experimental en desarrollo. Movimiento probado, calibración pendiente.

## 1. Objetivo

Después de presentar nuestra primera versión, que consistía en una pista atlética y figuras impresas de papel, comenzamos a explorar cómo incorporar movimiento físico a la representación de las rapideces de animales y seres humanos.

El objetivo de esta V2 es probar si podemos utilizar Arduino y servomotores para representar el avance de los participantes durante una carrera simulada de ocho segundos.

En esta etapa buscamos comprobar el funcionamiento de los componentes, explorar cómo transmitir el movimiento y evaluar una posible conexión entre la representación física y la página web.

Todavía no buscamos construir una carrera física completa ni perfectamente calibrada.

## 2. Materiales utilizados

- Arduino Leonardo, utilizado inicialmente durante las pruebas de conexión.
- Arduino Uno, utilizado finalmente para cargar y ejecutar los programas.
- Servomotor MG90S de posición angular.
- Segundo servomotor Tower Pro, que presentó giro continuo durante las pruebas.
- Cables USB y cables de conexión.
- Computador para programar y controlar el Arduino.
- Piezas LEGO, ruedas, ejes y engranajes disponibles para explorar mecanismos físicos.
- Interfaz experimental `maqueta.html`.

## 3. Cambios respecto de la V1

En la V1 contamos únicamente con una pista atlética impresa y figuras de papel. La propuesta contemplaba representar las distancias recorridas por los participantes durante ocho segundos, pero no existía movimiento automático ni conexión electrónica.

Después de la primera revisión docente comenzamos a explorar la incorporación de actuadores físicos.

En esta V2:

- Pasamos de una maqueta estática a realizar pruebas de movimiento con servomotores.
- Comenzamos a explorar la posibilidad de controlar ese movimiento mediante Arduino.
- Desarrollamos una interfaz digital experimental para simular una carrera entre un humano y un animal.
- Probamos una representación semicircular mediante brazos giratorios como alternativa a la pista recta de la V1.
- Incorporamos sonificación en la interfaz experimental, aunque todavía no está sincronizada con una maqueta física funcional.

El principal cambio consiste en explorar cómo transformar los datos digitales de rapidez en movimiento físico, en lugar de depender exclusivamente de la manipulación manual de las figuras.

## 4. Pruebas realizadas

### 4.1. Conexión y cambio de placa Arduino

Inicialmente intentamos utilizar un Arduino Leonardo, pero no conseguimos cargar correctamente el programa desde el computador.

Posteriormente identificamos que el cable USB utilizado proporcionaba alimentación, pero no transmitía datos.

Para continuar utilizamos un Arduino Uno prestado y un cable USB compatible con transmisión de datos. Esto nos permitió cargar programas y realizar pruebas con los servomotores.

El cambio de placa respondió a una dificultad técnica y no a un cambio en los objetivos de la visualización.

### 4.2. Prueba del servomotor angular

Probamos un servomotor MG90S de posición angular conectado al Arduino Uno.

Utilizamos una interfaz experimental que permitía trabajar con las opciones de participante humano y animal, enviando instrucciones de movimiento al servomotor.

Grabamos videos de las demostraciones correspondientes.

El motor respondió a las instrucciones, pero todavía no logramos calibrar adecuadamente sus posiciones de inicio y final. En algunas pruebas, el desplazamiento entre ambas posiciones fue muy pequeño.

Esto nos mostró que conseguir movimiento no es suficiente: también necesitamos controlar cuánto avanza el participante para que el movimiento represente correctamente los datos.

### 4.3. Prueba del segundo servomotor

También conectamos un segundo servomotor Tower Pro.

Inicialmente pensábamos que ambos motores funcionarían de manera similar, pero observamos que este giraba continuamente.

Esta prueba permitió identificar una diferencia importante entre los componentes disponibles.

Todavía debemos confirmar el modelo exacto y determinar si este comportamiento puede aprovecharse para un mecanismo de movimiento o si resulta más adecuado utilizar otro servomotor de posición.

### 4.4. Exploración con piezas LEGO

Disponemos de ruedas, ejes, engranajes y piezas LEGO que podrían permitir transmitir el giro de un motor hacia una figura física.

Consideramos inicialmente construir un pequeño vehículo con la imagen de un animal encima. También exploramos la posibilidad de utilizar brazos giratorios para representar el avance.

Por ahora, estas son alternativas de diseño en evaluación. Todavía no hemos construido un mecanismo completo y calibrado que permita desplazar a los participantes según los datos.

## 5. Interfaz digital experimental: `maqueta.html`

Durante esta etapa utilizamos una interfaz de prueba independiente de la página original de la E1.

La interfaz permite:

- Ingresar una rapidez humana hipotética en km/h.
- Seleccionar un animal como rival.
- Simular una carrera de ocho segundos.
- Calcular la distancia que recorrería cada participante durante ese tiempo.
- Representar el avance digitalmente mediante dos brazos semicirculares.
- Generar sonidos utilizando tono, ritmo y timbres diferentes.
- Enviar instrucciones de posición angular al Arduino mediante Web Serial.
- Probar manualmente los ángulos de cada servomotor e invertir su dirección.

La comunicación está diseñada para utilizar los pines digitales 5 y 6 del Arduino.

La interfaz contiene la lógica para enviar las instrucciones, pero su funcionamiento completo depende de contar con un programa compatible cargado en la placa y de calibrar correctamente los servomotores.

**Importante:** la interfaz todavía no está integrada a la página pública de la E1 y no constituye por sí sola una maqueta física funcional.

## 6. Representación de los datos y escala

Nuestra propuesta continúa utilizando las rapideces de los participantes para calcular cuánto recorrerían durante ocho segundos.

La distancia se obtiene mediante:

**Distancia = rapidez × tiempo**

Cuando la rapidez está expresada en km/h, primero debemos dividirla por 3,6 para convertirla a metros por segundo.

En la interfaz experimental decidimos probar una representación angular de las distancias.

El participante más rápido alcanza un ángulo final de 180°, mientras que el otro alcanza un ángulo proporcional a su rapidez.

Esto permite conservar la proporción entre las distancias recorridas durante un mismo tiempo, aunque la escala cambia dependiendo de los dos participantes seleccionados.

Por ejemplo, si el humano tiene una rapidez de 20 km/h y compite contra un guepardo de 110 km/h, el guepardo alcanzaría 180° y el humano aproximadamente 32,7°.

Por lo tanto, un desplazamiento angular pequeño no necesariamente indica un error de calibración: también puede deberse a la diferencia entre las rapideces de los participantes.

Sin embargo, todavía debemos comprobar qué parte del movimiento observado corresponde al cálculo digital y cuál a las limitaciones del mecanismo físico.

## 7. Sonificación

La interfaz experimental incorpora sonido durante la simulación.

Utiliza:

- **Tono:** la frecuencia aumenta con la rapidez del participante.
- **Ritmo:** los sonidos se repiten más frecuentemente para rapideces mayores.
- **Timbre:** se utilizan formas de onda distintas para diferenciar al humano y al rival.
- **Señal de término:** al finalizar la simulación se reproduce una secuencia sonora.

Estas características buscan complementar la representación visual de la carrera.

Aunque la interfaz digital genera sonidos, todavía debemos evaluar si se comprenden sin explicación y cómo sincronizarlos con una representación física funcional.

## 8. Problemas encontrados

Durante las pruebas identificamos las siguientes dificultades:

1. El cable inicial del Arduino Leonardo no permitía transmitir datos.
2. Fue necesario cambiar al Arduino Uno para continuar las pruebas.
3. El servomotor angular todavía presenta problemas de calibración del recorrido.
4. El segundo servomotor giraba continuamente y no se comportaba como el primero.
5. Aún no hemos definido un mecanismo físico definitivo con las piezas LEGO.
6. Todavía debemos determinar cómo representar distancias muy diferentes dentro del espacio disponible.
7. La interfaz experimental y la página original de la E1 todavía no están integradas.
8. No hemos comprobado una carrera física completa de ocho segundos con movimiento correctamente calibrado.

## 9. Decisiones de diseño y justificación

Después de la R1 decidimos explorar primero el movimiento de un participante antes de intentar construir una carrera física automatizada completa.

Esta decisión busca reducir la complejidad del prototipo y permitirnos identificar problemas técnicos antes de avanzar.

También comenzamos a explorar una representación semicircular mediante brazos giratorios, porque los servomotores angulares podrían adaptarse mejor a ese tipo de recorrido que a una pista recta con ruedas.

Sin embargo, todavía no hemos decidido reemplazar definitivamente la pista atlética de la V1.

Queremos evaluar si la representación angular permite comprender las diferencias de distancia y si resulta viable construirla con los materiales disponibles.

Reconocemos que la implementación tecnológica debe responder a una decisión de visualización: **el objetivo no es simplemente conseguir que un motor gire, sino utilizar ese movimiento para comunicar diferencias entre los datos**.

## 10. Próximos pasos

- Revisar el funcionamiento y la calibración del servomotor angular.
- Probar el movimiento físico sin carga y luego con un mecanismo sencillo.
- Evaluar si conviene continuar con la pista recta o con brazos semicirculares.
- Determinar una escala física que permita comparar las distancias.
- Confirmar las características del segundo servomotor.
- Comprobar la comunicación entre la interfaz digital y el Arduino.
- Explorar cómo integrar esta interacción con la página original de la E1.
- Evaluar la comprensión del movimiento y la sonificación mediante pruebas con usuarios.

## 11. Evidencias

Esta etapa cuenta con los siguientes registros:

- Videos de pruebas utilizando las opciones de humano y animal.
- Código utilizado para controlar el Arduino.
- Archivo `maqueta.html`, correspondiente a la interfaz digital experimental.
- Fotografías de los servomotores, las placas Arduino y las piezas disponibles.

Los videos permiten documentar los avances de las pruebas y los problemas de calibración encontrados.

**Estado al 9 de noviembre de 2026:** logramos realizar pruebas de movimiento mediante Arduino y desarrollamos una interfaz digital para explorar una carrera con representación angular y sonido. Todavía no contamos con una maqueta física completa, calibrada e integrada a la página original.
