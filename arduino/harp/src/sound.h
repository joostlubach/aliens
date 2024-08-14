#ifndef SOUND_H
#define SOUND_H

typedef enum {
  G = 0,
  B = 1,
  C = 2,
  D = 3
} Note;

void setupSound();

void playSound(int sound);
void playNote(Note note);
void playOpeningTune();
void playVictoryTune();
void playErrorBeep();

void stopPlayback();

#endif