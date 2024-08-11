import * as React from 'react'

import { VBox } from '~/components'
import { PromptCarousel } from '~/prompts'
import { observer } from '~/util'
import { GameStatusBar } from '../app/GameStatusBar'

const Game = observer('Game', () => {

  function render() {
    return (
      <VBox flex>
        {renderPromptCarousel()}
        <GameStatusBar/>
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