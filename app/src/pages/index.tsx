import { useRouter } from 'expo-router'
import { useStore } from 'mobx-store'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import { AlienFlashLabel, Button, Label, VBox } from '~/components'
import { GameStore, PromptStore } from '~/stores'
import { fonts, layout } from '~/styling'
import { observer } from '~/util'

const Index = observer('Index', () => {

  const [t] = useTranslation('start')

  const router = useRouter()
  const gameStore = useStore(GameStore)
  const promptsStore = useStore(PromptStore)

  const loadPrompts = React.useCallback(() => {
    promptsStore.loadPrompts()
  }, [promptsStore])

  React.useEffect(() => {
    promptsStore.loadPrompts()
  }, [promptsStore])

  const start = React.useCallback(() => {
    // gameStore.start(config.environment === 'development')
    gameStore.start()
    router.push('/game')
  }, [gameStore, router])

  const resetGame = React.useCallback(() => {
    gameStore.reset()
    start()
  }, [gameStore, start])

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

          {promptsStore.loading ? (
            <ActivityIndicator
              size='large'
              color='white'
            />
          ) : promptsStore.loaded ? (
            <Button
              caption={t('buttons:start')}
              onPress={start}
              onLongPress={resetGame}
            />
          ) : (
            <VBox gap={layout.padding.sm}>
              <Label align='center'>
                THE CONNECTION TO OUR PLANET IS SHAKY
              </Label>
              <Button
                caption={t('buttons:retry')}
                onPress={loadPrompts}
                disabled={promptsStore.loading}
              />
            </VBox>
          )}
        </VBox>
      </VBox>
    )
  }

  return render()

})

export default Index