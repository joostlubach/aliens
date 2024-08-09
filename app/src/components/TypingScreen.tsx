import { useStore } from 'mobx-store'
import React from 'react'
import { Image, LayoutChangeEvent, PanResponder, ScrollView } from 'react-native'
import { useTimer } from 'react-timer'
import { usePrevious } from 'react-util/hooks'

import { useImageFlicker } from '~/hooks'
import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import { AudioStore } from '../stores/AudioStore'
import Pulsate from './Pulsate'
import { TypingLabel } from './TypingLabel'
import { VBox } from './layout'

export interface TypingScreenProps {
  paragraphs: string[]

  next?:  ContinueProp
  sound?: boolean

  markup?:  boolean
  onEvent?: (event: string) => any
}

export type ContinueProp = number | 'press'

export const TypingScreen = observer('TypingScreen', (props: TypingScreenProps) => {

  const {
    paragraphs,
    next = 'press',
    sound = true,
    onEvent,
    markup,
  } = props

  const timer = useTimer()

  const typingLabelRef = React.useRef<TypingLabel>(null)
  const scrollViewRef = React.useRef<ScrollView>(null)

  const audioStore = useStore(AudioStore)

  const [currentParagraphIndex, setCurrentParagraphIndex] = React.useState<number>(0)

  const [status, setStatus] = React.useState<TypingScreenStatus>(TypingScreenStatus.Typing)

  const prevParagraphs = usePrevious(paragraphs)
  React.useEffect(() => {
    if (prevParagraphs !== paragraphs) {
      setCurrentParagraphIndex(0)
      setStatus(TypingScreenStatus.Typing)
    }
  }, [paragraphs, prevParagraphs])

  const nextParagraph = React.useCallback(() => {
    if (currentParagraphIndex === paragraphs.length - 1) {
      setStatus(TypingScreenStatus.Done)
    } else {
      setStatus(TypingScreenStatus.Typing)
      setCurrentParagraphIndex(currentParagraphIndex + 1)
    }
  }, [currentParagraphIndex, paragraphs.length])

  const handleTypingEnd = React.useCallback(() => {
    if (next == null) { return }

    if (currentParagraphIndex === paragraphs.length - 1) {
      setStatus(TypingScreenStatus.Done)
    } else if (next === 'press') {
      setStatus(TypingScreenStatus.WaitingForPress)
    } else {
      timer.debounce(nextParagraph, next)
    }
  }, [currentParagraphIndex, next, nextParagraph, paragraphs.length, timer])

  const handlePress = React.useCallback(() => {
    if (status === TypingScreenStatus.WaitingForPress) {
      nextParagraph()
    } else {
      typingLabelRef.current?.skip()
    }
  }, [nextParagraph, status])

  // #region Auto-scrolling

  const visibleHeightsRef = React.useRef<number[]>([])
  const scrollViewHeightRef = React.useRef<number>(0)

  const layoutScrollView = React.useCallback((event: LayoutChangeEvent) => {
    scrollViewHeightRef.current = event.nativeEvent.layout.height    
  }, [])

  const onVisibleHeightChanged = React.useCallback((index: number, height: number) => {
    visibleHeightsRef.current[index] = height

    let totalHeight = visibleHeightsRef.current.reduce((total, height) => total + (height ?? 0), 0)

    // Add the inter-paragraph spacings.
    totalHeight += layout.padding.md * (visibleHeightsRef.current.length - 1)

    // Add both paddings.
    totalHeight += 2 * layout.padding.md

    scrollViewRef?.current?.scrollTo({
      y:        totalHeight - scrollViewHeightRef.current,
      animated: true,
    })
  }, [])

  // #endregion

  const bgimage = useImageFlicker(
    require('%images/screenbg.png'),
    require('%images/screenbg2.png'),
    '          ..        . .             . . . .           .  .'
  )

  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => status !== TypingScreenStatus.Done,
    onMoveShouldSetPanResponder:  () => false,
    onPanResponderRelease:        handlePress,
  }), [handlePress, status])

  const $ = useStyles()

  function render() {
    return (
      <VBox style={$.TypingScreen} {...panResponder.panHandlers}>
        <VBox style={$.container}>
          <Image
            style={$.background}
            source={bgimage}
            resizeMode='contain'
          />
          
          {renderContent()}
          
          <Image
            style={$.frame}
            source={require('%images/screenfg.png')}
            resizeMode='contain'
          />

          {status === TypingScreenStatus.WaitingForPress && renderFingerprint()}
        </VBox>
      </VBox>
    )
  }

  function renderContent() {
    return (
      <ScrollView
        style={$.scrollView}
        contentContainerStyle={$.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={status === TypingScreenStatus.Done}
        onLayout={layoutScrollView}
        ref={scrollViewRef}
      >
        <VBox style={$.labelContainer} gap={layout.padding.md}>
          {paragraphs.slice(0, currentParagraphIndex + 1).map((paragraph, index) => (
            <TypingLabel
              ref={typingLabelRef}
              key={index}
              children={paragraph}
              onTypingEnd={handleTypingEnd}
              font='body-sm'
              sound={sound ? audioStore.sound('alien') ?? undefined : undefined}
              onVisibleHeightChanged={onVisibleHeightChanged.bind(null, index)}
              onEvent={onEvent}
              markup={markup}
            />
          ))}
        </VBox>
      </ScrollView>
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

enum TypingScreenStatus {
  Typing,
  WaitingForPress,
  Done,
}

const useStyles = createUseStyles({
  TypingScreen: {
    alignItems: 'center',
  },

  container: {
    width:  396,
    height: 420,

    paddingTop:        29,
    paddingBottom:     60,
    paddingHorizontal: 48,
  },

  background: {
    position: 'absolute',
    top:      0,
    left:     0,
    right:    0,
    bottom:   0,
  },

  frame: {
    position:      'absolute',
    top:           0,
    left:          0,
    right:         0,
    bottom:        0,
    pointerEvents: 'none',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow:        1,
    paddingVertical: layout.padding.sm,

  },

  labelContainer: {
    flexGrow: 1,
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