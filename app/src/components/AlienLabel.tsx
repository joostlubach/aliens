import React from 'react'
import { StyleSheet } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { memo } from 'react-util'
import { fonts } from '~/styling'
import Label, { Props as LabelProps } from './Label'

export interface Props extends LabelProps {
}

const AlienLabel = memo('AlienLabel', (props: Props) => {

  const font = useSharedValue<keyof typeof fonts>('alien-md')


  return (
    <Label {...props} font={font.value}/>
  )
})

export default AlienLabel

const $ = StyleSheet.create({
  
})