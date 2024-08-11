import { useRouter } from 'expo-router'
import { useStore } from 'mobx-store'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { AlienLabel, Button, VBox } from '~/components'
import { config } from '~/config'
import { GameStore } from '~/stores'
import { fonts, layout } from '~/styling'
import { observer } from '~/util'

const Index = observer('Index', () => {

  const [t] = useTranslation('start')

  const router = useRouter()
  const gameStore = useStore(GameStore)

  const startGame = React.useCallback(() => {
    gameStore.start(config.environment === 'development')
    router.push('/game')
  }, [gameStore, router])

  const startGameDev = React.useCallback(() => {
    gameStore.start(true)
    router.push('/game')
  }, [gameStore, router])

  function render() {
    return (
      <VBox flex>
        <VBox flex justify='middle' style={layout.overlay}>
          <AlienLabel style={{marginTop: -fonts['alien-lg'].size - 4}} align='center' size='lg'>
            DE BRUILOFT
          </AlienLabel>
        </VBox>
        <VBox flex justify='space-around' padding={layout.padding.md}>
          <VBox/>
          <Button
            caption={t('start_game')}
            onPress={startGame}
          />
        </VBox>
      </VBox>
    )
  }

  return render()

})

export default Index