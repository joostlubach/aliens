import { useStore } from 'mobx-store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, LayoutChangeEvent, PanResponder, ScrollView } from 'react-native'
import { useTimer } from 'react-timer'
import { usePrevious } from 'react-util/hooks'

import { Button, Center, TypingLabel, VBox } from '~/components'
import { useImageFlicker } from '~/hooks'
import { AudioStore, LetterStore } from '~/stores'
import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import Pulsate from '../components/Pulsate'
import { focusedPromptSize } from './layout'

export interface PromptScreenProps {
  paragraphs: string[]

  next?:        ContinueProp
  sound?:       boolean
  interactive?: boolean
  paused?:      boolean

  markup?: boolean

  onEvent?:        (event: string) => any
  requestDismiss?: () => any
}

export type ContinueProp = number | 'press'

export const PromptScreen = observer('PromptScreen', (props: PromptScreenProps) => {

  const {
    paragraphs,
    next = 'press',
    sound = true,
    interactive = true,
    paused = false,
    markup,
    onEvent,
    requestDismiss,
  } = props

  const timer = useTimer()

  const typingLabelRef = React.useRef<TypingLabel>(null)
  const scrollViewRef = React.useRef<ScrollView>(null)

  const audioStore = useStore(AudioStore)
  const letterStore = useStore(LetterStore)

  const [currentParagraphIndex, setCurrentParagraphIndex] = React.useState<number>(0)

  const [status, setStatus] = React.useState<PromptScreenStatus>(PromptScreenStatus.Typing)

  const prevParagraphs = usePrevious(paragraphs)
  React.useEffect(() => {
    if (prevParagraphs !== paragraphs) {
      setCurrentParagraphIndex(0)
      setStatus(PromptScreenStatus.Typing)
    }
  }, [paragraphs, prevParagraphs])

  const nextParagraph = React.useCallback(() => {
    if (currentParagraphIndex === paragraphs.length - 1) {
      setStatus(PromptScreenStatus.Done)
    } else {
      setStatus(PromptScreenStatus.Typing)
      setCurrentParagraphIndex(currentParagraphIndex + 1)
    }
  }, [currentParagraphIndex, paragraphs.length])

  const handleTypingEnd = React.useCallback(() => {
    if (next == null) { return }

    if (currentParagraphIndex === paragraphs.length - 1) {
      setStatus(PromptScreenStatus.Done)
    } else if (next === 'press') {
      setStatus(PromptScreenStatus.WaitingForPress)
    } else {
      timer.debounce(nextParagraph, next)
    }
  }, [currentParagraphIndex, next, nextParagraph, paragraphs.length, timer])

  const handlePress = React.useCallback(() => {
    if (status === PromptScreenStatus.WaitingForPress) {
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
    onStartShouldSetPanResponder: () => status !== PromptScreenStatus.Done,
    onMoveShouldSetPanResponder:  () => false,
    onPanResponderRelease:        handlePress,
  }), [handlePress, status])

  const [t] = useTranslation()

  const $ = useStyles()

  function render() {
    return (
      <VBox style={$.PromptScreen} {...interactive && status !== PromptScreenStatus.Done ? panResponder.panHandlers : null}>
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

        {status === PromptScreenStatus.WaitingForPress && renderFingerprint()}
        {status === PromptScreenStatus.Done && renderDismissButton()}
      </VBox>
    )
  }

  function renderContent() {
    return (
      <ScrollView
        style={$.scrollView}
        contentContainerStyle={$.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={interactive && status === PromptScreenStatus.Done}
        onLayout={layoutScrollView}
        ref={scrollViewRef}
      >
        <VBox style={$.labelContainer} gap={layout.padding.md}>
          {paragraphs.slice(0, currentParagraphIndex + 1).map((paragraph, index) => (
            <TypingLabel
              ref={typingLabelRef}
              key={index}
              children={letterStore.unmaskAlienLettersInAlienParts(paragraph)}
              onTypingEnd={handleTypingEnd}
              font='body-sm'
              sound={sound ? audioStore.sound('alien') ?? undefined : undefined}
              onVisibleHeightChanged={onVisibleHeightChanged.bind(null, index)}
              onEvent={onEvent}
              markup={markup}
              paused={paused}
            />
          ))}
        </VBox>
      </ScrollView>
    )
  }

  function renderDismissButton() {
    return (
      <Center style={$.dismissButton}>
        <Button
          caption={t('buttons:dismiss')}
          onPress={requestDismiss}
          small
        />
      </Center>
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

enum PromptScreenStatus {
  Typing,
  WaitingForPress,
  Done,
}

const useStyles = createUseStyles({
  PromptScreen: {
    ...focusedPromptSize,
    paddingTop:        24,
    paddingBottom:     54,
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

  dismissButton: {
    position: 'absolute',
    bottom:   24,
    right:    64,
  },
})