import { useStore } from 'mobx-store'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { VBox } from '~/components'
import { GameName, GameStatus, GameStore } from '~/stores'
import { observer } from '~/util'
import { TypingScreen } from '../components/TypingScreen'

import 'react-native-reanimated'

const Start = observer('Start', () => {

  const [t] = useTranslation('start')
  const paragraphs = t('paragraphs') as unknown as string[]

  const gameStore = useStore(GameStore)

  const handleEvent = React.useCallback((event: string) => {
    gameStore.setStatus(event as GameName, GameStatus.Unfinished)
  }, [gameStore])

  function render() {
    return (
      <VBox flex justify='middle'>
        <TypingScreen
          paragraphs={paragraphs}
          onEvent={handleEvent}
          markup
        />
      </VBox>
    )
  }

  return render()

})

export default Start