import { action, makeObservable, observable } from 'mobx'

export class GameStore {

  constructor() {
    makeObservable(this)
  }

  @observable
  public statuses = {
    cocktail:   GameStatus.Unavailable,
    colander:   GameStatus.Unavailable,
    crop:       GameStatus.Unavailable,
    invitation: GameStatus.Unavailable,
  }

  @action
  public setStatus(game: GameName, status: GameStatus) {
    this.statuses[game] = status
  }

}

export enum GameStatus {
  Unavailable,
  Unfinished,
  Finished
}

export type GameName = keyof GameStore['statuses']