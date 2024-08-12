import { useStore } from 'mobx-store'
import React from 'react'

import { HBox } from '~/components'
import { DragDropMonitor } from '~/invitation/DragDropMonitor'
import { DraggableWord } from '~/invitation/DraggableWord'
import { GameStore } from '~/stores'
import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import { wordGap, wordHeight } from './layout'

export interface AvailableWordsProps {
  dd: DragDropMonitor
}

export const AvailableWords = observer('AvailableWords', (props: AvailableWordsProps) => {

  const {dd} = props

  const gameStore = useStore(GameStore)

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <HBox wrap style={$.AvailableWords} gap={wordGap} justify='center'>
        {gameStore.availableInvitationWords.map(word => (
          <DraggableWord
            key={word}
            word={word}
            dd={dd}
          />
        ))}
      </HBox>
    )
  }

  // #endregion

  return render()

})

export default AvailableWords

const useStyles = createUseStyles({
  AvailableWords: {
    height:  wordHeight * 3 + 2 * wordGap,
    padding: layout.padding.md,
  },
})