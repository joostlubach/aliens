import I18next from 'i18next'
import { shuffle } from 'lodash'
import { action, computed, makeObservable, observable } from 'mobx'
import { inject, persist } from 'mobx-store'

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

  @observable
  public transientPromptKey: PromptKey | null = null

  @computed
  public get visiblePrompts() {
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

    if (this.transientPromptKey != null) {
      const prompt = this.promptStore.getPrompt(this.transientPromptKey, I18next.language)
      if (prompt != null) {
        prompts.push(prompt)
      }
    }

    return prompts
  }

  @observable
  public focusedPromptKey: PromptKey | null = null

  @computed
  public get focusedPrompt() {
    if (this.focusedPromptKey == null) { return null }
    return this.visiblePrompts.find(prompt => {
      if (prompt === '$scanner' || prompt === '$typer') {
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
  public focusOnPrompt(key: PromptKey | null, transient: boolean = false) {
    this.focusedPromptKey = key
    if (transient) {
      this.transientPromptKey = key
    } else {
      if (this.transientPromptKey != null) {
        this.transientPromptKey = null
      }
    }
  }

  @action
  public appendPrompt(name: PromptKey, focus: boolean = true) {
    console.log("APPEND", name)
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

      this.availableInvitationWords = shuffle(this.correctInvitationWords)
    } else {
      this.availableInvitationWords = shuffle(this.correctInvitationWords)
      if (!this.visiblePromptKeys.has('start')) {
        this.appendPrompt('start')
      }
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
  public startGame(game: GameName, options: StartGameOptions = {}) {
    const {focus = true, force = false} = options
    if (!force && !this.canStartGame(game)) {
      this.focusOnPrompt(`${game}:notyet`, true)
      return
    }

    if (game === 'invitation') {
      this.availableInvitationWords = shuffle(this.correctInvitationWords)
      this.invitationWords = []
    }

    this.statuses[game] = GameStatus.Started

    this.appendPrompt(`${game}:start`, focus)
  }

  @action
  public canStartGame(game: GameName) {
    const gameIndex = games.indexOf(game)
    const previousGames = games.slice(0, gameIndex)
    if (previousGames.some(it => this.statuses[it] !== GameStatus.Complete)) {
      return false
    }

    return true
  }

  @action
  public completeGame(game: GameName, force: boolean = false) {
    if (!force && this.statuses[game] !== GameStatus.Started) { return }
    
    this.statuses[game] = GameStatus.Complete
    this.appendPrompt(`${game}:complete`)
  }

  // #endregion

  // #region Invitation & letters
  
  @computed
  public get correctInvitationWords(): string[] {
    const prompt = this.promptStore.getPrompt('invitation', I18next.language)
    return prompt?.paragraphs[0]?.split(' ') ?? []
  }

  @observable
  public availableInvitationWords: string[] = []

  @observable
  public invitationWords: string[] = []

  @computed
  public get remainingInvitationWords() {
    return this.availableInvitationWords.filter(it => !this.invitationWords.includes(it))
  }

  @computed
  public get isInvitationCorrect() {
    return this.invitationWords.join(' ') === this.correctInvitationWords.join(' ')
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
  public toggleWord(word: string) {
    const next = [...this.invitationWords]
    const index = next.indexOf(word)
    if (index === -1) {
      next.push(word)
    } else {
      next.splice(index, 1)
    }
    this.invitationWords = next
  }

  @action
  public addWordToEnd(word: string) {
    const next = [...this.invitationWords].filter(it => it !== word)
    next.push(word)
    this.invitationWords = next
  }

  @observable
  public unlockedLetters = new Set<string>()

  @action
  public unlockLetter(letter: string) {
    this.unlockedLetters.add(letter)
  }

  @action
  public unlockAllLetters() {
    this.unlockedLetters = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
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
      this.startGame(trigger.game)
      return true

    case 'game:complete':
      this.completeGame(trigger.game)
      return true

    case 'letter':
      if (trigger.letter) {
        this.unlockLetter(trigger.letter)
      } else {
        this.unlockAllLetters()
      }
      return true

    default:
      return false
    }
  }

  // #endregion

  // #region Reset

  @action
  public reset() {
    this.visiblePromptKeys.clear()
    this.statuses = {}
    this.unlockedLetters.clear()
  }

  // #endregion

}

persist(
  GameStore,
  'game',
  store => ({
    visiblePromptKeys:        Array.from(store.visiblePromptKeys),
    statuses:                 store.statuses,  
    availableInvitationWords: store.availableInvitationWords,
    unlockedLetters:          Array.from(store.unlockedLetters),
  }),
  (store, state) => {
    store.visiblePromptKeys = new Set(state.visiblePromptKeys)
    store.statuses = state.statuses
    store.availableInvitationWords = state.availableInvitationWords
    store.unlockedLetters = new Set(state.unlockedLetters)
  }
)

export enum ProcessQRResult {
  Success,
  Invalid,
  Unhandled
}

export interface StartGameOptions {
  focus?: false
  force?: false
}