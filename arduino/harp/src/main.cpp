#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <SPI.h>

#include "harp.h"

// Definieer de pinnen
#define TFT_CS     5
#define TFT_RST    17
#define TFT_DC     16
#define TFT_LED    4
#define TFT_MOSI   23
#define TFT_CLK    18
#define TFT_MISO   -1  // Niet nodig voor dit display

// Maak een object voor het scherm aan
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_RST);

void setup() {
  // Start de seriële communicatie voor debugging
  Serial.begin(115200);

  pinMode(TFT_LED, OUTPUT);
  digitalWrite(TFT_LED, HIGH);

  // Initialiseer het display
  tft.begin();

  tft.drawRGBBitmap(0, 0, harp, HARP_WIDTH, HARP_HEIGHT);
}

void loop() {
  tft.writeCommand(ILI9341_DISPOFF);
  tft.writeCommand(ILI9341_SLPIN);
  digitalWrite(TFT_LED, LOW);
  delay(5000);

  tft.writeCommand(ILI9341_SLPOUT);
  tft.writeCommand(ILI9341_DISPON);
  digitalWrite(TFT_LED, HIGH);
  delay(5000);

  // tft.fillRect(0, 164, BACKGROUND_WIDTH, 72, ILI9341_WHITE);
  // tft.fillRect(12, 164, BACKGROUND_WIDTH - 2 * 12, 1, ILI9341_BLACK);
  // tft.fillRect(12, 182, BACKGROUND_WIDTH - 2 * 12, 1, ILI9341_DARKGREY);
  // tft.fillRect(12, 200, BACKGROUND_WIDTH - 2 * 12, 1, ILI9341_DARKGREY);
  // tft.fillRect(12, 218, BACKGROUND_WIDTH - 2 * 12, 1, ILI9341_DARKGREY);
  // tft.fillRect(12, 236, BACKGROUND_WIDTH - 2 * 12, 1, ILI9341_DARKGREY);

  // tft.drawRGBBitmap(0, 164, notes, NOTES_WIDTH, NOTES_HEIGHT);

}
