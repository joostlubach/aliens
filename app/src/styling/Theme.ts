import ShadowUtil from './ShadowUtil'
import * as colors from './colors'

export interface Theme {
  semantic: typeof colors.semantic.light
  bg:       typeof colors.bg.light
  fg:       typeof colors.fg.light
  
  inverse: Theme
  shadows: ShadowUtil
  isDark:  boolean
}

function createTheme(
  which: 'light' | 'dark',
  inverse?: Theme,
) {
  const semantic = which === 'light' ? colors.semantic.light : colors.semantic.dark
  const bg       = which === 'light' ? colors.bg.light : colors.bg.dark
  const fg       = which === 'light' ? colors.fg.dark : colors.fg.light

  const theme = {
    semantic,
    bg,
    fg,
    shadows: new ShadowUtil(),
    isDark:  which === 'dark',
    inverse,
  } as Theme

  if (theme.inverse == null) {
    theme.inverse = createTheme(which === 'dark' ? 'light' : 'dark', theme)
  }
  return theme
}

export const Theme: {
  create:  (which: 'light' | 'dark') => Theme,
  default: Theme
} = {
  create:  createTheme,
  default: createTheme('light')
}
