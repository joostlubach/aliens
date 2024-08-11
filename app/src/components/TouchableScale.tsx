import React from 'react'
import {
  GestureResponderEvent,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated'
import { memo } from 'react-util'
import { useBoolean } from 'react-util/hooks'

export interface TouchableScaleProps extends TouchableWithoutFeedbackProps {
  pressedScale?: number
  springConfig?: WithSpringConfig
}

export const TouchableScale = memo('TouchableScale', (props: TouchableScaleProps) => {

  const {
    pressedScale = 0.9,
    springConfig = defaultSpringConfig,
    onPressIn: props_onPressIn,
    onPressOut: props_onPressOut,
    children,
    ...rest
  } = props

  const [pressed, pressIn, pressOut] = useBoolean()

  const scale = useSharedValue(pressed ? pressedScale : 1)

  React.useEffect(() => {
    scale.value = withSpring(pressed ? pressedScale : 1, springConfig)
  }, [pressed, pressedScale, scale, springConfig])

  const onPressIn = React.useCallback((event: GestureResponderEvent) => {
    props_onPressIn?.(event)
    pressIn()
  }, [pressIn, props_onPressIn])

  const onPressOut = React.useCallback((event: GestureResponderEvent) => {
    props_onPressOut?.(event)
    pressOut()
  }, [pressOut, props_onPressOut])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }))

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut} {...rest}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  )

})

const defaultSpringConfig: WithSpringConfig = {
  damping:   20,
  stiffness: 500,
  mass:      0.5,
}
