import { Audio } from 'expo-av'
import React from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { forwardRef } from 'react-util'
import { useContinuousRef, usePrevious } from 'react-util/hooks'

import { createUseStyles } from '~/styling'
import Timer from '../../../vendor/react-timer/src/Timer'
import { Label, LabelProps } from './Label'

export interface TypingLabelProps extends Omit<LabelProps, 'children'> {
  children?: string | null

  sound?:  Audio.Sound
  paused?: boolean

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
    paused = false,
    onVisibleHeightChanged,
    onTypingEnd,
    onEvent,
    ...rest
  } = props

  const [text, events] = React.useMemo(
    () => extractEvents(children ?? ''),
    [children]
  )

  const [displayText, setDisplayText] = React.useState<string>('')

  const soundRef = useContinuousRef(sound)

  const onTypingStart = React.useCallback(() => {
    soundRef.current?.playAsync().catch(() => {})
  }, [soundRef])

  const onTypingStop = React.useCallback(() => {
    soundRef.current?.stopAsync().catch(() => {})
  }, [soundRef])


  const typer = React.useMemo(
    () => new AutoTyper(text, setDisplayText),
    [text],
  )

  typer.events = events
  typer.onEvent = onEvent
  typer.onTypingStart = onTypingStart
  typer.onTypingStop = onTypingStop
  typer.onTypingEnd = onTypingEnd

  const prevPaused = usePrevious(paused)
  React.useEffect(() => {
    if (paused === prevPaused) { return }
    if (paused) {
      typer.pause()
    } else {
      typer.resume()  
    }
  }, [paused, prevPaused, soundRef, typer])

  const layoutVisibleText = React.useCallback((event: LayoutChangeEvent) => {
    onVisibleHeightChanged?.(event.nativeEvent.layout.height)
  }, [onVisibleHeightChanged])

  React.useImperativeHandle(ref, () => ({
    skip() {
      typer.skip()
    },
  }), [typer])

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
        children={displayText}
        onLayout={layoutVisibleText}
        {...rest}
      />
    </View>
  )

})

class AutoTyper {

  constructor(
    private readonly text: string,
    private onDisplayTextChange: (text: string) => void
  ) {}

  private timer = new Timer()

  private displayText: string = ''

  public get isDone() {
    return this.displayText.length === this.text.length
  }

  public events:         TypingLabelEvent[] = []
  public onEvent?:       (event: string) => void
  public onTypingStart?: () => void
  public onTypingStop?:  () => void
  public onTypingEnd?:   () => void

  // #region Interface

  public start() {
    if (this.timer.isActive) { return }
    if (this.text.length === 0) { return }

    this.onTypingStart?.()
    this.timer.setTimeout(() => this.nextLetter(), 0)
  }

  public pause() {
    if (this.isDone) { return }
    if (!this.timer.isActive) { return }
    
    this.timer.disable()
    this.onTypingStart?.()
  }

  public resume() {
    if (this.isDone) { return }
    if (this.timer.isActive) { return }

    this.timer.enable()
    this.timer.debounce(() => this.nextLetter(), 0)
    this.onTypingStart?.()
  }

  public skip() {
    if (this.isDone) { return }

    this.displayText = this.text
    this.onDisplayTextChange(this.displayText)
    this.endTyping()

    for (const event of this.events) {
      this.onEvent?.(event.name)
    }
  }

  // #endregion

  // #region Internals

  private nextLetter() {
    if (this.isDone) {
      this.endTyping()
      return
    }

    this.fireEventAt(this.displayText.length - 1)

    const currentLetter = this.text[this.displayText.length]
    const interval = currentLetter === '.' ? 200 : 30

    this.displayText = this.text.slice(0, this.displayText.length + 1)
    this.onDisplayTextChange?.(this.displayText)
  
    this.timer.debounce(() => { this.nextLetter() }, interval)
  }

  private fireEventAt(index: number) {
    const event = this.events.find(it => it.index === index)
    if (event == null) { return }

    this.onEvent?.(event.name)
  }

  private endTyping() {
    this.timer.clearAll()
    this.onTypingStop?.()
    this.onTypingEnd?.()
  }

  // #endregion

}

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