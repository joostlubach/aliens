import { useStore } from 'mobx-store'
import React from 'react'

import { GameStore } from '~/stores'
import { observer } from '~/util'
import { Label, LabelProps } from './Label'

export interface AlienLabelProps extends Omit<LabelProps, 'font'> {
  size?: 'lg' | 'md' | 'sm'
}

export const AlienLabel = observer('AlienLabel', (props: AlienLabelProps) => {

  const {size = 'md', children, ...rest} = props

  const gameStore = useStore(GameStore)
  const textContent = React.Children.toArray(children).join(' ')
  const markup = gameStore.unmaskAlienLetters(textContent)

  return (
    <Label
      {...rest}
      children={markup}
      font={`body-${size}`}
      markup
    />
  )
})