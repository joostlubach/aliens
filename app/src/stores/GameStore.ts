import I18next from 'i18next'
import { shuffle } from 'lodash'
import { action, computed, makeObservable, observable } from 'mobx'
import { inject } from 'mobx-store'

import { Prompt, PromptKey, PromptStore } from './PromptStore'
import { GameName, GameStatus, QRParser, Trigger } from './game'
import { games } from './game/data'

export class GameStore {

  constructor() {
    makeObservable(this)
  }

  @inject(PromptStore)
  private promptStore!: PromptStore

  // #region Prompts

  @observable
  public visiblePromptKeys = new Set<PromptKey>([])

  @computed
  public get visiblePrompts(): Array<Prompt | '$scanner' | '$typer'> {
    const prompts: Array<Prompt | '$scanner' | '$typer'> = []
    for (const key of this.visiblePromptKeys) {
      if (key.startsWith('$')) { continue }

      const prompt = this.promptStore.getPrompt(key, I18next.language)
      if (prompt == null) { continue }
      prompts.push(prompt)
    }

    if (this.visiblePromptKeys.has('$scanner')) {
      prompts.push('$scanner')
    }
    if (this.visiblePromptKeys.has('$typer')) {
      prompts.push('$typer')
    }

    return prompts
  }

  @observable
  public focusedPromptKey: PromptKey | null = null

  @computed
  public get focusedPrompt() {
    if (this.focusedPromptKey == null) { return null }
    return this.visiblePrompts.find(prompt => {
      if (prompt === '$scanner') {
        return this.focusedPromptKey === '$scanner'
      } else if (prompt === '$typer') {
        return this.focusedPromptKey === '$typer'
      } else {
        return prompt.key === this.focusedPromptKey
      }
    })
  }

  public isPromptFocused(prompt: Prompt | '$scanner' | '$typer') {
    if (prompt === '$scanner') {
      return this.focusedPromptKey === '$scanner'
    } else if (prompt === '$typer') {
      return this.focusedPromptKey === '$typer'
    } else {
      return this.focusedPromptKey === prompt.key
    }
  }

  @action
  public focusOnPrompt(name: PromptKey | null) {
    this.focusedPromptKey = name
  }

  @action
  public appendPrompt(name: PromptKey, focus: boolean = true) {
    this.visiblePromptKeys.add(name)
    
    if (focus) {
      this.focusOnPrompt(name)
    }
  }

  @action
  public showCamera() {
    this.visiblePromptKeys.add('$scanner')
  }

  @action
  public hideCamera() {
    this.visiblePromptKeys.delete('$scanner')
  }

  @action
  public showTyper() {
    this.visiblePromptKeys.add('$typer')
  }

  @action
  public hideTyper() {
    this.visiblePromptKeys.delete('$typer')
  }

  // #endregion

  // #region Games

  @action
  public start(dev: boolean = false) {
    if (dev) {
      // Append all prompts.
      for (const key of this.promptStore.keys) {
        const prompt = this.promptStore.getPrompt(key, I18next.language)
        if (prompt != null) {
          this.appendPrompt(prompt.key, false)
        }
      }
      this.appendPrompt('$scanner', false)
      this.appendPrompt('$typer', false)

      // Make all games available that have a start and complete prompt.
      for (const game of games) {
        if (!this.promptStore.keys.includes(`${game}:start`)) { continue }
        if (!this.promptStore.keys.includes(`${game}:complete`)) { continue }

        this.makeGameAvailable(game as GameName)
      }
    } else {
      this.appendPrompt('start')
    }
  }
  
  @observable
  public statuses: Partial<Record<GameName, GameStatus>> = {}

  public gameStatus(game: GameName) {
    return this.statuses[game]
  }

  @action
  public makeGameAvailable(game: GameName) {
    if (!this.promptStore.keys.includes(`${game}:start`)) { return }

    this.statuses[game] = GameStatus.Available
  }

  @action
  public startGame(game: GameName, focus: boolean = true): boolean {
    if (game === 'invitation') {
      this.availableInvitationWords = shuffle(invitationWords)
    }

    this.statuses[game] = GameStatus.Started

    this.appendPrompt(`${game}:start`, focus)
    return true
  }

  @action
  public completeGame(game: GameName): boolean {
    if (this.statuses[game] !== GameStatus.Started) { return false }
    
    this.statuses[game] = GameStatus.Complete

    if (this.promptStore.keys.includes(`${game}:start`)) {
      this.appendPrompt(`${game}:complete`)
    }
    return true
  }

  // #endregion

  // #region Invitation & letters

  @observable
  public invitationWords: string[] = []
  
  @observable
  public availableInvitationWords: string[] = []

  @computed
  public get remainingInvitationWords() {
    return this.availableInvitationWords.filter(it => !this.invitationWords.includes(it))
  }

  @computed
  public get isInvitationCorrect() {
    return this.invitationWords.join(' ') === invitationWords.join(' ')
  }

  @computed
  public get maySubmitInvitation() {
    return this.remainingInvitationWords.length === 0
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

  @computed
  public get triggers() {
    return this.qrParser.triggers
  }

  public processQR(data: string) {
    const trigger = this.qrParser.parse(data)
    if (trigger == null) { return ProcessQRResult.Invalid }

    const executed = this.executeTrigger(trigger)
    return executed ? ProcessQRResult.Success : ProcessQRResult.Unhandled
  }

  public executeTrigger(trigger: Trigger): boolean {
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