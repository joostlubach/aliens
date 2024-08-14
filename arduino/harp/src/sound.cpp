#include <HardwareSerial.h>
#include <DFPlayerMini_Fast.h>

#include "sound.h"

#define VICTORY 5
#define ERROR 7

// Maak een object voor het scherm aan
HardwareSerial gd3200(2);
DFPlayerMini_Fast df;

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

int soundForNote(Note note) {
  switch (note) {
    case G: return 2;
    case B: return 3;
    case C: return 4;
    case D: return 1;
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