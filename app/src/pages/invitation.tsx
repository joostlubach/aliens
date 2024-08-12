import { useStore } from 'mobx-store'
import React from 'react'
import { Image } from 'react-native'

import { Center, HBox, VBox } from '~/components'
import { DragDropMonitor } from '~/invitation/DragDropMonitor'
import { DragLayer } from '~/invitation/DragLayer'
import { DraggableWord } from '~/invitation/DraggableWord'
import { GameStore } from '~/stores'
import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import { InvitationPage } from '../invitation/InvitationPage'
import { focusedPromptSize } from '../prompts/layout'

const Invitation = observer('Invitation', () => {

  const dd = React.useMemo(
    () => new DragDropMonitor(),
    []
  )

  const gameStore = useStore(GameStore)

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <VBox style={$.Invitation} justify='middle'>
        <VBox>
          <Center>
            <Image
              source={require('%images/typer.png')}
              style={$.typerImage}
            />
          </Center>
          {renderPage()}
          {renderWords()}
        </VBox>
        <DragLayer dd={dd}/>
      </VBox>
    )
  }

  function renderPage() {
    return (
      <VBox style={$.pageContainer}>
        <InvitationPage
          dd={dd}
        />
      </VBox>
    )
  }

  function renderWords() {
    return (
      <HBox wrap style={$.availableWords} gap={layout.padding.sm} justify='center'>
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

export default Invitation

const useStyles = createUseStyles({
  Invitation: {
    flex: 1,
  },

  typerImage: {
    ...focusedPromptSize,
  },

  pageContainer: {
    position: 'absolute',
    left:     21,
    right:    21,
    top:      39,
    bottom:   275,
  },

  availableWords: {
    height:  40 * 3 + 2 * layout.padding.sm,
    padding: layout.padding.md,
  },
})