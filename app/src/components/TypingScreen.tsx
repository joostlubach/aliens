import { useStore } from 'mobx-store'
import React from 'react'
import { Image, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { useTimer } from 'react-timer'
import { usePrevious } from 'react-util/hooks'

import { useImageFlicker } from '~/hooks'
import { createUseStyles } from '~/styling'
import { observer } from '~/util'
import { AudioStore } from '../stores/AudioStore'
import Pulsate from './Pulsate'
import { TypingLabel } from './TypingLabel'
import { VBox } from './layout'

export interface TypingScreenProps {
  paragraphs: string[]

  next?:  ContinueProp
  sound?: boolean

  markup?: boolean
}

export type ContinueProp = number | 'click'

export const TypingScreen = observer('TypingScreen', (props: TypingScreenProps) => {

  const {
    paragraphs,
    next = 'click',
    sound = true,
    markup,
  } = props

  const timer = useTimer()
  const typingLabelRef = React.useRef<TypingLabel>(null)

  const audioStore = useStore(AudioStore)

  const [currentParagraphIndex, setCurrentParagraphIndex] = React.useState<number>(0)
  const currentParagraph = paragraphs[currentParagraphIndex]

  const [waitingForPress, setWaitingForPress] = React.useState<boolean>(false)

  const prevParagraphs = usePrevious(paragraphs)
  React.useEffect(() => {
    if (prevParagraphs !== paragraphs) {
      setCurrentParagraphIndex(0)
      setWaitingForPress(false)
    }
  }, [paragraphs, prevParagraphs])

  const nextParagraph = React.useCallback(() => {
    if (currentParagraphIndex === paragraphs.length - 1) { return }
    setCurrentParagraphIndex(currentParagraphIndex + 1)
  }, [currentParagraphIndex, paragraphs.length])

  const handleTypingEnd = React.useCallback(() => {
    if (next == null) { return }
    if (currentParagraphIndex === paragraphs.length - 1) { return }

    if (next === 'click') {
      setWaitingForPress(true)
    } else {
      timer.debounce(nextParagraph, next)
    }
  }, [currentParagraphIndex, next, nextParagraph, paragraphs.length, timer])

  const handlePress = React.useCallback(() => {
    if (waitingForPress) {
      setWaitingForPress(false)
      nextParagraph()
    } else {
      typingLabelRef.current?.skip()
    }
  }, [nextParagraph, waitingForPress])

  const image = useImageFlicker(
    require('%images/screen.png'),
    require('%images/screen2.png'),
    '          ..        . .             . . . .           .  .'
  )

  const $ = useStyles()

  function render() {
    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <VBox style={$.TypingScreen}>
          <ImageBackground source={image} resizeMode='contain'>
            {renderContent()}
            {waitingForPress && renderFingerprint()}
          </ImageBackground>
        </VBox>
      </TouchableWithoutFeedback>
    )
  }

  function renderContent() {
    return (
      <VBox style={$.content}>
        {currentParagraph != null && (
          <TypingLabel
            ref={typingLabelRef}
            key={currentParagraph}
            children={currentParagraph}
            onTypingEnd={handleTypingEnd}
            font='body-sm'
            sound={audioStore.sound('alien')}
            markup={markup}
          />
        )}
      </VBox>
    )
  }

  function renderFingerprint() {
    return (
      <Pulsate style={$.fingerprint} minOpacity={0.1} maxOpacity={0.4}>
        <Image
          source={require('%images/fingerprint.png')}
          style={$.fingerprintImage}
        />
      </Pulsate>
    )
  }

  return render()
  
})

const useStyles = createUseStyles({
  TypingScreen: {
  },

  content: {
    width:             374,
    height:            340,
    paddingTop:        42,
    paddingBottom:     76,
    paddingHorizontal: 56,
  },

  fingerprint: {
    position: 'absolute',
    bottom:   34,
    right:    34,

    width:  48,
    height: 60,

    transform: [
      {rotate: '-20deg'},
    ],
  },

  fingerprintImage: {
    width:  '100%',
    height: '100%',
  },
})