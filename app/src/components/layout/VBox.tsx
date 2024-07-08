import React from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { forwardRef } from 'react-util'
import { FlexProp, flexStyle } from './util'

export interface Props extends ViewProps {
  gap?:     number
  padding?: number
  align?:   'stretch' | 'left' | 'center' | 'right'
  justify?: 'top' | 'middle' | 'bottom' | 'space-between' | 'space-around'
  flex?:     FlexProp

  pointerEvents?: ViewProps['pointerEvents']
  onLayout?:      ViewProps['onLayout']

  safeArea?: boolean | 'top' | 'bottom' | 'left' | 'right'

  style?:    StyleProp<ViewStyle>
  children?: React.ReactNode
}

const VBox = forwardRef('VBox', (props: Props, ref: React.Ref<View>) => {

  const {
    gap,
    padding,
    align,
    flex = false,
    safeArea = false,
    style,
    justify,
    ...rest
  } = props

  const styles: StyleProp<ViewStyle> = [
    $.VBox,
    $[align ?? 'stretch'],
    $[justify ?? 'top'],
    flexStyle(flex),
    {padding},
    style,
  ]

  const insets = useSafeAreaInsets()
  const safeAreaPadding = React.useMemo(() => {
    if (safeArea === false) { return {} }

    const padding: ViewStyle = {}
    if (safeArea === true || safeArea === 'top') {
      padding.paddingTop = insets.top
    }
    if (safeArea === true || safeArea === 'bottom') {
      padding.paddingBottom = insets.bottom
    }
    if (safeArea === true || safeArea === 'left') {
      padding.paddingLeft = insets.left
    }
    if (safeArea === true || safeArea === 'right') {
      padding.paddingRight = insets.right
    }
    return padding
  }, [])

  let count = 0
  return (
    <View style={[styles, safeAreaPadding]} ref={ref} {...rest}>
      {React.Children.map(props.children, child => (
        child && (
          <>
            {count++ > 0 && gap != null && <View style={{height: gap}}/>}
            {child}
          </>
        )
      ))}
    </View>
  )

})

export default VBox

const $ = StyleSheet.create({
  VBox: {},

  stretch: {
    alignItems: 'stretch',
  },

  left: {
    alignItems: 'flex-start',
  },

  center: {
    alignItems: 'center',
  },

  right: {
    alignItems: 'flex-end',
  },

  top: {
    justifyContent: 'flex-start',
  },

  middle: {
    justifyContent: 'center',
  },

  bottom: {
    justifyContent: 'flex-end',
  },

  'space-between': {
    justifyContent: 'space-between',
  },

  'space-around': {
    justifyContent: 'space-around',
  },
})