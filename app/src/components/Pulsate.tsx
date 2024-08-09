import React, { useEffect } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { memo } from 'react-util'

export interface PulsateProps extends ViewProps {
  duration?:  number
  minOpacity: number
  maxOpacity: number

  children?: React.ReactNode
}

const Pulsate = memo('Pulsate', (props: PulsateProps) => {
  const {
    duration = 1000, 
    minOpacity, 
    maxOpacity, 
    style, 
    ...rest
  } = props

  const opacity = useSharedValue(minOpacity)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(maxOpacity, {
        duration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    )
  }, [duration, maxOpacity, opacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  return (
    <Animated.View
      style={[$.Pulsate, animatedStyle, style]}
      {...rest}
    />
  )

})

const $ = StyleSheet.create({
  Pulsate: {},
})

export default Pulsate
