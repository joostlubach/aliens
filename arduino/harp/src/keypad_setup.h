#include <Keypad.h>

const byte ROWS = 4;  // four rows
const byte COLS = 3;  // three columns

// Define the key map - the layout of the keys on the keypad
char keys[ROWS][COLS] = {
  {'1','2','3'},
  {'4','5','6'},
  {'7','8','9'},
  {'*','0','#'}
};

// Connect keypad ROW0, ROW1, ROW2, ROW3 to these pins
byte rowPins[ROWS] = {25, 13, 12, 27};

// Connect keypad COL0, COL1, COL2 to these pins
byte colPins[COLS] = {26, 33, 14};

// Create the Keypad object
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

void setupKeypad() {
  for (int i = 0; i < ROWS; i++) {
    pinMode(rowPins[i], INPUT);
  }
  for (int i = 0; i < COLS; i++) {
    pinMode(colPins[i], INPUT);
  }
}