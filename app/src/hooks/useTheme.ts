import * as React from 'react'

import { ThemeContext } from '~/styling/ThemeContext'

export function useTheme() {
  return React.useContext(ThemeContext)
}