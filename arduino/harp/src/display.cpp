#include <Arduino.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <Fonts/FreeSans12pt7b.h>

#include "images.h"

#define TFT_CS     5
#define TFT_RST    4
#define TFT_DC     2
#define TFT_LED    15
#define TFT_MOSI   23
#define TFT_CLK    18

#define DIGIT_WIDTH  36
#define DIGIT_HEIGHT 36

Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_RST);

void setupDisplay() {
  pinMode(TFT_LED, OUTPUT);

  tft.begin();
  tft.setRotation(1);
  tft.writeCommand(ILI9341_DISPON);
  tft.writeCommand(ILI9341_SLPOUT);
  digitalWrite(TFT_LED, HIGH);
}

void printCode(String code) {
  Serial.printf("Printing code: %s\n", code);
  tft.fillScreen(ILI9341_BLACK);
  tft.setCursor((320 - DIGIT_WIDTH * 7) / 2, (240 - DIGIT_HEIGHT) / 2);
  tft.setTextColor(ILI9341_GREEN);
  tft.setTextSize(6);

  String text;
  for (int i = 0; i < code.length(); i++) {
    text += code[i];
    if (i != code.length() - 1) {
      text += " ";
    }
  }
  tft.print(text);
}

void turnDisplayOn() {
  tft.writeCommand(ILI9341_DISPON);
  tft.writeCommand(ILI9341_SLPOUT);
  digitalWrite(TFT_LED, HIGH);
}

void turnDisplayOff() {
  tft.writeCommand(ILI9341_SLPIN);
  tft.writeCommand(ILI9341_DISPOFF);
  digitalWrite(TFT_LED, LOW);
}

void showHarp() {
  turnDisplayOff();
  tft.drawRGBBitmap(0, 0, harp, HARP_WIDTH, HARP_HEIGHT);
  turnDisplayOn();
}

void flashDisplay() {
  turnDisplayOff();
  delay(100);
  turnDisplayOn();
  delay(100);
  turnDisplayOff();
  delay(100);
  turnDisplayOn();
  delay(100);
}
