# E2 — Versión 2: Movimiento físico con Arduino y pista compartida

**Proyecto:** ¿Le ganas al animal?  
**Grupo:** 6  
**Fecha de desarrollo:** 8–10 de noviembre de 2026  
**Estado:** Prototipo en desarrollo para la R2. Movimiento probado con un servomotor; pista compartida en construcción.

## 1. Objetivo

Después de presentar nuestra primera versión, que consistía en una pista atlética y figuras impresas de papel, comenzamos a explorar cómo incorporar movimiento físico a la representación de las rapideces de animales y seres humanos.

El objetivo de esta V2 es probar si podemos utilizar Arduino y servomotores para representar el avance de los participantes durante una carrera simulada de ocho segundos.

En esta etapa buscamos comprobar el funcionamiento de los componentes, explorar cómo transmitir el movimiento, conectar la representación física con una interfaz web y definir cómo comparar a la persona y al animal en una misma pista.

Todavía no buscamos construir una carrera física completa ni perfectamente calibrada.

## 2. Materiales utilizados

- Arduino Leonardo del curso, que volvimos a utilizar el 10 de noviembre con un cable USB de datos facilitado por el profesor.
- Arduino Uno prestado, utilizado temporalmente mientras no contábamos con un cable que transmitiera datos.
- Servomotor MG90S de posición angular.
- Segundo servomotor Tower Pro, que presentó giro continuo durante las pruebas.
- Cables USB y cables de conexión.
- Computador para programar y controlar el Arduino.
- Piezas LEGO: una viga amarilla (≈ 11,5 cm) y una viga azul (≈ 8,5 cm) como brazos giratorios, además de ejes, conectores, ruedas y engranajes.
- Cartón piedra de 37,5 × 27 cm como base de la pista.
- Interfaz `maqueta.html`.

## 3. Cambios respecto de la V1

En la V1 contamos únicamente con una pista atlética impresa y figuras de papel. La propuesta contemplaba representar las distancias recorridas por los participantes durante ocho segundos, pero no existía movimiento automático ni conexión electrónica.

Después de la primera revisión docente comenzamos a explorar la incorporación de actuadores físicos.

En esta V2:

- Pasamos de una maqueta estática a realizar pruebas de movimiento con servomotores.
- Controlamos ese movimiento mediante Arduino, a partir de instrucciones enviadas desde una interfaz web.
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

Grabamos videos de las demostraciones correspondientes.

El motor respondió a las instrucciones, pero todavía no logramos calibrar adecuadamente sus posiciones de inicio y final. En algunas pruebas, el desplazamiento entre ambas posiciones fue muy pequeño.

Esto nos mostró que conseguir movimiento no es suficiente: también necesitamos controlar cuánto avanza el participante para que el movimiento represente correctamente los datos.

Para abordar este problema, la nueva versión de la interfaz permite guardar la posición exacta de partida y de meta de cada brazo (ver sección 5).

### 4.3. Prueba del segundo servomotor

También conectamos un segundo servomotor Tower Pro.

Inicialmente pensábamos que ambos motores funcionarían de manera similar, pero observamos que este giraba continuamente: en un servomotor continuo, el valor enviado no indica una posición, sino una velocidad.

Esta prueba permitió identificar una diferencia importante entre los componentes disponibles. Un servomotor continuo no permite que el brazo se detenga siempre en la misma posición, por lo que para representar distancias necesitamos dos servomotores de posición angular.


### 4.4. Exploración con piezas LEGO

Consideramos inicialmente construir un pequeño vehículo con la imagen de un animal encima, pero descartamos esta alternativa porque el servomotor angular no gira de forma continua y porque los cables del Arduino dificultaban el desplazamiento.

Optamos por brazos giratorios: cada servomotor mueve una viga LEGO y la ficha del participante va en su extremo. La viga azul (más corta) representa a la persona y la viga amarilla (más larga) representa al animal.

### 4.5. Montaje de los dos brazos

Nuestra primera idea fue montar ambos servomotores sobre el mismo eje, uno bajo la pista y otro colgando de un puente, para que los dos brazos giraran desde el mismo centro sobre una pista con dos carriles concéntricos.

No logramos construir una base que pusiera un motor a mayor altura que el otro manteniendo el mismo origen. Como solución provisoria, pusimos los dos motores juntos y acostados, y dejamos la pista de pie, como la esfera de un reloj. Así, cada brazo gira en un plano distinto y no pueden chocar entre sí.

Como consecuencia, los ejes de los dos motores no coinciden: quedan separados por unos centímetros. Para que las fichas no se junten en la parte alta de la pista, el brazo largo debe ir en el motor de arriba, y la pista impresa debe ajustarse a la distancia real entre los ejes.

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
- Calibrar cada brazo guardando su posición de partida y de meta. Esto reemplaza la opción de invertir la dirección de giro y queda guardado en el navegador.

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
| 2 | Fue necesario cambiar temporalmente al Arduino Uno. | Volvimos al Arduino Leonardo del curso. |
| 3 | El servomotor angular presentaba problemas de calibración del recorrido. | La interfaz ahora permite calibrar partida y meta. Falta comprobarlo en la maqueta. |
| 4 | El segundo servomotor gira de forma continua. | Pendiente: necesitamos un segundo servomotor angular. |
| 5 | No logramos montar dos motores en el mismo eje a distinta altura. | Solución provisoria: motores acostados y pista de pie. |
| 6 | Con los motores juntos, los ejes no coinciden. | Brazo largo en el motor de arriba; ajustar la pista impresa a la distancia entre ejes. |
| 7 | Las rapideces son muy diferentes para un espacio limitado. | La meta equivale a lo que recorre el más rápido; la pista marca porcentajes. |
| 8 | La interfaz y la página de la E1 aún no están enlazadas. | Pendiente. La interfaz ya usa los mismos datos. |
| 9 | No hemos comprobado una carrera física completa de ocho segundos calibrada. | Pendiente. |

## 9. Decisiones de diseño y justificación

Después de la R1 decidimos explorar primero el movimiento de un participante antes de intentar construir una carrera física automatizada completa. Esta decisión buscó reducir la complejidad del prototipo y permitirnos identificar problemas técnicos antes de avanzar.

Elegimos brazos giratorios sobre una pista semicircular porque los servomotores angulares se mueven a una posición exacta entre 0° y 180°, lo que se adapta mejor a este recorrido que a una pista recta con ruedas.

Pasamos a una sola pista con dos carriles para que la comparación sea directa: la persona y el animal avanzan en el mismo espacio y con la misma escala, como en una competencia real.

Marcamos la partida y la meta como franjas anchas porque el servomotor tiene un margen de error de algunos grados.

Agregamos un mensaje final explícito (ganaste, perdiste o empate) para que el resultado se entienda sin necesidad de explicación.

Dejamos la pista de pie de manera provisoria por una restricción de montaje (sección 4.5), no por una decisión de visualización.

Reconocemos que la implementación tecnológica debe responder a una decisión de visualización: **el objetivo no es simplemente conseguir que un motor gire, sino utilizar ese movimiento para comunicar diferencias entre los datos**.

## 10. Próximos pasos

- Conseguir un segundo servomotor angular.
- Medir la distancia entre los ejes y ajustar la pista impresa a esa medida.
- Imprimir la pista y montarla sobre el cartón piedra.
- Calibrar ambos brazos desde la interfaz.
- Comprobar una carrera física completa de ocho segundos con los dos brazos.
- Enlazar la interfaz desde la página de la E1.
- Evaluar la comprensión del movimiento, del mensaje final y de la sonificación mediante pruebas con usuarios.

## 11. Evidencias

Durante el desarrollo de la V2 registramos las siguientes pruebas:

- **[Video: prueba del participante humano](https://drive.google.com/file/d/1_hwZMiRt5t0HUFzzEUbcYTmDxYpDCAAe/view?usp=sharing)** — Demostración del movimiento del servomotor utilizando la opción de humano.
- **[Video: prueba del animal](https://drive.google.com/file/d/1XuTpJAEkveTmNMMYyfglgerEG2nEn3s5/view?usp=sharing)** — Demostración del movimiento utilizando la opción de animal.
- **Archivo `maqueta.html`** — Interfaz de la carrera en una pista compartida (actualizada el 10 de noviembre). La versión anterior, con dos pistas separadas, está en el historial del repositorio.
- **Código de Arduino `carrera_servos.ino`** — Programa que recibe los ángulos y controla los servomotores.
- **[Imagen: Montaje 1](https://drive.google.com/file/d/1JqPR-qWcAqv80aG7_kap5A-tBCJYxvdg/view?usp=sharing)**
- **[Imagen: Montaje 2](https://drive.google.com/file/d/18XGIr_JgXWtonkoRoNNlqfIuXtE-oj0G/view?usp=sharing)**

**Estado al 10 de noviembre de 2026:** volvimos a usar el Arduino Leonardo del curso, desarrollamos una interfaz con una pista compartida, sonido y mensaje de resultado, y montamos provisoriamente los dos motores acostados con la pista de pie. Todavía falta un segundo servomotor angular, ajustar la pista impresa a la distancia entre los ejes y comprobar una carrera física completa calibrada.
