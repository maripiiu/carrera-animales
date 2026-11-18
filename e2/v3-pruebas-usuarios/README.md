# E2 — Versión 3: Interfaz para usuarios, ajustes visuales y estabilización del montaje físico

Esta versión evoluciona la interfaz y el montaje físico de la V2 a partir de dos instancias de evaluación: la prueba de *thinking aloud* con usuarios (`../v2-pruebas-arduino/README.md`, sección 10) y el feedback cruzado de otro grupo del curso durante las pruebas en sala.

Además de los cambios de interacción y sonificación, se realizaron ajustes posteriores en la apariencia de la interfaz y se resolvieron problemas técnicos relacionados con la alimentación y conexión de los servomotores.

---

## 1. Qué motivó los cambios de la V3

### 1.1 Hallazgos del *Thinking Aloud* (V2)

En la prueba con usuarios de la V2, la participante:

- No sabía dónde obtener su rapidez. La interfaz pedía el dato, pero no indicaba cómo medirlo ni daba valores de referencia.
- Se encontró con la calibración de los brazos y con las etiquetas de los pines (`pin 5` y `pin 6`), que son controles técnicos y no le correspondían.
- No entendió de inmediato por qué aparecía «Iniciar carrera» ni qué debía hacer primero.

### 1.2 Hallazgos del Feedback de Pares

Al probar nuestro prototipo, el grupo evaluador destacó positivamente la representación física con las dos manillas y que la interfaz era agradable a la vista, pero señaló cuatro oportunidades de mejora:

1. **Selección de animales oculta:** *"Al principio no quedaban tan claras las múltiples opciones de animales"* (el selector cerrado no invitaba a explorar los 43 animales).
2. **Diferenciación sonora:** *"Se perdió al intentar distinguir entre el sonido que representa al humano del animal"*.
3. **Jerarquía visual y foco en la pista:** sugirieron hacer más intuitivos los controles, agrandar los botones de inicio, facilitar la selección de animales y reducir texto innecesario. También propusieron permitir ocultar la pista digital para centrar la atención en la maqueta.
4. **Visibilidad de la pista y del avance:** la barra de pruebas de sonido empujaba la pista hacia abajo durante la cuenta regresiva y el sombreado del tramo recorrido tenía poco contraste sobre el color rojo.

---

## 2. Cambios implementados

### 2.1 Flujo guiado y medición de rapidez

- **Enlace directo y lenguaje claro:** en la cabecera aparece el botón **«↗ Medir mi rapidez»**, que lleva a la página principal para medir la velocidad desde el celular.
- **Botones de rapidez de ejemplo:** junto al campo de `km/h` se agregaron tres botones rápidos: **«🚶 Caminando (5)»**, **«🏃 Trotando (12)»** y **«⚡ Corriendo a tope (24)»**.
- **Pasos numerados:** los controles siguen un orden explícito: `1. Tu rapidez` → `2. Elige cualquier animal de la lista` → `▶ Iniciar carrera`.

### 2.2 Selección visual de los 43 animales

- **Galería de tarjetas:** se reemplazó el selector cerrado por una grilla interactiva donde se ven los animales con su emoji, nombre y velocidad en `km/h`.
- **Filtros por medio:** botones para filtrar por **Todos (43)**, **Tierra (27)**, **Aire (9)** y **Agua (7)**.

### 2.3 Coherencia estética y lectura de datos

- **Paleta inspirada en la lámina impresa:** se utilizaron como referencia los colores del estadio de `Carrera hojas.pdf`: azul marino (`#132a63`), celeste (`#28738f`), rojo (`#ee4e45`) y verde césped (`#a3c03b`), combinados con superficies suaves.
- **Marcador compacto:** se integró la duración de la carrera (`0,0 s`) en una píldora junto al resultado y se añadieron barras de progreso horizontales debajo de cada competidor.
- **Mayor contraste del recorrido:** el tramo avanzado se representa en rojo oscuro (`#8f1812`) para distinguirlo mejor del fondo rojo de la pista.
- **Foco en la maqueta física:** se agregó la casilla *«Mostrar pista animada en pantalla»*, que permite ocultar la pista digital sin perder el marcador en metros ni la escala.

### 2.4 Sonificación

- **Timbres diferenciados:** el humano se representa mediante un paso grave y seco (`sine`), mientras que el animal utiliza un pulso más agudo (`sawtooth` + `triangle`).
- **Frecuencia proporcional a la rapidez:** la frecuencia de los pulsos depende de la velocidad de cada competidor.
- **Escucha por separado:** los controles *«Sonido humano»* y *«Sonido animal»* permiten escuchar cada representación individualmente.
- **Reubicación de los controles:** la barra de sonido se movió debajo de la pista para evitar que desplazara el marcador y la visualización durante la cuenta regresiva.

### 2.5 Calibración y Modo Equipo

- **Controles técnicos ocultos:** el panel «Calibrar los brazos de la maqueta» y las etiquetas `pin 5` y `pin 6` permanecen ocultos por defecto.
- **Acceso para el equipo:** se mantiene el parámetro `?equipo` y se agregó el botón **«⚙️ Calibrar brazos»** en el pie de página.
- **Atajo de teclado:** también se puede abrir o cerrar la calibración con `Alt + C`.
- **Sin recargar la página:** la calibración puede activarse en vivo sin tener que recargar la URL ni desconectar el Arduino.

### 2.6 Ajustes posteriores de diseño y fondo

Después de los primeros cambios de la V3, se continuó trabajando en la apariencia general de la interfaz.

- **Revisión del fondo:** se modificó el tratamiento visual del fondo para obtener una apariencia más clara y menos cargada, evitando que las franjas o patrones del fondo compitieran con la información principal.
- **Simplificación visual:** se siguió ajustando el diseño general de la página para que los controles, la selección de animales, el marcador y la pista tuvieran una jerarquía más clara.
- **Mayor protagonismo del contenido:** se buscó que la atención estuviera puesta en la comparación de velocidades y en el movimiento de los brazos físicos, en lugar de elementos decorativos de la interfaz.
- **Continuidad entre la experiencia digital y física:** se mantuvo la intención de que la página y la lámina impresa se entendieran como partes de una misma experiencia.

> Nota: el archivo `maqueta.html` actualmente publicado en GitHub todavía conserva el fondo con franjas verdes. Esta sección describe el ajuste posterior de la versión de trabajo; hay que actualizar el archivo del repositorio para que el código y el README coincidan.

### 2.7 Estabilización de la conexión y alimentación de Arduino

Durante las pruebas del montaje físico también se encontraron dificultades técnicas con la conexión y alimentación de los servomotores.

- **Revisión de la conexión eléctrica:** se revisó la sección T7 de las cápsulas de InfoVis, que especifica las tres conexiones necesarias para cada servo: señal, alimentación de 5 V y tierra (GND).
- **Uso de los pines de señal:** se mantuvo la convención del curso de utilizar los pines 5 y 6 para controlar los servomotores.
- **Distinción entre señal y alimentación:** se identificó que los pines de señal no alimentan los motores y que `IOREF` no debe utilizarse como una salida de 5 V para alimentar los servos.
- **Problema durante las primeras pruebas:** una conexión de alimentación incorrecta provocó que uno de los servomotores se dañara. Esto llevó a revisar el esquema de conexión antes de continuar con las pruebas.
- **Validación del montaje:** posteriormente se consiguió hacer funcionar los dos servomotores con la placa Arduino UNO, manteniendo las señales de control en los pines D5 y D6.

La revisión de esta conexión permitió comprender mejor la diferencia entre la alimentación de la placa, la alimentación de los servomotores y las señales que controlan su movimiento.

Referencia técnica: [InfoVis — T7. Conexión a Arduino](https://infovis.alessiobellino.com/#sec-T7-conexion-a-arduino).

---

## 3. Síntesis del Feedback de Pares

| Dimensión | Comentario del grupo evaluador | Cómo se aborda en la V3 |
| :--- | :--- | :--- |
| **1. El Mensaje** | Al principio entendieron la comparación entre la rapidez humana y la de los animales, pero no estaba tan clara la relación con la velocidad personal. | Se agregó el enlace «Medir mi rapidez» y botones de velocidades de ejemplo. |
| **2. Lo Físico** | Destacaron las dos manillas que representan el desplazamiento de la persona y del animal. | Se mantuvo el mecanismo físico y se agregó la opción de ocultar la pista digital para priorizar la maqueta. |
| **3. Usarlo** | La selección de animales no era suficientemente evidente. | Se incorporó una galería visual con los 43 animales y filtros por hábitat. |
| **4. Los Datos** | La diferencia de velocidades se entendía, pero costaba distinguir los sonidos. | Se diferenciaron los timbres del humano y del animal y se agregaron controles para escucharlos por separado. |
| **5. Conservar** | Destacaron la representación física y el diseño agradable de la interfaz. | Se mantuvo la estructura general y se continuó refinando la apariencia visual. |
| **6. Cambiar** | Sugirieron diferenciar sonidos, agrandar el botón de inicio, facilitar la selección, reducir texto y dar protagonismo a la maqueta. | Se incorporaron estos cambios mediante la galería de animales, el botón de inicio destacado, la sonificación diferenciada y la opción de ocultar la pista digital. |

---

## 4. Qué se mantuvo

- El conjunto de datos de los 43 animales se mantuvo respecto de la Entrega 1.
- Se conservó la idea central de comparar la rapidez de una persona con la de un animal.
- Se mantuvo el montaje físico con dos servomotores y los brazos que representan el avance de los competidores.
- Se conservó la conexión entre la interfaz web y Arduino para sincronizar el movimiento de la maqueta con la carrera.

---

## 5. Posibles mejoras para una V4

A partir de las pruebas realizadas, se identificó una oportunidad para mejorar la relación entre la selección digital de los animales y su representación física.

Actualmente, el usuario puede seleccionar cualquiera de los 43 animales en la interfaz, pero la maqueta física no cambia automáticamente su representación visual para mostrar cuál fue seleccionado.

Una posible V4 sería:

- **Identificación visual del animal:** incorporar una representación del animal seleccionado en el brazo correspondiente de la maqueta.
- **Representación intercambiable:** explorar el uso de pequeñas imágenes o tarjetas físicas que permitan identificar al competidor seleccionado.
- **Pantalla pequeña:** evaluar la incorporación de una pantalla OLED que muestre el animal seleccionado. Esto permitiría actualizar la representación desde la interfaz sin que el usuario tenga que cambiar manualmente una imagen.
- **Mayor sincronización físico-digital:** buscar que la selección del animal en la página se refleje de forma más directa en el objeto físico.

Estas ideas corresponden a posibilidades de iteración y no deben presentarse como funcionalidades ya implementadas.

---

## 6. Pendiente

- Evaluar la versión actual con usuarios nuevos y comparar los resultados con la prueba de la V2.
- Incorporar, si se decide avanzar con esa idea, una identificación visual del animal seleccionado en los brazos físicos.

---

## 7. Archivos

- **`maqueta_v3_impresa.html` / `maqueta.html`** — Interfaz de la V3 sincronizada con el montaje físico. Uso normal: abrir sin parámetros. Modo equipo: presionar **«⚙️ Calibrar brazos»** al pie de la página (`Alt + C`) o agregar `?equipo` a la dirección.
- **`Carrera hojas.pdf`** — Lámina impresa a escala real de la pista semicircular para el montaje físico de los dos servomotores.

## 8. Registro audiovisual

Se incluyen videos que muestran el funcionamiento de la interfaz y su integración con la maqueta física.

- **Funcionamiento de la página web:**. Muestra la selección de la rapidez, exploración de los animales, inicio de la carrera, marcador y sonificación.
- [pista y grabacion de pantalla](https://drive.google.com/file/d/1jqB27b-6Iti8_zvguQmiO_nIhIhvcEGn/view?usp=share_link)
- [pista y pantalla en vivo](https://drive.google.com/file/d/1269Zud8PLP9hW_YzgtzpvZqdUpmzBH2O/view?usp=share_link)
- [grabacion de pantalla e interacción con la página](https://drive.google.com/file/d/1jNMbDo7cKDIjtlR0l_ljsjFSWxFb4Utr/view?usp=share_link)
- **Funcionamiento de la maqueta física:** [Ver video](https://drive.google.com/file/d/1eqcHG8BFSy7TarHCzugwav5BUCR5zNH5/view?usp=share_link). Muestra el movimiento de los dos brazos mediante los servomotores y su sincronización con la carrera iniciada desde la interfaz.


