import { useRouter } from 'expo-router'
import { useStore } from 'mobx-store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTimer } from 'react-timer'
import { useBoolean } from 'react-util/hooks'

import { Button, Center, HBox, Label, VBox } from '~/components'
import { DragDropMonitor } from '~/invitation/DragDropMonitor'
import { DragLayer } from '~/invitation/DragLayer'
import { DraggableWord } from '~/invitation/DraggableWord'
import { GameStore } from '~/stores'
import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import { InvitationPage } from '../invitation/InvitationPage'
import { UnlockedLetterList } from '../letters/UnlockedLetterList'
import { focusedPromptSize } from '../prompts/layout'

const Invitation = observer('Invitation', () => {

  const dd = React.useMemo(
    () => new DragDropMonitor(),
    []
  )

  const gameStore = useStore(GameStore)
  const [t] = useTranslation()
  const safeArea = useSafeAreaInsets()

  const router = useRouter()
  const backToGame = React.useCallback(() => {
    router.back()
  }, [router])

  const [lettersShown, showLetters, hideLetters] = useBoolean()

  const [showCross, setShowCross] = React.useState<boolean>(false)
  const crossTimer = useTimer()

  const flashCross = React.useCallback(() => {
    crossTimer.clearAll()
    crossTimer.setTimeout(() => setShowCross(true), 0)
    crossTimer.setTimeout(() => setShowCross(false), 300)
    crossTimer.setTimeout(() => setShowCross(true), 800)
    crossTimer.setTimeout(() => setShowCross(false), 1100)
    
    return () => {
      crossTimer.clearAll()
    }
  }, [crossTimer])

  const checkInvitation = React.useCallback(() => {
    if (gameStore.isInvitationCorrect) {
      gameStore.completeGame('invitation', true)
      router.back()
    } else {
      flashCross()
    }
  }, [flashCross, gameStore, router])

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
          {renderCheckButton()}
          {renderWords()}
        </VBox>
        <DragLayer dd={dd}/>

        <Center style={[$.back, {paddingTop: safeArea.top + layout.padding.sm}]}>
          <Button onPress={backToGame}>
            <Image
              source={require('%images/back.png')}
              style={{width: 44, height: 10}}
            />
          </Button>
        </Center>
        {gameStore.unlockedLetters.size > 0 && (
          <Center style={[$.letters, {paddingTop: safeArea.top + layout.padding.sm}]}>
            <Button onPress={showLetters} small>
              <Label>
                {t('button:letters')}
              </Label>
            </Button>
          </Center>
        )}

        {lettersShown && (
          <UnlockedLetterList
            requestHide={hideLetters}
          />
        )}
      </VBox>
    )
  }

  function renderPage() {
    return (
      <VBox style={$.pageContainer}>
        <InvitationPage
          dd={dd}
        />
        {showCross && (
          <Center style={$.cross}>
            <Image
              source={require('%images/cross.png')}
              style={{width: 333, height: 276}}
            />
          </Center>
        )}
      </VBox>
    )
  }

  function renderCheckButton() {
    return (
      <Center style={$.check}>
        {gameStore.maySubmitInvitation && (
          <Button
            onPress={checkInvitation}
            caption={t('check')}
          />
        )}
      </Center>
    )
  }

  function renderWords() {
    return (
      <HBox wrap style={$.availableWords} gap={layout.padding.sm} justify='center'>
        {gameStore.remainingInvitationWords.map(word => (
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
    left:     24,
    right:    24,
    top:      68,
    bottom:   246,
  },

  check: {
    position: 'absolute',
    bottom:   196,
    right:    26,
  },

  availableWords: {
    height:  40 * 3 + 2 * layout.padding.sm,
    padding: layout.padding.md,
  },

  cross: {
    ...layout.overlay,
  },

  back: {
    position: 'absolute',
    left:     0,
    top:      0,
    padding:  layout.padding.sm,
  },

  letters: {
    position: 'absolute',
    right:    0,
    top:      0,
    padding:  layout.padding.sm,
  },
})