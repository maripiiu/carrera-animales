# E2 — Avance posterior a la Revisión 3: ajustes de sonificación y selección de animales

Esta actualización continúa el trabajo de la V3 a partir de las sugerencias recibidas durante la **Revisión 3 (R3)** con el profesor. Se trata de una **iteración en desarrollo**, centrada por ahora en mejorar los sonidos y simplificar la elección del animal. **No corresponde todavía a una V4 final**: quedan pendientes cambios relacionados con la interacción física de la maqueta.

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

### 2.1 Selección de once animales

La galería de la maqueta se redujo de 43 opciones a **once animales** representativos:

- **Caballo de carrera** — 88 km/h
- **Abeja** — 29 km/h
- **Elefante** — 40 km/h
- **Guepardo** — 120 km/h
- **Gallina** — 14 km/h
- **Halcón peregrino** — 389 km/h
- **León** — 80 km/h
- **Conejo** — 56 km/h
- **Caracol** — 0,048 km/h
- **Berrendo** — 88 km/h
- **Delfín** — 60 km/h

Se conservaron los valores de rapidez utilizados en el proyecto. La reducción busca simplificar la interacción y permitir que el equipo trabaje con mayor detalle la representación sonora de cada competidor. La carrera continúa enfrentando a **una persona contra un animal**.

### 2.2 Pasos humanos en lugar de pulsos sintetizados

Se reemplazó el sonido abstracto del humano por pistas de pisadas diferenciadas según las cuatro velocidades de referencia disponibles:

| Rapidez de referencia | Movimiento representado | Audio incorporado |
| :--- | :--- | :--- |
| **5 km/h** | Caminando | `humano5.mp3` |
| **12 km/h** | Trotando | `humano12.mp3` |
| **24 km/h** | Corriendo | `humano24.wav` |
| **44,7 km/h** | Esprint | `humano44.mp3` |

La intención es que el usuario pueda **reconocer el tipo e intensidad del movimiento al escucharlo**, en lugar de interpretar solamente cambios de tono o frecuencia de pulsos. Estos audios funcionan como una representación auditiva del ritmo y no implican registros reales tomados exactamente a esas velocidades.

### 2.3 Sonidos de animales y galope del caballo

El sonido sintetizado del **caballo de carrera** se reemplazó por una pista de galope (`caballito.mp3`) para distinguir claramente los cascos de las pisadas humanas.

*(Nota: Los otros diez animales mantienen temporalmente los sonidos sintetizados de V3 o los efectos generados mediante IA según corresponda a las pruebas actuales. Su ajuste definitivo queda sujeto a nuevas evaluaciones).*

### 2.4 Generación de efectos sonoros con Inteligencia Artificial

Para lograr sonidos más reconocibles y evitar problemas de derechos de autor o enlaces rotos, se recurrió a herramientas de inteligencia artificial para generar los efectos de sonido de los animales:

- **Herramienta / Plataforma de IA utilizada:** ` [ElevenLabs, Morphic Studio]`
- **Audios generados con esta herramienta:** `[Todos menos el galope del caballo. El sonido del guepardo, elefante y gallina fueron creados en Morphic Studio los demás en ElevenLabs (esto solo porque la versión gratuita de Morphic no permitía más uso.)]`
- **Criterios de generación / Prompts base:** `[Close-up Foley sound effect of [animal o persona] [acción y velocidad, ej: running at maximum speed] on [superficie, ej: dry dirt and grass], [textura y ritmo de pisadas, ej: rapid rhythmic footsteps], no [sonido a evitar, ej: vocalizations or wind], clean isolated SFX, no background noise.]`

### 2.5 Integración de audios y ajuste de volumen

- Las pistas de audio quedaron **incorporadas directamente en el archivo `maqueta.html`** (codificadas/integradas), eliminando la dependencia de cargar archivos desde servidores externos.
- Se calibraron los niveles de ganancia/volumen para que los nuevos efectos sonoros mantuvieran un equilibrio adecuado respecto a los sonidos base de V3.
- Tras las primeras pruebas auditivas, se redujo ligeramente el volumen específico del caballo para evitar saturación.

Antes de llegar a esta solución se probaron sonidos sintetizados por código (que se confundían con golpes o ruido blanco) y audios enlazados externamente (que presentaban fallos de carga), por lo que la integración local en el HTML resultó ser la opción más estable.

---

## 3. Qué se mantuvo de V3

- El diseño general de la interfaz, la pista visual y los controles de inicio/reinicio de la carrera.
- La **duración estándar de ocho segundos**, los cálculos de distancia y la representación angular del avance.
- La comunicación entre la interfaz web y la placa Arduino mediante **Web Serial**.
- El mecanismo físico de **dos servomotores y dos brazos** que representan a los competidores.
- Los controles de escucha individual (previsualización de sonido) y la calibración de la maqueta.

**No se modificó el programa de Arduino** en esta iteración; todos los cambios se concentraron en la interfaz web.

---

## 4. Pendiente: interacción física y próximas pruebas

La recomendación de R3 de **dar mayor protagonismo a la interacción física** sigue abierta. Como siguiente paso, se evaluará la propuesta del profesor de implementar **códigos QR asociados a los once animales** directamente sobre la maqueta, permitiendo que el usuario seleccione al competidor desde el montaje físico y no exclusivamente desde la pantalla.

**Esto constituye una línea de desarrollo futura, no una funcionalidad disponible actualmente.** Asimismo, queda pendiente validar esta actualización con usuarios reales, verificar el balance sonoro en conjunto y registrar el funcionamiento completo en una nueva prueba audiovisual.

---

## 5. Archivos y registro

- **`maqueta.html`** — Interfaz actualizada de la maqueta con la selección de once animales y los nuevos audios integrados.
- **Programa Arduino (`../v2-pruebas-arduino/carrera_servos.ino`)** — Se mantiene sin cambios para el control de los dos servomotores.
- **`../v3-pruebas-usuarios/README.md`** — Documenta el estado anterior de la interfaz y las evaluaciones que motivaron esta iteración.

**Evidencia por agregar:**
- Video de esta actualización funcionando en sincronía con la maqueta física.
- Observaciones recogidas tras las pruebas de escucha con usuarios.
- Enlace al commit correspondiente en el repositorio de GitHub.

> Este registro documenta un **avance posterior a R3**. La versión final y la documentación consolidada de la Entrega 2 se completarán una vez implementados o descartados justificadamente los cambios de interacción física pendientes.
