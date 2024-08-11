import * as React from 'react'

import { VBox } from '~/components'
import { PromptCarousel } from '~/prompts'
import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import { GameStatusBar } from '../app/GameStatusBar'

const Game = observer('Game', () => {

  const $ = useStyles()

  function render() {
    return (
      <VBox flex>
        <VBox flex style={layout.overlay} justify='bottom'>
          <GameStatusBar/>
        </VBox>
        {renderPromptCarousel()}
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