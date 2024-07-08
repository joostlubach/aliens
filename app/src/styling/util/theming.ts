import { pick } from 'lodash'
import { DimensionValue, StyleSheet } from 'react-native'
import { ThemedProps } from '../ThemeContext'
import { BrandingGuide } from '../branding'
import { BackgroundSpec, ComponentShape } from '../branding/types'

export function borderRadiusForShape(shape: ComponentShape, height: number) {
  switch (shape) {
    case 'rectangle':
      return 0
    case 'oval':
      return height / 2
    default:
      return shape.rounded
  }
}

export function extractBorderRadiusStyles(style: ViewStyleProp) {
  const flattened = StyleSheet.flatten(style)
  return pick(flattened, 'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius')
}

export function extractPadding(side: 'top' | 'bottom', style: ViewStyleProp) {
  const flattened = StyleSheet.flatten(style)
  if (flattened == null) { return null }

  const tryThis = (arg: DimensionValue| undefined) => typeof arg === 'number' ? arg : null
  return null
    ?? tryThis(side === 'top' ? flattened.paddingTop : flattened.paddingBottom)
    ?? tryThis(flattened.paddingVertical)
    ?? tryThis(flattened.padding)
}

export function themeOptionsForBackground(guide: BrandingGuide, background: BackgroundSpec | null): ThemedProps {
  if (background?.theme === 'dark') {
    return {dark: true}
  } else if (background?.theme === 'light') {
    return {light: true}
  } else if (background?.theme === 'default') {
    return {
      dark:  guide.colors.darkMode ? true : undefined,
      light: !guide.colors.darkMode ? true : undefined,
    }
  } else {
    return {}
  }
}

export function gradientStartPoint(angle: number) {
  return {
    x: 0.5 - Math.sin(angle / 180 * Math.PI),
    y: 0.5 + Math.cos(angle / 180 * Math.PI),
  }
}

export function gradientEndPoint(angle: number) {
  return {
    x: 0.5 + Math.sin(angle / 180 * Math.PI),
    y: 0.5 - Math.cos(angle / 180 * Math.PI),
  }
}