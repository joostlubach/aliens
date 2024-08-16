import Timer from 'react-timer'

export class UnlockedLetterCycler {

  constructor(
    public readonly onCycle: (letter: string | null) => any
  ) {}

  private readonly timer = new Timer()
  private readonly queue: string[] = []

  public pushLetter(letter: string) {
    this.queue.push(letter)
    this.ensureCycling()
  }

  private ensureCycling() {
    if (this.timer.isActive) { return }
    this.timer.debounce(this.cycle, 0)
  }

  private cycle = () => {
    const next = this.queue.shift()

    if (next == null) {
      this.onCycle(null)
    } else {
      this.onCycle(next)
      this.timer.debounce(this.cycle, 1000)
    }
  }

}