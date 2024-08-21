#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <SPI.h>
#include <vector>

#include "types.h"
#include "cup.h"
#include "images.h"

// Definieer de pinnen
#define TFT_CS     5
#define TFT_CLK    18
#define TFT_MOSI   23
#define TFT_DC     22

#define TFT_LED    32
#define TFT_RST    33

#define TFT_MISO   -1  // Niet nodig voor dit display

#define LEVEL_1 26
#define LEVEL_2 27
#define LEVEL_3 25

#define ALCOHOL 35
#define TURBIDITY 34

#define MIN_ALCOHOL 2300
#define MAX_ALCOHOL 2500

#define MIN_TURBIDITY 500
#define MAX_TURBIDITY 100

int correctCount = 0;
bool showingCocktail = false;


// LINKS: 500 LEEG
// LINKS: 1100 1/3 VOL
// LINKS: 1900 2/3 VOL

// MIDDEN: 500 LEEG
// MIDDEN: 1530 1/3 VOL
// MIDDEN: 2330 2/3 VOL

// RECHTS: 500 LEEG
// RECHTS: 850 1/3 VOL
// RECHTS: 1100 2/3 VOL

// Maak een object voor het scherm aan
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_MOSI, TFT_CLK, TFT_RST);

Cup cup1 = Cup({
  liquid_min: 600, liquid_max: 2100,
  alcohol_min: UNDEFINED, alcohol_max: UNDEFINED,
  turbidity_min: UNDEFINED, turbidity_max: UNDEFINED,
});

Cup cup2 = Cup({
  liquid_min: 1200, liquid_max: 2800,
  alcohol_min: UNDEFINED, alcohol_max: UNDEFINED,
  turbidity_min: MIN_TURBIDITY, turbidity_max: MAX_TURBIDITY,
});

Cup cup3 = Cup({
  liquid_min: 500, liquid_max: 1700,
  alcohol_min: MIN_ALCOHOL, alcohol_max: MAX_ALCOHOL,
  turbidity_min: UNDEFINED, turbidity_max: UNDEFINED,
});

void draw(Adafruit_ILI9341 *tft, Cup *cup1, Cup *cup2, Cup *cup3);
void measure();

void showCocktail() {
  if (showingCocktail) { return; }
  tft.drawRGBBitmap(0, 0, cocktail, COCKTAIL_WIDTH, COCKTAIL_HEIGHT); 
  showingCocktail = true;
}

void showQR() {
  if (!showingCocktail) { return; }
  tft.drawRGBBitmap(0, 0, qr, COCKTAIL_WIDTH, COCKTAIL_HEIGHT); 
  showingCocktail = false;
}

void reset() {
  showCocktail();
}

void setup() {
  // Start de seriële communicatie voor debugging
  Serial.begin(115200);

  pinMode(TFT_LED, OUTPUT);
  digitalWrite(TFT_LED, HIGH);

  pinMode(LEVEL_1, INPUT);
  pinMode(LEVEL_2, INPUT);
  pinMode(LEVEL_3, INPUT);
  pinMode(ALCOHOL, INPUT);
  pinMode(TURBIDITY, INPUT);

  // Initialiseer het display
  tft.begin();
  tft.setRotation(1);

  reset();
  Serial.println("Started");
}

void loop() {
  measure();
  Serial.printf("Levels: %d, %d, %d\n", cup1.averageLiquid(), cup2.averageLiquid(), cup3.averageLiquid());
  // Serial.printf("Alcohol: %d, %d, %d\n", cup1.levels.alcohol, cup2.levels.alcohol, cup3.levels.alcohol);
  // Serial.printf("Turbidity: %d, %d, %d\n", cup1.levels.turbidity, cup2.levels.turbidity, cup3.levels.turbidity);

  if (showingCocktail) {
    draw(&tft, &cup1, &cup2, &cup3);
  }

  delay(500);

  if (cup1.ok() && cup2.ok() && cup3.ok()) {
    if (++correctCount >= 4) {
      showQR();
    }
  } else {
    correctCount == 0;
    showCocktail();
  }
}

void measure() {
  cup1.appendLiquid(analogRead(LEVEL_1));
  cup2.appendLiquid(analogRead(LEVEL_2));
  cup3.appendLiquid(analogRead(LEVEL_3));

  cup2.appendTurbidity(analogRead(TURBIDITY));
  cup3.appendAlcohol(analogRead(ALCOHOL));
}