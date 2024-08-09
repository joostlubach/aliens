import { Audio } from 'expo-av'
import React from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { useTimer } from 'react-timer'
import { forwardRef } from 'react-util'
import { useContinuousRef, usePrevious } from 'react-util/hooks'

import { createUseStyles } from '~/styling'
import { Label, LabelProps } from './Label'

export interface TypingLabelProps extends Omit<LabelProps, 'children'> {
  children?: string | null

  sound?: Audio.Sound

  onVisibleHeightChanged?: (height: number) => void
  onTypingEnd?:            () => void
  onEvent?:                (event: string) => void
}

export interface TypingLabel {
  skip(): void
}

export const TypingLabel = forwardRef('TypingLabel', (props: TypingLabelProps, ref: React.Ref<TypingLabel>) => {

  const {
    children,
    sound,
    onVisibleHeightChanged,
    onTypingEnd,
    onEvent,
    ...rest
  } = props

  const [text, events] = React.useMemo(
    () => extractEvents(children ?? ''),
    [children]
  )

  const [displayedText, setDisplayedText] = React.useState<string>('')
  const displayedTextRef = useContinuousRef(displayedText)
  const soundRef = useContinuousRef(sound)

  const timer = useTimer()

  const startAudio = React.useCallback(() => {
    if (sound == null) { return }

    sound.playAsync()
    return () => { sound.stopAsync }
  }, [sound])

  const stopAudio = React.useCallback(() => {
    const sound = soundRef.current
    sound?.stopAsync()
  }, [soundRef])

  const maybeFireEvent = React.useCallback((index: number) => {
    const event = events.find(it => it.index === index)
    if (event == null) { return }
    onEvent?.(event.name)
  }, [events, onEvent])

  const startTyping = React.useCallback(() => {
    if (text.length === 0) { return }

    timer.clearAll()

    const nextLetter = () => {
      const displayedText = displayedTextRef.current
      if (displayedText.length === text.length) {
        stopAudio()
        onTypingEnd?.()
        return
      }

      maybeFireEvent(displayedText.length - 1)

      const currentLetter = text[displayedText.length]
      const interval = currentLetter === '.' ? 200 : 30

      setDisplayedText(text.slice(0, displayedText.length + 1))
      timer.debounce(nextLetter, interval)
    }

    startAudio()
    timer.debounce(nextLetter, 0)
  }, [displayedTextRef, maybeFireEvent, onTypingEnd, startAudio, stopAudio, text, timer])

  const prevText = usePrevious(text)
  React.useEffect(() => {
    if (text === prevText) { return }

    setDisplayedText('')
    startTyping()
    onVisibleHeightChanged?.(0)
  }, [onVisibleHeightChanged, prevText, startTyping, text, timer])

  const layoutVisibleText = React.useCallback((event: LayoutChangeEvent) => {
    onVisibleHeightChanged?.(event.nativeEvent.layout.height)
  }, [onVisibleHeightChanged])

  React.useImperativeHandle(ref, () => ({
    skip() {
      timer.clearAll()
      setDisplayedText(text)
      stopAudio()
      onTypingEnd?.()

      for (const event of events) {
        onEvent?.(event.name)
      }
    },
  }), [events, onEvent, onTypingEnd, stopAudio, text, timer])

  const $ = useStyles()

  return (
    <View style={$.TypingLabel}>
      <Label
        style={$.hiddenText}
        children={text}
        {...rest}
      />
      <Label
        style={$.visibleText}
        children={displayedText}
        onLayout={layoutVisibleText}
        {...rest}
      />
    </View>
  )

})

function extractEvents(textWithEvents: string): [string, TypingLabelEvent[]] {
  let remainder = textWithEvents
  let text: string = ''
  const events: TypingLabelEvent[] = []

  let match: RegExpMatchArray | null
  while ((match = remainder.match(EVENT_REGEXP)) != null) {
    const {index} = match
    if (index == null) { continue }

    text += remainder.slice(0, index)
    events.push({index: text.length, name: match[1]})

    remainder = remainder.slice(index + match[0].length)
  }

  text += remainder
  return [text, events]
}

const EVENT_REGEXP = /†\[(.*?)\]/

interface TypingLabelEvent {
  name:  string
  index: number
}

const useStyles = createUseStyles({
  TypingLabel: {
  },

  hiddenText: {
    opacity: 0,
  },

  visibleText: {
    position: 'absolute',
    top:      0,
    left:     0,
    width:    '100%',
  },

})