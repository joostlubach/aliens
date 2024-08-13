#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>

#include "types.h"
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

#define LEVEL_MAX 2000.0
#define ALCOHOL_MAX 1000.0
#define SEDIMENT_MAX 1000.0

#define BLUE 0x347C

void drawCup(Adafruit_ILI9341 *tft, Cup *cup, int cupX, int indicatorX);

void draw(Adafruit_ILI9341 *tft, Cup *cup1, Cup *cup2, Cup *cup3) {
  drawCup(tft, cup1, CUP1_X, CUP1_INDICATOR_X);
  drawCup(tft, cup2, CUP2_X, CUP2_INDICATOR_X);
  drawCup(tft, cup3, CUP3_X, CUP3_INDICATOR_X);
}

const uint16_t *indicatorForLevel(int level, int min, int max) {
  if (min != UNDEFINED && level < min) { return higher; }
  if (max != UNDEFINED && level > max) { return lower; }
  return ok;
}

void drawCup(Adafruit_ILI9341 *tft, Cup *cup, int cupX, int indicatorX) {
  int height = (int)round((float)cup->levels.level / LEVEL_MAX * (float)CUP_H);

  // Draw the part above the level white, and the part below blue.
  tft->fillRect(cupX, CUP_Y, CUP_W, height, ILI9341_WHITE);
  tft->fillRect(cupX, CUP_Y + height, CUP_W, CUP_H - height, BLUE);

  // Draw the indicators
  if (cup->limits.level_min != UNDEFINED || cup->limits.level_max != UNDEFINED) {
    const uint16_t *indicator = indicatorForLevel(cup->levels.level, cup->limits.level_min, cup->limits.level_max);
    tft->drawRGBBitmap(indicatorX, LEVEL_INDICATOR_Y, indicator, INDICATOR_WIDTH, INDICATOR_HEIGHT);
  }

  if (cup->limits.alcohol_min != UNDEFINED || cup->limits.alcohol_max != UNDEFINED) {
    const uint16_t *indicator = indicatorForLevel(cup->levels.alcohol, cup->limits.alcohol_min, cup->limits.alcohol_max);
    tft->drawRGBBitmap(indicatorX, ALCOHOL_INDICATOR_Y, indicator, INDICATOR_WIDTH, INDICATOR_HEIGHT);
  }

  if (cup->limits.sediment_min != UNDEFINED || cup->limits.sediment_max != UNDEFINED) {
    const uint16_t *indicator = indicatorForLevel(cup->levels.sediment, cup->limits.sediment_min, cup->limits.sediment_max);
    tft->drawRGBBitmap(indicatorX, SEDIMENT_INDICATOR_Y, indicator, INDICATOR_WIDTH, INDICATOR_HEIGHT);
  }
}
