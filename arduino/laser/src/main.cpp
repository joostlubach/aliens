#include <Arduino.h>

const int laserPins[] = {14, 15, 16, 17};
const int laserPinCount = sizeof(laserPins) / sizeof(laserPins[0]);

const int melody[] = {1, 3, 3, 3, 1, 4, 2, 3};
const int melodyLength = sizeof(melody) / sizeof(melody[0]);

bool laserOn[4] = {false, false, false, false};
int melodyIndex = 0;

void onLaserOn(int laser);
void playSound(int laser);
void melodyComplete();
void melodyFailed();

void setup() {
  Serial.begin(115200);
  
  for (int i = 0; i < laserPinCount; i++) {
    pinMode(laserPins[i], INPUT);
  }
}

void loop() {
  for (int i = 0; i < laserPinCount; i++) {
    int value = digitalRead(laserPins[i]);
    Serial.println(value);

    if (value == HIGH && !laserOn[i]) {
      laserOn[i] = true;
      onLaserOn(i);
    } else if (value == LOW && laserOn[i]) {
      laserOn[i] = false;
    }
  }
  delay(50);
}

void onLaserOn(int laser) {
  Serial.printf("Laser %d is on\n", laser);
  playSound(laser);

  if (laser == melody[melodyIndex]) {
    melodyIndex++;
    if (melodyIndex == melodyLength) {
      melodyComplete();
      melodyIndex = 0;
    }
  } else {
    melodyFailed();
    melodyIndex = 0;
  }
}

void playSound(int laser) {
  Serial.printf("Playing sound for laser %d", laser);
}

void melodyComplete() {
  Serial.println("Melody complete");
}

void melodyFailed() {
  Serial.println("Melody failed");
}