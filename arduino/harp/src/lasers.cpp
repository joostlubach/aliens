#include <Arduino.h>

#include "lasers.h"

#define LASER_COUNT 1

const int laserPins[LASER_COUNT] = {32};

void setupLasers() {
    for (int i = 0; i < LASER_COUNT; i++) {
    pinMode(laserPins[i], OUTPUT);
  }
}

void turnOnLaser(int laser) {
  Serial.printf("Laser %d ON\n", laser);
  digitalWrite(laserPins[laser], LOW);
}

void turnOffLaser(int laser) {
  Serial.printf("Laser %d OFF\n", laser);
  digitalWrite(laserPins[laser], HIGH);
}

void turnOnAllLasers(int interval) {
  for (int i = 0; i < LASER_COUNT; i++) {
    turnOnLaser(i);
    delay(interval);
  }
}

void turnOffAllLasers(int interval) {
  for (int i = 0; i < LASER_COUNT; i++) {
    turnOffLaser(i);
    delay(interval);
  }
}