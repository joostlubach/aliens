#define UNDEFINED -1

typedef struct {
  int level;
  int alcohol;
  int sediment;
} CupLevels;

typedef struct {
  int level_min;
  int level_max;

  int alcohol_min;
  int alcohol_max;

  int sediment_min;
  int sediment_max;
} CupLimits;

typedef struct {
  CupLimits limits;
  CupLevels levels;
} Cup;