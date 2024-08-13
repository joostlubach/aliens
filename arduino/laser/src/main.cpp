#include <Arduino.h>

const int laserPins[] = {A6};
const int laserPinCount = sizeof(laserPins) / sizeof(laserPins[0]);

const int melody[] = {0, 2, 2, 2, 0, 3, 1, 2};
const int melodyLength = sizeof(melody) / sizeof(melody[0]);

bool laserOn[4] = {false, false, false, false};
int melodyIndex = 0;

void onLaserOn(int laser);
void playSound(int laser);
void melodyComplete();
void melodyFailed();

void setup() {
  Serial.begin(115200);
  while (!Serial.available()) {
    delay(10);
  }
  
  for (int i = 0; i < laserPinCount; i++) {
    pinMode(laserPins[i], INPUT);
  }

  Serial.println("Laser harp ready");
}

void loop() {
  for (int i = 0; i < laserPinCount; i++) {
    int value = digitalRead(laserPins[i]);

    if (value == LOW && !laserOn[i]) {
      laserOn[i] = true;
      onLaserOn(i);
    } else if (value == HIGH && laserOn[i]) {
      laserOn[i] = false;
    }
  }
  delay(50);
}

void onLaserOn(int laser) {
  Serial.printf("LASER: %d\n", laser);
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
  // Serial.printf("SOUND: %d\n", laser);
}

void melodyComplete() {
  Serial.println("Melody complete");
  // playMusic();
  // activateLaser();
}

void melodyFailed() {
  Serial.println("Melody failed");
}