# E2 — Versión 3: Interfaz para usuarios

Esta versión cambia la interfaz de la V2 a partir de la evaluación con usuarios. La V2 y su registro de prueba están en `../v2-pruebas-arduino/README.md` (sección 10).

## 1. Qué motivó la V3

En la prueba de thinking aloud con la V2, la participante:

- No sabía dónde obtener su rapidez. La interfaz pedía el dato, pero no indicaba cómo medirlo.
- Se encontró con la calibración de los brazos y con el pin 5, que son controles técnicos y no le correspondían.
- No entendió por qué aparecía «Iniciar carrera» ni qué debía hacer primero.

## 2. Cambios

- **Paso «Antes de correr»:** antes de los controles aparece un recuadro que indica medir la rapidez en km/h en la página principal (E1), con enlace directo.
- **Calibración oculta:** el panel «Calibrar los brazos de la maqueta» no se muestra por defecto. Para el equipo se abre agregando `?equipo` al final de la dirección.
- **Pines fuera de la vista:** las etiquetas «pin 5» y «pin 6» solo aparecen en modo equipo.
- **Ayuda ajustada:** se quitó de los pasos la instrucción de calibrar. En «Si algo falla», la sugerencia de calibrar solo aparece en modo equipo; para el público queda «Avísale al equipo».

## 3. Qué no cambió

- El programa del Arduino (`carrera_servos.ino`) es el mismo de la V2. Ver el problema de alimentación del segundo motor en la sección 8 de la V2.
- Los datos son los mismos de la página de la E1.

## 4. Pendiente

- Evaluar esta versión con usuarios nuevos (sin ayuda de la moderadora) y comparar con los resultados de la V2.
- Completar los tiempos de la grabación de la V2 en `../v2-pruebas-arduino/README.md`.
- Poner las imágenes de los participantes en los brazos.
- Enlazar la interfaz desde la página de la E1.

## 5. Archivos

- **`maqueta.html`** — Interfaz de la V3. Uso normal: abrir sin parámetros. Modo equipo: agregar `?equipo` a la dirección.
