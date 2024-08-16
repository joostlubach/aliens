import { games } from './data'

export type GameName = (typeof games)[number]

export enum GameStatus {
  Available,
  Started,
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
  key:     string
  type:    'letter'
  letter?: string
}