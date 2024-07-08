import React from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { forwardRef } from 'react-util'
import { FlexProp, flexStyle } from './util'

export interface Props extends ViewProps {
  gap?:     number
  padding?: number
  align?:   'stretch' | 'top' | 'middle' | 'bottom'
  justify?: 'left' | 'center' | 'right' | 'space-between' | 'space-around'

  flex?:     FlexProp
  children?: React.ReactNode
}

const HBox = forwardRef('HBox', (props: Props, ref: React.Ref<View>) => {

  const {gap, padding, align, flex = false, style, justify, ...rest} = props

  const styles: StyleProp<ViewStyle> = [
    $.HBox,
    $[align ?? 'middle'],
    $[justify ?? 'left'],
    flexStyle(flex),
    {padding},
    style,
  ]

  let count = 0
  return (
    <View style={styles} ref={ref} {...rest}>
      {React.Children.map(props.children, child => (
        child && (
          <>
            {count++ > 0 && gap != null && <View style={{width: gap}}/>}
            {child}
          </>
        )
      ))}
    </View>
  )

})

export default HBox

const $ = StyleSheet.create({
  HBox: {
    flexDirection: 'row',
  },

  stretch: {
    alignItems: 'stretch',
  },

  top: {
    alignItems: 'flex-start',
  },

  middle: {
    alignItems: 'center',
  },

  bottom: {
    alignItems: 'flex-end',
  },

  left: {
    justifyContent: 'flex-start',
  },

  center: {
    justifyContent: 'center',
  },

  right: {
    justifyContent: 'flex-end',
  },

  'space-between': {
    justifyContent: 'space-between',
  },

  'space-around': {
    justifyContent: 'space-around',
  },
})