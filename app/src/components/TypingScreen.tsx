import { Audio } from 'expo-av'
import React from 'react'
import { Image, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { useTimer } from 'react-timer'
import { memo } from 'react-util'
import { usePrevious } from 'react-util/hooks'

import { VBox } from '~/components'
import { useImageFlicker } from '~/hooks'
import { createUseStyles } from '~/styling'
import Pulsate from './Pulsate'
import { TypingLabel } from './TypingLabel'

export interface TypingScreenProps {
  paragraphs: string[]

  next?:        ContinueProp
  typingSound?: Audio.Sound

  markup?: boolean
}

export type ContinueProp = number | 'click'

export const TypingScreen = memo('TypingScreen', (props: TypingScreenProps) => {

  const {
    paragraphs,
    next = 'click',
    typingSound,
    markup,
  } = props

  const timer = useTimer()
  const typingLabelRef = React.useRef<TypingLabel>(null)

  const [currentParagraphIndex, setCurrentParagraphIndex] = React.useState<number>(0)
  const currentParagraph = paragraphs[currentParagraphIndex]

  const [waitingForPress, setWaitingForPress] = React.useState<boolean>(false)

  const prevParagraphs = usePrevious(paragraphs)
  React.useEffect(() => {
    if (prevParagraphs !== paragraphs) {
      setCurrentParagraphIndex(0)
    }
  }, [paragraphs, prevParagraphs])

  const nextParagraph = React.useCallback(() => {
    if (currentParagraphIndex === paragraphs.length - 1) { return }
    setCurrentParagraphIndex(currentParagraphIndex + 1)
  }, [currentParagraphIndex, paragraphs.length])

  const handleTypingEnd = React.useCallback(() => {
    if (next == null) { return }
    if (next === 'click') {
      setWaitingForPress(true)
    } else {
      timer.debounce(nextParagraph, next)
    }
  }, [next, nextParagraph, timer])

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
            sound={typingSound}
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
    paddingTop:        46,
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