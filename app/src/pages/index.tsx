import { useRouter } from 'expo-router'
import { useStore } from 'mobx-store'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { AlienFlashLabel, Button, VBox } from '~/components'
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

  React.useEffect(() => {
    setTimeout(() => {
      startGame()
    }, 0)
  }, [startGame])

  function render() {
    return (
      <VBox flex>
        <VBox flex justify='middle' style={layout.overlay}>
          <AlienFlashLabel style={{marginTop: -fonts['alien-lg'].size - 4}} align='center' size='lg'>
            DE BRUILOFT
          </AlienFlashLabel>
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