#ifndef CODE_H
#define CODE_H

typedef enum {
  INCOMPLETE,

  CORRECT_CODE,
  RESET,
  INVALID_INPUT,
} DigitResult;

DigitResult digitEntered(char digit);
const String getCode();
void resetCode();

#endif