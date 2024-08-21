#ifndef TYPES_H
#define TYPES_H

#include <vector>

#define UNDEFINED -1

typedef struct {
  std::vector<int> liquid;
  std::vector<int> alcohol;
  std::vector<int> turbidity;
} CupLevels;

typedef struct {
  int liquid_min;
  int liquid_max;

  int alcohol_min;
  int alcohol_max;

  int turbidity_min;
  int turbidity_max;
} CupLimits;

#endif