import I18next from 'i18next'

import { Trigger } from './types'

export const prompts = [
  {
    name:       'start',
    paragraphs: I18next.t('start:paragraphs') as unknown as string[],
  },
  {
    name:       'cocktail:start',
    paragraphs: I18next.t('cocktail:start.paragraphs') as unknown as string[],
  },
  {
    name:       'cocktail:complete',
    paragraphs: I18next.t('cocktail:complete.paragraphs') as unknown as string[],
  },
  {
    name:       'colander:start',
    paragraphs: I18next.t('colander:start.paragraphs') as unknown as string[],
  },
  {
    name:       'colander:complete',
    paragraphs: I18next.t('colander:complete.paragraphs') as unknown as string[],
  },
  {
    name:       'crop:start',
    paragraphs: I18next.t('crop:start.paragraphs') as unknown as string[],
  },
  {
    name:       'crop:complete',
    paragraphs: I18next.t('crop:complete.paragraphs') as unknown as string[],
  },
  {
    name:       'invitation:start',
    paragraphs: I18next.t('invitation:start.paragraphs') as unknown as string[],
  },
  {
    name:       'invitation:complete',
    paragraphs: I18next.t('invitation:complete.paragraphs') as unknown as string[],
  },
] as const

export const games = ['cocktail', 'colander', 'crop', 'invitation'] as const

export const triggers: Trigger[] = [{
  key:  '81ed78f1-3a09-425f-b39a-b90718d1cc5b',
  type: 'game:start',
  game: 'cocktail',
}, {
  key:  '9e687dd4-485a-4297-a0e5-08a9b2f536f6',
  type: 'game:complete',
  game: 'cocktail',
}, {
  key:  '921cf451-4869-424d-b3f5-823f3a22204e',
  type: 'game:start',
  game: 'colander',
}, {
  key:  'c7715b80-e2ac-4ab5-bdbe-31665e034cf7',
  type: 'game:complete',
  game: 'colander',
}, {
  key:  '8b70893b-d618-49a3-bc43-f4826bde1ac1',
  type: 'game:start',
  game: 'crop',
}, {
  key:  'db65d5ce-5d82-4988-91b4-f5f68456f0f5',
  type: 'game:complete',
  game: 'crop',
}, {
  key:  '561bcc58-bb77-4720-9075-7fb5180e5117',
  type: 'game:start',
  game: 'invitation',
}, {
  key:  '2b73ef1c-c5b7-4d2a-9a49-2e3008b04162',
  type: 'game:complete',
  game: 'invitation',
}]