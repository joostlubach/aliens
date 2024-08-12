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

  @action
  private startGame(game: GameName): boolean {
    if (this.statuses[game] === GameStatus.Unavailable) { return false }
    if (this.statuses[game] === GameStatus.Complete) { return false }
    
    this.statuses[game] = GameStatus.Available
    this.appendPrompt(`${game}:start`)
    return true
  }

  @action
  private completeGame(game: GameName): boolean {
    if (this.statuses[game] !== GameStatus.Available) { return false }
    
    this.statuses[game] = GameStatus.Complete
    this.appendPrompt(`${game}:complete`)
    return true
  }

  // #endregion

  // #region Invitation & letters

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

  @observable
  public unlockedLetters = new Set<string>([])

  @action
  public unlockLetter(letter: string) {
    if (this.unlockedLetters.has(letter)) {
      return false
    }
    
    this.unlockedLetters.add(letter)
    return true
  }

  public unmaskAlienLetters(text: string) {
    let markup = ''

    let alien: boolean = false
    let piece: string = ''

    for (const char of text.split('')) {
      const letter = char.toUpperCase()
      const nextAlien = !this.unlockedLetters.has(letter)

      if (alien === nextAlien) {
        piece += letter
      } else {
        markup += alien ? `|${piece}|` : piece
        alien = nextAlien
        piece = letter
      }
    }

    markup += alien ? `|${piece}|` : piece
    return markup
  }

  public unmaskAlienLettersInAlienParts(text: string) {
    return text.split('|').map((part, index) => {
      return index % 2 === 0 ? part : this.unmaskAlienLetters(part)
    }).join('')
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
      return this.unlockLetter(trigger.letter)

    default:
      return false
    }
  }

  // #endregion

}

const invitationWords = ['DEAR', 'GUEST', 'PLEASE', 'COME', 'TO', 'OUR', "OVERLORD'S", 'JOINING']

export enum ProcessQRResult {
  Success,
  Invalid,
  Unhandled
}