import * as React from 'react'
import { memo } from 'react-util'

import { useTheme } from '~/hooks'
import { buildThemeWithOptions, Theme, ThemeContext, ThemeOptions } from '~/styling'

export interface ThemedProps extends ThemeOptions {
  theme?:     Theme
  debugName?: string
  children?:  React.ReactNode
}
export const Themed = memo('Themed', (props: ThemedProps) => {
  const {
    theme: props_theme,
    dark,
    light,
    dim,
    branded,
    primary,
    secondary,
    contrast,
    overrides,
  } = props

  const upstream = useTheme()

  const theme = React.useMemo(() => buildThemeWithOptions(props_theme ?? upstream, {
    dark, light, dim, branded, primary, secondary, contrast, overrides,
  }), [branded, contrast, dark, dim, light, overrides, primary, props_theme, secondary, upstream])

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  )
})