#include <Arduino.h>

#include "lasers.h"

#define LASER_COUNT 4

const int laserPins[LASER_COUNT] = {26, 27, 12, 14};

void setupLasers() {
    for (int i = 0; i < LASER_COUNT; i++) {
    pinMode(laserPins[i], OUTPUT);
  }
}

void turnOnLaser(int laser) {
  digitalWrite(laserPins[laser], LOW);
}

void turnOfLaser(int laser) {
  digitalWrite(laserPins[laser], HIGH);
}

void turnOnAllLasers(int interval) {
  for (int i = 0; i < LASER_COUNT; i++) {
    turnOnLaser(i);
    delay(interval);
  }
}

void victoryDemo() {
  for (int i = 0; i < 100; i++) {
    digitalWrite(laserPins[0], LOW);
    delay(50);
    digitalWrite(laserPins[1], LOW);
    delay(50);
    digitalWrite(laserPins[2], LOW);
    delay(50);
    digitalWrite(laserPins[3], LOW);
    delay(50);
    digitalWrite(laserPins[0], HIGH);
    delay(50);
    digitalWrite(laserPins[1], HIGH);
    delay(50);
    digitalWrite(laserPins[2], HIGH);
    delay(50);
    digitalWrite(laserPins[3], HIGH);
    delay(50);
  }
}