import React from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { memo } from 'react-util'

export interface PopProps extends ViewProps {
  in?: boolean
  
  children?: React.ReactNode
}

const Pop = memo('Pop', (props: PopProps) => {
  const {
    in: _in = true,
    style, 
    ...rest
  } = props

  const opacity = useSharedValue(!_in ? 0 : 1)
  const scale = useSharedValue(!_in ? 0 : 1)

  React.useEffect(() => {
    opacity.value = withSpring(_in ? 1 : 0)
    scale.value = withSpring(_in ? 1 : 0)
  }, [_in, opacity, scale])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity:   opacity.value,
      transform: [{scale: scale.value}],
    }
  })

  return (
    <Animated.View
      style={[$.Pop, animatedStyle, style]}
      {...rest}
    />
  )

})

const $ = StyleSheet.create({
  Pop: {},
})

export default Pop
