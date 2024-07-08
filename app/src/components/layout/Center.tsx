import React from 'react'
import VBox, { Props as VBoxProps } from './VBox'

export type Props = Omit<VBoxProps, 'align' | 'justify'>

export default function Center(props: Props) {
  return <VBox {...props} align='center' justify='middle'/>
}