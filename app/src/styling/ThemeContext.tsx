
import chroma, { Color } from 'chroma-js'
import { cloneDeep, merge } from 'lodash'
import React from 'react'
import { memo } from 'react-util'
import { DeepPartial } from 'ytil'
import { Theme } from './Theme'
import * as colors from './colors'

const ThemeContext = React.createContext<Theme>(Theme.default)

export interface ThemeOptions {
  dark?:      boolean
  light?:     boolean
  dim?:       boolean
  branded?:   boolean
  primary?:   boolean
  secondary?: boolean
  contrast?:  Color | 'primary'
  overrides?: DeepPartial<Theme>
}

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

export function buildThemeWithOptions(upstream: Theme, options: ThemeOptions) {
  let theme = upstream

  if (options.light) {
    theme = Theme.create('light')
  }
  if (options.dark) {
    theme = Theme.create('dark')
  }
  if (options.contrast) {
    const contrastColor = options.contrast === 'primary'
      ? theme.semantic.primary
      : options.contrast

    theme = Theme.create(colors.isDark(contrastColor) ? 'dark' : 'light')
  }

  if (options.overrides != null) {
    theme = cloneDeep(theme)
    merge(theme, options.overrides)
  }

  return theme
}

export function useTheme() {
  return React.useContext(ThemeContext)
}