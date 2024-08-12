import { action, computed, makeObservable, observable } from 'mobx'

import { GameName, GameStatus, Prompt, PromptKey, prompts, QRParser, Trigger } from './game'

export class GameStore {

  constructor() {
    makeObservable(this)
  }

  // #region Prompts

  @observable
  public visiblePromptNames = new Set<PromptKey>(['start'])

  @computed
  public get visiblePrompts(): Array<Prompt | '$scanner'> {
    return [
      ...prompts.filter(it => this.visiblePromptNames.has(it.name)),
      ...this.visiblePromptNames.has('$scanner') ? ['$scanner'] as const : [],
    ]
  }

  @observable
  public focusedPromptName: PromptKey | null = null

  @computed
  public get focusedPrompt() {
    if (this.focusedPromptName == null) { return null }
    return this.visiblePrompts.find(prompt => {
      if (prompt === '$scanner') {
        return this.focusedPromptName === '$scanner'
      } else {
        return prompt.name === this.focusedPromptName
      }
    })
  }

  public isPromptFocused(prompt: Prompt | '$scanner') {
    if (prompt === '$scanner') {
      return this.focusedPromptName === '$scanner'
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
    this.visiblePromptNames.add('$scanner')
  }

  @action
  public hideCamera() {
    this.visiblePromptNames.delete('$scanner')
  }

  // #endregion

  // #region Games

  @action
  public start(dev: boolean = false) {
    if (dev) {
      // Append all prompts.
      for (const prompt of prompts) {
        this.appendPrompt(prompt.name, false)
      }
      this.appendPrompt('$scanner', false)
    } else {
      this.appendPrompt('start')
    }
  }
  
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


  @observable
  public invitationWords: string[] = []
  
  @computed
  public get availableInvitationWords() {
    return invitationWords.filter(word => !this.invitationWords.includes(word))
  }

  @action
  public setInvitationWords(words: string[]) {
    this.invitationWords = words
  }

  @action
  public addWordToEnd(word: string) {
    const next = [...this.invitationWords].filter(it => it !== word)
    next.push(word)
    this.invitationWords = next
  }

}

const invitationWords = ['DEAR', 'GUEST', 'PLEASE', 'COME', 'TO', 'OUR', "OVERLORD'S", 'JOINING']

export enum ProcessQRResult {
  Success,
  Invalid,
  Unhandled
}