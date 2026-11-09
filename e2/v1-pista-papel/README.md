# E2 — Versión 1: Pista física de papel

**Proyecto:** ¿Le ganas al animal?  
**Fecha de la versión:** 3 de noviembre de 2026  
**Estado:** Primera maqueta presentada en la R1.

## Objetivo

Explorar cómo transformar nuestra visualización digital de la E1 en una representación física de las diferencias de rapidez entre animales y seres humanos.

Nuestra propuesta inicial consistió en utilizar una pista atlética con figuras de papel, donde cada participante representaría un animal o una persona.

## Materiales

- Pista atlética impresa en papel.
- Figuras impresas de una tortuga, un guepardo, un halcón y un ser humano.
- Página web desarrollada durante la E1.

## Idea de funcionamiento

La propuesta consiste en representar cuánto recorrería cada participante durante un intervalo común de ocho segundos, utilizando los datos de rapidez de nuestra página web.

La posición de cada figura sobre la pista representaría una distancia calculada a partir de su rapidez.

En esta primera versión no se implementaron mecanismos automáticos ni sensores. La maqueta permitía explicar y discutir la idea mediante una simulación manual.

## Sonificación y actuadores propuestos

En esta primera versión presentamos únicamente una maqueta de papel, compuesta por una pista atlética y figuras que representaban a los participantes. No implementamos sensores, actuadores ni reprodujimos sonidos durante la demostración.

Sin embargo, desde el inicio contemplamos incorporar la sonificación desarrollada durante la E1 como parte de la experiencia físico-digital.

Nuestra intención era que el sonido complementara la representación física de las distancias, permitiendo percibir diferencias de rapidez entre los participantes.

Durante la primera revisión, el profesor nos preguntó qué actuadores utilizaríamos. Respondimos que considerábamos los parlantes del computador como actuadores de salida sonora, ya que permitirían reproducir la sonificación.

Esta conversación nos permitió identificar que todavía debíamos definir cómo sincronizar el sonido con el desplazamiento de las figuras y cómo integrar la maqueta física con nuestra página web.

**Estado en V1:** sonificación propuesta, no implementada ni demostrada físicamente.

## Primera revisión docente (R1)

Durante la primera revisión presentamos la pista y planteamos distintas preguntas sobre el funcionamiento de la propuesta.

Las principales dudas fueron:

1. **Escala física:** cómo representar en una pista de tamaño limitado las diferencias de rapidez entre animales muy lentos y muy rápidos.
2. **Movimiento:** cómo conseguir que las figuras avanzaran físicamente por la pista.
3. **Conexión físico-digital:** si convenía enviar datos desde la página web hacia la maqueta o desde una interacción física hacia el computador.
4. **Representación de datos:** cómo lograr que la posición de cada participante representara una distancia calculada y no un desplazamiento arbitrario.

El profesor nos recomendó probar distintas alternativas para evaluar su funcionamiento, sin establecer un mecanismo definitivo.

Durante la revisión, el profesor nos preguntó qué sensores y actuadores contemplábamos para nuestra propuesta.

Identificamos los parlantes como posibles actuadores sonoros, aprovechando la sonificación que ya existía en nuestra página web de la E1.

El profesor nos recomendó experimentar con distintas alternativas para determinar qué mecanismos podían funcionar y cuáles aportaban realmente a la experiencia.

## Problemas identificados

- No teníamos una escala definida para transformar las distancias calculadas en centímetros sobre la pista.
- Las velocidades de los animales seleccionados eran muy diferentes.
- El movimiento de las figuras todavía dependía de una simulación manual.
- La página web y la pista física aún no estaban conectadas.
- No estaba completamente definida la interacción del usuario con el prototipo.

## Aprendizajes y próximos pasos

La V1 permitió identificar que representar los datos físicamente implica resolver problemas de escala, movimiento e interacción que no aparecían de la misma manera en la página web.

Después de la R1 decidimos explorar mecanismos con Arduino, servomotores y piezas LEGO para comprobar si era viable incorporar movimiento físico a los participantes.

## Evidencia

- Fotografía de la pista y las figuras utilizadas durante la R1.
- Guía de preparación de la primera revisión.

**Nota:** La fotografía corresponde a la V1 presentada el 3 de noviembre, aunque se incorporó posteriormente al repositorio.
