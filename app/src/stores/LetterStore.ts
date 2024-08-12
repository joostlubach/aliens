import { action, makeObservable, observable } from 'mobx'

export class LetterStore {

  constructor() {
    makeObservable(this)
  }

  @observable
  public unlockedLetters: string[] = ['A', 'E', 'D', 'V', 'G', 'U', 'H']

  @action
  public unlockLetter(letter: string) {
    this.unlockedLetters.push(letter)
  }

  public unmaskAlienLetters(text: string) {
    let markup = ''

    let alien: boolean = false
    let piece: string = ''

    for (const char of text.split('')) {
      const letter = char.toUpperCase()
      const nextAlien = !this.unlockedLetters.includes(letter)

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

}