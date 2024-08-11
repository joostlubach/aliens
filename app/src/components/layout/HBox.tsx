import React from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { forwardRef } from 'react-util'

import { FlexProp, flexStyle } from './util'

export interface Props extends ViewProps {
  gap?:     number
  padding?: number
  align?:   'stretch' | 'top' | 'middle' | 'bottom'
  justify?: 'left' | 'center' | 'right' | 'space-between' | 'space-around'

  wrap?: boolean

  flex?:     FlexProp
  children?: React.ReactNode
}

const HBox = forwardRef('HBox', (props: Props, ref: React.Ref<View>) => {

  const {gap, padding, align, flex = false, wrap, style, justify, ...rest} = props

  const styles: StyleProp<ViewStyle> = [
    $.HBox,
    $[align ?? 'middle'],
    $[justify ?? 'left'],
    flexStyle(flex),
    wrap && $.wrap,
    {padding, gap},
    style,
  ]

  let count = 0
  return (
    <View style={styles} ref={ref} {...rest}/>
  )

})

export default HBox

const $ = StyleSheet.create({
  HBox: {
    flexDirection: 'row',
  },

  wrap: {
    flexWrap: 'wrap',
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