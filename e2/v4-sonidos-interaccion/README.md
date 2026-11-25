# E2 — Iteración posterior a la Revisión 3: sonificación equilibrada e interacción 100 % física con fichas QR

Esta actualización continúa el trabajo de la V3 a partir de las sugerencias recibidas durante la **Revisión 3 (R3)** con el profesor. Resuelve los tres frentes planteados en esa revisión: sonidos reconocibles y equilibrados, reducción de la galería de animales e interacción física directa sobre la maqueta mediante fichas con códigos QR.

---

## 1. Qué motivó los cambios

### 1.1 Comentarios del profesor en R3

Durante la revisión se plantearon tres oportunidades de mejora:

1. **Sonidos más reconocibles:** reemplazar los pulsos abstractos por sonidos asociados al movimiento real de los competidores (pisadas humanas diferenciadas según velocidad y sonidos reconocibles de animales, como el galope del caballo).
2. **Menos animales:** reducir la cantidad de opciones para facilitar la elección y enfocar la experiencia en una comparación clara entre una persona y un animal a la vez.
3. **Interacción 100 % física con la maqueta:** evitar que el usuario dependa de la pantalla del computador para elegir al competidor, proponiendo el uso de **códigos QR** para disparar la carrera directamente desde la maqueta mientras la página web opera en segundo plano.

---

## 2. Cambios implementados

### 2.1 Curaduría progresiva: de 43 a 11 y finalmente a 6 animales

En una primera prueba posterior a R3 redujimos la galería original de 43 opciones a 11 animales. Al evaluar las grabaciones en simultáneo durante los 8 segundos de carrera detectamos que las pisadas aisladas de especies como *guepardo, león, berrendo, elefante* y *halcón peregrino* resultaban difíciles de distinguir entre sí al oído sin explicación previa.

Por ello, se depuró el catálogo a **6 animales con firma sonora distintiva**, conservando los **tres hábitats** (tierra, aire y agua) y un rango completo de velocidades comparables frente a una persona:

| Animal | Rapidez | Hábitat | Rol en la comparación |
| :--- | :--- | :--- | :--- |
| **Caballo de carrera** | 88 km/h | Tierra | Referencia rápida con galope inconfundible |
| **Delfín** | 60 km/h | Agua | Desplazamiento acuático claramente diferenciable |
| **Conejo** | 56 km/h | Tierra | Referencia ligeramente superior al récord humano |
| **Abeja** | 29 km/h | Aire | Referencia aérea alcanzable corriendo rápido |
| **Gallina** | 14 km/h | Tierra | Duelo muy parejo frente al trote humano (12 km/h) |
| **Caracol** | 0,048 km/h | Tierra | Contraste extremo de lentitud |

**Qué se descartó:** se retiraron *guepardo, león, berrendo, elefante* y *halcón peregrino* porque sus pisadas no se diferenciaban con claridad al reproducirse en paralelo con el movimiento humano.

### 2.2 Pasos humanos sobre superficie firme

Se reemplazó el sonido abstracto del humano por cuatro pistas de pisadas diferenciadas según rangos de rapidez:

| Rango de rapidez | Movimiento representado | Audio incorporado |
| :--- | :--- | :--- |
| **Menos de 8,5 km/h** | Caminando (ref. 5 km/h) | `caminando.mp3` |
| **8,5 a 17,9 km/h** | Trotando (ref. 12 km/h) | `trotando.mp3` |
| **18 a 33,9 km/h** | Corriendo rápido (ref. 24 km/h) | `corriendo.mp3` |
| **34 km/h o más** | Usain Bolt / Esprint (ref. 44,7 km/h) | `usain bolt.mp3` |

Se descartaron las pistas iniciales de pasos humanos sobre pasto porque su textura se confundía con el desplazamiento de los animales; se reemplazaron por grabaciones sobre superficie firme para separar ambos timbres.

### 2.3 Generación y selección de efectos sonoros

Para el **caballo de carrera** se utilizó una grabación real de galope (`caballito.mp3`). Para los demás animales y las pistas humanas actualizadas se generaron efectos sonoros mediante herramientas de IA:

- **Herramientas utilizadas:** ElevenLabs y Morphic Studio.
- **Distribución:** `Chicken running footsteps.mp3` (gallina) fue generado en Morphic Studio; los demás efectos activos (`abeja.mp3`, `delfin.mp3`, `conejo.mp3`, `caracol+.mp3`) se generaron en ElevenLabs (debido al límite gratuito de Morphic).
- **Prompt base:** `Close-up Foley sound effect of [animal o persona] [acción y velocidad] on [superficie], [textura y ritmo de pisadas], no [vocalizations or wind], clean isolated SFX, no background noise.`

### 2.4 Integración offline, normalización RMS y mezcla de volumen en vivo

En las pruebas de reproducción simultánea se observó que algunos audios venían grabados a mayor intensidad que otros, tapando las pisadas humanas. Para solucionarlo:

- **Audios incrustados sin conexión:** las 10 pistas activas (4 humanas + 6 animales) quedaron codificadas en base64 dentro del propio archivo HTML, eliminando dependencias de carpetas externas y reduciendo el peso del archivo al retirar los 5 audios descartados.
- **Normalización automática por RMS:** al decodificar cada pista con Web Audio API, el código calcula su nivel energético real (RMS) y nivela automáticamente su ganancia base para que ningún sonido tape al otro.
- **Controles independientes en tiempo real:** la mezcla parte priorizando ligeramente las pisadas humanas (110 % humano / 85 % animal) y ofrece dos barras de volumen (`Tus pasos` y `Animal`, de 0 % a 150 %) conectadas a nodos de ganancia separados (`GainNode`) que permiten ajustar o aislar cada carril incluso durante la carrera.

### 2.5 Interacción 100 % física mediante 10 fichas QR y lector integrado con selector de cámara

Para que el usuario interactúe únicamente con la maqueta física —sin perder la posibilidad de competir con su propia rapidez— se diseñó un sistema tangible de **10 fichas plegables con código QR**:

- **4 fichas de ritmo humano (Paso 1):** `VEL:5` (Caminando), `VEL:12` (Trotando), `VEL:24` (Corriendo rápido) y `VEL:44.7` (Usain Bolt). Al mostrar una ficha al lector, se fija la rapidez del usuario, se guarda en `localStorage` y suena una confirmación breve (1,3 s de esos pasos humanos) para validar la lectura sin mirar la pantalla.
- **6 fichas de animales rivales (Paso 2):** `ANIMAL:caballo`, `ANIMAL:delfin`, `ANIMAL:conejo`, `ANIMAL:abeja`, `ANIMAL:gallina` y `ANIMAL:caracol`. Al mostrar la ficha, la página selecciona al animal y **dispara automáticamente la carrera de 8 segundos**, moviendo los brazos del Arduino y reproduciendo los sonidos nivelados.
- **Lector integrado en la misma pestaña:** la detección corre dentro del mismo HTML usando `BarcodeDetector` nativo del navegador (con respaldo `jsQR`), evitando abrir pestañas nuevas que desconecten el puerto USB (Web Serial) del Arduino. Además, bloquea lecturas duplicadas mientras dura la carrera.
- **Selector de cámara para uso con iPhone:** se incorporó un menú desplegable (`#qrCamara`) que detecta automáticamente las cámaras disponibles (incluyendo **Cámara de Continuidad de iPhone** conectada al Mac), permitiendo posicionar el teléfono directamente sobre la maqueta como escáner físico mientras el computador queda oculto operando en segundo plano.

---

## 3. Qué se mantuvo de V3

- El diseño general de la pista semicircular sincronizada con la lámina impresa.
- La **duración estándar de ocho segundos**, los cálculos de distancia y el mapeo angular `0°–180°`.
- La comunicación entre la interfaz web y Arduino mediante **Web Serial** (pines 5 y 6).
- El mecanismo físico de **dos servomotores y dos brazos** y el panel de calibración (`Modo Equipo`, `Alt + C`).

**No se modificó el programa de Arduino** en esta iteración; todas las mejoras se concentraron en la interfaz web, el motor de audio y el set físico de fichas QR.

---

## 4. Archivos y registro

- **`maqueta.html`** — Interfaz final con los 6 animales, audios incrustados, normalización RMS, barras de volumen en vivo, lector QR automático y selector de cámara (compatible con iPhone vía Cámara de Continuidad).
- **`Fichas QR imprimibles`** — Hoja imprimible (100 % offline, códigos QR en SVG) con las 10 fichas plegables (4 de ritmo humano + 6 de animales) listas para cortar, doblar y pegar en cartón.
- **Programa Arduino (`../v2-pruebas-arduino/carrera_servos.ino`)** — Sin cambios.
