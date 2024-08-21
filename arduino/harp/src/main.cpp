#include <Arduino.h>

#include "keypad_setup.h"
#include "lasers.h"
#include "sensors.h"
#include "sound.h"
#include "code.h"
#include "display.h"

#define TEST_SOUND 0
#define TEST_LASER 0
#define START_IMMEDIATELY 0

const Note melody[] = {G, C, C, C, G, D, B, C};
const int melodyLength = sizeof(melody) / sizeof(melody[0]);

bool started = false;
std::vector<Note> playedNotes = std::vector<Note>();

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

  delay(1000);
  turnOffAllLasers(100);

  reset();
  #if START_IMMEDIATELY
  startGame();
  #endif
  Serial.println("Laser harp ready");
}

void loop() {
  char digit = keypad.getKey();
  if (digit != NO_KEY) {
    #if TEST_SOUND
    if (digit >= '0' && digit <= '9') {
      Serial.printf("Digit: %c\n", digit);
      soundtestDigit(digit);
    }
    #elif TEST_LASER
    if (digit == '1') {
      turnOnLaser(0);
    } else {
      turnOffLaser(0);
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
  enableSensors();
  delay(500);
  turnOnAllLasers(100);
}

void onNotePlayed(Note note) {
  Serial.printf("NOTE: %d\n", note);
  playNote(note);

  // Keep a rolling window.
  playedNotes.push_back(note);
  while (playedNotes.size() > melodyLength) {
    playedNotes.erase(playedNotes.begin());
  }

  bool match = true;
  if (playedNotes.size() == melodyLength) {
    for (int i = 0; i < melodyLength; i++) {
      if (playedNotes[i] != melody[i]) {
        match = false;
        break;
      }
    }
  } else {
    match = false;
  }

  Serial.printf("Played notes: ");
  for (Note note : playedNotes) {
    Serial.printf("%d ", note);
  }
  Serial.println();

  Serial.printf("Matches? %d\n ", match);

  if (match) {
    onGameComplete();
    playedNotes.clear();
  }
}

void onGameComplete() {
  Serial.println("Melody complete");
  started = false;

  // Wait for the last note to finish playing.
  delay(800);

  showVictory();
  playVictoryTune();
  turnOffAllLasers(100);

  delay(16000);
  reset();
}

void reset() {
  playedNotes.clear();
  started = false;
  stopPlayback();
  disableSensors();
  resetCode();
  printCode("****");
  turnOffAllLasers(100);
}
