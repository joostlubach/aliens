import { Audio } from 'expo-av'
import React from 'react'
import { View } from 'react-native'
import { useTimer } from 'react-timer'
import { forwardRef } from 'react-util'
import { useContinuousRef, usePrevious } from 'react-util/hooks'

import { createUseStyles } from '~/styling'
import { Label, LabelProps } from './Label'

export interface TypingLabelProps extends Omit<LabelProps, 'children'> {
  children?: string | null

  sound?:       Audio.Sound
  onTypingEnd?: () => void
}

export interface TypingLabel {
  skip(): void
}

export const TypingLabel = forwardRef('TypingLabel', (props: TypingLabelProps, ref: React.Ref<TypingLabel>) => {

  const {
    children,
    sound,
    onTypingEnd,
    ...rest
  } = props

  const text = React.useMemo(
    () => children ?? '',
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

      const currentLetter = text[displayedText.length]
      const interval = currentLetter === '.' ? 300 : 50

      setDisplayedText(text.slice(0, displayedText.length + 1))
      timer.debounce(nextLetter, interval)
    }

    startAudio()
    timer.debounce(nextLetter, 0)
  }, [displayedTextRef, onTypingEnd, startAudio, stopAudio, text, timer])

  const prevText = usePrevious(text)
  React.useEffect(() => {
    if (text === prevText) { return }

    setDisplayedText('')
    startTyping()
  }, [prevText, startTyping, text, timer])

  React.useImperativeHandle(ref, () => ({
    skip() {
      timer.clearAll()
      setDisplayedText(text)
      stopAudio()
      onTypingEnd?.()
    },
  }), [onTypingEnd, stopAudio, text, timer])

  const $ = useStyles()

  return (
    <View style={$.TypingLabel}>
      <Label style={$.hiddenText} {...rest} children={text}/>
      <Label style={$.visibleText} {...rest} children={displayedText}/>
    </View>
  )

})

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