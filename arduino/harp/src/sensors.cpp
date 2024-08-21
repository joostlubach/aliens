#include <vector>
#include <Arduino.h>

#include "sound.h"

#define SENSORS_ENABLED 1

#define SENSOR_COUNT 4

const int sensorPins[SENSOR_COUNT] = {
  /* G: */ 35,
  /* B: */ 34,
  /* C: */ 19,
  /* D: */ 22
};

bool sensorHigh[SENSOR_COUNT] = {true, true, true, true};

bool enabled = false;

void setupSensors() {
  for (int i = 0; i < SENSOR_COUNT; i++) {
    pinMode(sensorPins[i], INPUT);
    sensorHigh[i] = digitalRead(sensorPins[i]) == HIGH;
  }
}

void enableSensors() {
  enabled = true;
}

void disableSensors() {
  enabled = false;
}

std::vector<Note> checkNotes() {
  std::vector<Note> notes = std::vector<Note>();
  #if !SENSORS_ENABLED
  return notes;
  #endif
  if (!enabled) { return notes; }

  for (int i = 0; i < SENSOR_COUNT; i++) {
    int value = digitalRead(sensorPins[i]);
    // if (i == 0) {
    //   Serial.printf("Sensor %d: %d\n", i, value);
    // }
    
    if (value == LOW && sensorHigh[i]) {
      sensorHigh[i] = false;
    } else if (value == HIGH && !sensorHigh[i]) {
      sensorHigh[i] = true;
      notes.push_back((Note)i);
    }
  }

  return notes;
}