import { action, computed, makeObservable, observable } from 'mobx'

import { config } from '~/config'
import { GameName, GameStatus, Prompt, PromptKey, prompts, QRParser, Trigger } from './game'

export class GameStore {

  constructor() {
    makeObservable(this)
  }

  // #region Prompts

  @observable
  public visiblePromptNames = new Set<PromptKey>(['start'])

  @observable
  public cameraVisible: boolean = false

  @computed
  public get visiblePrompts(): Array<Prompt | '$camera'> {
    return [
      ...prompts.filter(it => this.visiblePromptNames.has(it.name)),
      ...this.cameraVisible ? ['$camera'] as const : [],
    ]
  }

  @observable
  public focusedPromptName: PromptKey | null = config.environment === 'development' ? null : 'start'

  @computed
  public get focusedPrompt() {
    if (this.focusedPromptName == null) { return null }
    return this.visiblePrompts.find(prompt => {
      if (prompt === '$camera') {
        return this.focusedPromptName === '$camera'
      } else {
        return prompt.name === this.focusedPromptName
      }
    })
  }

  public isPromptFocused(prompt: Prompt | '$camera') {
    if (prompt === '$camera') {
      return this.focusedPromptName === '$camera'
    } else {
      return this.focusedPromptName === prompt.name
    }
  }

  @action
  public focusOnPrompt(name: PromptKey | null) {
    this.focusedPromptName = name
  }

  @action
  public appendPrompt(name: PromptKey, focus: boolean = true) {
    this.visiblePromptNames.add(name)
    
    if (focus) {
      this.focusOnPrompt(name)
    }
  }

  @action
  public showCamera() {
    this.cameraVisible = true
  }

  @action
  public hideCamera() {
    this.cameraVisible = false
  }

  // #endregion

  // #region Games
  
  @observable
  public statuses: Record<GameName, GameStatus> = {
    cocktail:   GameStatus.Unavailable,
    colander:   GameStatus.Unavailable,
    crop:       GameStatus.Unavailable,
    invitation: GameStatus.Unavailable,
  }

  @action
  public makeGameAvailable(game: GameName) {
    this.statuses[game] = GameStatus.Available
  }

  // #endregion

  // #region QR

  private qrParser = new QRParser()

  public processQR(data: string) {
    const trigger = this.qrParser.parse(data)
    if (trigger == null) { return ProcessQRResult.Invalid }

    const executed = this.executeTrigger(trigger)
    return executed ? ProcessQRResult.Success : ProcessQRResult.Unhandled
  }

  private executeTrigger(trigger: Trigger): boolean {
    switch (trigger.type) {
    case 'game:start':
      return this.startGame(trigger.game)

    case 'game:complete':
      return this.completeGame(trigger.game)

    case 'letter':
      // TODO
      // this.alienLetterStore.markLetterFound(trigger.letter)
      return true

    default:
      return false
    }
  }

  private startGame(game: GameName): boolean {
    if (this.statuses[game] === GameStatus.Unavailable) { return false }
    if (this.statuses[game] === GameStatus.Complete) { return false }
    
    this.statuses[game] = GameStatus.Available
    this.appendPrompt(`${game}:start`)
    return true
  }

  private completeGame(game: GameName): boolean {
    if (this.statuses[game] !== GameStatus.Available) { return false }
    
    this.statuses[game] = GameStatus.Complete
    this.appendPrompt(`${game}:complete`)
    return true
  }

  // #endregion

}

export enum ProcessQRResult {
  Success,
  Invalid,
  Unhandled
}