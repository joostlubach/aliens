#include <Arduino.h>
#include <Keypad.h>

#include "code.h"

const char validCodes[][5] = {
  "4321",
};

char *current = new char[5] {0, 0, 0, 0, 0};
int currentLength = 0;

void resetCode();

DigitResult digitEntered(char digit) {
  if (digit == '#') {
    resetCode();
    return DigitResult::INCOMPLETE;
  }

  if (currentLength < 4) {
    current[currentLength++] = digit;
  }
  if (currentLength < 4) {
    return DigitResult::INCOMPLETE;
  }

  Serial.printf("Code entered: %s\n", current);

  for (const char *code : validCodes) {
    if (strcmp(current, "****") == 0) {
      return DigitResult::RESET;
    }
    if (strcmp(current, code) == 0) {
      return DigitResult::CORRECT_CODE;
    }
  }

  resetCode();
  return DigitResult::INVALID_INPUT;
}

const String getCode() {
  String code = "";
  for (int i = 0; i < 4; i++) {
    if (i < currentLength) {
      code += current[i];
    } else {
      code += '*';
    }
  }
  return code;
}

void resetCode() {
  for (int i = 0; i < 5; i++) {
    current[i] = '\0';
  }
  currentLength = 0;
}