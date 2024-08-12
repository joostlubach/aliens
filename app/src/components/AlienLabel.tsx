import { useStore } from 'mobx-store'
import React from 'react'

import { observer } from '~/util'
import { LetterStore } from '../stores/LetterStore'
import { Label, LabelProps } from './Label'

export interface AlienLabelProps extends Omit<LabelProps, 'font'> {
  size?: 'lg' | 'md' | 'sm'
}

export const AlienLabel = observer('AlienLabel', (props: AlienLabelProps) => {

  const {size = 'md', children, ...rest} = props

  const letterStore = useStore(LetterStore)

  const textContent = React.Children.toArray(children).join(' ')
  const markup = letterStore.unmaskAlienLetters(textContent)

  return (
    <Label
      {...rest}
      children={markup}
      font={`body-${size}`}
      markup
    />
  )
})