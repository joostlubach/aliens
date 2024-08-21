#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>

#include "cup.h"
#include "images.h"

#define CUP_H 80
#define CUP_W 51
#define CUP_Y 24

#define CUP1_X 68
#define CUP2_X 152
#define CUP3_X 236

#define LEVEL_INDICATOR_Y 134
#define ALCOHOL_INDICATOR_Y 171
#define SEDIMENT_INDICATOR_Y 208

#define CUP1_INDICATOR_X 86
#define CUP2_INDICATOR_X 170
#define CUP3_INDICATOR_X 254

// LINKS: 500 LEEG
// LINKS: 1100 1/3 VOL
// LINKS: 1500 2/3 VOL

// MIDDEN: 500 LEEG
// MIDDEN: 1530 1/3 VOL
// MIDDEN: 2600 2/3 VOL

// RECHTS: 500 LEEG
// RECHTS: 850 1/3 VOL
// RECHTS: 1500 2/3 VOL

#define CUP1_LEVEL_EMPTY 500.0
#define CUP1_LEVEL_ONE_THIRD 1100.0
#define CUP1_LEVEL_TWO_THIRDS 1500.0

#define CUP2_LEVEL_EMPTY 500.0
#define CUP2_LEVEL_ONE_THIRD 1100.0
#define CUP2_LEVEL_TWO_THIRDS 1800.0

#define CUP3_LEVEL_EMPTY 500.0
#define CUP3_LEVEL_ONE_THIRD 850.0
#define CUP3_LEVEL_TWO_THIRDS 1500.0

#define LEVEL_MAX 5300.0

#define BLUE 0x347C

void drawCup(Adafruit_ILI9341 *tft, Cup *cup, float empty, float oneThirds, float twoThirds, int cupX, int indicatorX);

void draw(Adafruit_ILI9341 *tft, Cup *cup1, Cup *cup2, Cup *cup3) {
  drawCup(tft, cup1, CUP1_LEVEL_EMPTY, CUP1_LEVEL_ONE_THIRD, CUP2_LEVEL_TWO_THIRDS, CUP1_X, CUP1_INDICATOR_X);
  drawCup(tft, cup2, CUP2_LEVEL_EMPTY, CUP2_LEVEL_ONE_THIRD, CUP2_LEVEL_TWO_THIRDS, CUP2_X, CUP2_INDICATOR_X);
  drawCup(tft, cup3, CUP3_LEVEL_EMPTY, CUP3_LEVEL_ONE_THIRD, CUP2_LEVEL_TWO_THIRDS, CUP3_X, CUP3_INDICATOR_X);
}

const uint16_t *indicatorForStatus(int status) {
  if (status < 0) { return higher; }
  if (status > 0) { return lower; }
  return ok;
}

int calculateHeight(float value, float empty, float oneThird, float twoThirds) {
  if (value <= empty) {
    return 0;
  } else if (value <= oneThird) {
    return (value - empty) / (oneThird - empty) * (float)CUP_H / 3.0;
  } else if (value <= twoThirds) {
    return ((value - oneThird) / (twoThirds - oneThird) + 1.0) * (float)CUP_H / 3.0;
  } else {
    return min((float)CUP_H, ((value - oneThird) / (twoThirds - oneThird) + (float)2.0) * (float)CUP_H / (float)3.0);
  }
}

void drawCup(Adafruit_ILI9341 *tft, Cup *cup, float empty, float oneThird, float twoThirds, int cupX, int indicatorX) {
  int height = calculateHeight(cup->averageLiquid(), empty, oneThird, twoThirds);

  // Draw the part above the level white, and the part below blue.
  tft->fillRect(cupX, CUP_Y, CUP_W, CUP_H - height, ILI9341_WHITE);
  tft->fillRect(cupX, CUP_Y + CUP_H - height, CUP_W, height, BLUE);

  // Draw the indicators
  
  if (cup->limits.liquid_min != UNDEFINED || cup->limits.liquid_max != UNDEFINED) {
    const uint16_t *indicator = indicatorForStatus(cup->liquidStatus());
    tft->drawRGBBitmap(indicatorX, LEVEL_INDICATOR_Y, indicator, INDICATOR_WIDTH, INDICATOR_HEIGHT);
  }

  if (cup->limits.alcohol_min != UNDEFINED || cup->limits.alcohol_max != UNDEFINED) {
    const uint16_t *indicator = indicatorForStatus(cup->alcoholStatus());
    tft->drawRGBBitmap(indicatorX, ALCOHOL_INDICATOR_Y, indicator, INDICATOR_WIDTH, INDICATOR_HEIGHT);
  }

  if (cup->limits.turbidity_min != UNDEFINED || cup->limits.turbidity_max != UNDEFINED) {
    const uint16_t *indicator = indicatorForStatus(cup->turbidityStatus());
    tft->drawRGBBitmap(indicatorX, SEDIMENT_INDICATOR_Y, indicator, INDICATOR_WIDTH, INDICATOR_HEIGHT);
  }
}
