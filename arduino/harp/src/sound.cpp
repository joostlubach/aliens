#include <HardwareSerial.h>
#include <DFPlayerMini_Fast.h>

#include "sound.h"

#define VICTORY 11
#define ERROR 7

// Maak een object voor het scherm aan
HardwareSerial gd3200(2);
DFPlayerMini_Fast df;

char *currentTest = new char[3] {0, 0};
int currentTestLength = 0;

void resetTest();
void playSound(int sound);

void setupSound() {
  pinMode(16, OUTPUT);
  pinMode(17, INPUT_PULLUP);

  gd3200.begin(9600, SERIAL_8N1, 16, 17);
  if (!df.begin(gd3200)) {
    Serial.println("DFPlayer Mini not detected!");
  }

  df.volume(30);

  int16_t numTracks = df.numSdTracks();
  Serial.printf("Number of tracks: %d\n", numTracks);
}

void soundtestDigit(char digit) {
  if (currentTestLength < 2) {
    currentTest[currentTestLength++] = digit;
  }

  if (currentTestLength >=2) {
    int sound = atoi(currentTest);
    playSound(sound);

    resetTest();
  }
}

void resetTest() {
  for (int i = 0; i < 2; i++) {
    currentTest[i] = '\0';
  }
  currentTestLength = 0;
}

int soundForNote(Note note) {
  switch (note) {
    case G: return 9;
    case B: return 1;
    case C: return 3;
    case D: return 5;
    default: return -1;
  }
}

void playSound(int sound) {
  Serial.printf("Playing sound %d\n", sound);
  df.play(sound);
}


// INTERFACE

void playNote(Note note) {
  int sound = soundForNote(note);
  playSound(sound);
}

void playOpeningTune() {
  playNote(G);
  delay(100);
  playNote(B);
  delay(100);
  playNote(C);
  delay(100);
  playNote(D);
}

void playVictoryTune() {
  playSound(VICTORY);
}

void playErrorBeep() {
  playSound(ERROR);
}

void stopPlayback() {
  df.stop();
}