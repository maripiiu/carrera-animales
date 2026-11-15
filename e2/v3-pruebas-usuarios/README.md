# E2 — Versión 3: Interfaz para usuarios y coherencia con la lámina impresa

Esta versión evoluciona la interfaz de la V2 a partir de dos instancias de evaluación: la prueba de *thinking aloud* con usuarios (`../v2-pruebas-arduino/README.md`, sección 10) y el feedback cruzado de otro grupo del curso durante las pruebas en sala.

---

## 1. Qué motivó los cambios de la V3

### 1.1 Hallazgos del *Thinking Aloud* (V2)
En la prueba con usuarios de la V2, la participante:
- No sabía dónde obtener su rapidez. La interfaz pedía el dato, pero no indicaba cómo medirlo ni daba valores de referencia.
- Se encontró con la calibración de los brazos y con las etiquetas de los pines (`pin 5` y `pin 6`), que son controles técnicos y no le correspondían.
- No entendió de inmediato por qué aparecía «Iniciar carrera» ni qué debía hacer primero.

### 1.2 Hallazgos del Feedback de Pares ( Evaluación de otro grupo )
Al probar nuestro prototipo, el grupo evaluador destacó positivamente la representación física con las dos manillas y que la interfaz era agradable a la vista, pero señaló cuatro oportunidades de mejora clave:
1. **Selección de animales oculta:** *"Al principio no quedaban tan claras las múltiples opciones de animales"* (el `<select>` cerrado no invitaba a explorar los 43 animales).
2. **Diferenciación sonora:** *"Se perdió al intentar distinguir entre el sonido que representa al humano del animal"* (sugirieron usar timbres más diferenciados entre grave y agudo, y poder escucharlos por separado).
3. **Jerarquía visual y foco en la pista:** Sugirieron *"que sea más intuitivo en aspectos como los botones de inicio (más grandes), selección de animales y reducir texto innecesario"*, además de permitir ocultar la pista digital cuando se quiera centrar toda la atención en la maqueta física.
4. **Visibilidad de la pista y del avance:** En pantallas de computador, la barra de pruebas de sonido empujaba la pista hacia abajo durante la cuenta regresiva («En sus marcas, listos, ya»), y el sombreado del tramo recorrido tenía poco contraste sobre el color rojo de la pista.

---

## 2. Cambios implementados

### 2.1 Flujo guiado y medición de rapidez
- **Enlace directo y lenguaje claro:** en la cabecera aparece el botón **«↗ Medir mi rapidez»** (sin jerga interna como «E1») que lleva a la página principal para medir la velocidad desde el celular.
- **Botones de rapidez de ejemplo:** junto al campo de `km/h` se agregaron tres botones rápidos (**«🚶 Caminando (5)»**, **«🏃 Trotando (12)»** y **«⚡ Corriendo a tope (24)»**) para que cualquier persona pueda probar la experiencia al instante aunque no haya medido su velocidad previamente.
- **Pasos numerados:** los controles siguen un orden explícito (`1. Tu rapidez` → `2. Elige cualquier animal de la lista` → `▶ Iniciar carrera`).

### 2.2 Selección visual de los 43 animales (sin buscador de texto)
- **Galería de tarjetas a la vista:** se reemplazó el buscador de texto y la lista cerrada por una **grilla interactiva de tarjetas** donde se ven de inmediato los animales con su emoji, nombre y velocidad en `km/h`.
- **Filtros por medio:** botones rápidos para filtrar por **Todos (43)**, **Tierra (27)**, **Aire (9)** y **Agua (7)** con un solo clic.

### 2.3 Coherencia estética con la lámina impresa y lectura de datos
- **Paleta armónica y descansada:** el diseño adopta los colores de estadio de la lámina impresa (`Carrera hojas.pdf`: cabezal azul marino `#132a63`, franja celeste `#28738f`, pista roja `#ee4e45` sobre césped `#a3c03b`), combinados con superficies crema y salvia suave (`#f7f9f2` y `#e5ebd8`) para evitar contrastes chillones.
- **Marcador compacto con barras proporcionales:** se eliminó el espacio en blanco alrededor del reloj integrando la duración (`0,0 s`) en una píldora central junto al resultado, y se añadieron **barras de progreso horizontales** debajo de cada competidor para visualizar gráficamente la proporción recorrida.
- **Alto contraste en el recorrido de la pista:** el tramo avanzado por cada brazo se pinta en **rojo burdeo oscuro (`#8f1812`)** con un arco luminoso en el carril correspondiente, logrando que el avance destaque claramente sobre el fondo rojo de la pista.
- **Opción de foco en la maqueta física:** se incluyó la casilla *«Mostrar pista animada en pantalla»*, que permite ocultar el dibujo digital de la pista para centrar la atención exclusivamente en los brazos físicos de la maqueta sin perder el marcador en metros ni la escala.

### 2.4 Sonificación debajo de la pista
- **Timbres diferenciados:** el humano suena como un paso grave y seco (`sine`), mientras que el animal suena como un pulso agudo brillante (`sawtooth` + `triangle`), manteniendo la frecuencia de pulsos proporcional a la rapidez en `km/h`.
- **Reubicación debajo de la pista:** la barra **«Escuchar por separado»** (*Sonido humano* / *Sonido animal*) se movió debajo de la pista para no empujar el marcador ni la pista fuera de la pantalla durante la cuenta regresiva.

### 2.5 Calibración y Modo Equipo sin perder la conexión con Arduino
- **Calibración y pines ocultos para el público:** el panel «Calibrar los brazos de la maqueta» y las etiquetas `pin 5` y `pin 6` permanecen ocultos por defecto.
- **Activación instantánea sin recargar la URL:** además de soportar `?equipo` en la dirección, se agregó el botón discreto **«⚙️ Calibrar brazos»** en el pie de página (y el atajo de teclado `Alt + C`). Esto permite al equipo abrir y cerrar la calibración en vivo **sin recargar la página ni desconectar el Arduino**.

---

## 3. Síntesis del Feedback de Pares (para el Informe E2)

| Dimensión del Formulario | Comentario del grupo evaluador | Cómo lo resuelve esta versión (V3) |
| :--- | :--- | :--- |
| **1. El Mensaje** | *"Al principio entendimos que se buscaba mostrar la diferencia de velocidad entre un humano y distintos animales. Luego explicaron que a futuro se quería usar la velocidad de uno al correr."* | Se integró el enlace directo **«↗ Medir mi rapidez»** y botones rápidos (*Caminando*, *Trotando*, *Corriendo a tope*) para conectar inmediatamente el dato personal con la carrera. |
| **2. Lo Físico** | *"Ocupan dos manillas que representan el desplazamiento de la persona y del animal para poder ver físicamente quién se mueve más rápido."* | Se sincronizó el diseño gráfico de la web con la lámina impresa de la maqueta y se añadió el interruptor para mostrar u ocultar la pista digital según se quiera priorizar el objeto físico. |
| **3. Usarlo** | *"Se usó un botón llamativo para que la visualización comenzara, aunque al principio no quedaban tan claras las múltiples opciones de animales."* | Se desplegó la **galería visual con los 43 animales** y filtros por hábitat (*Tierra*, *Aire*, *Agua*) siempre visibles sin necesidad de escribir ni abrir menús ocultos. |
| **4. Los Datos** | *"Pudimos dimensionar de manera más directa la diferencia de velocidad... pero se perdió al intentar distinguir entre el sonido que representa al humano del animal."* | Se separaron los timbres (paso grave para humano vs. pulso agudo para animal) y se agregaron botones debajo de la pista para escuchar cada sonido por separado durante 1,2 s. |
| **5. Conservar** | *"Lo físico, porque está bien logrado, el diseño de la interfaz es agradable a la vista."* | Se mantuvo la estructura limpia y se suavizó la paleta cromática para integrarla con la lámina impresa sin saturar la vista. |
| **6. Cambiar** | *"Sonido más diferenciable, botón de inicio más grande, selección de animales más intuitiva, reducir texto innecesario y opción de centrar la atención en la representación física."* | Se aplicaron los 5 cambios: timbres diferenciados, botón «▶ Iniciar carrera» destacado, galería visual de animales, marcador compacto con barras proporcionales y opción para ocultar la pista en pantalla. |

---

## 4. Qué no cambió

- El programa del Arduino (`carrera_servos.ino`) es el mismo de la V2 (recibe los ángulos `a,b\n` a `9600` baudios para los pines 5 y 6). Ver el detalle de alimentación de los servomotores en la sección 8 del README de la V2.
- El conjunto de datos de los 43 animales es el mismo de la Entrega 1.

---

## 5. Pendiente

- Evaluar esta versión con usuarios nuevos (sin ayuda de la moderadora) y comparar con los resultados de la V2.
- Completar los tiempos de la grabación de la V2 en `../v2-pruebas-arduino/README.md`.
- Poner las imágenes de los participantes en los brazos físicos de la maqueta.
- Enlazar esta interfaz desde la página principal de la E1.

---

## 6. Archivos

- **`maqueta_v3_impresa.html` / `maqueta.html`** — Interfaz completa de la V3 sincronizada con el diseño de la pista impresa. Uso normal: abrir sin parámetros. Modo equipo: presionar **«⚙️ Calibrar brazos»** al pie de la página (`Alt + C`) o agregar `?equipo` a la dirección.
- **`Carrera hojas.pdf`** — Lámina impresa a escala real de la pista semicircular para el montaje físico de los dos servomotores.
