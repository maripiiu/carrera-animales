# E2 — Avance posterior a la Revisión 3: ajustes de sonificación y selección de animales

Esta actualización continúa el trabajo de la V3 a partir de las sugerencias recibidas durante la **Revisión 3 (R3)** con el profesor. Se trata de una **iteración en desarrollo**, centrada en lograr una sonificación reconocible y equilibrada, además de depurar la selección de animales. **No corresponde todavía a una V4 final**: quedan pendientes los cambios relacionados con la interacción física de la maqueta.

---

## 1. Qué motivó los cambios

### 1.1 Comentarios del profesor en R3

Durante la revisión se plantearon tres oportunidades de mejora:

1. **Sonidos más reconocibles:** reemplazar los pulsos abstractos por sonidos asociados al movimiento de los competidores. El profesor propuso como ejemplos las **pisadas de una persona** —diferenciando caminar, trotar y correr— y el **galope de un caballo**.
2. **Menos animales:** reducir la cantidad de opciones para facilitar la elección y concentrar la experiencia en una comparación clara entre una persona y un animal a la vez.
3. **Mayor interacción con la maqueta física:** buscar que el usuario no dependa tanto de la pantalla para elegir al competidor. Como posible solución, el profesor sugirió utilizar **códigos QR asociados a cada animal**, para seleccionarlos desde la propia maqueta.

En esta actualización abordamos las **dos primeras sugerencias**. La selección mediante códigos QR y otros cambios de interacción física **todavía no se han implementado**.

---

## 2. Cambios implementados

### 2.1 Curaduría progresiva: de 43 a 11 y finalmente a 6 animales

En una primera prueba posterior a R3 redujimos la galería original de 43 opciones a 11 animales. Sin embargo, al evaluar los audios en conjunto detectamos dos problemas de diseño:

- **Falta de reconocibilidad auditiva en varias especies:** mientras los pasos humanos y el galope del caballo son icónicos, las pisadas aisladas de especies como guepardo, león, berrendo, elefante o halcón peregrino resultaban difíciles de distinguir entre sí al oído sin explicación previa.
- **Amplitud excesiva frente al objetivo de la maqueta:** mantener especies cuyo sonido no aportaba información clara perjudicaba la lectura sonora exigida por la experiencia físico-digital.

Por ello, se decidió depurar el catálogo a **6 animales con firma sonora distintiva**, conservando los **tres hábitats** (tierra, aire y agua) y un rango completo de velocidades comparables contra un ser humano:

| Animal | Rapidez | Hábitat | Rol en la comparación |
| :--- | :--- | :--- | :--- |
| **Caballo de carrera** | 88 km/h | Tierra | Referencia rápida con galope inconfundible |
| **Delfín** | 60 km/h | Agua | Desplazamiento acuático claramente diferenciable |
| **Conejo** | 56 km/h | Tierra | Referencia ligeramente superior al récord humano |
| **Abeja** | 29 km/h | Aire | Referencia aérea alcanzable corriendo rápido |
| **Gallina** | 14 km/h | Tierra | Duelo muy parejo frente al trote humano (12 km/h) |
| **Caracol** | 0,048 km/h | Tierra | Contraste extremo de lentitud |

**Qué se descartó:** se retiraron *guepardo, león, berrendo, elefante* y *halcón peregrino* de esta iteración porque sus grabaciones de pisadas/movimiento no se diferenciaban claramente durante la carrera simultánea.

### 2.2 Pasos humanos sobre superficie firme

Se reemplazó el sonido abstracto del humano por cuatro pistas de pisadas diferenciadas según rangos de rapidez ingresada por el usuario:

| Rango de rapidez ingresada | Movimiento representado | Audio incorporado |
| :--- | :--- | :--- |
| **Menos de 8,5 km/h** | Caminando (ref. 5 km/h) | `caminando.mp3` |
| **8,5 a 17,9 km/h** | Trotando (ref. 12 km/h) | `trotando.mp3` |
| **18 a 33,9 km/h** | Corriendo (ref. 24 km/h) | `corriendo.mp3` |
| **34 km/h o más** | Esprint (ref. 44,7 km/h) | `usain bolt.mp3` |

Tras las primeras pruebas se descartaron las pistas iniciales de pasos humanos sobre pasto, ya que su textura se confundía con el desplazamiento de los animales; se reemplazaron por grabaciones sobre superficie firme para separar ambos timbres.

### 2.3 Generación y selección de efectos sonoros

Para el **caballo de carrera** se incorporó una grabación real de galope (`caballito.mp3`). Para los demás animales y las pistas humanas actualizadas se generaron efectos sonoros mediante herramientas de IA, evitando enlaces rotos o problemas de carga:

- **Herramientas utilizadas:** ElevenLabs y Morphic Studio.
- **Distribución:** `Chicken running footsteps.mp3` (gallina) fue generado en Morphic Studio; el resto de los efectos de animales (`abeja.mp3`, `delfin.mp3`, `conejo.mp3`, `caracol+.mp3`) y pistas complementarias se generaron en ElevenLabs (debido al límite gratuito de Morphic).
- **Criterios de generación (prompt base):** `Close-up Foley sound effect of [animal o persona] [acción y velocidad] on [superficie], [textura y ritmo de pisadas], no [vocalizations or wind], clean isolated SFX, no background noise.`

### 2.4 Integración local, normalización automática y control de mezcla en vivo

En las pruebas con audio simultáneo se detectó que algunas grabaciones venían a un volumen mucho mayor que otras, tapando las pisadas humanas durante los 8 segundos de carrera. Para resolverlo:

- **Audios incrustados sin conexión:** las pistas quedaron codificadas directamente dentro del archivo `maqueta.html`, eliminando dependencias de carpetas externas o servidores.
- **Normalización automática por RMS:** al decodificar cada pista con Web Audio API, la página calcula su nivel energético real (RMS) y ajusta automáticamente su ganancia base para que todos los animales partan equilibrados.
- **Prioridad base y controles de volumen independientes:** la mezcla inicial prioriza ligeramente las pisadas humanas (110 % humano / 85 % animal) y se incorporaron **dos barras de volumen en vivo** (`Tus pasos` y `Animal`, de 0 % a 150 %) conectadas a nodos de ganancia separados (`GainNode`). Esto permite al usuario enfatizar o aislar cualquiera de los dos carriles incluso en medio de la carrera.

---

## 3. Qué se mantuvo de V3

- El diseño general de la interfaz, la pista semicircular y los controles de inicio/reinicio de la carrera.
- La **duración estándar de ocho segundos**, los cálculos de distancia y la representación angular del avance.
- La comunicación entre la interfaz web y la placa Arduino mediante **Web Serial**.
- El mecanismo físico de **dos servomotores y dos brazos** que representan a los competidores.
- Los botones de escucha individual previa y el panel de calibración de la maqueta (`Modo Equipo`).

**No se modificó el programa de Arduino** en esta iteración; todos los cambios se concentraron en la interfaz web y su motor de audio.

---

## 4. Pendiente: interacción física y próximas pruebas

La recomendación de R3 de **dar mayor protagonismo a la interacción física** sigue abierta. Como siguiente paso, se evaluará implementar **selección tangible desde la maqueta** (por ejemplo, mediante códigos QR o pulsadores físicos asociados a los 6 animales), de modo que el usuario no dependa exclusivamente de la pantalla.

**Esto constituye una línea de desarrollo futura, no una funcionalidad disponible actualmente.** Queda pendiente validar esta nueva mezcla sonora con usuarios externos (*thinking aloud*) y registrar la sincronía completa con la maqueta física en video.

---

## 5. Archivos y registro

- **`maqueta.html`** — Interfaz actualizada con los 6 animales seleccionados, audios incrustados, normalización automática RMS y barras de volumen independientes.
- **Programa Arduino (`../v2-pruebas-arduino/carrera_servos.ino`)** — Se mantiene sin cambios para el control de los dos servomotores.
- **`../v3-pruebas-usuarios/README.md`** — Documenta el estado anterior de la interfaz y las evaluaciones que motivaron esta iteración.

**Evidencia por agregar:**
- Video de esta actualización funcionando en sincronía con la maqueta física.
- Observaciones recogidas tras las pruebas de escucha con usuarios.
- Enlace al commit correspondiente en el repositorio de GitHub.

> Este registro documenta un **avance posterior a R3**. La versión final y la documentación consolidada de la Entrega 2 se completarán una vez implementados o descartados justificadamente los cambios de interacción física pendientes.
