import { useStore } from 'mobx-store'
import * as React from 'react'

import { GameStatusBar } from '~/app/GameStatusBar'
import { VBox } from '~/components'
import { UnlockedLetterCycler } from '~/letters/UnlockedLetterCycler'
import { UnlockedLetterNotice } from '~/letters/UnlockedLetterNotice'
import { PromptCarousel } from '~/prompts'
import { GameStore } from '~/stores'
import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'

const Game = observer('Game', () => {

  const gameStore = useStore(GameStore)

  const unlockedLetterCount = gameStore.unlockedLetters.size
  const prevUnlockedLettersRef = React.useRef(new Set(gameStore.unlockedLetters))

  const [unlockedLetter, setUnlockedLetter] = React.useState<string | null>(null)

  const cycler = React.useMemo(
    () => new UnlockedLetterCycler(setUnlockedLetter),
    []
  )

  React.useEffect(() => {
    if (unlockedLetterCount === prevUnlockedLettersRef.current.size) { return }

    for (const letter of gameStore.unlockedLetters) {
      if (prevUnlockedLettersRef.current.has(letter)) { continue }
      cycler.pushLetter(letter)
    }
    prevUnlockedLettersRef.current = new Set(gameStore.unlockedLetters)
  }, [cycler, gameStore.unlockedLetters, prevUnlockedLettersRef, unlockedLetterCount])

  function render() {
    return (
      <VBox flex>
        <VBox flex style={layout.overlay} justify='bottom'>
          <GameStatusBar/>
        </VBox>
        {renderPromptCarousel()}
        {unlockedLetter && (
          <UnlockedLetterNotice
            letter={unlockedLetter}
          />
        )}
      </VBox>
    )
  }

  function renderPromptCarousel() {
    return (
      <VBox flex pointerEvents='box-none'>
        <PromptCarousel/>
      </VBox>
    )
  }

  return render()

})

export default Game

const useStyles = createUseStyles({
  statusBarContainer: {
    ...layout.overlay,
  },
})