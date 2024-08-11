import { games, prompts } from './data'

export type PromptKey = (typeof prompts[number])['name'] | '$camera'

export interface Prompt {
  name:       PromptKey
  paragraphs: string[]
}

export type GameName = (typeof games)[number]

export enum GameStatus {
  Unavailable,
  Available,
  Complete
}

export type Trigger =
  | GameStartTrigger
  | GameCompleteTrigger
  | AlienLetterTrigger


export interface GameStartTrigger {
  key:  string
  type: 'game:start'
  game: GameName
}

export interface GameCompleteTrigger {
  key:  string
  type: 'game:complete'
  game: GameName
}

export interface AlienLetterTrigger {
  key:    string
  type:   'letter'
  letter: string
}