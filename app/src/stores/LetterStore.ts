import { makeObservable, observable } from 'mobx'

export class LetterStore {

  constructor() {
    makeObservable(this)
  }

  @observable
  public unmaskedLetters: string[] = []

  public unmaskLetter(letter: string) {
    this.unmaskedLetters.push(letter)
  }

}