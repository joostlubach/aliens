#include <Arduino.h>

#include "keypad_setup.h"
#include "lasers.h"
#include "sensors.h"
#include "sound.h"
#include "code.h"
#include "display.h"

#define TEST_SOUND 0

const Note melody[] = {G, C, C, C, G, D, B, C};
const int melodyLength = sizeof(melody) / sizeof(melody[0]);

bool started = false;
int melodyIndex = 0;

void startGame();
void onNotePlayed(Note note);
void onGameComplete();
void reset();

void setup() {
  Serial.begin(115200);
  Serial.println("-------- START --------");

  setupDisplay();
  setupKeypad();
  setupLasers();
  setupSensors();
  setupSound();

  reset();
  Serial.println("Laser harp ready");
}

void loop() {
  char digit = keypad.getKey();
  if (digit != NO_KEY) {
    #if TEST_SOUND
    if (digit >= '0' && digit <= '9') {
      playSound(digit - '0');
    }
    #else
    DigitResult result = digitEntered(digit);
    if (!started) {
      String code = getCode();
      printCode(code);
    }
  
    if (result == DigitResult::RESET) {
      Serial.println("RESET");
      reset();
    } else if (!started && result == DigitResult::INVALID_INPUT) {
      playErrorBeep();
      flashDisplay();
      resetCode();
      printCode("****");
    } else if (!started && result == DigitResult::CORRECT_CODE) {
      startGame();
      resetCode();
    }
    #endif
  }

  if (started) {
    for (Note note : checkNotes()) {
      onNotePlayed(note);
    }
  }

  delay(50);
}

void startGame() {
  started = true;
  Serial.println("Game started!");
  playOpeningTune();
  showHarp();
  turnOnAllLasers(100);
  enableSensors();
}

void onNotePlayed(Note note) {
  Serial.printf("NOTE: %d\n", note);
  playNote(note);

  if (note == melody[melodyIndex]) {
    melodyIndex++;
    if (melodyIndex == melodyLength) {
      onGameComplete();
      melodyIndex = 0;
    }
  } else {
    reset();
    melodyIndex = 0;
  }
}

void onGameComplete() {
  Serial.println("Melody complete");

  // Wait for the last note to finish playing.
  delay(800);

  playVictoryTune();
  victoryDemo();
}

void reset() {
  melodyIndex = 0;
  started = false;
  stopPlayback();
  disableSensors();
  resetCode();
  printCode("****");
}
