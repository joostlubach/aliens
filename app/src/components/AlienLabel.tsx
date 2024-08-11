import React from 'react'
import { useTimer } from 'react-timer'
import { memo } from 'react-util'
import { useBoolean } from 'react-util/hooks'

import { Label, LabelProps } from './Label'

export interface AlienLabelProps extends Omit<LabelProps, 'font'> {
  size?: 'lg' | 'md' | 'sm'
}

export const AlienLabel = memo('AlienLabel', (props: AlienLabelProps) => {

  const {size = 'md', ...rest} = props

  const [visible, show, hide] = useBoolean(true)

  const variant = React.useMemo(() => visible ? 'alien' : 'body', [visible])
  const font = React.useMemo(() => `${variant}-${size}` as const, [variant, size])

  const sequenceTimer = useTimer()
  const flashTimer = useTimer()

  React.useEffect(() => {
    const flashMoments = [2000, 2200, 3000, 6700, 6900, 8000]
    const flashDuration = 100

    const flash = () => {
      hide()
      flashTimer.debounce(show, flashDuration)
    }

    const sequence = () => {
      sequenceTimer.clearAll()
      for (const moment of flashMoments) {
        sequenceTimer.setTimeout(flash, moment)
      }
      sequenceTimer.setTimeout(sequence, 10000)
    }

    sequence()
  }, [flashTimer, hide, sequenceTimer, show])

  return (
    <Label
      {...rest}
      font={font}
      style={[{letterSpacing: letterSpacings[variant]}, rest.style]}
    />
  )
})

const letterSpacings = {
  alien: 0,
  body:  15,
} as const