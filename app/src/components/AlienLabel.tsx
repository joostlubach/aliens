import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { useTimer } from 'react-timer'
import { memo } from 'react-util'
import { useBoolean } from 'react-util/hooks'
import { fonts } from '~/styling'
import Label, { Props as LabelProps } from './Label'

const AnimatedLabel = Animated.createAnimatedComponent(Label)

export interface Props extends Omit<LabelProps, 'font'> {
  size?: 'lg' | 'md' | 'sm'
}

const AlienLabel = memo('AlienLabel', (props: Props) => {

  const {size = 'md', ...rest} = props

  const [visible, show, hide] = useBoolean(true)

  const variant = React.useMemo(() => visible ? 'body' : 'alien', [visible])
  const font = React.useMemo(() => `${variant}-${size}` as const, [variant, size])

  const sequenceTimer = useTimer()
  const flashTimer = useTimer()

  React.useEffect(() => {
    const flashMoments = [2000, 2200, 3000, 6700, 6900, 8000]
    const flashDuration  = 100

    const flash = () => {
      hide()
      flashTimer.debounce(show, flashDuration)
    }

    const sequence = () => {
      sequenceTimer.clearAll()
      for (const moment of flashMoments) {
        sequenceTimer.setTimeout(flash, moment)
      }
      sequenceTimer.setTimeout(sequence, 10000)
    }

    sequence()
  }, [])

  return (
    <Label
      {...rest}
      font={font}
      style={{letterSpacing: letterSpacings[variant]}}
    />
  )
})

const letterSpacings = {
  alien: 0,
  body:  15
} as const

export default AlienLabel