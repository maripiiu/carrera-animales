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

### 2.1 Selección de seis animales

La galería de la maqueta se redujo de 43 opciones a seis animales:

- **Caballo de carrera** — 88 km/h.
- **Abeja** — 29 km/h.
- **Elefante** — 40 km/h.
- **Guepardo** — 120 km/h.
- **Gallina** — 14 km/h.
- **Halcón peregrino** — 389 km/h.

Se conservaron los valores de rapidez utilizados en el proyecto. La reducción busca simplificar la interacción y permitir que el equipo trabaje con mayor detalle la representación sonora de cada competidor. La carrera continúa enfrentando a **una persona contra un animal**.

### 2.2 Pasos humanos en lugar de pulsos sintetizados

Se reemplazó el sonido abstracto del humano por grabaciones de pisadas, diferenciadas según las cuatro velocidades de referencia disponibles:

| Rapidez de referencia | Movimiento representado | Audio incorporado |
| :--- | :--- | :--- |
| **5 km/h** | Caminando | `humano5.mp3` |
| **12 km/h** | Trotando | `humano12.mp3` |
| **24 km/h** | Corriendo | `humano24.wav` |
| **44,7 km/h** | Esprint | `humano44.mp3` |

La intención es que el usuario pueda **reconocer el tipo e intensidad del movimiento al escucharlo**, en lugar de interpretar solamente cambios de tono o frecuencia de pulsos. Las grabaciones son una representación auditiva; **no implican que se hayan registrado personas corriendo exactamente a esas velocidades**.

### 2.3 Galope del caballo

El sonido sintetizado del **caballo de carrera** se reemplazó por una grabación de galope (`caballito.mp3`), para distinguir más claramente los cascos del caballo de las pisadas humanas.

Los otros cinco animales **mantienen por ahora los sonidos sintetizados de V3**. Su posible reemplazo queda pendiente de nuevas pruebas y de encontrar representaciones reconocibles de sus movimientos.

### 2.4 Integración de audios y ajuste de volumen

- Las cinco grabaciones quedaron **incorporadas en el mismo archivo `maqueta.html`**, sin necesidad de cargar audios desde páginas externas.
- Se ajustaron los niveles de reproducción para que las grabaciones no sobresalieran demasiado respecto de los sonidos originales de V3.
- Tras las primeras escuchas, se redujo un poco más el volumen del caballo.

Antes de llegar a esta solución se probaron sonidos generados artificialmente y audios enlazados desde otros sitios. Los primeros se confundían con golpes o ruido, y los segundos no siempre se reproducían. Por eso se optó por trabajar con las grabaciones seleccionadas e integrarlas en el HTML.

---

## 3. Qué se mantuvo de V3

- El diseño general de la interfaz, la pista y los controles de la carrera.
- La **duración de ocho segundos**, los cálculos de distancia y la representación angular del avance.
- La comunicación entre la página y Arduino mediante **Web Serial**.
- El mecanismo físico de **dos servomotores y dos brazos** que representan a los competidores.
- Los controles de escucha individual y la calibración de la maqueta.

**No se modificó el programa de Arduino** en esta iteración. Los cambios se realizaron en el archivo de la interfaz web.

---

## 4. Pendiente: interacción física y próximas pruebas

La recomendación de R3 de **dar mayor protagonismo a la interacción física** sigue abierta. En particular, se podría evaluar la propuesta del profesor de colocar **códigos QR para los seis animales** en la maqueta, de modo que el usuario pueda elegir al competidor desde el montaje físico en lugar de hacerlo exclusivamente en la página.

**Esto es una idea para desarrollar y evaluar, no una funcionalidad disponible actualmente.** También queda pendiente probar esta actualización con usuarios, comprobar el equilibrio de los sonidos durante la carrera y evaluar si los otros animales requieren nuevas grabaciones. El funcionamiento completo con el montaje físico deberá registrarse en una nueva prueba audiovisual.

---

## 5. Archivos y registro

- **`maqueta.html`** — Interfaz de la maqueta con seis animales y cinco grabaciones incorporadas.
- **Programa Arduino de V2 (`../v2-pruebas-arduino/carrera_servos.ino`)** — Se mantiene sin cambios para el control de los dos servomotores.
- **`../v3-pruebas-usuarios/README.md`** — Documenta el estado anterior de la interfaz y las evaluaciones que motivaron V3.

**Evidencia por agregar:** video de esta actualización funcionando con la maqueta física; observaciones de nuevas pruebas; enlace al commit de GitHub y créditos de procedencia/licencia de las grabaciones utilizadas.

> Este registro documenta un **avance posterior a R3**. La versión final y la documentación de la Entrega 2 se completarán después de implementar o descartar justificadamente los cambios pendientes.
