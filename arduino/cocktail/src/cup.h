#ifndef CUP_H
#define CUP_H

#include "types.h"

#define ROLLING_WINDOW 4

inline const int average(std::vector<int> values) {
  if (values.size() == 0) { return UNDEFINED; }

  int total = 0;
  for (int value : values) {
    total += value;
  }

  return total / values.size();
}

inline void append(std::vector<int> *vec, int value) {
  vec->push_back(value);

  while (vec->size() > ROLLING_WINDOW) {
    vec->erase(vec->begin());
  }
}

inline const int status(int level, int min, int max, bool inverse) {
  if (!inverse) {
    if (min != UNDEFINED && level < min) { return -1; }
    if (max != UNDEFINED && level > max) { return 1; }
  } else {
    if (min != UNDEFINED && level > min) { return -1; }
    if (max != UNDEFINED && level < max) { return 1; }
  }
  return 0;
}


class Cup {

  public:
    CupLimits limits;
    CupLevels levels;


    Cup(CupLimits limits) {
      this->limits = limits;
    }

    void appendLiquid(int value) {
      append(&this->levels.liquid, value);
    }

    void appendAlcohol(int value) {
      append(&this->levels.alcohol, value);
    }

    void appendTurbidity(int value) {
      append(&this->levels.turbidity, value);
    }

    int averageLiquid() {
      return average(this->levels.liquid);
    }

    int averageAlcohol() {
      return average(this->levels.alcohol);
    }

    int averageTurbidity() {
      return average(this->levels.turbidity);
    }

    int liquidStatus() {
      return status(this->averageLiquid(), this->limits.liquid_min, this->limits.liquid_max, false);
    }

    int turbidityStatus() {
      return status(this->averageTurbidity(), this->limits.turbidity_min, this->limits.turbidity_max, true);
    }

    int alcoholStatus() {
      // HACK; the alcoholsensor is not accurate enough.
      return this->liquidStatus();
      // return status(this->averageAlcohol(), this->limits.alcohol_min, this->limits.alcohol_max, false);
    }

    bool ok() {
      if (this->liquidStatus() != 0) { return false; }
      if (this->limits.alcohol_min != UNDEFINED || this->limits.alcohol_max != UNDEFINED) {
        if (this->alcoholStatus() != 0) { return false; }
      }
      if (this->limits.turbidity_min != UNDEFINED || this->limits.turbidity_max != UNDEFINED) {
        if (this->turbidityStatus() != 0) { return false; }
      }

      return true;
    }

};

#endif