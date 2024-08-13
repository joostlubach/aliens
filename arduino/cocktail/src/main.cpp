#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <SPI.h>

#include "types.h"
#include "images.h"

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

#define MIN_LEVEL 1200
#define MAX_LEVEL 1800

Cup cup1 = {
  {
    level_min: MIN_LEVEL, level_max: MAX_LEVEL,
    alcohol_min: UNDEFINED, alcohol_max: UNDEFINED,
    sediment_min: UNDEFINED, sediment_max: UNDEFINED,
  },
  { 0, 0, 0 },
};

Cup cup2 = {
  {
    level_min: MIN_LEVEL, level_max: MAX_LEVEL,
    alcohol_min: 430, alcohol_max: 630,
    sediment_min: UNDEFINED, sediment_max: UNDEFINED,
  },
  { 0, 0, 0 },
};

Cup cup3 = {
  {
    level_min: MIN_LEVEL, level_max: MAX_LEVEL,
    alcohol_min: UNDEFINED, alcohol_max: UNDEFINED,
    sediment_min: 200, sediment_max: 1000,
  },
  { 0, 0, 0 },
};

void draw(Adafruit_ILI9341 *tft, Cup *cup1, Cup *cup2, Cup *cup3);
void measure();

void setup() {
  // Start de seriële communicatie voor debugging
  Serial.begin(115200);

  pinMode(TFT_LED, OUTPUT);
  digitalWrite(TFT_LED, HIGH);

  // Initialiseer het display
  tft.begin();
  tft.setRotation(1);

  tft.drawRGBBitmap(0, 0, cocktail, COCKTAIL_WIDTH, COCKTAIL_HEIGHT);
}

void loop() {
  measure();
  draw(&tft, &cup1, &cup2, &cup3);
  delay(500);
}

void measure() {
  cup1.levels.level = random(1000, 2000);

  cup2.levels.level = random(1000, 2000);
  cup2.levels.alcohol = random(200, 900);

  cup3.levels.level = random(1000, 2000);
  cup3.levels.sediment = random(200, 900);
}