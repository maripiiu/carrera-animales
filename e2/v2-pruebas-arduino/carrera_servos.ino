// Carrera de animales — maqueta con dos servos (IIC2026, Entrega 2)
//
// Conexiones:
//   Servo 1 (TÚ)    → señal (cable naranjo) al pin 5
//   Servo 2 (RIVAL) → señal (cable naranjo) al pin 6
//   Ambos servos: cable rojo a 5V y cable café a GND
//
// Cómo funciona:
//   La página maqueta.html le manda al Arduino líneas de texto como "90,30"
//   (ángulo del servo 1, ángulo del servo 2), entre 0 y 180.
//   El Arduino mueve cada servo a ese ángulo.
//
// Al encenderse, los dos servos hacen una prueba: van de 0° a 180° y vuelven.
// Si ves ese movimiento, el cableado está bien.

#include <Servo.h>

Servo servoTu;
Servo servoRival;
String linea = "";

void moverAmbos(int a, int b) {
  servoTu.write(180 - constrain(a, 0, 180));
  servoRival.write(180 - constrain(b, 0, 180));
}

void setup() {
  Serial.begin(9600);
  servoTu.attach(5);
  servoRival.attach(6);

  // Prueba de encendido: barrido completo y vuelta a la partida
  moverAmbos(0, 0);
  delay(600);
  for (int a = 0; a <= 180; a += 2) { moverAmbos(a, a); delay(15); }
  delay(400);
  for (int a = 180; a >= 0; a -= 2) { moverAmbos(a, a); delay(15); }
}

void loop() {
  while (Serial.available() > 0) {
    char c = Serial.read();
    if (c == '\n') {
      int coma = linea.indexOf(',');
      if (coma > 0) {
        int a = linea.substring(0, coma).toInt();
        int b = linea.substring(coma + 1).toInt();
        moverAmbos(a, b);
      }
      linea = "";
    } else if (c != '\r') {
      linea += c;
      if (linea.length() > 20) linea = "";  // descarta basura
    }
  }
}
