#ifndef SENSORS_H
#define SENSORS_H

#include <vector>
#include "sound.h"

void setupSensors();

void enableSensors();
void disableSensors();

std::vector<Note> checkNotes();

#endif