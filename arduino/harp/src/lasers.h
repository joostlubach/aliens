#ifndef LASERS_H
#define LASERS_H

void setupLasers();

void turnOnLaser(int laser);
void turnOffLaser(int laser);

void turnOnAllLasers(int interval);
void turnOffAllLasers(int interval);

#endif