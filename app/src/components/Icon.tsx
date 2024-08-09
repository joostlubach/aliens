import {
  FontAwesomeIcon,
  Props as FontAwesomeIconProps,
} from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { memo } from 'react-util'

import { useTheme } from '~/hooks'

export interface IconProps extends FontAwesomeIconProps{
  
}

export const Icon = memo('Icon', (props: IconProps) => {

  const theme = useTheme()

  return (
    <FontAwesomeIcon
      {...props}
      color={props.color ?? theme.fg.normal.hex()}
      size={props.size ?? 24}
    />
  )
})

export default Icon